import React, { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type CodeBlockProps = {
  code: string;
  language: string;
  preview?: boolean;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  detectPatterns?: boolean;
};

// Enhanced syntax highlighting function with more detailed token handling for dark theme
const highlightCode = (code: string, language: string) => {
  // Language specific highlighting rules optimized for dark theme
  if (language === 'javascript' || language === 'typescript') {
    return code
      // Keywords
      .replace(/(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|finally)(\s|$)/g, '<span style="color: #C678DD;">$1</span>$2')
      // Types (TypeScript)
      .replace(/(string|number|boolean|any|void|interface|type|extends|implements|namespace)(\s|$)/g, '<span style="color: #E5C07B;">$1</span>$2')
      // Strings
      .replace(/("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|`(?:\\`|[^`])*`)(?!\w)/g, '<span style="color: #98C379;">$1</span>')
      // Numbers
      .replace(/(?<![a-zA-Z0-9_])(\d+\.?\d*|\.\d+)(?![a-zA-Z0-9_])/g, '<span style="color: #D19A66;">$1</span>')
      // Brackets and operators
      .replace(/(\{|\}|\(|\)|\[|\]|=>|=|&amp;|&lt;|&gt;|\+|-|\*|\/|%|\||\^|!|\?|:|;|,|\.|==|===|!=|!==|>=|<=)/g, '<span style="color: #56B6C2;">$1</span>')
      // Comments
      .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span style="color: #5C6370;">$1</span>')
      // React hooks
      .replace(/(use[A-Z]\w+)/g, '<span style="color: #61AFEF;">$1</span>')
      // Array methods
      .replace(/(\.map|\.filter|\.reduce|\.forEach|\.find|\.some|\.every|\.includes)/g, '<span style="color: #61AFEF;">$1</span>')
      // DOM API
      .replace(/(document|window|localStorage|sessionStorage|navigator|console)\./g, '<span style="color: #E06C75;">$1</span>')
      // API Calls
      .replace(/(fetch|axios|XMLHttpRequest)/g, '<span style="color: #56B6C2;">$1</span>')
      // Error handling
      .replace(/(Error|TypeError|SyntaxError)/g, '<span style="color: #E06C75;">$1</span>')
      // JSX Tags
      .replace(/(&lt;\/?\w+)/g, '<span style="color: #E06C75;">$1</span>')
      // Attributes in JSX
      .replace(/(\s\w+)=(".*?")/g, '<span style="color: #D19A66;">$1</span>=<span style="color: #98C379;">$2</span>');
  } else if (language === 'python') {
    return code
      // Keywords
      .replace(/(def|class|if|else|elif|for|while|import|from|return|try|except|finally|with|as|in|is|not|and|or|True|False|None)(\s|$|\:)/g, '<span style="color: #C678DD;">$1</span>$2')
      // Strings
      .replace(/("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|"""[\s\S]*?"""|'''[\s\S]*?''')/g, '<span style="color: #98C379;">$1</span>')
      // Numbers
      .replace(/(?<![a-zA-Z0-9_])(\d+\.?\d*|\.\d+)(?![a-zA-Z0-9_])/g, '<span style="color: #D19A66;">$1</span>')
      // Comments
      .replace(/(#.*)/g, '<span style="color: #5C6370;">$1</span>')
      // Decorators
      .replace(/(@\w+)/g, '<span style="color: #61AFEF;">$1</span>')
      // Built-in functions
      .replace(/(print|len|str|int|float|list|dict|tuple|set|sum|min|max|sorted|range|enumerate|zip|map|filter)(\s*\()/g, '<span style="color: #E06C75;">$1</span>$2')
      // Self parameter
      .replace(/(self)(\.|,|\))/g, '<span style="color: #E06C75;">$1</span>$2');
  } else if (language === 'css' || language === 'scss') {
    return code
      // Properties
      .replace(/([\w-]+)(\s*:)/g, '<span style="color: #E06C75;">$1</span>$2')
      // Values
      .replace(/(:)(\s*)([\w-]+|#[a-fA-F0-9]+)/g, '$1$2<span style="color: #98C379;">$3</span>')
      // Units
      .replace(/(\d+)(px|rem|em|vh|vw|%|s|ms)/g, '<span style="color: #D19A66;">$1$2</span>')
      // Hex colors
      .replace(/(#[a-fA-F0-9]{3,8})(?![a-zA-Z0-9])/g, '<span style="color: #56B6C2;">$1</span>')
      // Media queries
      .replace(/(@media|@keyframes|@import|@font-face|@supports)/g, '<span style="color: #C678DD;">$1</span>')
      // Brackets and punctuation
      .replace(/(\{|\}|;)/g, '<span style="color: #ABB2BF;">$1</span>')
      // Selectors
      .replace(/(\.[\w-]+|#[\w-]+)(\s|,|\{)/g, '<span style="color: #61AFEF;">$1</span>$2')
      // Comments
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #5C6370;">$1</span>');
  } else if (language === 'html') {
    return code
      // Tags
      .replace(/(&lt;\/?)([\w-]+)/g, '<span style="color: #E06C75;">$1$2</span>')
      // Attributes
      .replace(/(\s)([\w-]+)(=)(".*?"|'.*?')/g, '$1<span style="color: #D19A66;">$2</span>$3<span style="color: #98C379;">$4</span>')
      // Angle brackets and comments
      .replace(/(&lt;|&gt;)(?!\w)/g, '<span style="color: #56B6C2;">$1</span>')
      // Comments
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: #5C6370;">$1</span>');
  } else if (language === 'sql') {
    return code
      // Keywords
      .replace(/(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|VIEW|INDEX|TRIGGER|PROCEDURE|FUNCTION|CONSTRAINT|PRIMARY KEY|FOREIGN KEY)(\s|$)/gi, 
        '<span style="color: #C678DD;">$1</span>$2')
      // Strings
      .replace(/('(?:\\'|[^'])*')/g, '<span style="color: #98C379;">$1</span>')
      // Numbers
      .replace(/(?<![a-zA-Z0-9_])(\d+\.?\d*|\.\d+)(?![a-zA-Z0-9_])/g, '<span style="color: #D19A66;">$1</span>')
      // Operators
      .replace(/(=|&lt;|&gt;|&lt;=|&gt;=|!=|IS NULL|IS NOT NULL|IN|LIKE|BETWEEN|AND|OR|NOT)/gi, '<span style="color: #56B6C2;">$1</span>')
      // Comments
      .replace(/(--.*|\/\*[\s\S]*?\*\/)/g, '<span style="color: #5C6370;">$1</span>');
  } else {
    // Generic syntax highlighting for unsupported languages
    return code
      // Keywords (common across languages)
      .replace(/(if|else|for|while|function|return|class|public|private|protected|static|final|void|int|string|bool|true|false|null)(\s|$)/g, '<span style="color: #C678DD;">$1</span>$2')
      // Strings
      .replace(/("(?:\\"|[^"])*"|'(?:\\'|[^'])*')/g, '<span style="color: #98C379;">$1</span>')
      // Comments
      .replace(/(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g, '<span style="color: #5C6370;">$1</span>')
      // Numbers
      .replace(/(?<![a-zA-Z0-9_])(\d+\.?\d*|\.\d+)(?![a-zA-Z0-9_])/g, '<span style="color: #D19A66;">$1</span>');
  }
};

// Function to add line numbers to code
const addLineNumbers = (code: string): string => {
  return code.split('\n').map((line, i) => {
    return `<span class="code-line-number">${i + 1}</span>${line}`;
  }).join('\n');
};

// Function to detect and highlight patterns in code
const detectAndHighlightPatterns = (code: string): string => {
  // Detect and wrap patterns in highlighting spans
  let highlightedCode = code;
  
  // Loop detection
  highlightedCode = highlightedCode.replace(/(for\s*\([^)]*\)|while\s*\([^)]*\))/g, 
    '<span class="pattern-highlight pattern-highlight-loop">$1</span>');
  
  // API call detection
  highlightedCode = highlightedCode.replace(/(fetch\s*\(|axios\.|XMLHttpRequest|\.get\(|\.post\(|request\s*\()/g, 
    '<span class="pattern-highlight pattern-highlight-api">$1</span>');
  
  // Error handling detection
  highlightedCode = highlightedCode.replace(/(try\s*{|catch\s*\([^)]*\)|throw\s+new\s+Error|throw\s+|finally\s*{|except\s+|raise\s+)/g, 
    '<span class="pattern-highlight pattern-highlight-error">$1</span>');
  
  // Debugging detection
  highlightedCode = highlightedCode.replace(/(console\.log|console\.error|console\.debug|debugger|print\s*\()/g, 
    '<span class="pattern-highlight pattern-highlight-debug">$1</span>');
  
  // Array methods detection
  highlightedCode = highlightedCode.replace(/(\.\s*map\s*\(|\.\s*filter\s*\(|\.\s*reduce\s*\(|\.\s*forEach\s*\(|\.\s*find\s*\()/g, 
    '<span class="pattern-highlight pattern-highlight-array">$1</span>');
  
  // React hooks detection
  highlightedCode = highlightedCode.replace(/(use[A-Z][a-zA-Z]*\s*\()/g, 
    '<span class="pattern-highlight pattern-highlight-hook">$1</span>');
  
  return highlightedCode;
};

const CodeBlock = ({ 
  code, 
  language, 
  preview = false, 
  showLineNumbers = true,
  highlightLines = [],
  detectPatterns = false
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    // Apply syntax highlighting with a slight delay for animation
    const timer = setTimeout(() => {
      let processedCode = highlightCode(code, language);
      
      if (detectPatterns) {
        processedCode = detectAndHighlightPatterns(processedCode);
      }
      
      if (showLineNumbers && !preview) {
        processedCode = addLineNumbers(processedCode);
      }
      
      // Highlight specific lines if needed
      if (highlightLines.length > 0 && !preview) {
        const lines = processedCode.split('\n');
        processedCode = lines.map((line, i) => {
          return highlightLines.includes(i + 1) 
            ? `<div class="bg-primary/10 -mx-4 px-4">${line}</div>`
            : line;
        }).join('\n');
      }
      
      setHighlightedCode(processedCode);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [code, language, preview, showLineNumbers, highlightLines, detectPatterns]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Code has been copied to your clipboard.",
          duration: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "There was an error copying to clipboard.",
          variant: "destructive",
        });
        console.error('Failed to copy: ', err);
      });
  };
  
  const displayCode = preview ? code.split('\n').slice(0, 3).join('\n') : code;
  
  return (
    <div 
      className={`code-editor group relative animate-fade-in ${preview ? '' : 'p-0'}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {!preview && (
        <button 
          onClick={copyToClipboard} 
          className={`copy-button ${copied ? 'bg-secondary/30 text-secondary-foreground' : ''} 
                     transition-all duration-200 ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4 animate-copy-success" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
      <pre className={`overflow-x-auto code-scrollbar ${showLineNumbers && !preview ? 'line-numbered' : ''}`}>
        <code className="font-jetbrains text-sm transition-opacity duration-300 block whitespace-pre-wrap break-words" 
              dangerouslySetInnerHTML={{ __html: highlightedCode || displayCode }} />
      </pre>
    </div>
  );
};

export default CodeBlock;
