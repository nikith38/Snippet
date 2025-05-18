import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Folder, FolderWithSnippets } from '@/types/Folder';
import { Snippet } from '@/types/Snippet';
import { getFolderById, updateFolder, deleteFolder, removeSnippetFromFolder } from '@/services/folderService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { FolderEdit, FolderMinus, ArrowLeft, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import SnippetCard from './SnippetCard';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';

interface FolderContentsViewProps {
  folderId: string;
  allFolders: Folder[];
  onBack: () => void;
  onEditSnippet?: (snippet: Snippet) => void;
  onCreateSnippet?: () => void;
}

const FolderContentsView = ({ 
  folderId, 
  allFolders, 
  onBack, 
  onEditSnippet,
  onCreateSnippet
}: FolderContentsViewProps) => {
  const [folder, setFolder] = useState<FolderWithSnippets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [breadcrumbPath, setBreadcrumbPath] = useState<Folder[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();

  // Load folder data
  useEffect(() => {
    const loadFolder = async () => {
      setIsLoading(true);
      try {
        const folderData = await getFolderById(folderId);
        if (folderData) {
          setFolder(folderData);
          setNewFolderName(folderData.name);
          
          // Build breadcrumb path
          const path: Folder[] = [];
          let currentFolderId = folderData.parent_folder_id;
          
          while (currentFolderId) {
            const parentFolder = allFolders.find(f => f.id === currentFolderId);
            if (parentFolder) {
              path.unshift(parentFolder);
              currentFolderId = parentFolder.parent_folder_id;
            } else {
              break;
            }
          }
          
          setBreadcrumbPath(path);
        }
      } catch (error) {
        console.error('Error loading folder:', error);
        toast({
          title: 'Error',
          description: 'Failed to load folder contents',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFolder();
  }, [folderId, allFolders]);

  const handleRenameFolder = async () => {
    if (!folder || !newFolderName.trim()) return;

    try {
      const updatedFolder = await updateFolder(folder.id, { name: newFolderName });
      if (updatedFolder) {
        toast({
          title: 'Folder Renamed',
          description: `Folder has been renamed to "${newFolderName}"`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setFolder({ ...folder, name: newFolderName });
        setIsRenameDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename folder',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFolder = async () => {
    if (!folder) return;

    try {
      const success = await deleteFolder(folder.id);
      if (success) {
        toast({
          title: 'Folder Deleted',
          description: `Folder "${folder.name}" has been deleted`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        onBack();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete folder',
        variant: 'destructive',
      });
    }
  };

  const handleSnippetClick = (id: string) => {
    if (!folder || isEditMode) return; // Don't open snippet if in edit mode
    
    const snippet = folder.snippets.find(s => s.id === id);
    if (snippet && onEditSnippet) {
      onEditSnippet(snippet);
    }
  };
  
  const handleRemoveSnippet = async (snippetId: string, event: React.MouseEvent) => {
    // Prevent event from bubbling up to the card
    event.stopPropagation();
    event.preventDefault();
    
    if (!folder) return;
    
    try {
      console.log('Removing snippet', snippetId, 'from folder', folder.id);
      const success = await removeSnippetFromFolder(folder.id, snippetId);
      
      if (success) {
        toast({
          title: 'Snippet Removed',
          description: 'Snippet has been removed from this folder',
        });
        
        // Update local state to remove the snippet
        const updatedSnippets = folder.snippets.filter(s => s.id !== snippetId);
        setFolder({
          ...folder,
          snippets: updatedSnippets
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['folder', folder.id] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      } else {
        throw new Error('Failed to remove snippet from folder');
      }
    } catch (error) {
      console.error('Error removing snippet from folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove snippet from folder',
        variant: 'destructive',
      });
    }
  };

  // Navigate to a folder in the breadcrumb
  const navigateToFolder = (folder: Folder) => {
    queryClient.invalidateQueries({ queryKey: ['folders', folder.id] });
    // Update the current folder ID to show the selected folder
    setIsLoading(true);
    setFolder(null);
    // Use the existing folderId prop to load the new folder
    const loadNewFolder = async () => {
      try {
        const folderData = await getFolderById(folder.id);
        if (folderData) {
          setFolder(folderData);
          setNewFolderName(folderData.name);
          
          // Build breadcrumb path
          const path: Folder[] = [];
          let currentFolderId = folderData.parent_folder_id;
          
          while (currentFolderId) {
            const parentFolder = allFolders.find(f => f.id === currentFolderId);
            if (parentFolder) {
              path.unshift(parentFolder);
              currentFolderId = parentFolder.parent_folder_id;
            } else {
              break;
            }
          }
          
          setBreadcrumbPath(path);
        }
      } catch (error) {
        console.error('Error loading folder:', error);
        toast({
          title: 'Error',
          description: 'Failed to load folder contents',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNewFolder();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading folder contents...</div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Folder not found</h3>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to folders
        </Button>
      </div>
    );
  }

  const subfolders = allFolders.filter(f => f.parent_folder_id === folder.id);

  return (
    <div className="space-y-6">
      {/* Folder header with actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack}>Folders</BreadcrumbLink>
              </BreadcrumbItem>
              
              {breadcrumbPath.map((pathFolder) => (
                <BreadcrumbItem key={pathFolder.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbLink onClick={() => navigateToFolder(pathFolder)}>
                    {pathFolder.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
              
              <BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbLink className="font-semibold">
                  {folder?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsRenameDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            Rename
          </Button>
          {isEditMode ? (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsEditMode(false)}
              className="flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              Done
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-1"
            >
              <FolderEdit className="h-3.5 w-3.5" />
              Edit Folder
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Subfolders section */}
      {subfolders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subfolders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subfolders.map(subfolder => (
                <Card 
                  key={subfolder.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigateToFolder(subfolder)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{subfolder.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Snippets section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Snippets</h3>
          {onCreateSnippet && (
            <Button onClick={onCreateSnippet} variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Snippet
            </Button>
          )}
        </div>

        {folder?.snippets && folder.snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folder?.snippets?.map(snippet => (
              <div key={snippet.id} className="relative group">
                <SnippetCard
                  snippet={snippet}
                  onClick={handleSnippetClick}
                  onEditSnippet={isEditMode ? undefined : onEditSnippet}
                />
                {isEditMode && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 z-20 shadow-md hover:shadow-lg transition-all duration-200 rounded-full h-7 w-7 -mt-3 -mr-3"
                    onClick={(e) => handleRemoveSnippet(snippet.id, e)}
                    title="Remove from folder"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">No snippets in this folder yet</p>
            {onCreateSnippet && (
              <Button onClick={onCreateSnippet} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add your first snippet
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Folder Name</Label>
              <Input
                id="edit-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{folder?.name}"? This action cannot be undone.</p>
            {subfolders.length > 0 && (
              <p className="text-destructive mt-2">
                Warning: This folder contains {subfolders.length} subfolder(s) which will also be deleted.
              </p>
            )}
            {folder?.snippets && folder.snippets.length > 0 && (
              <p className="text-destructive mt-2">
                Warning: This folder contains {folder.snippets.length} snippet(s). The snippets will not be deleted, but they will be removed from this folder.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFolder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderContentsView;
