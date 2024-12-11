import { VideoRepository } from '../repositories/videoRepository';
import { InVideo } from '../models/input/video';
import { OutVideo } from '../models/output/video';
import { OutVideoBattle } from '../models/output/videoBattle';
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
        const disputedWin1 = Math.round(this.eloCalculator.calculateDisputed(1, probability1));
        const disputedWin2 = Math.round(this.eloCalculator.calculateDisputed(1, probability2));
        const disputedLoser1 = Math.round(this.eloCalculator.calculateDisputed(1, probability1));
        const disputedLoser2 = Math.round(this.eloCalculator.calculateDisputed(1, probability2));

        const videosBattle: OutVideoBattle[] = videos.map((video, index) => ({
            ...video,
            probability: index === 0 ? probability1 : probability2,
            disputedWinLoser: index === 0 ? [disputedWin1, disputedLoser2] : [disputedWin2, disputedLoser1],
        }));

        return videosBattle;
    }
    async voteOnVideo(inVideo: InVideo): Promise<OutVideo[]> {
        const videos = inVideo.videos;
        [videos[0].rating, videos[1].rating] = this.eloCalculator.calculateElo(inVideo);
        
        const [video, video2] = await this.videoRepository.saveVote(inVideo);

        return [video, video2]
    }
}
