import { InVideo } from "../../models/inVideo/video";
import { OutVideo } from "../../models/outVideo/video";
import { OutVideoBattle } from "../../models/outVideo/videoBattle";

export interface IVideoService {
    getAllVideos(): Promise<OutVideo[]>
    getVideosBattle(): Promise<OutVideoBattle[]>
    voteOnVideo(inVideo: InVideo): Promise<OutVideo[]>
}