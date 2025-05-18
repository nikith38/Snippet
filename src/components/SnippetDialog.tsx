import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CodeBlock from './CodeBlock';
import TagPill from './TagPill';
import { X, Plus, Sparkles, Bug, ArrowRight, ArrowUp, Shield, List } from 'lucide-react';
import { Snippet } from '../types/Snippet';
import { toast } from '@/hooks/use-toast';
import { createSnippet, updateSnippet } from '../services/snippetService';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getFolders, getSnippetFolders, addSnippetToFolder, removeSnippetFromFolder } from '@/services/folderService';
import { Folder } from '@/types/Folder';
import { Checkbox } from './ui/checkbox';

type SnippetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet?: Snippet;
};

const programmingLanguages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C', 'C++', 'PHP', 'Ruby', 'Go', 'Swift', 'Rust', 'Kotlin', 'Dart', 'Scala', 'Objective-C', 'HTML', 'CSS', 'Shell', 'Bash', 'PowerShell', 'R', 'MATLAB', 'Perl', 'SQL', 'Assembly', 'Elixir', 'Erlang', 'Haskell', 'Lua', 'Groovy', 'F#', 'Visual Basic', 'Fortran', 'COBOL', 'Julia', 'SAS', 'VBA', 'TypeScript', 'JavaScript', 'JSON', 'YAML', 'XML', 'Markdown', 'GraphQL', 'Dockerfile', 'Makefile', 'INI', 'TOML', 'Clojure', 'Elm', 'Crystal', 'Nim', 'OCaml', 'ReasonML', 'Solidity', 'VHDL', 'Verilog', 'Prolog', 'APL', 'Awk', 'Batch', 'Common Lisp', 'D', 'Delphi', 'Elm', 'GDScript', 'LabVIEW', 'Lisp', 'Logo', 'MQL4', 'MQL5', 'Pascal', 'PostScript', 'Q#', 'Racket', 'Raku', 'Smalltalk', 'Tcl', 'Verilog', 'VHDL', 'Zig'
];

