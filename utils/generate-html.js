#!/usr/bin/env node

/**
 * Generate interactive HTML file from Mermaid diagram
 * Usage: node generate-html.js <markdown-file> [output-html]
 */

const fs = require('fs');
const path = require('path');

function extractDiagramInfo(markdownContent) {
    const lines = markdownContent.split('\n');

    let title = '';
    let generated = '';
    let type = '';
    let context = '';
    let mermaidCode = '';
    let description = '';
    let relatedFiles = [];

    let inMermaid = false;
    let inDescription = false;
    let inRelatedFiles = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Extract title (first h1)
        if (line.startsWith('# ') && !title) {
            title = line.substring(2).trim();
            continue;
        }

        // Extract metadata
        if (line.startsWith('**Generated**:')) {
            generated = line.split(':')[1].trim();
        } else if (line.startsWith('**Type**:')) {
            type = line.split(':')[1].trim();
        } else if (line.startsWith('**Context**:')) {
            context = line.split(':')[1].trim();
        }

        // Extract Mermaid code
        if (line.trim() === '```mermaid') {
            inMermaid = true;
            continue;
        }
        if (inMermaid && line.trim() === '```') {
            inMermaid = false;
            continue;
        }
        if (inMermaid) {
            mermaidCode += line + '\n';
        }

        // Extract description
        if (line.startsWith('## Description')) {
            inDescription = true;
            inRelatedFiles = false;
            continue;
        }
        if (line.startsWith('## Related Files')) {
            inDescription = false;
            inRelatedFiles = true;
            continue;
        }
        if (line.startsWith('##')) {
            inDescription = false;
            inRelatedFiles = false;
        }
        if (inDescription && line.trim()) {
            description += line + ' ';
        }

        // Extract related files
        if (inRelatedFiles && line.trim().startsWith('-')) {
            relatedFiles.push(line.trim().substring(1).trim());
        }
    }

    return {
        title: title || 'Diagram',
        generated: generated || new Date().toISOString(),
        type: type || 'diagram',
        context: context || '',
        mermaidCode: mermaidCode.trim(),
        description: description.trim() || 'No description provided',
        relatedFiles
    };
}

function generateHTML(diagramInfo) {
    const templatePath = path.join(__dirname, '..', 'templates', 'diagram-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders
    template = template.replace(/{{TITLE}}/g, diagramInfo.title);
    template = template.replace(/{{GENERATED}}/g, diagramInfo.generated);
    template = template.replace(/{{TYPE}}/g, diagramInfo.type);
    template = template.replace(/{{CONTEXT}}/g, diagramInfo.context);
    template = template.replace(/{{MERMAID_CODE}}/g, diagramInfo.mermaidCode);
    template = template.replace(/{{DESCRIPTION}}/g, diagramInfo.description);

    // Generate related files list
    const relatedFilesList = diagramInfo.relatedFiles
        .map(file => `                <li>${file}</li>`)
        .join('\n');
    template = template.replace(/{{RELATED_FILES}}/g, relatedFilesList || '                <li>None</li>');

    return template;
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage: node generate-html.js <markdown-file> [output-html]');
        process.exit(1);
    }

    const inputFile = args[0];

    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File not found: ${inputFile}`);
        process.exit(1);
    }

    // Read markdown file
    const markdownContent = fs.readFileSync(inputFile, 'utf8');

    // Extract diagram information
    const diagramInfo = extractDiagramInfo(markdownContent);

    // Generate HTML
    const htmlContent = generateHTML(diagramInfo);

    // Determine output filename
    const outputFile = args[1] || inputFile.replace(/\.md$/, '.html');

    // Write HTML file
    fs.writeFileSync(outputFile, htmlContent, 'utf8');

    console.log(`[OK] Generated: ${outputFile}`);
    console.log(`  Title: ${diagramInfo.title}`);
    console.log(`  Type: ${diagramInfo.type}`);
    console.log(`  Features: Pan/Zoom, Keyboard shortcuts, Responsive`);
    console.log(`\nOpen in browser to view interactive diagram with zoom support.`);
}

// Self-executing module
if (require.main === module) {
    main();
}

module.exports = { extractDiagramInfo, generateHTML };
