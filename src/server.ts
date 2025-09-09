#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { generateImageOpenAI } from "./providers/openai.js";
import { generateImageGoogle } from "./providers/google.js";
import { generateImageGemini } from "./providers/gemini.js";
import { generateImageReplicate } from "./providers/replicate.js";
import { GenerateImageArgs } from "./types.js";
import { z } from "zod";

const server = new McpServer({
  name: "imagegen-mcp-server",
  version: "0.1.0",
});

server.registerTool(
  "image.generate.openai",
  {
    description:
      "Generate an image using OpenAI (default model gpt-image-1). Returns a saved file path and optional base64.",
    inputSchema: {
      prompt: z.string(),
      negativePrompt: z.string().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      size: z.string().optional(),
      format: z.enum(["png", "jpeg", "jpg", "webp"]).optional(),
      seed: z.number().int().optional(),
      quality: z.enum(["standard", "hd"]).optional(),
      style: z.string().optional(),
      background: z.enum(["transparent", "solid"]).optional(),
      model: z.string().optional(),
      returnBase64: z.boolean().optional(),
      filenameHint: z.string().optional(),
    },
  },
  async (args) => {
    const r = await generateImageOpenAI(args as unknown as GenerateImageArgs);
    const parts = [] as any[];
    parts.push({
      type: "text",
      text: `provider=openai model=${r.model ?? ""} saved=${r.path}`.trim(),
    });
    if (r.base64)
      parts.push({ type: "image", data: r.base64, mimeType: r.mimeType });
    return { content: parts } as any;
  }
);

server.registerTool(
  "image.generate.google",
  {
    description:
      "Generate an image using Google (e.g., Imagen 3). Requires GOOGLE_API_KEY and GOOGLE_IMAGEN_ENDPOINT. Returns a saved file path and optional base64.",
    inputSchema: {
      prompt: z.string(),
      negativePrompt: z.string().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      size: z.string().optional(),
      format: z.enum(["png", "jpeg", "jpg", "webp"]).optional(),
      seed: z.number().int().optional(),
      quality: z.string().optional(),
      style: z.string().optional(),
      background: z.enum(["transparent", "solid"]).optional(),
      model: z.string().optional(),
      returnBase64: z.boolean().optional(),
      filenameHint: z.string().optional(),
    },
  },
  async (args) => {
    const r = await generateImageGoogle(args as unknown as GenerateImageArgs);
    const parts = [] as any[];
    parts.push({
      type: "text",
      text: `provider=google model=${r.model ?? ""} saved=${r.path}`.trim(),
    });
    if (r.base64)
      parts.push({ type: "image", data: r.base64, mimeType: r.mimeType });
    return { content: parts } as any;
  }
);

server.registerTool(
  "image.generate.gemini",
  {
    description:
      "Generate an image using Google Gemini via @google/genai (default gemini-2.5-flash-image-preview). Requires GOOGLE_API_KEY.",
    inputSchema: {
      prompt: z.string(),
      model: z.string().optional(),
      returnBase64: z.boolean().optional(),
      filenameHint: z.string().optional(),
    },
  },
  async (args) => {
    const r = await generateImageGemini(args as unknown as GenerateImageArgs);
    const parts = [] as any[];
    parts.push({
      type: "text",
      text: `provider=google(gemini) model=${r.model ?? ""} saved=${
        r.path
      }`.trim(),
    });
    if (r.base64)
      parts.push({ type: "image", data: r.base64, mimeType: r.mimeType });
    return { content: parts } as any;
  }
);

server.registerTool(
  "image.generate.replicate",
  {
    description:
      "Generate an image using Replicate (default black-forest-labs/flux-1.1-pro). Requires REPLICATE_API_TOKEN.",
    inputSchema: {
      prompt: z.string(),
      model: z.string().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      size: z.string().optional(),
      format: z.enum(["png", "jpeg", "jpg", "webp"]).optional(),
      seed: z.number().int().optional(),
      returnBase64: z.boolean().optional(),
      filenameHint: z.string().optional(),
    },
  },
  async (args) => {
    const r = await generateImageReplicate(args as unknown as GenerateImageArgs);
    const parts = [] as any[];
    parts.push({
      type: "text",
      text: `provider=replicate model=${r.model ?? ""} saved=${r.path}`.trim(),
    });
    if (r.base64)
      parts.push({ type: "image", data: r.base64, mimeType: r.mimeType });
    return { content: parts } as any;
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
