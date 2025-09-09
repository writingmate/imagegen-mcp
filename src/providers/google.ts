import { GenerateImageArgs, GeneratedImage } from "../types.js";
import { saveBase64Image } from "../utils/fs.js";

/**
 * Placeholder Google image generation provider.
 *
 * Many Google image-gen options exist (Imagen 3 via Google AI Studio or Vertex AI, etc.).
 * To keep this portable without extra SDKs, this module expects a REST endpoint in
 * GOOGLE_IMAGEN_ENDPOINT that accepts a JSON payload:
 *   {
 *     prompt: string,
 *     size?: "<w>x<h>",
 *     width?: number,
 *     height?: number,
 *     seed?: number,
 *     ...
 *   }
 * and returns JSON with a base64-encoded image under `image.base64` and optional mimeType.
 */
export async function generateImageGoogle(args: GenerateImageArgs): Promise<GeneratedImage> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const endpoint = process.env.GOOGLE_IMAGEN_ENDPOINT;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY environment variable");
  if (!endpoint)
    throw new Error(
      "Missing GOOGLE_IMAGEN_ENDPOINT. Please provide the REST endpoint for your Google image model (e.g., Imagen 3)."
    );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Common patterns: either Bearer or `x-goog-api-key`
  if (endpoint.includes("generativelanguage.googleapis.com")) {
    headers["x-goog-api-key"] = apiKey;
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const size = args.size
    ? args.size
    : args.width && args.height
    ? `${args.width}x${args.height}`
    : undefined;

  const payload = {
    prompt: args.prompt,
    negativePrompt: args.negativePrompt,
    size,
    width: args.width,
    height: args.height,
    seed: args.seed,
    quality: args.quality,
    style: args.style,
    background: args.background,
    model: args.model,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google endpoint error ${res.status}: ${text}`);
  }
  const json = (await res.json()) as any;

  const base64: string | undefined = json?.image?.base64 || json?.data?.[0]?.b64_json || json?.b64 || json?.base64;
  const mimeType: string = json?.image?.mimeType || json?.mimeType || "image/png";

  if (!base64) {
    throw new Error("Google endpoint returned no base64 image data");
  }

  const ext = mimeType.includes("png") ? "png" : mimeType.includes("jpeg") ? "jpg" : mimeType.includes("webp") ? "webp" : "png";
  const outputDir = process.env.OUTPUT_DIR || "outputs";
  const name = (args.filenameHint || "google-image")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const filename = `${Date.now()}-${name || "image"}.${ext}`;
  const path = saveBase64Image(base64, outputDir, filename);

  return {
    path,
    mimeType,
    base64: args.returnBase64 ? base64 : undefined,
    provider: "google",
    model: args.model,
  };
}

