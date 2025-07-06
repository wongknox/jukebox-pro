import express from "express";
const router = express.Router();

import getUserFromToken from "#middleware/getUserFromToken";

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireBody from "#middleware/requireBody";

router.use(getUserFromToken);

router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Authentication required.");
  }
  next();
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      const playlists = await getPlaylists(req.user.id);
      res.send(playlists);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  })
  .post(requireBody(["name", "description"]), async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    try {
      const playlist = await createPlaylist(name, description, userId);
      res.status(201).send(playlist);
    } catch (error) {
      console.error(error.message);
      res.status.send("Internal server error.");
    }
  });

router.param("id", async (req, res, next, id) => {
  let playlist;
  try {
    playlist = await getPlaylistById(id);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error.");
  }

  if (!playlist) return res.status(404).send("Playlist not found.");
  if (playlist.user_id !== req.user.id) {
    return res.status(403).send("Forbidden: You do not own this playlist.");
  }

  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    try {
      const tracks = await getTracksByPlaylistId(req.playlist.id);
      res.send(tracks);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  })
  .post(requireBody(["trackId"]), async (req, res) => {
    const { trackId } = req.body;

    try {
      const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
      res.status(201).send(playlistTrack);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  });

export default router;
