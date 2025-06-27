import { Card, CardMedia, CardContent, Typography } from "@mui/material";

export interface Show {
  Name: string;
  Id: string;
  ImageTags: {
    Primary: string;
    Logo?: string;
    Thumb?: string;
  };
  imageUrl?: string;
}

// Props for show card
interface ShowCardProps {
  show: Show;
  maxWords?: number;
}

// Helper function (can be moved to a utilities file if used elsewhere)
function truncateByWordCount(text: string, maxWords: number): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(" ") + "...";
}

export function ShowCard({ show, maxWords = 4 }: ShowCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardMedia
        component="img"
        image={
          show.imageUrl || "https://via.placeholder.com/200x300?text=No+Image"
        }
        alt={show.Name}
        sx={{
          height: 400,
          width: "100%",
          objectFit: "cover",
          display: "block",
          maxWidth: "100%",
          minWidth: "0%",
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          height: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" textAlign={"center"}>
          {truncateByWordCount(show.Name, maxWords)}
        </Typography>
      </CardContent>
    </Card>
  );
}
