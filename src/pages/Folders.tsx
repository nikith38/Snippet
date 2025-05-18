import React, { useState } from 'react';
import Header from '../components/Header';
import FolderView from '../components/FolderView';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFolders, getFolderById, createFolder } from '../services/folderService';
import type { Folder, FolderWithSnippets } from '../types/Folder';
import type { Snippet } from '../types/Snippet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderPlus, FolderOpen, ChevronRight, ChevronDown, Plus, ChevronLeft } from 'lucide-react';
import SnippetLibrary from '../components/SnippetLibrary';
import SnippetDialog from '../components/SnippetDialog';

const Folders = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | undefined>(undefined);
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(undefined);
  
  const queryClient = useQueryClient();
  
  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  // Fetch selected folder details
  const { data: folderDetails, isLoading: folderDetailsLoading } = useQuery<FolderWithSnippets | null>({
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
  
  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };
  
  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setCreateDialogOpen(true);
  };
  
  const handleSubmitFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createFolder(newFolderName);
      
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setCreateFolderDialogOpen(false);
      setNewFolderName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };
  
  const isLoading = foldersLoading || folderDetailsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCreateSnippet={handleCreateSnippet}
        onCreateFolder={handleCreateFolder}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-jetbrains">Folders</h1>
              <p className="text-muted-foreground">Organize your snippets into folders for better management</p>
            </div>
            <Button onClick={handleCreateFolder}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Folder List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Folders</CardTitle>
                <CardDescription>Select a folder to view its contents</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {folders.length > 0 ? (
                    <div className="space-y-2">
                      {folders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            selectedFolder?.id === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                          }`}
                          onClick={() => handleFolderSelect(folder)}
                        >
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            <span>{folder.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {folder.snippetCount || 0} snippets
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FolderPlus className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No folders yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create folders to organize your snippets
                      </p>
                      <Button onClick={handleCreateFolder} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Folder
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Folder Contents */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedFolder ? selectedFolder.name : 'Select a Folder'}
                </CardTitle>
                <CardDescription>
                  {selectedFolder ? `Snippets in ${selectedFolder.name}` : 'Choose a folder to view its snippets'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedFolder ? (
                  folderDetails?.snippets && folderDetails.snippets.length > 0 ? (
                    <SnippetLibrary 
                      snippets={folderDetails.snippets} 
                      onEditSnippet={handleEditSnippet}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="text-muted-foreground mb-4">
                        No snippets in this folder
                      </div>
                      <Button onClick={handleCreateSnippet} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Snippet
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ChevronLeft className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a folder</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a folder from the left to view its contents
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Create Folder Dialog */}
      <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Snippet Dialog */}
      <SnippetDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        snippet={selectedSnippet}
      />
    </div>
  );
};

export default Folders; 