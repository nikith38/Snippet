import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SnippetLibrary from '../components/SnippetLibrary';
import Header from '../components/Header';
import FilterSidebar from '../components/FilterSidebar';
import EmptyState from '../components/EmptyState';
import SnippetDialog from '../components/SnippetDialog';
import FolderView from '../components/FolderView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Bookmark, User, Settings, PanelLeftClose, PanelLeftOpen, FolderPlus, Folder as FolderIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSnippets } from '../services/snippetService';
import { getTags, getLanguageCounts } from '../services/tagService';
import { getFolders, createFolder } from '../services/folderService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Folder } from '@/types/Folder';
import type { Snippet } from '@/types/Snippet';

const Dashboard = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile(user);
      } else {
        // Redirect to login if no user found
        navigate('/auth');
      }
    };
    
    fetchUserProfile();
  }, [navigate]);
  
  // Listen for tab change events from header
  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    window.addEventListener('setActiveTab', handleSetActiveTab as EventListener);
    
    return () => {
      window.removeEventListener('setActiveTab', handleSetActiveTab as EventListener);
    };
  }, []);
  
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
  
  const handleCreateSnippet = () => {
    setSelectedSnippet(undefined);
    setCreateDialogOpen(true);
  };
  
  const handleCreateFolder = () => {
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
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Filter snippets based on active tab
  useEffect(() => {
    let filtered = [...snippets];
    
    // No special filtering for tabs since Recent and Favorites have been removed
    setFilteredSnippets(filtered);
  }, [snippets, activeTab]);

  const isLoading = snippetsLoading || languagesLoading || tagsLoading || foldersLoading;

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
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
      
      <div className="flex relative">
        {/* Fixed sidebar */}
        <div className={`fixed top-14 bottom-0 left-0 z-10 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}>
          {!sidebarCollapsed && (
            <div className="h-full overflow-y-auto pt-4 border-t border-border">
              <FilterSidebar
                languages={languages.map(lang => ({ name: String(lang.name), count: lang.count }))}
                tags={tags}
                folders={folders}
                onCreateSnippet={handleCreateSnippet}
                onFolderSelect={(folder) => {
                  console.log('[Dashboard] Folder selected from sidebar:', folder);
                  console.log('[Dashboard] Current active tab:', activeTab);
                  console.log('[Dashboard] Setting active tab to: folders');
                  
                  // When a folder is selected in the sidebar, switch to folders tab and set the selected folder
                  setActiveTab('folders');
                  
                  console.log('[Dashboard] Setting selectedFolderId to:', folder.id);
                  setSelectedFolderId(folder.id);
                }}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        
        {/* Main content with margin to accommodate sidebar */}
        <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-64'} transition-all duration-300 ease-in-out`}>
          <div className="relative">
            <div className="p-6 pl-16">
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-jetbrains">My Snippets</h1>
                  <p className="text-muted-foreground">Organize and access your code snippets</p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 md:w-auto">
                    <TabsTrigger value="all" className="flex items-center gap-1">
                      <Bookmark className="h-4 w-4" />
                      <span className="hidden md:inline">All</span>
                    </TabsTrigger>
                    <TabsTrigger value="folders" className="flex items-center gap-1">
                      <FolderIcon className="h-4 w-4" />
                      <span className="hidden md:inline">Folders</span>
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">Profile</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {activeTab === 'folders' ? (
                <div className="animate-fade-in py-4">
                  <FolderView 
                    folders={folders} 
                    onCreateFolder={handleCreateFolder}
                    onCreateSnippet={handleCreateSnippet}
                    onEditSnippet={handleEditSnippet}
                    selectedFolder={selectedFolderId}
                    onFolderSelect={(folder) => {
                      // Update the selected folder ID when a folder is clicked in the folder view
                      setSelectedFolderId(folder.id);
                      toast({
                        title: "Folder Selected",
                        description: `Selected folder: ${folder.name}`,
                      });
                    }}
                  />
                </div>
              ) : activeTab === 'profile' ? (
                <div className="bg-snippet-bg border border-snippet-border rounded-lg p-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-2">
                        <h2 className="text-2xl font-bold font-jetbrains">
                          {userProfile?.email?.split('@')[0] || 'User'}
                        </h2>
                        <p className="text-muted-foreground">{userProfile?.email}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-snippet-code p-3 rounded-md">
                          <div className="text-2xl font-bold">{snippets.length}</div>
                          <div className="text-sm text-muted-foreground">Total Snippets</div>
                        </div>
                        <div className="bg-snippet-code p-3 rounded-md">
                          <div className="text-2xl font-bold">{languages.length}</div>
                          <div className="text-sm text-muted-foreground">Languages</div>
                        </div>
                        <div className="bg-snippet-code p-3 rounded-md">
                          <div className="text-2xl font-bold">{tags.length}</div>
                          <div className="text-sm text-muted-foreground">Tags</div>
                        </div>
                        <div className="bg-snippet-code p-3 rounded-md">
                          <div className="text-2xl font-bold">{folders.length}</div>
                          <div className="text-sm text-muted-foreground">Folders</div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Settings</h3>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Account Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-pulse text-primary">Loading snippets...</div>
                </div>
              ) : filteredSnippets.length > 0 ? (
                <SnippetLibrary 
                  snippets={filteredSnippets}
                  onEditSnippet={handleEditSnippet}
                  sidebarCollapsed={sidebarCollapsed}
                />
              ) : (
                <EmptyState onCreateSnippet={handleCreateSnippet} />
              )}
              
              {/* Floating action button */}
              <Button
                className="fixed right-6 bottom-6 shadow-lg rounded-full h-14 w-14 p-0"
                onClick={handleCreateSnippet}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
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

export default Dashboard;
