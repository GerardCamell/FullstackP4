import express     from 'express';
import dotenv      from 'dotenv';
import cors        from 'cors';
import session     from 'express-session';
import MongoStore  from 'connect-mongo';
import { connectDB } from './mongoose.js';

import authRouter          from './routes/auth.js';
import usuariosRouter      from './routes/usuarios.js';
import voluntariadosRouter from './routes/voluntariado.js';
import { requireAuth }     from './utils/authMiddleware.js';

// Apollo Server
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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(session({
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    store:             MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie:            { secure: false, httpOnly: true }
  }));

  // Usamos Express para parsear JSON tanto en REST como en GraphQL
  app.use(express.json());

  // 3. Inicializar y arrancar ApolloServer
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res })
  });
  await apolloServer.start();

  // 4. Montar endpoint /graphql
  app.use(
    '/graphql',
    express.json(),  
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res })
    })
  );

  // 5. Rutas REST
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/auth', authRouter);
  app.use('/usuarios', requireAuth, usuariosRouter);
  app.use('/voluntariados', voluntariadosRouter);

  // 6. Arrancar servidor
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => {
  console.error('Error arrancando el servidor:', err);
  process.exit(1);
});
