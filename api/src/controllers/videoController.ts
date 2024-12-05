import { NextFunction, Request, Response } from 'express';
import { VideoService } from '../services/videoService';
import { InVideo } from '../models/inVideo/video';

export class VideoController {
  constructor(private videoService: VideoService) { }

  async getAllVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const videos = await this.videoService.getAllVideos();
      res.json(videos);
    } catch (error) {
      return next({ message: 'Erro ao buscar os vídeos.', statusCode: 500 });
    }
  };

  async getVideosBattle(req: Request, res: Response, next: NextFunction) {
    try {
      const videosBattle = await this.videoService.getVideosBattle();
      res.json(videosBattle);
    } catch (error) {
      return next({ message: 'Erro ao obter os vídeos para a batalha.', statusCode: 500 });
    }
  };

  async voteOnVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const inVideo: InVideo = req.body;

      if (!inVideo.result.length) {
        return next({ message: 'Resultado de batalha não enviado.', statusCode: 406 });
      }
      if (!inVideo.videos.length) {
        return next({ message: 'Vídeos competidores não enviados.', statusCode: 406 });
      }

      await this.videoService.voteOnVideo(inVideo);

      res.status(200).json({ message: 'Voto realizado com sucesso.' });
    } catch (error) {
      return next(error);
    }
  };
}
