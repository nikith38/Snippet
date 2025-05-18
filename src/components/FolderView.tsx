import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Folder } from '@/types/Folder';
import { Snippet } from '@/types/Snippet';
import { createFolder, updateFolder, deleteFolder } from '@/services/folderService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { FolderPlus, FolderEdit, FolderMinus, ChevronRight, ChevronDown, Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import FolderContentsView from './FolderContentsView';

interface FolderViewProps {
  folders: Folder[];
  selectedFolder?: string | null;
  onFolderSelect?: (folder: Folder) => void;
  onSnippetSelect?: (snippet: Snippet) => void;
  onCreateFolder?: () => void;
  onCreateSnippet?: () => void;
  onEditSnippet?: (snippet: Snippet) => void;
}

const FolderView = ({ folders, selectedFolder, onFolderSelect, onSnippetSelect, onCreateFolder, onCreateSnippet, onEditSnippet }: FolderViewProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedParentFolder, setSelectedParentFolder] = useState<Folder | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [internalSelectedFolder, setInternalSelectedFolder] = useState<string | null>(null);
  
  // Use the prop value if provided, otherwise use internal state
  const effectiveSelectedFolder = selectedFolder !== undefined ? selectedFolder : internalSelectedFolder;
  
  console.log('[FolderView] Props selectedFolder:', selectedFolder);
  console.log('[FolderView] Internal selectedFolder:', internalSelectedFolder);
  console.log('[FolderView] Effective selectedFolder:', effectiveSelectedFolder);

  const queryClient = useQueryClient();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const folder = await createFolder(
        newFolderName, 
        selectedParentFolder ? selectedParentFolder.id : undefined
      );
      
      if (folder) {
        toast({
          title: "Folder Created",
          description: `Folder "${newFolderName}" has been created.`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setIsCreateDialogOpen(false);
        setNewFolderName('');
        setSelectedParentFolder(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) return;

    try {
      const folder = await updateFolder(editingFolder.id, { 
        name: newFolderName,
        parent_folder_id: selectedParentFolder?.id || null
      });
      
      if (folder) {
        toast({
          title: "Folder Updated",
          description: `Folder has been renamed to "${newFolderName}".`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setIsEditDialogOpen(false);
        setEditingFolder(null);
        setNewFolderName('');
        setSelectedParentFolder(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async () => {
    if (!deletingFolder) return;

    try {
      const success = await deleteFolder(deletingFolder.id);
      if (success) {
        toast({
          title: "Folder Deleted",
          description: `Folder "${deletingFolder.name}" has been deleted.`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setIsDeleteDialogOpen(false);
        setDeletingFolder(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const subfolders = folders.filter(f => f.parent_folder_id === folder.id);
    const hasSubfolders = subfolders.length > 0;

    return (
      <div key={folder.id} className="folder-item">
        <div 
          className={`flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted cursor-pointer ${level > 0 ? 'ml-4' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            // Set the selected folder to view its contents
            setInternalSelectedFolder(folder.id);
            if (onFolderSelect) onFolderSelect(folder);
          }}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasSubfolders ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolderExpansion(folder.id);
                }}
                className="p-1 hover:bg-muted rounded-sm"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium truncate">{folder.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingFolder(folder);
                setSelectedParentFolder(folders.find(f => f.id === folder.parent_folder_id) || null);
                setNewFolderName(folder.name);
                setIsEditDialogOpen(true);
              }}
              className="p-1 hover:bg-muted rounded-sm"
            >
              <FolderEdit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeletingFolder(folder);
                setIsDeleteDialogOpen(true);
              }}
              className="p-1 hover:bg-muted rounded-sm text-destructive"
            >
              <FolderMinus className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isExpanded && subfolders.map(subfolder => renderFolder(subfolder, level + 1))}
      </div>
    );
  };

  const rootFolders = folders.filter(folder => !folder.parent_folder_id);

  // If a folder is selected, show its contents
  console.log('[FolderView] Checking if folder is selected:', effectiveSelectedFolder ? 'YES' : 'NO');
  if (effectiveSelectedFolder) {
    console.log('[FolderView] Rendering folder contents for ID:', effectiveSelectedFolder);
    return (
      <div className="w-full">
        <FolderContentsView
          folderId={effectiveSelectedFolder}
          allFolders={folders}
          onBack={() => {
            setInternalSelectedFolder(null);
            // If using the prop, inform the parent component
            if (selectedFolder !== undefined && onFolderSelect) {
              // We don't have the folder object here, so we'll need to find it
              const folder = folders.find(f => f.id === effectiveSelectedFolder);
              if (folder) {
                onFolderSelect(folder);
              }
            }
          }}
          onEditSnippet={onEditSnippet}
          onCreateSnippet={onCreateSnippet}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Folder Management</CardTitle>
              <CardDescription>Organize your snippets in folders</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateFolder ? onCreateFolder() : setIsCreateDialogOpen(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-1">
              {rootFolders.length > 0 ? (
                rootFolders.map(folder => renderFolder(folder))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No folders yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => onCreateFolder ? onCreateFolder() : setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first folder
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            {folders.length} {folders.length === 1 ? 'folder' : 'folders'} total
          </div>
        </CardFooter>
      </Card>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
              <select
                id="parent-folder"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedParentFolder?.id || ""}
                onChange={(e) => {
                  const folderId = e.target.value;
                  setSelectedParentFolder(folderId ? folders.find(f => f.id === folderId) || null : null);
                }}
              >
                <option value="">None (Root level)</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
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
            <div className="grid gap-2">
              <Label htmlFor="edit-parent-folder">Parent Folder (Optional)</Label>
              <select
                id="edit-parent-folder"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedParentFolder?.id || ""}
                onChange={(e) => {
                  const folderId = e.target.value;
                  // Prevent circular references
                  if (editingFolder && folderId === editingFolder.id) {
                    toast({
                      title: "Invalid Selection",
                      description: "A folder cannot be its own parent.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setSelectedParentFolder(folderId ? folders.find(f => f.id === folderId) || null : null);
                }}
              >
                <option value="">None (Root level)</option>
                {folders
                  .filter(folder => folder.id !== editingFolder?.id) // Exclude the current folder
                  .map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFolder}>
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
            <p>Are you sure you want to delete "{deletingFolder?.name}"? This action cannot be undone.</p>
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

export default FolderView;
