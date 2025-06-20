import { Router } from "express";
import { config } from "../config/index.js";
import {
  getAllMovies,
  getMovie,
  getMovieImage,
} from "../controllers/moviesController.js";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMovie);
router.get("/:id/image", getMovieImage);
export default router;
