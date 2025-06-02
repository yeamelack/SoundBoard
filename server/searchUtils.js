import axios from "axios";
import getAuthHeader from "./tokenManager.js";

export async function searchRequest(query) {
  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=album&market=US&limit=5`;
  const headers = await getAuthHeader();

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
  const headers = await getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  return res.data.artists.items[0].id;
}

async function fetchArtistReleases(artistId, groupType) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${groupType}&market=US&limit=50`;
  const headers = await getAuthHeader();

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
  const headers = await getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data;
}

export async function newRelease() {
  const endpoint = `https://api.spotify.com/v1/browse/new-releases`;
  const headers = await getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data.albums.items;
}

export async function getArtistsTopTracks(artistId) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
  const headers = await getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  //return res.data.tracks.map((track) => track.name);
  return res.data.tracks;
}

export async function getArtistInfo(artistId) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}`;
  const headers = await getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  return res.data;
}

export async function getSimilarArtists(artistId) {
  const endpoint = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
  const headers = await getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  

  console.log("🔍 Raw related artists response:", res.data);

  if (!Array.isArray(res.data.artists)) {
    throw new Error("Unexpected response format: 'artists' is not an array");
  }

  // return res.data.artists.map((artist) => ({
  //   id: artist.id,
  //   name: artist.name,
  //   images: artist.images,
  //   genres: artist.genres,
  //   popularity: artist.popularity
  // }));
  try {
    return res.data.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url ?? null,
      genres: artist.genres ?? [],
      popularity: artist.popularity ?? 0
    }));
  } catch (err) {
    console.error("🛑 Error during mapping related artists:", err.message);
    throw err; // propagate to your Express route
  }
  
}



export default {
  getArtistInfo,
  searchRequest,
  getAlbumInfo,
  newRelease,
  getArtistsTopTracks,
  searchRequest,
  getSimilarArtists
  
};
