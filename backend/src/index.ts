import express from "express";
import dotenv from "dotenv";
import showsRouter from "./routes/shows.routes.js";
import moviesRouter from "./routes/movies.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use("/api/shows", showsRouter);
app.use("/api/movies", moviesRouter);

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
