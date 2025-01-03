import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";
import errorHandler from './middlewares/errorHandler';
import { PostgresDatabaseAdapter } from './database/PostgresDatabaseAdapter';
import videoRoutes from './routes/videoRoutes';
import validateApiKey from './middlewares/validateApiKey';

dotenv.config();

const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'development';

const app = express();
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET'],
    },
    transports: ['websocket']
});

export const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const logConfig = ':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms :referrer :user-agent'
if (nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan(logConfig, {
        stream: logStream
    }));
}

app.use(cors());
app.use(express.json());

const init = async () => {
    try {
        const dbAdapter = new PostgresDatabaseAdapter();
        await dbAdapter.connect();

        app.use('/api/videos', validateApiKey, videoRoutes(dbAdapter));

        io.on('connection', (socket) => {
            console.log('A user connected');

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });

        app.get('/', (req: Request, res: Response) => {
            res.send('Bem-vindo a API do Melhor Vídeo do YouTube!, Temos WebSocket');
        });

        app.use(errorHandler);

        server.listen(port, () => {
            if (nodeEnv === 'development') {
                console.log(`Servidor rodando em ambiente de desenvolvimento na porta ${port}`);
            } else {
                console.log(`Servidor rodando em produção na porta ${port}`);
            }
        });

        process.on('SIGINT', async () => {
            console.log('Finalizando o servidor...');
            await dbAdapter.disconnect();
            server.close(() => {
                console.log('Servidor encerrado');
                process.exit(0);
            });
        });
    } catch (error) {
        console.error("Erro ao inicializar a aplicação:", error);
    }
}
init();