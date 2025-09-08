import fetch from "node-fetch";
import { removeBackground } from "@imgly/background-removal-node";

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Fetch the image from given URL
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(400).json({ error: "Unable to fetch image" });
    }
    const buffer = Buffer.from(await response.arrayBuffer());

    // Run background removal
    const blob = await removeBackground(buffer);
    const outBuf = Buffer.from(await blob.arrayBuffer());

    // Send transparent PNG back
    res.setHeader("Content-Type", "image/png");
    res.send(outBuf);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Background removal failed" });
  }
}
