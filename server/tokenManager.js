import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();

  if (!accessToken || now > tokenExpiresAt) {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );
    accessToken = res.data.access_token;
    tokenExpiresAt = res.data.expires_in * 1000 - 5000;
  }
}

async function getAuthHeader() {
  await getAccessToken();
  return { "Authorization": "Bearer " + accessToken};
  
}


export default getAuthHeader;
