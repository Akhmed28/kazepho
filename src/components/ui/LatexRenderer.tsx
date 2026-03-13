import { useMemo } from 'react';
import katex from 'katex';

interface Props {
  children: string;
  className?: string;
}

function renderLatex(text: string): string {
  // Process display math first: $$...$$
  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<span style="color:var(--izho)">$$${math}$$</span>`;
    }
  });

  // Then inline math: $...$
  result = result.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<span style="color:var(--izho)">$${math}$</span>`;
    }
  });

  // Convert markdown-style bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Convert newlines to <br> for rendering
  result = result.replace(/\n\n/g, '</p><p>');
  result = `<p>${result}</p>`;

  return result;
}

export default function LatexRenderer({ children, className }: Props) {
  const html = useMemo(() => renderLatex(children), [children]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ lineHeight: 1.8 }}
    />
  );
}
