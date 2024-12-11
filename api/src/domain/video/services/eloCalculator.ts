import { InVideo } from "../models/input/video";
import { OutVideo } from "../models/output/video";

export class EloCalculator {
    calculateElo(inVideo: InVideo): number[] {
        const player = inVideo.videos[0];
        const opponent = inVideo.videos[1];

        const resultado = inVideo.result;

        const [playerExpect, opponentExpect] = this.calculateExpectative(player, opponent)

        const newClassificationPlayer = player.rating + this.calculateDisputed(resultado[0], playerExpect);
        const newClassificationOpponent = opponent.rating + this.calculateDisputed(resultado[1], opponentExpect);

        return [Math.round(newClassificationPlayer), Math.round(newClassificationOpponent)];
    }

    calculateExpectative(player: OutVideo, opponent: OutVideo): number[] {
        const expectationPlayer = 1 / (1 + Math.pow(10, (opponent.rating - player.rating) / 400));
        const expectationOpponent = 1 / (1 + Math.pow(10, (player.rating - opponent.rating) / 400));

        return [expectationPlayer, expectationOpponent]
    }

    calculateDisputed(result: number, expect: number, k: number = 32): number {
        return k * (result - expect)
    }
}