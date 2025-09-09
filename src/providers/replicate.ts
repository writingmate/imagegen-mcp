import Replicate from "replicate";
import { GenerateImageArgs, GeneratedImage } from "../types.js";
import { saveBase64Image } from "../utils/fs.js";

const DEFAULT_MODEL = "black-forest-labs/flux-1.1-pro";

export async function generateImageReplicate(args: GenerateImageArgs): Promise<GeneratedImage> {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    throw new Error("Missing REPLICATE_API_TOKEN environment variable");
  }

  const replicate = new Replicate({ auth: apiKey });

  const format = (args.format ?? "png").toLowerCase();
  const ext = format === "jpeg" ? "jpg" : (format as string);
  const mimeType =
    format === "png"
      ? "image/png"
      : format === "jpg" || format === "jpeg"
      ? "image/jpeg"
      : "image/webp";

  // Flux 1.1 supported aspect ratios and sizes
  const getFluxDimensions = (size?: string, width?: number, height?: number) => {
    if (size) {
      const [w, h] = size.split("x").map(Number);
      if (w && h) return { width: w, height: h };
    }
    if (width && height) {
      return { width, height };
    }
    // Default to 1024x1024
    return { width: 1024, height: 1024 };
  };

  const dimensions = getFluxDimensions(args.size, args.width, args.height);
  const model = args.model || process.env.REPLICATE_MODEL || DEFAULT_MODEL;

  // Build input parameters for Flux 1.1
  const input: any = {
    prompt: args.prompt,
    width: dimensions.width,
    height: dimensions.height,
    output_format: format === "jpg" ? "jpg" : format,
    output_quality: 95,
  };

  // Add optional parameters if provided
  if (args.seed !== undefined) {
    input.seed = args.seed;
  }

  // Flux 1.1 Pro supports safety tolerance
  input.safety_tolerance = 2;

  try {
    const output = await replicate.run(model as any, { input });
    
    // Handle streaming response from Replicate
    let imageUrl: string;
    
    if (output instanceof ReadableStream) {
      // Convert stream to array buffer
      const response = new Response(output);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      
      // Save image directly from stream
      const outputDir = process.env.OUTPUT_DIR || "outputs";
      const name = (args.filenameHint || "flux-image")
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
        provider: "replicate",
        model,
        width: dimensions.width,
        height: dimensions.height,
      };
    } else if (Array.isArray(output)) {
      imageUrl = output[0] as string;
    } else if (typeof output === "string") {
      imageUrl = output;
    } else {
      throw new Error("Unexpected output format from Replicate");
    }

    // Download the image and convert to base64
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Save image to disk
    const outputDir = process.env.OUTPUT_DIR || "outputs";
    const name = (args.filenameHint || "flux-image")
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
      provider: "replicate",
      model,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error: any) {
    throw new Error(`Replicate API error: ${error.message}`);
  }
}