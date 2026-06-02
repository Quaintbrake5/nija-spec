import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CodeBlock.css';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  copyable?: boolean;
}

export const CodeBlock = ({
  code,
  language,
  title,
  copyable = false,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-block">
      {title && (
        <div className="code-block-header">
          <span className="code-block-title">{title}</span>
          {language && (
            <span className="code-block-language">{language}</span>
          )}
          {copyable && (
            <button
              type="button"
              className="code-block-copy"
              onClick={handleCopy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      )}
      {!title && copyable && (
        <div className="code-block-header">
          <div />
          <button
            type="button"
            className="code-block-copy"
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}
      <pre className="code-block-pre">
        <code className="code-block-code">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
