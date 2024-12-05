import { InVideo } from "../../models/inVideo/video";
import { OutVideo } from "../../models/outVideo/video";

export interface IVideoRepository {
    getAllVideos(): Promise<OutVideo[]>
    getVideosBattle(): Promise<OutVideo[]>
    getVideoById(id: string): Promise<OutVideo>
    saveVote(inVideo: InVideo): Promise<OutVideo[]>
}