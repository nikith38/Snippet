import { supabase } from '@/integrations/supabase/client';
import { Folder, FolderWithSnippets } from '@/types/Folder';
import { Snippet } from '@/types/Snippet';

export async function getFolders(): Promise<Folder[]> {
  const { data: folders, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
  
  // Get snippet counts for each folder
  const foldersWithCounts = await Promise.all(folders.map(async (folder) => {
    const count = await getFolderSnippetCount(folder.id);
    return {
      ...folder,
      snippetCount: count
    };
  }));

  return foldersWithCounts;
}

export async function getFolderById(id: string): Promise<FolderWithSnippets | null> {
  const { data: folder, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching folder:', error);
    return null;
  }

  // Fetch snippets in this folder with their tags
  const { data: folderSnippets, error: snippetsError } = await supabase
    .from('folder_snippets')
    .select('snippets(*)')
    .eq('folder_id', id);

  if (snippetsError) {
    console.error('Error fetching folder snippets:', snippetsError);
    return {
      ...folder,
      snippets: []
    };
  }

  // Extract snippets and ensure they have a tags property
  const snippets = folderSnippets.map(item => {
    const snippet = item.snippets as Snippet;
    // Ensure each snippet has a tags property, even if empty
    return {
      ...snippet,
      tags: snippet.tags || []
    };
  });

  console.log('Folder snippets loaded:', snippets);

  return {
    ...folder,
    snippets
  };
}

export async function createFolder(name: string, parentFolderId?: string): Promise<Folder | null> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return null;
  }

  const { data: folder, error } = await supabase
    .from('folders')
    .insert({
      name,
      user_id: userId,
      parent_folder_id: parentFolderId || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating folder:', error);
    return null;
  }

  return folder;
}

export async function updateFolder(id: string, updates: Partial<Folder>): Promise<Folder | null> {
  const { data: folder, error } = await supabase
    .from('folders')
    .update({
      name: updates.name,
      parent_folder_id: updates.parent_folder_id
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating folder:', error);
    return null;
  }

  return folder;
}

export async function deleteFolder(id: string): Promise<boolean> {
  // First delete all folder-snippet associations
  const { error: snippetsError } = await supabase
    .from('folder_snippets')
    .delete()
    .eq('folder_id', id);

  if (snippetsError) {
    console.error('Error deleting folder snippets:', snippetsError);
    return false;
  }

  // Then delete the folder itself
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting folder:', error);
    return false;
  }

  return true;
}

export async function addSnippetToFolder(folderId: string, snippetId: string): Promise<boolean> {
  const { error } = await supabase
    .from('folder_snippets')
    .insert({
      folder_id: folderId,
      snippet_id: snippetId
    });

  if (error) {
    console.error('Error adding snippet to folder:', error);
    return false;
  }

  return true;
}

export async function removeSnippetFromFolder(folderId: string, snippetId: string): Promise<boolean> {
  const { error } = await supabase
    .from('folder_snippets')
    .delete()
    .eq('folder_id', folderId)
    .eq('snippet_id', snippetId);

  if (error) {
    console.error('Error removing snippet from folder:', error);
    return false;
  }

  return true;
}

export async function getSnippetFolders(snippetId: string): Promise<Folder[]> {
  const { data: folderSnippets, error } = await supabase
    .from('folder_snippets')
    .select('folders(*)')
    .eq('snippet_id', snippetId);

  if (error) {
    console.error('Error fetching snippet folders:', error);
    return [];
  }

  return folderSnippets.map(item => item.folders as Folder);
}

/**
 * Get the number of snippets in a folder
 */
export async function getFolderSnippetCount(folderId: string): Promise<number> {
  const { count, error } = await supabase
    .from('folder_snippets')
    .select('*', { count: 'exact', head: true })
    .eq('folder_id', folderId);

  if (error) {
    console.error('Error fetching folder snippet count:', error);
    return 0;
  }

  return count || 0;
}
