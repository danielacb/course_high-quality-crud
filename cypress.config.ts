import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: true,
    videoCompression: 32,
    videosFolder: "cypress/videos",
  },
});
