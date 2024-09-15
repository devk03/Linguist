"use node"

// Convex functions don't have direct access to Node.js built-in modules
// We'll need to use Convex-compatible alternatives or rethink our approach
import { v } from "convex/values";
import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";

export function downloadVideo(url, id, outputPath=`./uploads/videos/${id}`) {
  return new Promise((resolve, reject) => {
    const fileName = `${id}.mp4`;
    const filePath = path.join(outputPath, fileName);

    // Create the output directory if it doesn't exist
    fs.mkdirSync(outputPath, { recursive: true });

    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download video: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Video downloaded successfully: ${filePath}`);
        resolve(filePath);
      });
    }).on('error', (error) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(error);
    });

    file.on('error', (error) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(error);
    });
  });
}