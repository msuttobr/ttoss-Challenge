import { InVideo } from "../../models/input/video";
import { OutVideo } from "../../models/output/video";
import { OutVideoBattle } from "../../models/output/videoBattle";

export interface IVideoService {
    getAllVideos(): Promise<OutVideo[]>
    getVideosBattle(): Promise<OutVideoBattle[]>
    voteOnVideo(inVideo: InVideo): Promise<OutVideo[]>
}