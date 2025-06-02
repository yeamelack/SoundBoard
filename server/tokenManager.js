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
  return { Authorization: "Bearer " + accessToken };
}

//Last.fm API
let sessionKey = null;

const API_KEY = process.env.LASTFM_API_KEY;
const API_SECRET = process.env.LASTFM_API_SECRET;

// Signature generator (sorted keys + shared secret)
function getApiSignature(params) {
  const keys = Object.keys(params).sort();
  const baseString = keys.map((k) => `${k}${params[k]}`).join("") + API_SECRET;
  return crypto.createHash("md5").update(baseString).digest("hex");
}

// Get session key using auth token (user must approve your app first)
async function getSessionKey(token) {
  if (sessionKey) return sessionKey;

  const params = {
    method: "auth.getSession",
    api_key: API_KEY,
    token: token,
  };
  const api_sig = getApiSignature(params);

  const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
    params: {
      ...params,
      api_sig,
      format: "json",
    },
  });

  sessionKey = res.data.session.key;
  return sessionKey;
}

export default { getAuthHeader, getSessionKey };
