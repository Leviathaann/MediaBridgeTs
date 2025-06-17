import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  emby: {
    serverIP: process.env.EMBY_SERVER_IP,
    apiKey: process.env.EMBY_API_KEY || "",
    userId: process.env.EMBY_USER_ID,
  },
};

if (!config.emby.serverIP || !config.emby.userId || !config.emby.apiKey) {
  console.error("Missing the needed enviroment variables!!!");
  process.exit(1);
}
