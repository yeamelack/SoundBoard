import axios from "axios";
import tokenManager from "./tokenManager.js";

const LAST_FM_API_KEY = process.env.LASTFM_API_KEY;

export async function searchRequest(query) {
  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=album&market=US&limit=5`;
  const headers = await tokenManager.getAuthHeader();

  const searchRes = await axios.get(endpoint, { headers });
  const albums = searchRes.data.albums.items;

  const updatedAlbums = [];

  for (const album of albums) {
    try {
      const albumRes = await axios.get(
        `https://api.spotify.com/v1/albums/${album.id}`,
        { headers }
      );
      const hasExplicit = albumRes.data.tracks.items.some(
        (track) => track.explicit
      );

      // Add a new property to indicate explicit content
      album.isExplicit = hasExplicit;

      updatedAlbums.push(album);
    } catch (err) {
      console.error(`Error checking album ${album.id}:`, err.message);
      album.isExplicit = false;
      updatedAlbums.push(album);
    }
  }

  return updatedAlbums;
}

async function getArtistId(query) {
  const endpoint = `https://api.spotify.com/v1/search?q=${query}&type=artist&market=US&limit=1`;
  const headers = await tokenManager.getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  return res.data.artists.items[0].id;
}

async function getSeveralArtist(ids) {
  const query = ids.join(",");

  const endpoint = `https://api.spotify.com/v1/artists?ids=${query}`;
  const headers = await tokenManager.getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  console.log(res);

  return res.data.artists;
}

async function fetchArtistReleases(artistId, groupType) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${groupType}&market=US&limit=50`;
  const headers = await tokenManager.getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  return res.data.items; // returns list of albums/singles
}

export async function getAlbums(artistId) {
  return fetchArtistReleases(artistId, "album");
}

export async function getSingles(artistId) {
  return fetchArtistReleases(artistId, "single");
}

export async function getAlbumInfo(album_id) {
  const endpoint = `https://api.spotify.com/v1/albums/${album_id}?include_groups=album&market=US&limit=50`;
  const headers = await tokenManager.getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data;
}

export async function newRelease() {
  const endpoint = `https://api.spotify.com/v1/browse/new-releases?include_groups=market=US`;
  const headers = await tokenManager.getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data.albums.items;
}

export async function getArtistsTopTracks(artistId) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
  const headers = await tokenManager.getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data.tracks.map((track) => track.name);
}

export async function getArtistInfo(artistId) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}`;
  const headers = await tokenManager.getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  return res.data;
}

export async function getSimilarArtists(artistName) {
  const url = "https://ws.audioscrobbler.com/2.0/";
  const params = {
    method: "artist.getsimilar",
    artist: artistName,
    api_key: LAST_FM_API_KEY,
    format: "json",
    limit: 5,
  };

  const res = await axios.get(url, { params });

  const artistSpotifyIds = [];

  for (const artist of res.data.similarartists.artist) {
    const id = await getArtistId(artist.name);
    artistSpotifyIds.push(id);
  }

  const artists = await getSeveralArtist(artistSpotifyIds);

  if (artists && artists.length > 0) {
    return artists;
  } else {
    throw new Error("No similar artists found");
  }
}

export default {
  getArtistInfo,
  searchRequest,
  getAlbumInfo,
  newRelease,
  getArtistsTopTracks,
  searchRequest,
  getSimilarArtists,
};
