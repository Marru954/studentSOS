/**
 * Rendered Markdown: GFM + $…$/$$…$$ math (KaTeX) + fenced-code syntax
 * highlighting. react-markdown emits no raw HTML, so note content is
 * sanitized by construction.
 */
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
// katex/dist/katex.min.css is imported by the /note route, not here, so this
// component stays renderable outside the bundler (markup audit script).

export function NotePreview({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <p className="text-sm text-ink-mute">
        L&rsquo;anteprima formattata apparirà qui mentre scrivi. Puoi usare
        Markdown, blocchi di codice evidenziato e formule matematiche.
      </p>
    );
  }
  return (
    <div className="note-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        // demote content headings: the page outline already owns h1
        components={{ h1: "h2", h2: "h3", h3: "h4", h4: "h5" }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
