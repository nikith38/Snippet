import React, { useState } from 'react';
import Header from '../components/Header';
import FilterSidebar from '../components/FilterSidebar';
import SnippetLibrary from '../components/SnippetLibrary';
import EmptyState from '../components/EmptyState';
import SnippetDialog from '../components/SnippetDialog';
import FolderManager from '../components/FolderManager';
import FolderContentsView from '../components/FolderContentsView';
import { useQuery } from '@tanstack/react-query';
import { getSnippets } from '../services/snippetService';
import { getTags, getLanguageCounts } from '../services/tagService';
import { getFolders, getFolderById } from '../services/folderService';
import type { Folder, FolderWithSnippets } from '../types/Folder';
import type { Snippet } from '../types/Snippet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { createFolder } from '@/services/folderService';
import { useQueryClient } from '@tanstack/react-query';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

const Index = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | undefined>(undefined);
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch snippets
  const { data: snippets = [], isLoading: snippetsLoading } = useQuery({
    queryKey: ['snippets'],
    queryFn: getSnippets,
  });

  // Fetch languages
  const { data: languages = [], isLoading: languagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguageCounts,
  });

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  // Fetch selected folder details
  const { data: folderDetails } = useQuery<FolderWithSnippets | null>({
    queryKey: ['folder', selectedFolder?.id],
    queryFn: () => selectedFolder ? getFolderById(selectedFolder.id) : Promise.resolve(null),
    enabled: !!selectedFolder,
  });
  
  const handleCreateSnippet = () => {
    setSelectedSnippet(undefined);
    setCreateDialogOpen(true);
  };
  
  const handleCreateFolder = () => {
    setNewFolderName('');
    setCreateFolderDialogOpen(true);
  };

  const handleSaveFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const folder = await createFolder(newFolderName);
      if (folder) {
        toast({
          title: "Folder Created",
          description: `Folder "${newFolderName}" has been created.`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setCreateFolderDialogOpen(false);
        setNewFolderName('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setCreateDialogOpen(true);
  };

  const handleFolderSelect = async (folder: Folder) => {
    console.log('Folder selected:', folder);
    setSelectedFolder(folder);
  };
  
  const handleBackFromFolder = () => {
    console.log('Going back from folder view');
    setSelectedFolder(undefined);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const isLoading = snippetsLoading || languagesLoading || tagsLoading || foldersLoading;

  // Filter snippets based on selected folder
  const filteredSnippets = selectedFolder && folderDetails
    ? folderDetails.snippets
    : snippets;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCreateSnippet={handleCreateSnippet}
        onCreateFolder={handleCreateFolder}
      />
      
      {/* Sidebar toggle button - positioned at the top left */}
      <div className="fixed top-[3.75rem] left-4 z-30">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? 
            <PanelLeftOpen className="h-5 w-5" /> : 
            <PanelLeftClose className="h-5 w-5" />
          }
        </Button>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex gap-6 relative">
          {/* Sidebar - Fixed position */}
          <div className={`w-64 flex-shrink-0 transition-all duration-200 ${sidebarCollapsed ? 'w-16' : ''} fixed top-14 bottom-0 left-0 pl-4 z-10`}>
            <div className="h-[calc(100vh-7rem)] overflow-y-auto pt-4 border-t border-border">
              <FolderManager
                folders={folders}
                currentFolder={selectedFolder}
                onFolderSelect={handleFolderSelect}
              />
              <div className="mt-6">
                <FilterSidebar
                  languages={languages}
                  tags={tags}
                  folders={folders}
                  onCreateSnippet={handleCreateSnippet}
                  onFolderSelect={handleFolderSelect}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Main Content - Add left margin to account for fixed sidebar */}
          <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-200 pl-10`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : selectedFolder ? (
              // Show folder contents when a folder is selected
              <FolderContentsView
                folderId={selectedFolder.id}
                allFolders={folders}
                onBack={handleBackFromFolder}
                onEditSnippet={handleEditSnippet}
                onCreateSnippet={handleCreateSnippet}
              />
            ) : filteredSnippets.length === 0 ? (
              <EmptyState onCreateSnippet={handleCreateSnippet} />
            ) : (
              <SnippetLibrary
                snippets={filteredSnippets}
                onEditSnippet={handleEditSnippet}
                sidebarCollapsed={sidebarCollapsed}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Snippet Dialog */}
      <SnippetDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        snippet={selectedSnippet}
      />

      {/* Create Folder Dialog */}
      <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
