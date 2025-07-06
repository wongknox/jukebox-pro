import db from "#db/client";

export async function createPlaylist(name, description, userId) {
  const sql = `
  INSERT INTO playlists
    (name, description, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  try {
    const {
      rows: [playlist],
    } = await db.query(sql, [name, description, userId]);
    return playlist;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getPlaylists(userId) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE user_id = $1
  `;
  try {
    const { rows: playlists } = await db.query(sql, [userId]);
    return playlists;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getPlaylistById(id) {
  const sql = `
    SELECT *
    FROM playlists
    WHERE id = $1
    `;
  try {
    const {
      rows: [playlist],
    } = await db.query(sql, [id]);
    return playlist;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
export async function getPlaylistsByUserIdAndTrackId(userId, trackId) {
  const sql = `
        SELECT
            playlists.*
        FROM
            playlists
        JOIN
            playlists_tracks 
            ON playlists.id = playlists_tracks.playlist_id 
        WHERE
            playlists.user_id = $1 AND playlists_tracks.track_id = $2;
    `;
  try {
    const { rows: playlists } = await db.query(sql, [userId, trackId]);
    return playlists;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
