"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"

export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-hidden border",
        "border-border bg-card text-card-foreground rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type CodeBlockCodeProps = {
  code: string
  language?: string
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlockCode({
  code,
  language = "tsx",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setHighlightedHtml("<pre><code></code></pre>")
      return
    }
    const grammar = Prism.languages[language] || Prism.languages.javascript
    const html = Prism.highlight(code, grammar, language)
    setHighlightedHtml(`<pre class="language-${language}"><code class="language-${language}">${html}</code></pre>`)
  }, [code, language])

  const classNames = cn(
    "w-full whitespace-pre-wrap break-words overflow-x-hidden font-jetbrains text-sm [&>pre]:px-4 [&>pre]:py-4",
    className
  )

  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>

function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock } 