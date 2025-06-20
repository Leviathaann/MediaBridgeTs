import { Request, Response } from "express";
import { showsService } from "../services/showsService.js";
export const getAllShows = async (req: Request, res: Response) => {
  try {
    const shows = await showsService.getShows();
    res.json(shows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error getting shows: ${err}`);
      res
        .status(500)
        .json({ error: "failed getting tv shows from the emby api" });
    }
  }
};

export const getShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shows = await showsService.getShowById(id);
    res.json(shows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error movies: ${err} `);
      res.status(500).json({ error: "Error fetching moives freom emby api!" });
    }
  }
};
