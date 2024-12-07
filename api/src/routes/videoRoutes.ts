import { Router } from 'express';
import { VideoService } from '../services/videoService';
import { VideoRepository } from '../repositories/videoRepository';
import { VideoController } from '../controllers/videoController';
import { EloCalculator } from '../services/eloCalculator';
import { IDatabaseClient } from '../interface/database/IDatabaseClient';

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