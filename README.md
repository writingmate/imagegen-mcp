<div align="center">

# 🎨 ImageGen MCP Server

**A powerful MCP server for AI image generation with support for multiple providers**

<p align="center">
  <img src="https://img.shields.io/npm/v/imagegen-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=blue" alt="npm version">
  <img src="https://img.shields.io/npm/dt/imagegen-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=green" alt="downloads">
  <img src="https://img.shields.io/github/license/writingmate/imagegen-mcp?style=for-the-badge&color=orange" alt="license">
</p>

<p align="center">
  <strong>OpenAI DALL-E</strong> • <strong>Google Gemini</strong> • <strong>Google Imagen</strong> • <strong>Flux 1.1 Pro</strong>
</p>

<p align="center">
  <code>npx imagegen-mcp-server</code>
</p>

</div>

---

## 🎬 Quick Demo

```bash
# Install and run in one command
npx imagegen-mcp-server
```

Then in your MCP client (like Claude Desktop):
> *"Generate an image of a cyberpunk city using Flux 1.1"*

✅ **Result**: High-quality image saved to `outputs/` directory

---

An MCP (Model Context Protocol) server for AI image generation with support for OpenAI DALL-E, Google Imagen, Google Gemini, and Flux 1.1 via Replicate.

<table>
<tr>
<td width="50%">
<img src="examples/flux-example.png" alt="Flux Example" width="100%"/>
<p><em>Dragon generated with Flux 1.1 Pro</em></p>
</td>
<td width="50%">
<img src="examples/gemini-example.png" alt="Gemini Example" width="100%"/>
<p><em>Garden generated with Google Gemini</em></p>
</td>
</tr>
</table>

## ✨ Features

| Provider | Models | Highlights |
|----------|--------|-----------|
| **🤖 OpenAI** | DALL-E 2, DALL-E 3, GPT-Image-1 | Latest GPT-Image-1 with background control |
| **🧠 Google Gemini** | Gemini 2.5 Flash Image Preview | Fast generation via official SDK |
| **🎨 Google Imagen** | Imagen 3 (custom endpoint) | High-quality photorealistic images |
| **⚡ Flux 1.1 Pro** | via Replicate API | State-of-the-art prompt following |

### 🎯 **Core Capabilities**
- **Multiple Output Formats**: PNG, JPEG, WebP support
- **Flexible Sizing**: Custom dimensions and aspect ratios
- **Base64 & File Output**: Return images as base64 or save to disk  
- **Seed Support**: Reproducible generation with Flux
- **MCP Compatible**: Works seamlessly with any MCP client

## 🚀 Quick Start

### Option 1: Install from npm (Recommended)

```bash
# Install globally
npm install -g imagegen-mcp-server

# Or use with npx (no installation required)
npx imagegen-mcp-server
```

### Option 2: Install from source

```bash
# Clone the repository
git clone https://github.com/writingmate/imagegen-mcp.git
cd imagegen-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## Requirements

- Node.js 18+
- API keys: `OPENAI_API_KEY`, `GOOGLE_API_KEY`, and/or `REPLICATE_API_TOKEN`

## Configuration

Create a `.env` file in your project directory:

```env
# Required: OpenAI API Key for DALL-E models
OPENAI_API_KEY=your-openai-api-key-here

# Required: Google API Key for Imagen and Gemini
GOOGLE_API_KEY=your-google-api-key-here

# Required: Replicate API Token for Flux models
REPLICATE_API_TOKEN=your-replicate-api-token-here

# Optional: Custom Google Imagen endpoint
GOOGLE_IMAGEN_ENDPOINT=

# Optional: Output directory for generated images (default: outputs)
OUTPUT_DIR=outputs
```

## 🔧 Setup & Configuration

### 1. Get API Keys

You'll need at least one of these API keys:

| Provider | How to Get API Key | Cost |
|----------|-------------------|------|
| **OpenAI** | [Get OpenAI API Key](https://platform.openai.com/api-keys) | ~$0.02-0.08 per image |
| **Google** | [Get Google API Key](https://aistudio.google.com/app/apikey) | Free tier available |
| **Replicate** | [Get Replicate Token](https://replicate.com/account/api-tokens) | ~$0.003-0.01 per image |

### 2. Configure Environment

Create a `.env` file in your project directory:

```env
# Add the API keys for the providers you want to use
OPENAI_API_KEY=your-openai-api-key-here
GOOGLE_API_KEY=your-google-api-key-here  
REPLICATE_API_TOKEN=your-replicate-api-token-here

# Optional settings
OUTPUT_DIR=outputs
GOOGLE_IMAGEN_ENDPOINT=
```

### 3. Add to Your MCP Client

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "imagegen": {
      "command": "npx",
      "args": ["imagegen-mcp-server"]
    }
  }
}
```

### 4. Test the Installation

```bash
# Test if the server starts correctly
npx imagegen-mcp-server

# Or if installed globally
imagegen-mcp-server
```

