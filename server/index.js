require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const app = express();
const checkJwt = require("./authMiddleware");
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/api/public", (req, res) => {
  res.json({ message: "Anyone can access this." });
});

app.get("/api/protected", checkJwt, (req, res) => {
  res.json({
    message: `This is protected data for ${req.auth.sub}`,
  });
});

const PORT = 4343;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//update review
app.put("/api/updateReview/:id", checkJwt, async (req, res) => {
  const auth0UserId = req.auth.sub;
  const reviewId = req.params.id;

  // Get Supabase user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("userid")
    .eq("userid", auth0UserId)
    .single();

  if (userError || !user) {
    return res.status(403).json({ error: "User not found in Supabase." });
  }

  // Update the review
  const { error: updateError } = await supabase
    .from("musicreviews")
    .update(req.body)
    .eq("albumreviewid", reviewId)
    .eq("userid", user.userid);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  res.status(200).json({ message: "Review updated successfully", reviewId });
});

//insert a review
app.post("/api/insertReview", checkJwt, async (req, res) => {
  const auth0UserId = req.auth.sub;
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("userid")
    .eq("userid", auth0UserId)
    .single();

  if (userError || !user) {
    return res.status(403).json({ error: "User not found in Supabase." });
  }

  const reviewToInsert = { ...req.body, userid: auth0UserId };
  const { error: insertFailure } = await supabase
    .from("musicreviews")
    .insert(reviewToInsert);

  if (insertFailure) {
    return res.status(500).json({ error: insertFailure.message });
  }
  res.status(200).json({ message: "Review sucessfully inserted." });
});

//delete from db
app.delete("/api/deleteReview/:id", checkJwt, async (req, res) => {
  const auth0UserId = req.auth.sub;
  const reviewId = req.params.id;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("userid")
    .eq("userid", auth0UserId)
    .single();

  if (userError || !user) {
    return res.status(403).json({ error: "User not found in Supabase." });
  }

  const { error: failedDeletion } = await supabase
    .from("musicreviews")
    .delete()
    .eq("albumreviewid", reviewId)
    .eq("userid", user.userid); // Makes sure the user owns it

  if (failedDeletion) {
    return res.status(500).json({ error: failedDeletion.message });
  }

  res.status(200).json({ message: "Review successfully deleted." });
});

app.get("/api/artist/:artistId", async (req, res) => {
  const artistId = req.params.artistId;

  const { data, error: fetchError } = await supabase
    .from("artists")
    .select("*")
    .eq("artistid", artistId)
    .single();

  if (fetchError) {
    return res.status(404).json({ error: "Artist not found" });
  }
  res.status(200).json(data);
});

app.post("/api/insertArtist", async (req, res) => {
  const { error: insertError } = await supabase
    .from("artists")
    .insert(req.body);

  if (insertError) {
    return res.status(500).json({ message: insertError.message });
  }

  res.status(200).json({ message: "Artist added successfully" });
});

app.get("/api/music/:musicId", async (req, res) => {
  const musicId = req.params.musicId;
  console.log(musicId);

  const { data, error: fetchError } = await supabase
    .from("music")
    .select("*")
    .eq("albumid", musicId);

  console.log(data);
  if (fetchError) {
    return res.status(404).json({ error: "Album not found" });
  }
  return res.status(200).json(data);
});

app.post("/api/insertMusic", async (req, res) => {
  const { error: insertError } = await supabase.from("music").insert(req.body);

  if (insertError) {
    return res.status(500).json({ message: insertError.message });
  }

  res.status(200).json({ message: "Album added successfully" });
});

app.get("/api/getMusicReview/:albumid", async (req, res) => {
  const albumid = req.params.albumid;

  // First: get the count
  const { count, error: countError } = await supabase
    .from("musicreviews")
    .select("*", { count: "exact", head: true })
    .eq("albumid", albumid);

  if (countError) {
    return res.status(500).json({ message: countError.message });
  }

  // Second: get the actual review data
  const { data, error: dataError } = await supabase
    .from("musicreviews")
    .select("*")
    .eq("albumid", albumid);

  if (dataError) {
    return res.status(500).json({ message: dataError.message });
  }

  res.status(200).json({
    message: "Reviews fetched successfully",
    reviews: data,
    count: count,
  });
});

app.get("/api/fetchUser/:username", async (req, res) => {
  const username = req.params.username;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (error) {
    res.status(404).json({ message: error.message });
  }

  res.status(200).json({ data });
});

app.post("/api/insertUser", async (req, res) => {
  const { error: insertError } = await supabase.from("users").insert([
    {
      userid: req.body.usersub,
      username: req.body.normalizedUsername,
      numberofrating: 0,
      numberofreviews: 0,
    },
  ]);
  if (insertError) {
    res.status(404).json({ message: insertError.message });
  }
  res.status(200);
});
