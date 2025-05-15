import express       from 'express';
import dotenv        from 'dotenv';
import cors          from 'cors';
import session       from 'express-session';
import MongoStore    from 'connect-mongo';
import { connectDB } from './mongoose.js'; 
import authRouter         from './routes/auth.js';
import usuariosRouter     from './routes/usuarios.js';
import voluntariadosRouter from './routes/voluntariado.js';
import { requireAuth }    from './utils/authMiddleware.js';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import root from './graphql/resolvers.js';

dotenv.config();  

async function startServer() {
  
  await connectDB();

  const app = express();

 app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


  app.use(session({
    secret:           process.env.SESSION_SECRET,
    resave:           false,
    saveUninitialized:false,
    store:            MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie:           { secure: false, httpOnly: true }
  }));

app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  rootValue: root,
  graphiql: true, 
  context: { 
    req, 
    user: req.session.user 
  }
})));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/auth', authRouter);
  app.use('/usuarios', requireAuth, usuariosRouter);
  app.use('/voluntariados', voluntariadosRouter);

  app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Fullstack P4', 
    endpoints: ['/health', '/auth', '/usuarios', '/voluntariados', '/graphql'] 
  });
});

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 API escuchando en http://localhost:${PORT}`);
  });
}

startServer();