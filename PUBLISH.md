# Publishing to npm (npx)

This guide explains how to publish the ImageGen MCP Server to npm so users can install it with `npm install` or run it directly with `npx`.

## Prerequisites

1. **npm account**: Create one at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI logged in**: Run `npm login` and enter your credentials
3. **Package ready**: Ensure your package.json and code are ready

## Pre-Publishing Steps

### 1. Verify Package Configuration

Check that `package.json` has all required fields:

```json
{
  "name": "imagegen-mcp-server",
  "version": "0.1.0", 
  "description": "MCP server for AI image generation...",
  "main": "dist/server.js",
  "bin": {
    "imagegen-mcp-server": "dist/server.js"
  },
  "files": [
    "dist/**/*",
    "README.md", 
    "package.json"
  ],
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

### 2. Test the Package Locally

```bash
# Build the package
npm run build

# Test the binary works
node dist/server.js

# Test installation locally
npm pack
npm install -g imagegen-mcp-server-0.1.0.tgz
imagegen-mcp-server # Should work
npm uninstall -g imagegen-mcp-server
```

### 3. Verify Files to Publish

```bash
# See what files will be included
npm pack --dry-run
```

Should include:
- `dist/` directory with compiled code
- `README.md`
- `package.json`
- Any other essential files

## Publishing Process

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and email.

### 2. Check Package Name Availability

```bash
npm view imagegen-mcp-server
```

If it returns "npm ERR! 404", the name is available.

### 3. Build and Publish

```bash
# Build the package (prepublishOnly script runs automatically)
npm publish
```

This will:
1. Run `npm run build` automatically
2. Create a tarball with your files
3. Upload to npm registry

### 4. Verify Publication

```bash
# Check it's published
npm view imagegen-mcp-server

# Test installation
npm install -g imagegen-mcp-server
imagegen-mcp-server

# Test npx (no installation)
npx imagegen-mcp-server
```

## Making Updates

### 1. Update Version

```bash
# Patch version (0.1.0 → 0.1.1)
npm version patch

# Minor version (0.1.0 → 0.2.0) 
npm version minor

# Major version (0.1.0 → 1.0.0)
npm version major
```

This automatically updates `package.json` and creates a git tag.

### 2. Publish Update

```bash
npm publish
```

## Package Configuration Details

### Binary Configuration

The `bin` field makes your package executable via npx:

```json
{
  "bin": {
    "imagegen-mcp-server": "dist/server.js"
  }
}
```

This means:
- `npm install -g imagegen-mcp-server` → `imagegen-mcp-server` command available
- `npx imagegen-mcp-server` → runs directly without installation

### Files to Include

```json
{
  "files": [
    "dist/**/*",     // Compiled JavaScript
    "README.md",     // Documentation  
    "package.json"   // Package info
  ]
}
```

**Don't include**:
- `src/` - Source TypeScript files
- `node_modules/` - Dependencies
- `.env` - Environment files
- `outputs/` - Generated images
- Development files

### Pre-publish Hook

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

This ensures the package is always built before publishing.

## Best Practices

### 1. Semantic Versioning

Follow [semver](https://semver.org/):
- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible  
- **Major** (0.1.0 → 1.0.0): Breaking changes

### 2. Test Before Publishing

```bash
# Install from tarball locally
npm pack
npm install -g imagegen-mcp-server-*.tgz

# Test all functionality
imagegen-mcp-server
# Test with MCP client
# Test with different providers

# Clean up
npm uninstall -g imagegen-mcp-server
```

### 3. Update Documentation

Before each release:
- Update README.md with new features
- Update CHANGELOG.md
- Test all examples in documentation

### 4. Git Workflow

```bash
# Commit all changes
git add .
git commit -m "Prepare v0.1.0"

# Update version and publish
npm version patch
npm publish

# Push to GitHub
git push origin main --tags
```

## Troubleshooting

### "Package name already exists"

If `imagegen-mcp-server` is taken, try:
- `@writingmate/imagegen-mcp-server` (scoped package)
- `imagegen-mcp` 
- `mcp-imagegen-server`

Update the `name` field in `package.json`.

### "Need to authenticate"

```bash
npm login
# Or if you have 2FA enabled:
npm login --auth-type=legacy
```

### "403 Forbidden"

- Check you're logged into correct npm account
- Verify package name isn't taken
- Check if you need to verify email address

### Binary not working after install

- Ensure `dist/server.js` has shebang: `#!/usr/bin/env node`
- Check file permissions: `chmod +x dist/server.js`
- Verify `bin` field in package.json

## After Publishing

### 1. Test Installation

```bash
# Test global installation
npm install -g imagegen-mcp-server
imagegen-mcp-server

# Test npx
npx imagegen-mcp-server

# Test with MCP client
```

### 2. Update Documentation

- Update installation instructions
- Add to MCP server lists/registries
- Share with community

### 3. Monitor

- Watch for issues on GitHub
- Monitor download stats on npm
- Respond to user feedback

Your package is now available worldwide via:
- `npm install -g imagegen-mcp-server`
- `npx imagegen-mcp-server`