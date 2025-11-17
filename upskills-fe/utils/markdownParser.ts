// Helper function to escape HTML special characters.
const escapeHtml = (text: string): string => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper function to process inline markdown elements like bold, italic, code, links, and images.
const processInline = (text: string): string => {
    // Process images first (before links, as images contain links)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    
    // Process links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Process bold (**text** or __text__)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Process italic (*text* or _text_)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Process inline code (but not if it's inside a code block)
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    return text;
};

// A comprehensive parser to convert markdown-like text to HTML.
export const parseContent = (markdown: string): string => {
    if (!markdown) return '';
    
    const lines = markdown.split('\n');
    let html = '';
    let inList = false;
    let inOrderedList = false;
    let inCodeBlock = false;
    let codeLang = '';
    let codeContent = '';
    let inParagraph = false;

    const closeParagraph = () => {
        if(inParagraph) {
            html += '</p>\n';
            inParagraph = false;
        }
    }

    const closeList = () => {
        if (inList) {
            html += '</ul>\n';
            inList = false;
        }
        if (inOrderedList) {
            html += '</ol>\n';
            inOrderedList = false;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Handle code blocks
        if (line.startsWith('```')) {
            closeParagraph();
            closeList();
            if (inCodeBlock) {
                // End of code block
                const escapedCode = escapeHtml(codeContent);
                html += `<pre><code class="language-${codeLang}">${escapedCode.trim()}</code></pre>\n`;
                inCodeBlock = false;
                codeContent = '';
            } else {
                // Start of code block
                inCodeBlock = true;
                codeLang = line.substring(3).trim() || 'plaintext';
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent += line + '\n';
            continue;
        }

        // Handle headings (# ## ### #### ##### ######)
        if (trimmedLine.startsWith('###### ')) {
            closeParagraph();
            closeList();
            html += `<h6>${processInline(escapeHtml(trimmedLine.substring(7)))}</h6>\n`;
            continue;
        } else if (trimmedLine.startsWith('##### ')) {
            closeParagraph();
            closeList();
            html += `<h5>${processInline(escapeHtml(trimmedLine.substring(6)))}</h5>\n`;
            continue;
        } else if (trimmedLine.startsWith('#### ')) {
            closeParagraph();
            closeList();
            html += `<h4>${processInline(escapeHtml(trimmedLine.substring(5)))}</h4>\n`;
            continue;
        } else if (trimmedLine.startsWith('### ')) {
            closeParagraph();
            closeList();
            html += `<h3>${processInline(escapeHtml(trimmedLine.substring(4)))}</h3>\n`;
            continue;
        } else if (trimmedLine.startsWith('## ')) {
            closeParagraph();
            closeList();
            html += `<h2>${processInline(escapeHtml(trimmedLine.substring(3)))}</h2>\n`;
            continue;
        } else if (trimmedLine.startsWith('# ')) {
            closeParagraph();
            closeList();
            html += `<h1>${processInline(escapeHtml(trimmedLine.substring(2)))}</h1>\n`;
            continue;
        }

        // Handle horizontal rules
        if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
            closeParagraph();
            closeList();
            html += '<hr />\n';
            continue;
        }

        // Handle unordered lists (- or *)
        if (trimmedLine.match(/^[-*]\s+/)) {
            closeParagraph();
            if (inOrderedList) {
                html += '</ol>\n';
                inOrderedList = false;
            }
            if (!inList) {
                html += '<ul>\n';
                inList = true;
            }
            const listContent = trimmedLine.replace(/^[-*]\s+/, '');
            html += `  <li>${processInline(escapeHtml(listContent))}</li>\n`;
            continue;
        }

        // Handle ordered lists (1. 2. etc.)
        if (trimmedLine.match(/^\d+\.\s+/)) {
            closeParagraph();
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
            if (!inOrderedList) {
                html += '<ol>\n';
                inOrderedList = true;
            }
            const listContent = trimmedLine.replace(/^\d+\.\s+/, '');
            html += `  <li>${processInline(escapeHtml(listContent))}</li>\n`;
            continue;
        }

        // Handle blockquotes
        if (trimmedLine.startsWith('> ')) {
            closeParagraph();
            closeList();
            const quoteContent = trimmedLine.substring(2);
            html += `<blockquote><p>${processInline(escapeHtml(quoteContent))}</p></blockquote>\n`;
            continue;
        }

        // Handle empty lines
        if (trimmedLine === '') {
            closeParagraph();
            closeList();
            continue;
        }

        // Handle regular paragraphs
        closeList();
        if (!inParagraph) {
            html += '<p>';
            inParagraph = true;
            html += processInline(escapeHtml(line));
        } else {
            html += ' ' + processInline(escapeHtml(line));
        }
    }

    // Close any open tags
    closeList();
    closeParagraph();
    
    if (inCodeBlock) {
        // Failsafe for unclosed code blocks
        const escapedCode = escapeHtml(codeContent);
        html += `<pre><code class="language-${codeLang}">${escapedCode.trim()}</code></pre>\n`;
    }

    return html;
};
