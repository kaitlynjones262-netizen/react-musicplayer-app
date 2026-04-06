export const songs = Array.from({ length: 50 }, (_, i) => ({
name: `Song ${i + 1}`,
file: `/audio/song${(i % 3) + 1}.mp3`
}));