import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  searchRequest,
  getAlbumInfo,
  newRelease,
  getAlbums,
  getSingles,
  getArtistsTopTracks,
  getArtistInfo,
} from "./searchUtils.js";

const app = express();
app.use(cors());
dotenv.config();
const port = 8484;

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

app.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const resJson = await searchRequest(query);
    if (resJson.length != 0) {
      res.status(200).send(resJson);
    } else {
      res.status(400).send("no results");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/albums", async (req, res) => {
  const artistId = req.query.q;
  try {
    const albums = await getAlbums(artistId);
    if (albums.length > 0) {
      res.status(200).send(albums);
    } else {
      res.status(404).send("No albums found");
    }
  } catch (error) {
    console.error("Albums fetch failed:", error);
    res.status(500).send("Internal server error");
  }
});

// GET /singles?q={artistId}
app.get("/singles", async (req, res) => {
  const artistId = req.query.q;
  try {
    const singles = await getSingles(artistId);
    if (singles.length > 0) {
      res.status(200).send(singles);
    } else {
      res.status(404).send("No singles found");
    }
  } catch (error) {
    console.error("Singles fetch failed:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/getAlbumInfo", async (req, res) => {
  const query = req.query.q;
  try {
    const resJson = await getAlbumInfo(query);
    if (resJson.length != 0) {
      res.status(200).send(resJson);
    } else {
      res.status(400).send("no results");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/getTopTracks", async (req, res) => {
  const query = req.query.q; // artistId
  try {
    const trackNames = await getArtistsTopTracks(query);
    if (trackNames.length > 0) {
      res.status(200).send(trackNames);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/artist", async (req, res) => {
  const query = req.query.q; // artistId
  try {
    const artistInfo = await getArtistInfo(query); // renamed to avoid conflict
    // console.log(artistInfo);
    if (artistInfo) {
      res.status(200).send(artistInfo); // send artist info or replace with relevant data
    } else {
      res.status(404).send("Artist not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
