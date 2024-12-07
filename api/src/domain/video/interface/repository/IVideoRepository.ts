import { InVideo } from "../../models/input/video";
import { OutVideo } from "../../models/output/video";

export interface IVideoRepository {
    getAllVideos(): Promise<OutVideo[]>
    getVideosBattle(): Promise<OutVideo[]>
    getVideoById(id: string): Promise<OutVideo>
    saveVote(inVideo: InVideo): Promise<OutVideo[]>
}