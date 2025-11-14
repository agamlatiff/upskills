// Helper function to escape HTML special characters.
const escapeHtml = (text: string): string => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper function to process inline markdown elements like bold, italic, and code.
const processInline = (text: string): string => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
};

// A simple parser to convert markdown-like text to HTML.
export const parseContent = (markdown: string): string => {
    if (!markdown) return '';
    
    // Escape the entire input first to prevent XSS, but we will handle it in processInline
    // and for code blocks separately to avoid double-escaping.
    const lines = markdown.split('\n');
    let html = '';
    let inList = false;
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

    for (const line of lines) {
        if (line.startsWith('```')) {
            closeParagraph();
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
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

        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('- ')) {
            closeParagraph();
            if (!inList) {
                html += '<ul>\n';
                inList = true;
            }
            html += `  <li>${processInline(escapeHtml(trimmedLine.substring(2)))}</li>\n`;
        } else {
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }

            if (trimmedLine.startsWith('### ')) {
                closeParagraph();
                html += `<h3>${processInline(escapeHtml(trimmedLine.substring(4)))}</h3>\n`;
            } else if (trimmedLine !== '') {
                if(!inParagraph) {
                    html += '<p>';
                    inParagraph = true;
                    html += processInline(escapeHtml(line));
                } else {
                    html += '<br />' + processInline(escapeHtml(line));
                }
            } else {
                closeParagraph();
            }
        }
    }

    if (inList) html += '</ul>\n';
    closeParagraph();
    if (inCodeBlock) { // Failsafe for unclosed code blocks
        const escapedCode = escapeHtml(codeContent);
        html += `<pre><code class="language-${codeLang}">${escapedCode.trim()}</code></pre>\n`;
    }

    return html;
};
