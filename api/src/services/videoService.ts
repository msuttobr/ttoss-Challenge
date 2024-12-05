import { VideoRepository } from '../repositories/videoRepository';
import { InVideo } from '../models/inVideo/video';
import { OutVideo } from '../models/outVideo/video';
import { OutVideoBattle } from '../models/outVideo/videoBattle';
import { IVideoService } from '../interface/service/IVideoService';
import { EloCalculator } from './eloCalculator';

export class VideoService implements IVideoService {
    private eloCalculator: EloCalculator;

    constructor(private videoRepository: VideoRepository, eloCalculator: EloCalculator) {
        this.eloCalculator = eloCalculator;
    }

    async getAllVideos(): Promise<OutVideo[]> {
        return this.videoRepository.getAllVideos();
    }
    async getVideosBattle(): Promise<OutVideoBattle[]> {
        const videos = await this.videoRepository.getVideosBattle();
        const [probability1, probability2] = this.eloCalculator.calculateExpectative(videos[0], videos[1]);

        const videosBattle: OutVideoBattle[] = videos.map((video, index) => ({
            ...video,
            probability: index === 0 ? probability1 : probability2,
        }));

        return videosBattle;
    }
    async voteOnVideo(inVideo: InVideo): Promise<OutVideo[]> {
        const [video, video2] = await this.videoRepository.saveVote(inVideo);
        
        [video.rating, video2.rating] = this.eloCalculator.calculateElo(video, video2, inVideo.result)

        return [video, video2]
    }
}
