import { Response, Request } from "express";
import { moviesService } from "../services/moviesService";
import { config } from "../config/index.js";
export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await moviesService.getMovies();
    res.json(movies);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error movies: ${err} `);
      res.status(500).json({ error: "Error fetching moives freom emby api!" });
    }
  }
};

export const getMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movies = await moviesService.getMovieById(id);
    res.json(movies);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error movies: ${err} `);
      res.status(500).json({ error: "Error fetching moives freom emby api!" });
    }
  }
};

export const getMovieImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await moviesService.getMovieById(id);
    const imageURL = `${config.emby.serverIP}/emby/Items/${id}/Images/Primary?tag=${movie.ImageTags.Primary}&X-Emby-Token=${config.emby.apiKey}`;
    res.json(imageURL);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error movies: ${err} `);
      res.status(500).json({ error: "Error fetching moives freom emby api!" });
    }
  }
};
