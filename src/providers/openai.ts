import OpenAI from "openai";
import { GenerateImageArgs, GeneratedImage } from "../types.js";
import { saveBase64Image } from "../utils/fs.js";

const DEFAULT_MODEL = "gpt-image-1"; // supports images.generate

export async function generateImageOpenAI(args: GenerateImageArgs): Promise<GeneratedImage> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  const client = new OpenAI({ apiKey });

  const format = (args.format ?? "png").toLowerCase();
  const ext = format === "jpeg" ? "jpg" : (format as string);
  const mimeType =
    format === "png"
      ? "image/png"
      : format === "jpg" || format === "jpeg"
      ? "image/jpeg"
      : "image/webp";

  // size priority: explicit size string > width/height > default
  const size = args.size
    ? args.size
    : args.width && args.height
    ? `${args.width}x${args.height}`
    : "1024x1024";

  const model = args.model || process.env.OPENAI_IMAGE_MODEL || DEFAULT_MODEL;

  // Build request parameters based on model capabilities
  const requestParams: any = {
    model,
    prompt: args.prompt,
    size,
    response_format: "b64_json",
  };

  // Add quality parameter (supported by all models)
  if (args.quality) {
    requestParams.quality = args.quality;
  }

  // gpt-image-1 specific parameters
  if (model === "gpt-image-1") {
    if (args.background) {
      requestParams.background = args.background;
    }
    // gpt-image-1 supports additional output formats
    if (args.format && args.format !== "png") {
      if (args.format === "jpeg" || args.format === "jpg") {
        requestParams.output_format = "jpeg";
      } else if (args.format === "webp") {
        requestParams.output_format = "webp";
      }
    }
  }

  const response = await client.images.generate(requestParams);

  const data = response.data?.[0];
  if (!data?.b64_json) {
    throw new Error("OpenAI returned no image data");
  }

  const base64 = data.b64_json as string;
  const outputDir = process.env.OUTPUT_DIR || "outputs";
  const name = (args.filenameHint || "openai-image")
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
    provider: "openai",
    model,
  };
}