// Pattern detection for auto-tagging
const detectCodePatterns = (code: string): { pattern: string, type: string, name: string, icon: React.ReactNode }[] => {
  const patterns: { pattern: string, type: string, name: string, icon: React.ReactNode }[] = [];
  const lowerCode = code.toLowerCase();
  
  // API calls
  if (lowerCode.includes('fetch(') || lowerCode.includes('axios.') || lowerCode.includes('xmlhttprequest') || 
      lowerCode.includes('http.get') || lowerCode.includes('http.post') || lowerCode.includes('api.') ||
      lowerCode.includes('request(') || lowerCode.includes('ajax(')) {
    patterns.push({ 
      pattern: 'API calls', 
      type: 'api', 
      name: 'api', 
      icon: <ArrowRight className="h-3 w-3" /> 
    });
  }
  
  // Loops
  if (lowerCode.includes('for (') || lowerCode.includes('while (') || lowerCode.includes('foreach') || 
      lowerCode.includes('for ') || lowerCode.includes('while ') || lowerCode.includes('do {') ||
      lowerCode.includes('for...of') || lowerCode.includes('for...in')) {
    patterns.push({ 
      pattern: 'Loops', 
      type: 'loop', 
      name: 'loop', 
      icon: <ArrowUp className="h-3 w-3" /> 
    });
  }
  
  // Error handling
  if (lowerCode.includes('try {') || lowerCode.includes('catch (') || lowerCode.includes('try:') || 
      lowerCode.includes('except:') || lowerCode.includes('throw ') || lowerCode.includes('error') ||
      lowerCode.includes('finally') || lowerCode.includes('raise ')) {
    patterns.push({ 
      pattern: 'Error handling', 
      type: 'error', 
      name: 'error-handling', 
      icon: <Shield className="h-3 w-3" /> 
    });
  }
  
  // Debugging
  if (lowerCode.includes('console.log') || lowerCode.includes('print(') || lowerCode.includes('debug(') ||
      lowerCode.includes('console.error') || lowerCode.includes('console.warn') || lowerCode.includes('console.info') ||
      lowerCode.includes('debugger') || lowerCode.includes('logger.') || lowerCode.includes('log(')) {
    patterns.push({ 
      pattern: 'Debugging', 
      type: 'debug', 
      name: 'debugging', 
      icon: <Bug className="h-3 w-3" /> 
    });
  }
  
  // Array methods
  if (lowerCode.includes('.map(') || lowerCode.includes('.filter(') || lowerCode.includes('.reduce(') || 
      lowerCode.includes('.foreach(') || lowerCode.includes('.find(') || lowerCode.includes('.some(') ||
      lowerCode.includes('.every(') || lowerCode.includes('.flatmap(') || lowerCode.includes('.sort(') ||
      lowerCode.includes('.reverse(') || lowerCode.includes('.slice(') || lowerCode.includes('.splice(')) {
    patterns.push({ 
      pattern: 'Array operations', 
      type: 'array', 
      name: 'array-methods', 
      icon: <List className="h-3 w-3" /> 
    });
  }

  // Conditional logic
  if (lowerCode.includes('if (') || lowerCode.includes('else if') || lowerCode.includes('else {') ||
      lowerCode.includes('switch (') || lowerCode.includes('case ') || lowerCode.includes('?:') ||
      lowerCode.includes('ternary') || lowerCode.includes('if:') || lowerCode.includes('elif')) {
    patterns.push({
      pattern: 'Conditional logic',
      type: 'condition',
      name: 'conditional',
      icon: <ArrowRight className="h-3 w-3" />
    });
  }

  // Async operations
  if (lowerCode.includes('async') || lowerCode.includes('await') || lowerCode.includes('promise') ||
      lowerCode.includes('.then(') || lowerCode.includes('.catch(') || lowerCode.includes('settimeout') ||
      lowerCode.includes('setinterval') || lowerCode.includes('async/await')) {
    patterns.push({
      pattern: 'Async operations',
      type: 'async',
      name: 'async',
      icon: <ArrowRight className="h-3 w-3" />
    });
  }

  // DOM manipulation
  if (lowerCode.includes('document.') || lowerCode.includes('queryselector') || lowerCode.includes('getelement') ||
      lowerCode.includes('addeventlistener') || lowerCode.includes('innerhtml') || lowerCode.includes('appendchild') ||
      lowerCode.includes('createelement') || lowerCode.includes('classlist')) {
    patterns.push({
      pattern: 'DOM manipulation',
      type: 'dom',
      name: 'dom',
      icon: <List className="h-3 w-3" />
    });
  }

  // Regular expressions
  if (lowerCode.includes('regex') || lowerCode.includes('regexp') || lowerCode.includes('/[a-z]/') ||
      lowerCode.includes('match(') || lowerCode.includes('replace(') || lowerCode.includes('test(') ||
      lowerCode.includes('exec(') || lowerCode.includes('search(')) {
    patterns.push({
      pattern: 'Regular expressions',
      type: 'regex',
      name: 'regex',
      icon: <List className="h-3 w-3" />
    });
  }

  // Data structures
  if (lowerCode.includes('map(') || lowerCode.includes('set(') || lowerCode.includes('weakmap') ||
      lowerCode.includes('weakset') || lowerCode.includes('object.entries') || lowerCode.includes('object.keys') ||
      lowerCode.includes('object.values') || lowerCode.includes('new map') || lowerCode.includes('new set')) {
    patterns.push({
      pattern: 'Data structures',
      type: 'data-structure',
      name: 'data-structures',
      icon: <List className="h-3 w-3" />
    });
  }
  
  return patterns;
};

// Generate auto tags based on code content and language
const generateAutoTags = (code: string, language: string): { name: string, type: 'auto' }[] => {
  const tags: { name: string, type: 'auto' }[] = [];
  const detectedPatterns = detectCodePatterns(code);
  
  // Add tags based on detected patterns
  detectedPatterns.forEach(pattern => {
    tags.push({ name: pattern.name, type: 'auto' });
  });
  
  // Add language tag
  if (language) {
    tags.push({ name: language.toLowerCase(), type: 'auto' });
  }

  // Add framework-specific tags based on imports/requires
  const lowerCode = code.toLowerCase();
  if (lowerCode.includes('react') || lowerCode.includes('jsx') || lowerCode.includes('tsx')) {
    tags.push({ name: 'react', type: 'auto' });
  }
  if (lowerCode.includes('vue')) {
    tags.push({ name: 'vue', type: 'auto' });
  }
  if (lowerCode.includes('angular')) {
    tags.push({ name: 'angular', type: 'auto' });
  }
  if (lowerCode.includes('express') || lowerCode.includes('koa') || lowerCode.includes('next')) {
    tags.push({ name: 'node', type: 'auto' });
  }
  
  return tags;
};

