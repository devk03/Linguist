"use node"
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

/**
 * Splits a video file into 7-second chunks with a 2-second overlap.
 * Each chunk will be saved in a folder named after the video file,
 * and the chunks will be named using the format `{chunk number} {start time}-{end time} {video name}`.
 *
 * @param {string} filePath - The path to the video file.
 * @returns {Promise<void>}
 */


const chunkVideo = async (videoId) => {
  // Extract the video file name without the extension
  // Remove the file extension from the video name
  const videoNameWithoutExtension = videoName.replace(/\.[^/.]+$/, "");
  const videoUrl = await getVideoUrl(videoId);
  
  const outputDirectory = `./convex/functions/videoChunking/videos/${videoNameWithoutExtension}`;
  const SUPPORTED_FORMATS = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];

  // Check if the file extension is supported
  const fileExtension = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(fileExtension)) {
    throw new Error(`Unsupported file format: ${fileExtension}`);
  }

  // Create an output directory named after the video file
  const videoOutputDir = path.join(outputDirectory, videoName);
  if (!fs.existsSync(videoOutputDir)) {
    fs.mkdirSync(videoOutputDir, { recursive: true });
  }

  // Probe the video to get its duration
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error("Error getting video metadata", err);
        reject(err);
        return;
      }

      const duration = metadata.format.duration ?? 0;
      const chunkDuration = 7; // 7 seconds
      const overlap = 2; // 2 seconds
      let startTime = 0;
      let index = 1; // Chunk number

      let chunksProcessed = 0;
      const totalChunks = Math.ceil(duration / (chunkDuration - overlap));

      // Loop through the video, creating chunks
      while (startTime < duration) {
        const endTime = Math.min(startTime + chunkDuration, duration);
        const chunkName = `${index} ${startTime.toFixed(2)}-${endTime.toFixed(2)} ${videoName}.mp4`;
        const outputFilePath = path.join(videoOutputDir, chunkName);

        // Run ffmpeg to create the chunk
        ffmpeg(filePath)
          .setStartTime(startTime)
          .setDuration(endTime - startTime)
          .output(outputFilePath)
          .on("end", () => {
            console.log(`Chunk ${index} saved: ${chunkName}`);
            chunksProcessed++;
            if (chunksProcessed === totalChunks) {
              resolve();
            }
          })
          .on("error", (error) => {
            console.error("Error during chunking", error);
            reject(error);
          })
          .run();

        // Increment for next chunk
        startTime += chunkDuration - overlap;
        index++;
      }
    });
  });
};

export { chunkVideo };