import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TagPill from './TagPill';
import LanguageBadge from './LanguageBadge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Folder } from '../types/Folder';
import { Tag } from '../types/Tag';

type Language = {
  name: string;
  count: number;
};

type FilterSidebarProps = {
  languages: Language[];
  tags: Tag[];
  folders: Folder[];
  onCreateSnippet: () => void;
  onFolderSelect?: (folder: Folder) => void;
  isLoading?: boolean;
};

const FilterSidebar = ({ languages, tags, folders, onCreateSnippet, onFolderSelect, isLoading }: FilterSidebarProps) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang) 
        : [...prev, lang]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const renderFolder = (folder: Folder, depth = 0) => {
    const isActive = selectedFolder === folder.id;
    
    return (
      <div key={folder.id} className="text-sm">
        <div 
          className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer hover:bg-muted ${isActive ? 'bg-primary/20 text-primary' : ''}`}
          style={{ paddingLeft: `${(depth + 1) * 0.5}rem` }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[FilterSidebar] Folder clicked:', folder.name, 'ID:', folder.id);
            console.log('[FilterSidebar] Previous selected folder:', selectedFolder);
            
            // Always call onFolderSelect when a folder is clicked, regardless of active state
            if (onFolderSelect) {
              console.log('[FilterSidebar] Calling onFolderSelect with folder:', folder);
              onFolderSelect(folder);
              
              // Update local state after calling the callback
              const newSelectedState = isActive ? null : folder.id;
              console.log('[FilterSidebar] Setting selected folder to:', newSelectedState);
              setSelectedFolder(newSelectedState);
            } else {
              console.log('[FilterSidebar] onFolderSelect callback is not defined');
            }
          }}
        >
          {/* Check if there are child folders */}
          {folders.some(f => f.parent_folder_id === folder.id) ? (
            isActive ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : <span className="w-3.5" />}
          <span>{folder.name}</span>
          {/* Show snippet count if available */}
          <span className="ml-auto text-xs text-muted-foreground">
            {folder.snippetCount !== undefined ? folder.snippetCount : 0}
          </span>
        </div>
        
        {/* Show child folders if this folder is active/expanded */}
        {isActive && (
          <div className="ml-2">
            {folders
              .filter(f => f.parent_folder_id === folder.id)
              .map(subfolder => renderFolder(subfolder, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-sidebar w-64 p-4 flex flex-col border-r border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sidebar w-64 p-4 flex flex-col border-r border-border">
      <div className="mb-6">
        <Button onClick={onCreateSnippet} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
          <Plus className="mr-2 h-4 w-4" /> New Snippet
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium py-1">
            <span>Languages</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 space-y-1">
              {languages.map(lang => (
                <div 
                  key={lang.name}
                  onClick={() => toggleLanguage(lang.name)}
                  className={`flex items-center justify-between text-sm py-1 px-2 rounded-md cursor-pointer hover:bg-sidebar-accent ${selectedLanguages.includes(lang.name) ? 'bg-primary/20 text-primary' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="scale-75 origin-left">
                      <LanguageBadge language={lang.name} />
                    </div>
                    <span>{lang.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{lang.count}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium py-1">
            <span>Popular Tags</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {tags.slice(0, 15).map(tag => (
                <div 
                  key={tag.name}
                  onClick={() => toggleTag(tag.name)}
                  className={`cursor-pointer ${selectedTags.includes(tag.name) ? 'ring-1 ring-primary' : ''}`}
                >
                  <TagPill name={tag.name} type={tag.type} />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium py-1">
            <span>Folders</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 space-y-1">
              {folders.map(folder => renderFolder(folder))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default FilterSidebar;
