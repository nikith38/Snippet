import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Folder, FolderWithSnippets } from '@/types/Folder';
import { Snippet } from '@/types/Snippet';
import { createFolder, updateFolder, deleteFolder, addSnippetToFolder, removeSnippetFromFolder } from '@/services/folderService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { FolderPlus, FolderEdit, FolderMinus, ChevronRight, ChevronDown } from 'lucide-react';

interface FolderManagerProps {
  folders: Folder[];
  currentFolder?: Folder;
  onFolderSelect: (folder: Folder) => void;
  onSnippetSelect?: (snippet: Snippet) => void;
}

const FolderManager = ({ folders, currentFolder, onFolderSelect, onSnippetSelect }: FolderManagerProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const folder = await createFolder(newFolderName);
      if (folder) {
        toast({
          title: "Folder Created",
          description: `Folder "${newFolderName}" has been created.`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setIsCreateDialogOpen(false);
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

  const handleUpdateFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) return;

    try {
      const folder = await updateFolder(editingFolder.id, { name: newFolderName });
      if (folder) {
        toast({
          title: "Folder Updated",
          description: `Folder has been renamed to "${newFolderName}".`,
        });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        setIsEditDialogOpen(false);
        setEditingFolder(null);
        setNewFolderName('');
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

    return (
      <div key={folder.id} className="w-full">
        <div 
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
            ${currentFolder?.id === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
          `}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          {subfolders.length > 0 && (
            <button
              onClick={() => toggleFolderExpansion(folder.id)}
              className="p-1 hover:bg-muted rounded-sm"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          <div 
            className="flex-1 flex items-center gap-2"
            onClick={() => onFolderSelect(folder)}
          >
            <FolderPlus className="h-4 w-4" />
            <span className="truncate">{folder.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => {
                setEditingFolder(folder);
                setNewFolderName(folder.name);
                setIsEditDialogOpen(true);
              }}
              className="p-1 hover:bg-muted rounded-sm"
            >
              <FolderEdit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      <div className="space-y-1">
        {folders
          .filter(folder => !folder.parent_folder_id)
          .map(folder => renderFolder(folder))}
      </div>

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
              />
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
              />
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

export default FolderManager; 