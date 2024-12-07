import { Router } from 'express';
import { VideoService } from '../domain/video/services/videoService';
import { VideoController } from '../domain/video/controllers/videoController';
import { EloCalculator } from '../domain/video/services/eloCalculator';
import { IDatabaseClient } from '../database/interface/IDatabaseClient';
import { VideoRepository } from '../domain/video/repositories/videoRepository';

const videoRoutes = (dbAdapter: IDatabaseClient) => {
    const videoRepository = new VideoRepository(dbAdapter);
    const eloCalculator = new EloCalculator();
    const videoService = new VideoService(videoRepository, eloCalculator);
    const videoController = new VideoController(videoService);

    const router = Router();

    router.get('/ranking', videoController.getAllVideos.bind(videoController));
    router.get('/battle', videoController.getVideosBattle.bind(videoController));
    router.post('/vote', videoController.voteOnVideo.bind(videoController));

    return router;
}

export default videoRoutes;