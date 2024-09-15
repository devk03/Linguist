import express from "express";
import fetch from "node-fetch";
import puppeteer from "puppeteer";
import FormData from "form-data";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/scrape-video", async (req, res) => {
  let browser;
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    console.log(`Launching browser and navigating to: ${url}`);
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const videoSrc = await page.evaluate(() => {
      const video = document.querySelector('video source');
      return video ? video.src : null;
    });

    console.log(`Video source found: ${videoSrc}`);

    if (!videoSrc) {
      return res.status(404).json({ error: "No video found on the page" });
    }

    console.log(`Fetching video from: ${videoSrc}`);
    const videoResponse = await fetch(videoSrc);
    const videoBlob = await videoResponse.buffer();
    console.log(`Video fetched, size: ${videoBlob.length} bytes`);

    const formData = new FormData();
    formData.append("video", videoBlob, "input.mp4");

    console.log("Sending to Symphonic Labs...");
    const symphonicsResponse = await fetch(
      "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!symphonicsResponse.ok) {
      throw new Error(
        `Symphonic Labs API responded with ${symphonicsResponse.status}: ${await symphonicsResponse.text()}`
      );
    }

    const result = await symphonicsResponse.text();
    console.log(
      `Received result from Symphonic Labs: ${result.substring(0, 100)}...`
    );

    res.json({ result });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while processing the request",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});