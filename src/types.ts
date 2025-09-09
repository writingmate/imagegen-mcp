export type ImageFormat = "png" | "jpeg" | "jpg" | "webp";

export interface GenerateImageArgs {
  prompt: string;
  negativePrompt?: string;
  width?: number; // pixels
  height?: number; // pixels
  size?: string; // e.g. "1024x1024" (overrides width/height when provided)
  format?: ImageFormat;
  seed?: number;
  quality?: "standard" | "hd";
  style?: string;
  background?: "transparent" | "solid";
  // Model selection
  model?: string;
  // Output handling
  returnBase64?: boolean; // include base64 in result
  filenameHint?: string; // used to name output file
}

export interface GeneratedImage {
  path?: string; // saved file path if written
  mimeType: string;
  base64?: string; // optionally included
  width?: number;
  height?: number;
  provider: "openai" | "google" | "replicate";
  model?: string;
}
