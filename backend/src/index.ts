import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const serverIP = process.env.EMBY_SERVER_IP;
const apiKey = process.env.EMBY_API_KEY || "";
const userId = process.env.EMBY_USER_ID;

app.get("/shows", async (_req, res) => {
  try {
    const response = await fetch(
      `${serverIP}/Users/${userId}/Items?IncludeItemTypes=Series&Recursive=true`,
      {
        headers: { "X-Emby-Token": apiKey },
      },
    );

    if (!response.ok) {
      throw new Error(`Emby api error: ${response.status}`);
    }

    const shows = await response.json();
    res.json(shows);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
