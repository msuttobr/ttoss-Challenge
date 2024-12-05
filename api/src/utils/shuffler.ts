export function shuffle<T>(array: T[]): T[] {
    const shuffledarray = [...array];
    for (let i = shuffledarray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledarray[i], shuffledarray[j]] = [shuffledarray[j], shuffledarray[i]];
    }
    return shuffledarray;
}