import { config } from "../config/index.js";

export const moviesService = {
  async getMovies() {
    const response = await fetch(
      `${config.emby.serverIP}/Users/${config.emby.userId}/Items?IncludeItemTypes=Movie&Recursive=true`,
      {
        headers: { "X-Emby-Token": config.emby.apiKey },
      },
    );

    if (!response.ok) {
      throw new Error(`Emby api error: ${response.status}`);
    }

    return response.json();
  },

  async getMovieById(id: string) {
    const response = await fetch(
      `${config.emby.serverIP}/Users/${config.emby.userId}/Items/${id}`,
      {
        headers: { "X-Emby-Token": config.emby.apiKey },
      },
    );

    if (!response.ok) {
      throw new Error(`Emby api error: ${response.status}`);
    }

    return response.json();
  },
};
