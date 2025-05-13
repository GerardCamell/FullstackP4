import express       from 'express';
import dotenv        from 'dotenv';
import cors          from 'cors';
import session       from 'express-session';
import MongoStore    from 'connect-mongo';
import { connectDB } from './mongoose.js'; 

dotenv.config();  

async function startServer() {
  
  await connectDB();

  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  app.use(session({
    secret:           process.env.SESSION_SECRET,
    resave:           false,
    saveUninitialized:false,
    store:            MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie:           { secure: false, httpOnly: true }
  }));

  // Ruta de comprobación
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 API escuchando en http://localhost:${PORT}`);
  });
}

startServer();