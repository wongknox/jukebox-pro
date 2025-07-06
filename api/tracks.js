import express from "express";
const router = express.Router();

import getUserFromToken from "#middleware/getUserFromToken";
import { getTrackById } from "#db/queries/tracks";
import { getPlaylistsByUserIdAndTrackId } from "#db/queries/playlists";

router.use(getUserFromToken);
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Authentication required.");
  }
  next();
});

router.param("id", async (req, res, next, id) => {
  let track;
  try {
    track = await getTrackById(id);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error.");
  }

  if (!track) {
    return res.status(404).send("Track not found.");
  }
  req.track = track;
  next();
});

router.route("/:id/playlists").get(async (req, res) => {
  const trackId = req.track.id;
  const userId = req.user.id;

  try {
    const playlists = await getPlaylistsByUserIdAndTrackId(userId, trackId);

    res.status(200).send(playlists);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

export default router;
