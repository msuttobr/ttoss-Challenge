import { Router } from 'express';
import { VideoService } from '../services/videoService';
import { VideoRepository } from '../repositories/videoRepository';
import { VideoController } from '../controllers/videoController';
import { EloCalculator } from '../services/eloCalculator';

const eloCalculator = new EloCalculator();
const videoRepository = new VideoRepository();
const videoService = new VideoService(videoRepository, eloCalculator);
const videoController = new VideoController(videoService);

const router = Router();

router.get('/', videoController.getAllVideos.bind(videoController));
router.get('/battle', videoController.getVideosBattle.bind(videoController));
router.post('/vote', videoController.voteOnVideo.bind(videoController));

export default router;