# Installation Guide

This guide will walk you through installing and setting up the ImageGen MCP Server.

## Prerequisites

- **Node.js 18 or higher** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- At least one API key from supported providers

## Step 1: Install the Server

### Option A: Global Installation (Recommended)

```bash
npm install -g imagegen-mcp-server
```

This allows you to run `imagegen-mcp-server` from anywhere.

### Option B: Local Installation

```bash
npm install imagegen-mcp-server
```

Then run with `npx imagegen-mcp-server`.

### Option C: From Source

```bash
git clone https://github.com/writingmate/imagegen-mcp.git
cd imagegen-mcp
npm install
npm run build
```

## Step 2: Get API Keys

### OpenAI (DALL-E, GPT-Image-1)

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Add billing information if you haven't already

**Cost**: ~$0.02-0.08 per image depending on model and size.

### Google (Gemini, Imagen)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Select a Google Cloud project (or create one)
4. Copy the key (starts with `AIzaSy`)

**Cost**: Free tier available, then pay-per-use.

### Replicate (Flux 1.1)

1. Sign up at [Replicate.com](https://replicate.com)
2. Go to [Account Settings > API Tokens](https://replicate.com/account/api-tokens)
3. Click "Create token"
4. Copy the token (starts with `r8_`)

**Cost**: ~$0.003-0.01 per image. Very affordable!

## Step 3: Configure Environment

Create a `.env` file in your project directory:

```env
# Required: Add the API keys for providers you want to use
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_API_KEY=AIzaSy-your-google-key-here
REPLICATE_API_TOKEN=r8_your-replicate-token-here

# Optional: Customize output directory
OUTPUT_DIR=generated-images

# Optional: Google Imagen custom endpoint
GOOGLE_IMAGEN_ENDPOINT=
```

**Note**: You only need the API keys for the providers you plan to use.

## Step 4: Add to MCP Client

### Claude Desktop

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "imagegen": {
      "command": "imagegen-mcp-server"
    }
  }
}
```

Or if using npx:

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

### Other MCP Clients

The server works with any MCP-compatible client. Use the command `imagegen-mcp-server` as your server executable.

## Step 5: Test Installation

1. **Test the server starts**:
   ```bash
   imagegen-mcp-server
   ```
   You should see the server start without errors.

2. **Test with your MCP client**:
   - Restart your MCP client (e.g., Claude Desktop)
   - Try generating an image: "Generate an image of a sunset"
   - Check that images are saved to your `outputs/` directory

## Troubleshooting

### Server won't start
- Check Node.js version: `node --version` (should be 18+)
- Verify installation: `npm list -g imagegen-mcp-server`

### API key errors
- Check `.env` file exists and has correct format
- Verify API keys are valid and have credits
- Ensure no extra spaces or quotes around keys

### Images not generating
- Check provider API key is set for the model you're trying to use
- Verify you have sufficient credits/quota
- Check the `outputs/` directory exists and is writable

### MCP client not connecting
- Restart your MCP client after adding configuration
- Check the config file path and JSON syntax
- Try using full path to executable if needed

## Updates

To update to the latest version:

```bash
# If installed globally
npm update -g imagegen-mcp-server

# If installed locally
npm update imagegen-mcp-server
```

## Uninstall

```bash
# If installed globally
npm uninstall -g imagegen-mcp-server

# If installed locally
npm uninstall imagegen-mcp-server
```

## Support

If you encounter issues:

1. Check this installation guide
2. Look at [common issues](https://github.com/writingmate/imagegen-mcp/issues)
3. Create a new issue on GitHub with details about your setup and error messages