## Available Tools

### 1. OpenAI Image Generation (`image_generate_openai`)

Generate images using OpenAI's DALL-E models.

**Parameters:**
```typescript
{
  prompt: string;              // Required: Image description
  model?: string;              // "dall-e-2", "dall-e-3", "gpt-image-1" (default)
  size?: string;               // "1024x1024", "1792x1024", "1024x1792", etc.
  width?: number;              // Alternative to size
  height?: number;             // Alternative to size
  quality?: "standard" | "hd" | "low" | "medium" | "high" | "auto";
  format?: "png" | "jpeg" | "jpg" | "webp";
  background?: "transparent" | "opaque" | "auto"; // gpt-image-1 only
  style?: "vivid" | "natural";  // DALL-E 3 only
  returnBase64?: boolean;      // Include base64 in response
  filenameHint?: string;       // Custom filename prefix
}
```

**Model-specific features:**
- **DALL-E 2**: Basic generation, sizes: 256×256, 512×512, 1024×1024
- **DALL-E 3**: High-quality generation, sizes: 1024×1024, 1792×1024, 1024×1792
- **GPT-Image-1**: Latest model with background control, multiple formats, flexible sizing

### 2. Google Imagen Generation (`image_generate_google`)

Generate images using Google's Imagen models via custom endpoint.

**Parameters:**
```typescript
{
  prompt: string;              // Required: Image description
  model?: string;              // Model name
  size?: string;               // Image dimensions
  quality?: string;            // Quality setting
  format?: "png" | "jpeg" | "jpg" | "webp";
  returnBase64?: boolean;
  filenameHint?: string;
}
```

**Requirements:**
- Set `GOOGLE_IMAGEN_ENDPOINT` in your `.env` file
- Endpoint should accept POST requests with JSON payload
- Response format: `{ image: { base64: string, mimeType?: string } }`

### 3. Google Gemini Generation (`image_generate_gemini`)

Generate images using Google's Gemini models via the official SDK.

**Parameters:**
```typescript
{
  prompt: string;              // Required: Image description
  model?: string;              // Default: "gemini-2.5-flash-image-preview"
  returnBase64?: boolean;
  filenameHint?: string;
}
```

### 4. Replicate Flux Generation (`image_generate_replicate`)

Generate images using Flux 1.1 models via Replicate API.

**Parameters:**
```typescript
{
  prompt: string;              // Required: Image description
  model?: string;              // Default: "black-forest-labs/flux-1.1-pro"
  width?: number;              // Image width (default: 1024)
  height?: number;             // Image height (default: 1024)
  size?: string;               // Alternative format: "1024x1024"
  format?: "png" | "jpeg" | "jpg" | "webp";
  seed?: number;               // Reproducible generation
  returnBase64?: boolean;
  filenameHint?: string;
}
```

**Flux Model Features:**
- **Flux 1.1 Pro**: State-of-the-art image quality and prompt following
- **High Resolution**: Supports various aspect ratios and sizes
- **Fast Generation**: Optimized for speed and quality
- **Seed Support**: Reproducible image generation

## Examples

### Generate with OpenAI GPT-Image-1

```javascript
const result = await mcpClient.callTool("image_generate_openai", {
  prompt: "A serene mountain landscape at sunset",
  model: "gpt-image-1",
  size: "1536x1024",
  format: "webp",
  background: "transparent",
  quality: "high"
});
```

### Generate with Google Gemini

```javascript
const result = await mcpClient.callTool("image_generate_gemini", {
  prompt: "A futuristic city with flying cars",
  returnBase64: true
});
```

### Generate with Flux 1.1

```javascript
const result = await mcpClient.callTool("image_generate_replicate", {
  prompt: "A detailed portrait of a robot in a cyberpunk setting",
  width: 1024,
  height: 1536,
  seed: 12345,
  format: "png"
});
```

## Output Format

All tools return a consistent response format:

```typescript
{
  content: [
    {
      type: "text",
      text: "provider=openai model=gpt-image-1 saved=/path/to/image.png"
    },
    {
      type: "image",        // Only if returnBase64: true
      data: "base64data",
      mimeType: "image/png"
    }
  ]
}
```

Generated images are automatically saved to the configured output directory with timestamped filenames.

## Publishing to npm

The package is ready for npm publishing:

```bash
# Update version
npm version patch|minor|major

# Publish
npm publish
```

## API Keys Setup

### OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env` as `OPENAI_API_KEY`

### Google API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key and enable required APIs
3. Add to `.env` as `GOOGLE_API_KEY`

### Replicate API Token
1. Visit [Replicate](https://replicate.com)
2. Sign up and go to your account settings
3. Create an API token
4. Add to `.env` as `REPLICATE_API_TOKEN`

## Development

```bash
npm install    # Install dependencies
npm run dev    # Development with hot reload
npm run build  # Build for production
npm start      # Start production server
```

## License

MIT - See LICENSE file for details.
