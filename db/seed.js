import db from "#db/client";

import { createUser } from "#db/queries/users";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("mochi", "password123");
  const user2 = await createUser("lilly", "securepass456");

  const userIds = [user1.id, user2.id];

  const createdTrackIds = [];
  for (let i = 1; i <= 50; i++) {
    const track = await createTrack("Track " + i, i * 30000);
    createdTrackIds.push(track.id);
  }

  const createdPlaylistIds = [];

  const user1MainPlaylist = await createPlaylist(
    "Mochi's Chill Mix",
    "Relaxing tunes for Mochi",
    userIds[0]
  );
  createdPlaylistIds.push(user1MainPlaylist.id);

  const user2MainPlaylist = await createPlaylist(
    "Lilly's Workout Jams",
    "High energy for Lilly's workouts",
    userIds[1]
  );
  createdPlaylistIds.push(user2MainPlaylist.id);

  for (let i = 1; i <= 10; i++) {
    const randomUserIndex = Math.floor(Math.random() * userIds.length);
    const randomUserId = userIds[randomUserIndex];
    const newPlaylist = await createPlaylist(
      `General Playlist ${i}`,
      `A mixed playlist #${i}`,
      randomUserId
    );
    createdPlaylistIds.push(newPlaylist.id);
  }

  for (let i = 0; i < 5; i++) {
    await createPlaylistTrack(user1MainPlaylist.id, createdTrackIds[i]);
  }

  for (let i = 5; i < 10; i++) {
    await createPlaylistTrack(user2MainPlaylist.id, createdTrackIds[i]);
  }

  for (const playlistId of createdPlaylistIds) {
    const numTracksToAdd = 3 + Math.floor(Math.random() * 5);
    const shuffledTracks = createdTrackIds.sort(() => 0.5 - Math.random());
    for (let i = 0; i < numTracksToAdd; i++) {
      if (shuffledTracks[i]) {
        try {
          await createPlaylistTrack(playlistId, shuffledTracks[i]);
        } catch (error) {
          if (!error.message.includes("unique constraint")) {
            console.error(
              `Error adding track to playlist ${playlistId}:`,
              error.message
            );
          }
        }
      }
    }
  }

  console.log("Seeding complete: Users, Playlists, and Tracks created.");
}
