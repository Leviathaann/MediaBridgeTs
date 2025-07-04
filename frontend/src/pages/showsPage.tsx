import { useState, useEffect } from "react";
import { Grid, Box, Container, Typography } from "@mui/material";
import { ShowCard, type Show } from "../components/showCard";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShowsWithImages() {
      try {
        setLoading(true);
        setError(null);
        const showsResponse = await fetch(`${baseURL}/api/shows`);
        if (!showsResponse.ok) {
          throw new Error(`HTTP error! Status: ${showsResponse.status}`);
        }
        const showsData = await showsResponse.json();

        const showsWithImages = await Promise.all(
          showsData.Items.map(async (show: any) => {
            let imageUrl = show.imageUrl;
            if (!imageUrl) {
              try {
                const imageUrlResponse = await fetch(
                  `${baseURL}/api/movies/${show.Id}/Image`,
                );
                if (!imageUrlResponse.ok) {
                  console.warn(
                    `Could not fetch image URL for ${show.Name}. Status: ${imageUrlResponse.status}`,
                  );
                  imageUrl =
                    "https://via.placeholder.com/200x300?text=No+Image+Found";
                } else {
                  imageUrl = await imageUrlResponse.json();
                }
              } catch (imageError) {
                console.error(
                  `Error fetching image URL for ${show.Name}:`,
                  imageError,
                );
                imageUrl = "https://via.placeholder.com/200x300?text=Error";
              }
            }
            return { ...show, imageUrl };
          }),
        );

        setShows(showsWithImages);
      } catch (err: any) {
        console.error("Error fetching Shows:", err);
        setError(err.message || "Failed to load Shows.");
      } finally {
        setLoading(false);
      }
    }
    fetchShowsWithImages();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading Shows...</Typography>
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
        {shows.map((show) => (
          <Grid item xs={6} sm={4} md={3} lg={2} xl={1} key={show.Id}>
            <ShowCard show={show} maxWords={MAX_WORDS} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
