import React, { useState } from 'react';
import { Check, Copy, Pencil } from 'lucide-react';
import LanguageBadge from './LanguageBadge';
import TagPill from './TagPill';
import { toast } from '@/hooks/use-toast';
import { Snippet } from '../types/Snippet';
import { incrementUsageCount } from '../services/snippetService';
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/ui/code-block';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type SnippetCardProps = {
  snippet: Snippet;
  onClick: (id: string) => void;
  viewMode?: 'grid' | 'list';
  isRecent?: boolean;
  isMostUsed?: boolean;
  onEditSnippet?: (snippet: Snippet) => void;
};

const SnippetCard = ({ 
  snippet, 
  onClick, 
  viewMode = 'grid',
  isRecent = false,
  isMostUsed = false,
  onEditSnippet
}: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copyCount, setCopyCount] = useState(snippet.usage_count || 0);

  const handleCopyClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setCopyCount((prev) => prev + 1);
      incrementUsageCount(snippet.id).catch(() => {});
      toast({
        title: "Copied to clipboard",
        description: `${snippet.title} has been copied to your clipboard.`,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "There was an error copying to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(false);
    if (onEditSnippet) onEditSnippet(snippet);
  };

  return (
    <>
      <div
        className="group relative rounded-2xl overflow-hidden shadow-xl border border-border bg-gradient-to-br from-background to-card/90 hover:shadow-2xl hover:border-primary/60 transition-all duration-300 cursor-pointer max-w-3xl mx-auto min-h-[500px] h-[500px] w-full transform hover:scale-105 select-none"
        onClick={() => setDialogOpen(true)}
        style={{ minHeight: 500, height: 500 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 h-8 w-8"
          onClick={handleCopyClick}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <CodeBlock className="rounded-2xl h-full flex flex-col">
          <CodeBlockGroup className="border-border border-b px-4 py-3 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <LanguageBadge language={snippet.language} />
                </div>
                <span className="font-jetbrains font-bold text-lg text-foreground truncate max-w-[60vw]">
                  {snippet.title}
                </span>
              </div>
            </div>
          </CodeBlockGroup>
          <div className="flex-1 overflow-hidden">
            <CodeBlockCode code={snippet.code} language={snippet.language} />
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-3 pt-2">
            {snippet.tags && snippet.tags.length > 0 ? snippet.tags.map((tag, idx) => (
              <TagPill key={idx} name={tag.name} type={tag.type} />
            )) : null}
          </div>
          <div className="absolute bottom-3 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded shadow font-mono">
            {copyCount} copied
          </div>
        </CodeBlock>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
          <div className="flex flex-col h-[80vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="mr-3">
                    <LanguageBadge language={snippet.language} />
                  </div>
                  <span className="font-jetbrains font-bold text-xl text-foreground truncate max-w-[40vw]">
                    {snippet.title}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopyClick}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="px-6 pb-2 text-xs text-muted-foreground flex gap-4">
              <span>Created: {snippet.created_at ? new Date(snippet.created_at).toLocaleString() : 'N/A'}</span>
              <span>Last Used: {snippet.updated_at ? new Date(snippet.updated_at).toLocaleString() : 'N/A'}</span>
            </div>
            <div className="flex-1 overflow-auto px-6 pb-2 pt-2">
              <CodeBlockCode code={snippet.code} language={snippet.language} />
            </div>
            <div className="flex flex-wrap gap-2 px-6 pb-4 pt-2">
              {snippet.tags && snippet.tags.length > 0 ? snippet.tags.map((tag, idx) => (
                <TagPill key={idx} name={tag.name} type={tag.type} />
              )) : null}
            </div>
            <div className="flex justify-end px-6 pb-6">
              <Button variant="outline" onClick={handleEdit} className="gap-2">
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SnippetCard;
