import express               from 'express';
import http                  from 'http';
import { Server as IOServer } from 'socket.io';
import dotenv                from 'dotenv';
import cors                  from 'cors';
import session               from 'express-session';
import MongoStore            from 'connect-mongo';
import { connectDB }         from './mongoose.js';
import { parse }             from 'graphql';

import authRouter            from './routes/auth.js';
import usuariosRouter        from './routes/usuarios.js';
import voluntariadosRouter   from './routes/voluntariado.js';
import { requireAuth }       from './utils/authMiddleware.js';

import { ApolloServer }      from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs }          from './graphql/schema.js';
import { resolvers }         from './graphql/resolvers.js';

dotenv.config();

async function startServer() {
  // 1. Conectar a MongoDB
  await connectDB();

  // 2. Crear app y servidor HTTP
  const app = express();
  const server = http.createServer(app);

  // 3. Levantar Socket.IO
  const io = new IOServer(server, {
    cors: { origin: true, credentials: true }
  });

  // 4. Middleware para exponer `io` en cada req
  app.use((req, _res, next) => {
    req.io = io;
    next();
  });

  // 5. Middlewares globales
  app.use(cors({
    origin: (_, callback) => callback(null, true),
    credentials: true
  }));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      domain: 'localhost',
      path: '/',
      maxAge: 1000 * 60 * 60, // 1 hora
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    }
  }));
  app.use(express.json());

  // 6. Inicializar ApolloServer
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  // 7. Montar endpoint /graphql con control de operaciones públicas
  const PUBLIC_OPS = ['Login', 'RegistrarUsuario'];
  app.use(
    '/graphql',
    express.json(),
    (req, res, next) => {
      let op = req.body.operationName;
      if (!op && req.body.query) {
        try {
          const doc = parse(req.body.query);
          const def = doc.definitions.find(d => d.kind === 'OperationDefinition');
          op = def?.name?.value;
        } catch {}
      }
      if (PUBLIC_OPS.includes(op)) return next();
      if (!req.session.user) {
        return res.status(401).json({ errors: [{ message: 'No autenticado' }] });
      }
      next();
    },
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res })
    })
  );

  // 8. Rutas REST
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/auth', authRouter);
  app.use('/usuarios', requireAuth, usuariosRouter);
  app.use('/voluntariados', voluntariadosRouter);

  // 9. Iniciar servidor HTTP + WebSocket
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}/graphql (WS activo)`);
  });
}

startServer().catch(err => {
  console.error('Error arrancando servidor:', err);
  process.exit(1);
});
