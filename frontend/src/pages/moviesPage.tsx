// 1. Import everything this component needs
import { useState, useEffect } from "react";
import { Grid, Box, Container, Typography } from "@mui/material";
import { MovieCard, type Movie } from "../components/movieCard";

export const baseURL = "http://localhost:3000";

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMoviesWithImages() {
      try {
        setLoading(true);
        setError(null);

        const moviesResponse = await fetch(`${baseURL}/api/movies`);
        if (!moviesResponse.ok) {
          throw new Error(`HTTP error! Status: ${moviesResponse.status}`);
        }
        const moviesData = await moviesResponse.json();

        const moviesWithImages = await Promise.all(
          moviesData.Items.map(async (movie: any) => {
            let imageUrl = movie.imageUrl;
            if (!imageUrl) {
              try {
                const imageUrlResponse = await fetch(
                  `${baseURL}/api/movies/${movie.Id}/Image`,
                );
                if (!imageUrlResponse.ok) {
                  console.warn(
                    `Could not fetch image URL for ${movie.Name}. Status: ${imageUrlResponse.status}`,
                  );
                  imageUrl =
                    "https://via.placeholder.com/200x300?text=No+Image+Found";
                } else {
                  imageUrl = await imageUrlResponse.json();
                }
              } catch (imageError) {
                console.error(
                  `Error fetching image URL for ${movie.Name}:`,
                  imageError,
                );
                imageUrl = "https://via.placeholder.com/200x300?text=Error";
              }
            }
            return { ...movie, imageUrl };
          }),
        );

        setMovies(moviesWithImages);
      } catch (err: any) {
        console.error("Error fetching movies:", err);
        setError(err.message || "Failed to load movies.");
      } finally {
        setLoading(false); // Stop loading, regardless of success or failure
      }
    }
    fetchMoviesWithImages();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading movies...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const MAX_WORDS = 4;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4} justifyContent={"center"}>
        {movies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} lg={2} xl={1} key={movie.Id}>
            <MovieCard movie={movie} maxWords={MAX_WORDS} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
