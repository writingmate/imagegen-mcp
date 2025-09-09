import { GoogleGenAI } from "@google/genai";
import { GenerateImageArgs, GeneratedImage } from "../types.js";
import { saveBase64Image } from "../utils/fs.js";

const DEFAULT_MODEL = "gemini-2.5-flash-image-preview";

export async function generateImageGemini(args: GenerateImageArgs): Promise<GeneratedImage> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY environment variable");

  const model = args.model || process.env.GOOGLE_IMAGE_MODEL || DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey });

  // The new SDK accepts contents as a string for simple prompts
  const response = await ai.models.generateContent({
    model,
    contents: args.prompt,
  } as any);

  const candidates = (response as any)?.candidates || [];
  if (!candidates.length) throw new Error("Gemini returned no candidates");

  // Find the first inline image part
  let base64: string | undefined;
  let mimeType: string = "image/png";

  outer: for (const c of candidates) {
    const parts = c?.content?.parts || [];
    for (const p of parts) {
      if (p?.inlineData?.data) {
        base64 = p.inlineData.data as string;
        if (p.inlineData.mimeType) mimeType = p.inlineData.mimeType as string;
        break outer;
      }
    }
  }

  if (!base64) {
    // If the model responded with text, surface it for debugging
    const texts: string[] = [];
    for (const c of candidates) {
      const parts = c?.content?.parts || [];
      for (const p of parts) if (p?.text) texts.push(p.text as string);
    }
    const msg = texts.length ? `Gemini returned text instead of image: ${texts.join(" | ")}` : "Gemini returned no image data";
    throw new Error(msg);
  }

  const ext = mimeType.includes("png") ? "png" : mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : mimeType.includes("webp") ? "webp" : "png";
  const outputDir = process.env.OUTPUT_DIR || "outputs";
  const name = (args.filenameHint || "gemini-image")
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
    model,
  };
}

