import { Router } from "express";
import { config } from "../config/index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const response = await fetch(
      `${config.emby.serverIP}/Users/${config.emby.userId}/Items?IncludeItemTypes=Movie&Recursive=true`,
      {
        headers: { "X-Emby-Token": config.emby.apiKey },
      },
    );

    if (!response.ok) {
      throw new Error(`Emby api error: ${response.status}`);
    }

    const movies = await response.json();

    res.json(movies);
  } catch (err) {
    console.log(err);
  }
});

export default router;
