import axios from "axios";
import getAuthHeader from "./tokenManager.js";

export async function searchRequest(query) {
  const endpoint = `https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=5`;
  const headers = await getAuthHeader();

  const res = await axios.get(endpoint, { headers });
  return res.data.albums.items;
}

async function getArtistId(query) {
    const endpoint = `https://api.spotify.com/v1/search?q=${query}&type=artist&market=US&limit=1`;
    const headers = await getAuthHeader();
  
    const res = await axios.get(endpoint, { headers });
    return res.data.artists.items[0].id;
  }


export async function getDiscography(query) {
    const artistId = await getArtistId(query);
    const endpoint = `https://api.spotify.com/v1/artists/${artistId}/albums?market=US&limit=50`;
    const headers = await getAuthHeader();
  
    const res = await axios.get(endpoint, { headers });
    return res.data;
  }


export async function getAlbumInfo(album_id){
  const endpoint = `https://api.spotify.com/v1/albums/${album_id}/tracks?include_groups=album&market=US&limit=50`;
  const headers = await getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data;
}


export async function newRelease(){
  const endpoint = `https://api.spotify.com/v1/browse/new-releases`;
  const headers = await getAuthHeader();
  const res = await axios.get(endpoint, { headers });
  return res.data.albums.items;
}
export default {searchRequest, getDiscography, getAlbumInfo, newRelease};
