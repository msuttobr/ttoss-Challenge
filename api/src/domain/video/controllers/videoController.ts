import { NextFunction, Request, Response } from 'express';
import { VideoService } from '../services/videoService';
import { InVideo } from '../models/input/video';
import { io } from '../../../app';
import { CustomError } from '../../../utils/customError';

export class VideoController {
  constructor(private videoService: VideoService) { }

  async getAllVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const videos = await this.videoService.getAllVideos();
      res.json(videos);
    } catch (error) {
      return next(new CustomError('Erro ao buscar os vídeos.', 500));
    }
  };

  async getVideosBattle(req: Request, res: Response, next: NextFunction) {
    try {
      const videosBattle = await this.videoService.getVideosBattle();
      res.json(videosBattle);
    } catch (error) {
      return next(new CustomError('Erro ao obter os vídeos para a batalha.', 500));
    }
  };

  async voteOnVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const inVideo: InVideo = req.body;

      if (!inVideo.result.length) {
        return next(new CustomError('Resultado de batalha não enviado.', 406));
      }
      if (!inVideo.videos.length) {
        return next(new CustomError('Vídeos competidores não enviados.', 406));
      }

      await this.videoService.voteOnVideo(inVideo);
      
      const videos = await this.videoService.getAllVideos()
      io.emit('rankingUpdate', videos);
      res.status(200).json({ message: 'Voto realizado com sucesso.' });
    } catch (error) {
      return next(error);
    }
  };
}
