import { Router } from "express";
import { getAllShows, getShow } from "../controllers/showsController";
const router = Router();

router.get("/", getAllShows);
router.get("/:id", getShow);

export default router;
