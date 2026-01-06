# Installation Guide

Quick setup guide for the Mermaid diagram generation MCP server integration.

## Prerequisites

- Node.js (v16 or higher)
- npm or npx
- Claude Code (CLI or Desktop app)

## Installation Steps

### 1. Install the MCP Server

Install the Mermaid MCP server globally:

```bash
npm install -g mcp-mermaid
```

Verify installation:
```bash
npm list -g mcp-mermaid
```

### 2. Configure Your Tool

Choose the configuration that matches your setup:

#### For Claude Desktop App

Add the Mermaid MCP server to your Claude Desktop configuration file:

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "mermaid": {
      "command": "npx",
      "args": ["-y", "mcp-mermaid"]
    }
  }
}
```

If you already have other MCP servers configured, add the `"mermaid"` entry to your existing `mcpServers` object.

#### For Claude Code (CLI)

Claude Code automatically detects globally installed MCP servers. No additional configuration file changes needed - just ensure you installed the package globally in step 1.

### 3. Copy Skill Files

Copy the skill definition to your Claude Code skills directory:

```bash
# macOS/Linux
mkdir -p ~/.claude/skills
cp skills/diagram.md ~/.claude/skills/

# Windows
mkdir %USERPROFILE%\.claude\skills
copy skills\diagram.md %USERPROFILE%\.claude\skills\
```

### 4. Optional: Copy SuperClaude Framework Files

If you use the SuperClaude framework, copy the MODE files:

```bash
# macOS/Linux
cp MODE_*.md ~/.claude/
cp MCP_Mermaid.md ~/.claude/

# Windows
copy MODE_*.md %USERPROFILE%\.claude\
copy MCP_Mermaid.md %USERPROFILE%\.claude\
```

### 5. Restart

- **Claude Desktop:** Quit and restart the application
- **Claude Code (CLI):** No restart needed - changes take effect immediately on next run

## Verification

Test that the installation works:

```bash
# In Claude Code
/diagram flowchart for a simple process
```

You should see:
1. Claude Code generates a Mermaid diagram
2. File saved to `claudedocs/diagrams/`
3. Both `.md` and `.html` files created

## Project Setup

### Create Diagram Directory

The integration expects diagrams to be saved in:

```bash
mkdir -p claudedocs/diagrams
```

### Install HTML Generation Dependencies (Optional)

For manual HTML generation:

```bash
# No additional dependencies required
# The utils/generate-html.js script uses Node.js built-in modules
```

## Usage

### Automatic Generation

Just ask Claude Code to visualize something:

```
"Show me the architecture of the auth module"
"Explain the login flow"
"Diagram the API request sequence"
```

### Manual Command

Use the `/diagram` skill:

```
/diagram flowchart for user registration
/diagram sequence for POST /api/login
/diagram architecture of auth module
/diagram state for user session lifecycle
```

### HTML Generation

HTML files are generated automatically. For manual generation:

```bash
node utils/generate-html.js claudedocs/diagrams/your-diagram.md
```

## Troubleshooting

### MCP Server Not Loading

**Issue**: Mermaid diagrams not generating

**Check**:
1. Verify installation: `npm list -g mcp-mermaid`
2. Check configuration file path is correct
3. Ensure JSON syntax is valid (no trailing commas)
4. Restart Claude Code after configuration changes

**Solution**:
```bash
# Reinstall if needed
npm uninstall -g mcp-mermaid
npm install -g mcp-mermaid
```

### Diagrams Not Auto-Triggering

**Issue**: Manual `/diagram` works, but automatic detection doesn't

**Solution**:
1. Use specific keywords: "architecture", "flow", "sequence", "state"
2. Be explicit: "Show me the architecture" vs "Explain the code"
3. Check that MODE files are installed in `~/.claude/`

### Permission Errors

**Issue**: Cannot create files in `claudedocs/diagrams/`

**Solution**:
```bash
# Ensure directory exists and has correct permissions
mkdir -p claudedocs/diagrams
chmod 755 claudedocs/diagrams
```

### HTML Files Won't Open

**Issue**: Security restrictions on local files

**Solution**:
Use a local server:
```bash
cd claudedocs/diagrams
python3 -m http.server 8000
# Open http://localhost:8000/your-diagram.html
```

## Uninstallation

To remove the Mermaid MCP integration:

1. Remove from Claude Code configuration:
   ```bash
   # Edit claude_desktop_config.json and remove "mermaid" entry
   ```

2. Uninstall MCP server:
   ```bash
   npm uninstall -g mcp-mermaid
   ```

3. Remove skill files:
   ```bash
   rm ~/.claude/skills/diagram.md
   rm ~/.claude/MODE_Diagram_Generation.md
   rm ~/.claude/MCP_Mermaid.md
   ```

## Next Steps

After installation:

1. Read [README.md](README.md) for complete feature overview
2. Check [EXAMPLES.md](EXAMPLES.md) for workflow examples
3. Browse [TEMPLATES.md](TEMPLATES.md) for Mermaid syntax reference
4. Review [TEST_PLAN.md](TEST_PLAN.md) to verify all features work

## Support

For issues or questions:
- Check [Mermaid Documentation](https://mermaid.js.org/)
- Visit [mcp-mermaid GitHub](https://github.com/hustcc/mcp-mermaid)
- Review troubleshooting section above

---

**Installation complete! Start generating diagrams with Claude Code!** 🎉
