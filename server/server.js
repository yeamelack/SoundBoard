import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  searchRequest,
  getDiscography,
  getAlbumInfo,
  newRelease,
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

app.get("/discography", async (req, res) => {
  const query = req.query.q;
  try {
    const resJson = await getDiscography(query);
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
