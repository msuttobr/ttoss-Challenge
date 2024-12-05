import { IVideoRepository } from '../interface/repository/IVideoRepository';
import { InVideo } from '../models/inVideo/video';
import { OutVideo } from '../models/outVideo/video';
import { CustomError } from '../utils/customError';
import { shuffle } from '../utils/shuffler';

export class VideoRepository implements IVideoRepository {
    private videos: OutVideo[] = [];

    constructor(videos: OutVideo[] = []) {
        this.videos = videos.length > 0 ? videos : [
            { id: '1', title: 'Video 1', url: 'https://www.youtube.com/embed/Ex2NB7JsLyA', rating: 800 },
            { id: '2', title: 'Video 2', url: 'https://www.youtube.com/embed/8G80nuEyDN4', rating: 800 },
        ];
    }

    async getAllVideos(): Promise<OutVideo[]> {
        const videos = this.videos;
        if (!videos.length) {
            throw new CustomError(`Não existem videos cadastrados`, 444)
        }
        return videos;
    }

    async getVideosBattle(): Promise<OutVideo[]> {
        const videos = shuffle<OutVideo>(this.videos).slice(0, 2)
        if (videos.length !== 2) {
            throw new CustomError(`É necessário que existam pelo menos 2 videos para competirem`)
        }
        return videos;
    }

    async getVideoById(id: string): Promise<OutVideo> {
        const video = this.videos.find(video => video.id === id);
        if (!video) {
            throw new CustomError('Vídeo não encontrado.', 204);
        }
        return video;
    }

    async saveVote(inVideo: InVideo): Promise<OutVideo[]> {
        const [video, video2] = await Promise.all([
            this.getVideoById(inVideo.videos[0].id),
            this.getVideoById(inVideo.videos[1].id)
        ]);

        return [video, video2];
    }
}
