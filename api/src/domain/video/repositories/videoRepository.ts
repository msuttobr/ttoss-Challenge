import { IDatabaseClient } from '../../../database/interface/IDatabaseClient';
import { IVideoRepository } from '../../../domain/video/interface/repository/IVideoRepository';
import { InVideo } from '../models/input/video';
import { OutVideo } from '../models/output/video';
import { CustomError } from '../../../utils/customError';
import { shuffle } from '../../../utils/shuffler';

export class VideoRepository implements IVideoRepository {
    private dbClient: IDatabaseClient;

    constructor(dbClient: IDatabaseClient) {
        this.dbClient = dbClient;
    }

    async getAllVideos(): Promise<OutVideo[]> {
        const query = 'SELECT * FROM videos ORDER BY rating DESC';
        const videos = await this.dbClient.query(query, []);

        if (videos.length === 0) {
            throw new CustomError(`Não existem vídeos cadastrados`, 444);
        }

        return videos.map((video: any) => ({
            id: video.id,
            title: video.title,
            url: video.url,
            rating: video.rating,
        }));
    }

    async getVideosBattle(): Promise<OutVideo[]> {
        const videos = shuffle<OutVideo>(await this.getAllVideos()).slice(0, 2)
        if (videos.length !== 2) {
            throw new CustomError(`É necessário que existam pelo menos 2 videos para competirem`)
        }
        return videos;
    }

    async getVideoById(id: string): Promise<OutVideo> {
        const query = 'SELECT * FROM videos WHERE id = $1';
        const video = await this.dbClient.query(query, [id]);

        if (video.length === 0) {
            throw new CustomError('Vídeo não encontrado.', 204);
        }

        return {
            id: video[0].id,
            title: video[0].title,
            url: video[0].url,
            rating: video[0].rating,
        };
    }

    async saveVote(inVideo: InVideo): Promise<OutVideo[]> {
        const [video, video2] = await Promise.all([
            this.getVideoById(inVideo.videos[0].id),
            this.getVideoById(inVideo.videos[1].id)
        ]);

        const query = 'UPDATE videos SET rating = $1 WHERE id = $2';
        await this.dbClient.query(query, [inVideo.videos[0].rating, video.id]);
        await this.dbClient.query(query, [inVideo.videos[1].rating, video2.id]);

        return [video, video2];
    }
}
