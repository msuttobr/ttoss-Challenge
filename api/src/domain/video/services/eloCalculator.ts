import { OutVideo } from "../models/output/video";

export class EloCalculator {
    calculateElo(player: OutVideo, opponent: OutVideo, resultado: number[], k: number = 32): number[] {
        const [playerExpect, opponentExpect] = this.calculateExpectative(player, opponent)

        const newClassificationPlayer = player.rating + k * (resultado[0] - playerExpect);
        const newClassificationOpponent = opponent.rating + k * (resultado[1] - opponentExpect);

        return [Math.round(newClassificationPlayer), Math.round(newClassificationOpponent)];
    }

    calculateExpectative(player: OutVideo, opponent: OutVideo): number[] {
        const expectationPlayer = 1 / (1 + Math.pow(10, (opponent.rating - player.rating) / 400));
        const expectationOpponent = 1 / (1 + Math.pow(10, (player.rating - opponent.rating) / 400));

        return [expectationPlayer, expectationOpponent]
    }
}