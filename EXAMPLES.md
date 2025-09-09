# Usage Examples

This document provides practical examples of using the ImageGen MCP Server with different providers.

## Basic Examples

### OpenAI DALL-E Examples

```javascript
// Simple generation with GPT-Image-1
{
  "name": "image_generate_openai", 
  "arguments": {
    "prompt": "A serene mountain lake at sunrise"
  }
}

// High-quality generation with specific model
{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": "A cyberpunk city with neon lights", 
    "model": "dall-e-3",
    "size": "1792x1024",
    "quality": "hd",
    "style": "vivid"
  }
}

// GPT-Image-1 with background control
{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": "A floating island in the sky",
    "model": "gpt-image-1", 
    "background": "transparent",
    "format": "png",
    "width": 1024,
    "height": 1536
  }
}
```

### Google Gemini Examples

```javascript
// Simple Gemini generation
{
  "name": "image_generate_gemini",
  "arguments": {
    "prompt": "A Japanese garden with cherry blossoms and a stone bridge"
  }
}

// With custom model and base64 output
{
  "name": "image_generate_gemini", 
  "arguments": {
    "prompt": "A futuristic robot in a laboratory",
    "model": "gemini-2.5-flash-image-preview",
    "returnBase64": true,
    "filenameHint": "robot-lab"
  }
}
```

### Replicate Flux Examples

```javascript
// Basic Flux generation
{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "A majestic dragon flying over a medieval castle"
  }
}

// High-resolution with seed for reproducibility
{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "A detailed portrait of an elf warrior in fantasy armor",
    "width": 1024,
    "height": 1536, 
    "seed": 42,
    "format": "png"
  }
}

// Custom model and format
{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "Abstract art with vibrant colors and geometric shapes",
    "model": "black-forest-labs/flux-1.1-pro",
    "size": "1536x1024",
    "format": "webp"
  }
}
```

## Advanced Use Cases

### Comparing Providers

Generate the same prompt with different providers to compare styles:

```javascript
const prompt = "A cozy coffee shop on a rainy evening";

// OpenAI version
{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": prompt,
    "filenameHint": "coffee-shop-openai"
  }
}

// Gemini version  
{
  "name": "image_generate_gemini",
  "arguments": {
    "prompt": prompt,
    "filenameHint": "coffee-shop-gemini"
  }
}

// Flux version
{
  "name": "image_generate_replicate", 
  "arguments": {
    "prompt": prompt,
    "filenameHint": "coffee-shop-flux"
  }
}
```

### Batch Generation

Generate multiple variations with seeds:

```javascript
const basePrompt = "A magical forest with glowing mushrooms";

// Generate 3 variations with different seeds
[42, 123, 999].forEach(seed => {
  return {
    "name": "image_generate_replicate",
    "arguments": {
      "prompt": basePrompt,
      "seed": seed,
      "filenameHint": `forest-variation-${seed}`
    }
  };
});
```

### Different Aspect Ratios

```javascript
// Portrait orientation
{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "A tall lighthouse on a cliff",
    "width": 768,
    "height": 1024
  }
}

// Landscape orientation  
{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": "A wide mountain panorama",
    "size": "1792x1024"
  }
}

// Square format
{
  "name": "image_generate_gemini",
  "arguments": {
    "prompt": "A mandala pattern",
    "size": "1024x1024"
  }
}
```

## Creative Prompts by Category

### Fantasy & Sci-Fi

```javascript
{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "A crystalline alien city floating in space, with bioluminescent towers and energy bridges connecting floating platforms, cosmic background with nebulae"
  }
}

{
  "name": "image_generate_openai", 
  "arguments": {
    "prompt": "A steampunk airship soaring through clouds, brass and copper details, Victorian-era design, adventure atmosphere"
  }
}
```

### Realistic Portraits

```javascript
{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": "Professional headshot of a business executive, clean background, professional lighting, photorealistic",
    "model": "dall-e-3",
    "quality": "hd"
  }
}

{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "Portrait of an elderly craftsman in his workshop, wrinkled hands, wise eyes, natural lighting, highly detailed",
    "width": 768,
    "height": 1024
  }
}
```

### Abstract & Artistic

```javascript
{
  "name": "image_generate_gemini",
  "arguments": {
    "prompt": "Abstract composition with flowing water colors, blue and gold tones, minimalist design"
  }
}

{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": "Geometric abstract art in the style of Kandinsky, vibrant colors, dynamic shapes",
    "background": "transparent",
    "format": "png"
  }
}
```

### Nature & Landscapes

```javascript
{
  "name": "image_generate_replicate",
  "arguments": {
    "prompt": "Sunrise over a misty lake surrounded by pine trees, golden hour lighting, peaceful atmosphere, highly detailed",
    "size": "1536x1024"
  }
}

{
  "name": "image_generate_openai",
  "arguments": {
    "prompt": "Underwater coral reef scene with tropical fish, vibrant colors, crystal clear water"
  }
}
```

## Best Practices

### Prompt Writing Tips

1. **Be Specific**: Instead of "a dog", use "a golden retriever puppy sitting in grass"
2. **Include Style**: "photorealistic", "oil painting", "digital art", "watercolor"  
3. **Specify Lighting**: "golden hour", "soft diffused light", "dramatic shadows"
4. **Add Details**: Colors, textures, mood, composition
5. **Set the Scene**: Background, environment, atmosphere

### Quality Settings

```javascript
// For highest quality (OpenAI)
{
  "model": "dall-e-3",
  "quality": "hd",
  "style": "vivid"
}

// For detailed images (Flux)
{
  "model": "black-forest-labs/flux-1.1-pro", 
  "width": 1024,
  "height": 1024
}

// For transparent backgrounds (GPT-Image-1)
{
  "model": "gpt-image-1",
  "background": "transparent", 
  "format": "png"
}
```

### File Management

```javascript
// Organized naming
{
  "filenameHint": "project-character-concept-v1",
  "returnBase64": false  // Save file only
}

// Include base64 for immediate use
{
  "filenameHint": "thumbnail-image",
  "returnBase64": true   // Get both file and base64
}
```

## Troubleshooting Common Issues

### Low Quality Results

- Use `"quality": "hd"` with DALL-E 3
- Try Flux for highly detailed images
- Increase image dimensions
- Be more specific in prompts

### Content Policy Issues

- Avoid generating real people
- Use general descriptions instead of names
- Keep prompts appropriate and safe
- Different providers have different policies

### API Limits

- OpenAI: Rate limits and monthly quotas
- Google: Daily quotas on free tier  
- Replicate: Pay-per-use, generally generous

### Cost Optimization

- Use Replicate for bulk generation (cheapest)
- Use Google free tier for testing
- Use OpenAI DALL-E 2 for lower costs
- Start with smaller sizes for previews

## Integration Examples

### With Claude Desktop

Ask Claude: "Generate an image of a sunset over mountains using Flux"

Claude will use the MCP tools automatically.

### With Custom Applications

```javascript
// Example MCP client code
const result = await mcpClient.callTool('image_generate_replicate', {
  prompt: 'Your prompt here',
  width: 1024,
  height: 1024
});

console.log('Image saved to:', result.content[0].text);
if (result.content[1]) {
  // Handle base64 data
  const imageData = result.content[1].data;
}
```

This covers the main usage patterns and examples for the ImageGen MCP Server!