const SnippetDialog = ({ open, onOpenChange, snippet }: SnippetDialogProps) => {
  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [language, setLanguage] = useState(snippet?.language || 'JavaScript');
  const [code, setCode] = useState(snippet?.code || '');
  const [userTags, setUserTags] = useState<string[]>(
    snippet?.tags.filter(t => t.type === 'user').map(t => t.name) || []
  );
  const [autoTags, setAutoTags] = useState<{ name: string, type: 'auto' }[]>(
    snippet?.tags.filter(t => t.type === 'auto').map(t => ({ name: t.name, type: 'auto' })) || []
  );
  const [newTag, setNewTag] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState<{ pattern: string, type: string, name: string, icon: React.ReactNode }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [availableFolders, setAvailableFolders] = useState<Folder[]>([]);
  
  const queryClient = useQueryClient();
  
  // Fetch folders
  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  // Fetch snippet's folders when editing
  useEffect(() => {
    if (snippet) {
      getSnippetFolders(snippet.id).then(folders => {
        setSelectedFolders(folders.map(f => f.id));
      });
    } else {
      setSelectedFolders([]);
    }
  }, [snippet]);

  // Update available folders when folders data changes
  useEffect(() => {
    setAvailableFolders(folders);
  }, [folders]);

  // Update form when snippet changes
  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setDescription(snippet.description || '');
      setLanguage(snippet.language);
      setCode(snippet.code);
      setUserTags(snippet.tags.filter(t => t.type === 'user').map(t => t.name));
      setAutoTags(snippet.tags.filter(t => t.type === 'auto').map(t => ({ name: t.name, type: 'auto' })));
    } else {
      setTitle('');
      setDescription('');
      setLanguage('JavaScript');
      setCode('');
      setUserTags([]);
      setAutoTags([]);
    }
  }, [snippet, open]);
  
  // Update auto-generated tags when code or language changes
  useEffect(() => {
    const patterns = detectCodePatterns(code);
    setDetectedPatterns(patterns);
    
    // Don't immediately regenerate tags if we're editing an existing snippet
    if (!snippet) {
      const newAutoTags = generateAutoTags(code, language);
      setAutoTags(newAutoTags);
    }
  }, [code, language]);
  
  const handleAddTag = () => {
    if (newTag && !userTags.includes(newTag)) {
      setUserTags([...userTags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setUserTags(userTags.filter(t => t !== tag));
  };
  
  const handleGenerateAutoTags = () => {
    // Generate tags based on code content
    setIsGeneratingTags(true);
    setTimeout(() => {
      const newAutoTags = generateAutoTags(code, language);
      setAutoTags(newAutoTags);
      setIsGeneratingTags(false);
      
      toast({
        title: "Tags Generated",
        description: `${newAutoTags.length} tags were automatically detected in your code.`,
      });
    }, 1000);
  };
  
  const handleFolderToggle = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your snippet.",
        variant: "destructive",
      });
      return;
    }
    
    if (!code.trim()) {
      toast({
        title: "Code required",
        description: "Your snippet needs some code!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Combine user and auto tags
    const allTags = [
      ...userTags.map(name => ({ name, type: 'user' as const })),
      ...autoTags
    ];

    try {
      let savedSnippet: Snippet | null;

      if (snippet) {
        // Update existing snippet
        savedSnippet = await updateSnippet(snippet.id, {
          title,
          description,
          language,
          code,
          tags: allTags
        });

        // Update folder associations
        const currentFolders = await getSnippetFolders(snippet.id);
        const currentFolderIds = currentFolders.map(f => f.id);

        // Remove from folders that are no longer selected
        for (const folderId of currentFolderIds) {
          if (!selectedFolders.includes(folderId)) {
            await removeSnippetFromFolder(folderId, snippet.id);
          }
        }

        // Add to newly selected folders
        for (const folderId of selectedFolders) {
          if (!currentFolderIds.includes(folderId)) {
            await addSnippetToFolder(folderId, snippet.id);
          }
        }
      } else {
        // Create new snippet
        savedSnippet = await createSnippet({
          title,
          description,
          language,
          code,
          tags: allTags
        });

        // Add to selected folders
        if (savedSnippet) {
          for (const folderId of selectedFolders) {
            await addSnippetToFolder(folderId, savedSnippet.id);
          }
        }
      }

      if (savedSnippet) {
        toast({
          title: snippet ? "Snippet Updated" : "Snippet Created",
          description: `Your snippet "${title}" has been ${snippet ? 'updated' : 'saved'}.`,
          variant: "default",
        });
      } else {
        throw new Error(`Failed to ${snippet ? 'update' : 'create'} snippet`);
      }

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your snippet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-snippet-bg text-foreground">
        <DialogHeader>
          <DialogTitle className="font-jetbrains text-lg">
            {snippet ? 'Edit Snippet' : 'Create New Snippet'}
          </DialogTitle>
          {snippet && (
            <div className="text-xs text-muted-foreground mt-1 flex gap-4">
              <span>Created: {snippet.created_at ? new Date(snippet.created_at).toLocaleString() : 'N/A'}</span>
              <span>Last Used: {snippet.updated_at ? new Date(snippet.updated_at).toLocaleString() : 'N/A'}</span>
            </div>
          )}
        </DialogHeader>
        
        <div className="grid gap-3 py-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <Label htmlFor="title" className="font-jetbrains text-sm">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-snippet-code border-snippet-border h-8"
                placeholder="Descriptive name for your snippet"
              />
            </div>
            
            <div>
              <Label htmlFor="language" className="font-jetbrains text-sm">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-snippet-code border-snippet-border h-8">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-snippet-bg border-snippet-border">
                  {programmingLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="font-jetbrains text-sm">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-snippet-code border-snippet-border resize-none h-16"
              placeholder="What does this code snippet do? When would you use it?"
            />
          </div>
          
          <div>
            <Label htmlFor="code" className="font-jetbrains text-sm">Code</Label>
            <div className="mt-1 relative">
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-snippet-code border-snippet-border resize-none h-48 font-jetbrains"
                placeholder="Paste or type your code here"
              />
              
              {/* Pattern detection visualization */}
              {detectedPatterns.length > 0 && (
                <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-md animate-fade-in">
                  <h4 className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Auto-detected patterns
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedPatterns.map((pattern, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-1 bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full">
                        {pattern.icon}
                        {pattern.pattern}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label className="font-jetbrains text-sm">Tags</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateAutoTags} 
                disabled={isGeneratingTags || !code}
                className="text-xs h-6 gap-1"
              >
                <Sparkles className="h-3 w-3" />
                {isGeneratingTags ? 'Generating...' : 'Auto-detect Tags'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-2">
              {autoTags.map((tag, idx) => (
                <TagPill key={`auto-${idx}`} name={tag.name} type="auto" />
              ))}
              {userTags.map((tag, idx) => (
                <span key={`user-${idx}`} className="flex items-center bg-snippet-code border border-snippet-border rounded px-2 py-0.5 gap-1">
                  <TagPill name={tag} type="user" />
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-destructive focus:outline-none"
                    tabIndex={0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a custom tag..."
                className="bg-snippet-code border-snippet-border h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                variant="outline" 
                onClick={handleAddTag}
                disabled={!newTag}
                className="gap-1 h-8"
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
          </div>

          {/* Add folder selection */}
          <div className="grid gap-2">
            <Label className="font-jetbrains text-sm">Folders</Label>
            <div className="grid gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-snippet-code border-snippet-border">
              {availableFolders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No folders available</p>
              ) : (
                availableFolders.map(folder => (
                  <div key={folder.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`folder-${folder.id}`}
                      checked={selectedFolders.includes(folder.id)}
                      onCheckedChange={() => handleFolderToggle(folder.id)}
                    />
                    <label
                      htmlFor={`folder-${folder.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {folder.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="h-8">Cancel</Button>
          <Button 
            onClick={handleSave} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : snippet ? 'Update' : 'Save'} Snippet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SnippetDialog;
