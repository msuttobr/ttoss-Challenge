import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import videoRoutes from './routes/videoRoutes';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'development';

const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

if (nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('common', {
        stream: logStream
    }));
}

app.use(cors());
app.use(express.json());

app.use('/api/videos', videoRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Bem-vindo a API do Melhor Vídeo do YouTube!');
});

app.use(errorHandler);

app.listen(port, () => {
    if (nodeEnv === 'development') {
        console.log(`Servidor rodando em ambiente de desenvolvimento na porta ${port}`);
    } else {
        console.log(`Servidor rodando em produção na porta ${port}`);
    }
});