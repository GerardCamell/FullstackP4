// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import https from 'https';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createHTTPSServer } from 'node:https';
import { connectDB } from './mongoose.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { Server as SocketIOServer } from 'socket.io';

// Configuración inicial
dotenv.config();
const app = express();

// 1. Configuración HTTPS
const httpsOptions = {
  key: fs.readFileSync('clave-privada.key'),
  cert: fs.readFileSync('certificado.crt')
};

// 2. Conectar a MongoDB
await connectDB();

// 3. Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));

app.use(express.json());

// 4. Configuración de WebSockets
const schema = makeExecutableSchema({ typeDefs, resolvers });
const httpsServer = createHTTPSServer(httpsOptions, app);
const wsServer = new WebSocketServer({ server: httpsServer, path: '/graphql' });
useServer({ schema }, wsServer);

// 5. Configuración Apollo Server
const apolloServer = new ApolloServer({
  schema,
  plugins: [{
    async serverWillStart() {
      return {
        async drainServer() {
          wsServer.close();
        }
      };
    }
  }]
});

await apolloServer.start();

// 6. Middleware GraphQL
app.use('/graphql', 
  expressMiddleware(apolloServer, {
    context: async ({ req, res }) => ({ req, res })
  })
);

// 7. Configuración Socket.io
const io = new SocketIOServer(httpsServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado via WebSocket');
  
  socket.on('nuevoVoluntariado', (voluntariado) => {
    io.emit('actualizarVoluntariados', voluntariado);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// 8. Rutas REST
import authRouter from './routes/auth.js';
import usuariosRouter from './routes/usuarios.js';
import voluntariadosRouter from './routes/voluntariado.js';

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/voluntariados', voluntariadosRouter);

// 9. Redirección HTTP -> HTTPS
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// 10. Iniciar servidores
const PORT_HTTPS = process.env.PORT || 4000;
const PORT_HTTP = 80;

httpsServer.listen(PORT_HTTPS, () => {
  console.log(`🚀 Servidor HTTPS en puerto ${PORT_HTTPS}`);
  console.log(`🔌 WebSockets en wss://localhost:${PORT_HTTPS}/graphql`);
});

httpApp.listen(PORT_HTTP, () => {
  console.log(`⇄ Redireccionando HTTP a HTTPS en puerto ${PORT_HTTP}`);
});


