
import React from 'react';
import { Button } from "@/components/ui/button";
import { Code, Plus } from 'lucide-react';

type EmptyStateProps = {
  onCreateSnippet: () => void;
};

const EmptyState = ({ onCreateSnippet }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Code className="h-12 w-12 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold font-jetbrains mb-2">No snippets yet</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Start building your collection of code snippets. Save frequently used code and find it when you need it.
      </p>
      
      <div className="typing-animation max-w-md mb-8 text-sm font-jetbrains">
        console.log('Welcome to SnipStash!');
      </div>
      
      <Button onClick={onCreateSnippet} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="mr-2 h-4 w-4" /> Create Your First Snippet
      </Button>
    </div>
  );
};

export default EmptyState;
