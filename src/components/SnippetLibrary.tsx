import React, { useState, useEffect } from 'react';
import SnippetCard from './SnippetCard';
import { Snippet } from '../types/Snippet';
import SnippetDialog from './SnippetDialog';
import { Button } from './ui/button';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import TagPill from './TagPill';
import LanguageBadge from './LanguageBadge';
import { Badge } from './ui/badge';
import { getSnippets } from '../services/snippetService';
import { getTags } from '../services/tagService';
import { useQuery } from '@tanstack/react-query';

type SnippetLibraryProps = {
  snippets?: Snippet[];
  onEditSnippet?: (snippet: Snippet) => void;
  sidebarCollapsed?: boolean;
};

type ViewMode = 'grid' | 'list' | 'table';
type SortOption = 'recent' | 'usage' | 'alphabetical' | 'language';

const SnippetLibrary = ({ snippets: propSnippets, onEditSnippet, sidebarCollapsed = false }: SnippetLibraryProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | undefined>(undefined);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch snippets
  const { data: fetchedSnippets = [], isLoading: snippetsLoading } = useQuery({
    queryKey: ['snippets'],
    queryFn: getSnippets,
  });

  // Fetch tags
  const { data: fetchedTags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  // Use prop snippets if provided, otherwise use fetched snippets
  const snippetsData = propSnippets || fetchedSnippets;

  // Extract unique languages from snippets
  const availableLanguages = [...new Set(snippetsData.map(s => s.language))];
  
  // Extract unique tags from snippets
  const availableTags = fetchedTags.map(tag => tag.name);
  
  const handleSnippetClick = (id: string) => {
    const snippet = snippetsData.find(s => s.id === id);
    if (snippet) {
      if (onEditSnippet) {
        onEditSnippet(snippet);
      } else {
        setSelectedSnippet(snippet);
        setDialogOpen(true);
      }
    }
  };

  const toggleLanguageFilter = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language) 
        : [...prev, language]
    );
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguages([]);
    setSelectedTags([]);
  };

  // Apply filters and sorting whenever the filter criteria change
  useEffect(() => {
    let result = [...snippetsData];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(snippet => 
        snippet.title.toLowerCase().includes(query) || 
        (snippet.description?.toLowerCase().includes(query)) ||
        snippet.code.toLowerCase().includes(query)
      );
    }
    
    // Apply language filters
    if (selectedLanguages.length > 0) {
      result = result.filter(snippet => 
        selectedLanguages.includes(snippet.language.toLowerCase())
      );
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter(snippet => 
        selectedTags.some(tag => 
          snippet.tags.some(t => t.name.toLowerCase() === tag.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    result = sortSnippets(result, sortOption);
    
    setFilteredSnippets(result);
  }, [snippetsData, searchQuery, selectedLanguages, selectedTags, sortOption]);

  const sortSnippets = (snippetsToSort: Snippet[], option: SortOption): Snippet[] => {
    const sorted = [...snippetsToSort];
    
    switch(option) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'usage':
        return sorted.sort((a, b) => b.usage_count - a.usage_count);
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'language':
        return sorted.sort((a, b) => a.language.localeCompare(b.language));
      default:
        return sorted;
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Determine grid columns based on sidebarCollapsed
  const gridCols = viewMode === 'grid'
    ? sidebarCollapsed
      ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'
    : viewMode === 'list'
      ? 'flex flex-col gap-3'
      : viewMode === 'table'
        ? 'overflow-x-auto'
        : '';

  if (snippetsLoading || tagsLoading) {
    return (
      <div className="p-6 w-full flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col gap-4 mb-6">
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-snippet-bg border-snippet-border"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className={showFilters ? 'bg-accent text-accent-foreground' : ''} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
          
          <div className="hidden sm:flex items-center gap-2">
            <Button 
              variant={sortOption === 'recent' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => handleSortChange('recent')}
              className="text-xs"
            >
              Recent
            </Button>
            <Button 
              variant={sortOption === 'usage' ? 'default' : 'ghost'}
              size="sm" 
              onClick={() => handleSortChange('usage')}
              className="text-xs"
            >
              Most Used
            </Button>
            <Button 
              variant={sortOption === 'alphabetical' ? 'default' : 'ghost'}
              size="sm" 
              onClick={() => handleSortChange('alphabetical')}
              className="text-xs"
            >
              A-Z
            </Button>
            <Button 
              variant={sortOption === 'language' ? 'default' : 'ghost'}
              size="sm" 
              onClick={() => handleSortChange('language')}
              className="text-xs"
            >
              Language
            </Button>
          </div>
        </div>
        
        {/* Advanced filters section */}
        {showFilters && (
          <div className="p-4 bg-snippet-bg border border-snippet-border rounded-md animate-fade-in">
            <div className="space-y-4">
              {/* Language filters */}
              <div>
                <h3 className="text-sm font-medium mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => toggleLanguageFilter(language.toLowerCase())}
                      className={`flex items-center gap-1 p-1 rounded-md ${
                        selectedLanguages.includes(language.toLowerCase()) 
                          ? 'bg-primary/20' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <LanguageBadge language={language} />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tag filters */}
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {fetchedTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTagFilter(tag.name)}
                      className={selectedTags.includes(tag.name) ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                    >
                      <TagPill 
                        name={tag.name} 
                        type={tag.type} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Active filters */}
              {(selectedLanguages.length > 0 || selectedTags.length > 0 || searchQuery) && (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Active Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchQuery && (
                      <Badge variant="outline" className="bg-muted">
                        Search: {searchQuery}
                        <button className="ml-2" onClick={() => setSearchQuery('')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {selectedLanguages.map(lang => (
                      <Badge key={lang} variant="outline" className="bg-muted">
                        Language: {lang}
                        <button className="ml-2" onClick={() => toggleLanguageFilter(lang)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-muted">
                        Tag: {tag}
                        <button className="ml-2" onClick={() => toggleTagFilter(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* View mode toggles */}
              <div>
                <h3 className="text-sm font-medium mb-2">View</h3>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleViewModeChange('grid')}
                  >
                    Grid
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleViewModeChange('list')}
                  >
                    List
                  </Button>
                  <Button 
                    variant={viewMode === 'table' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleViewModeChange('table')}
                  >
                    Table
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter results summary */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-jetbrains">
          {filteredSnippets.length} {filteredSnippets.length === 1 ? 'Snippet' : 'Snippets'}
          {(selectedLanguages.length > 0 || selectedTags.length > 0 || searchQuery) && ' Found'}
        </h2>
      </div>
      
      {/* Snippet grid */}
      <div className={gridCols}>
        {viewMode === 'table' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-snippet-border">
                <th className="text-left p-3 font-jetbrains">Title</th>
                <th className="text-left p-3 font-jetbrains">Language</th>
                <th className="text-left p-3 font-jetbrains">Tags</th>
                <th className="text-left p-3 font-jetbrains">Usage</th>
                <th className="text-left p-3 font-jetbrains">Created</th>
                <th className="text-left p-3 font-jetbrains">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSnippets.map(snippet => (
                <tr 
                  key={snippet.id} 
                  className="border-b border-snippet-border hover:bg-snippet-code/30 cursor-pointer transition-colors"
                  onClick={() => handleSnippetClick(snippet.id)}
                >
                  <td className="p-3 font-medium">{snippet.title}</td>
                  <td className="p-3"><LanguageBadge language={snippet.language} /></td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {snippet.tags.slice(0, 2).map((tag, idx) => (
                        <TagPill key={idx} name={tag.name} type={tag.type} />
                      ))}
                      {snippet.tags.length > 2 && (
                        <span className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground">
                          +{snippet.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{snippet.usage_count} uses</td>
                  <td className="p-3">{new Date(snippet.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(snippet.code);
                      }}
                    >
                      Copy
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          filteredSnippets.map(snippet => (
            <SnippetCard 
              key={snippet.id} 
              snippet={snippet} 
              onClick={handleSnippetClick}
              viewMode={viewMode}
              onEditSnippet={onEditSnippet}
            />
          ))
        )}
      </div>
      
      {/* Empty state */}
      {filteredSnippets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-jetbrains mb-2">No Snippets Found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
      
      <SnippetDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={selectedSnippet}
      />
    </div>
  );
};

export default SnippetLibrary;
