import { Router } from "express";
import { config } from "../config";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const response = await fetch(
      `${config.emby.serverIP}/Users/${config.emby.userId}/Items?IncludeItemTypes=Series&Recursive=true`,
      {
        headers: { "X-Emby-Token": config.emby.apiKey },
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

export default router;
