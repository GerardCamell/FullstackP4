import express     from 'express';
import dotenv      from 'dotenv';
import cors        from 'cors';
import session     from 'express-session';
import MongoStore  from 'connect-mongo';
import { connectDB } from './mongoose.js';
import { parse }     from 'graphql';           

import authRouter          from './routes/auth.js';
import usuariosRouter      from './routes/usuarios.js';
import voluntariadosRouter from './routes/voluntariado.js';
import { requireAuth }     from './utils/authMiddleware.js';

import { ApolloServer }      from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs }          from './graphql/schema.js';
import { resolvers }         from './graphql/resolvers.js';

dotenv.config();

async function startServer() {
  // 1. Conectar a MongoDB
  await connectDB();

  const app = express();

  // 2. Middlewares globales
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
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false,         
    sameSite: 'lax'        
  }
}));
  app.use(express.json());  // parse JSON

  // 3. Inicializar ApolloServer
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  // 4. Montar /graphql con control de operaciones públicas
  const PUBLIC_OPS = ['Login','RegistrarUsuario'];
  app.use(
    '/graphql',
    express.json(),  // volver a parsear el body para GraphQL
    (req, res, next) => {
      // 4.1 Intento leer operationName directo
      let op = req.body.operationName;
      // 4.2 Si no viene, parseo la query para extraer el nombre
      if (!op && req.body.query) {
        try {
          const doc = parse(req.body.query);
          const def = doc.definitions.find(d => d.kind === 'OperationDefinition');
          op = def?.name?.value;
        } catch {
          // si el parse falla, lo ignoramos
        }
      }
      // 4.3 Si es pública, dejamos pasar
      if (PUBLIC_OPS.includes(op)) {
        return next();
      }
      // 4.4 Para el resto, requerimos sesión válida
      if (!req.session.user) {
        return res.status(401).json({ errors:[{ message:'No autenticado' }] });
      }
      next();
    },
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res })
    })
  );

  // 5. Rutas REST
  app.get('/health', (_req, res) => res.json({ status:'ok' }));
  app.use('/auth', authRouter);
  app.use('/usuarios', requireAuth, usuariosRouter);
  app.use('/voluntariados', voluntariadosRouter);

  // 6. Levantar servidor
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => {
  console.error('Error arrancando servidor:', err);
  process.exit(1);
});
