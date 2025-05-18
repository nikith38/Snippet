import { Snippet } from './Snippet';

export interface Folder {
  id: string;
  name: string;
  user_id: string;
  parent_folder_id: string | null;
  created_at: string;
  snippets?: Snippet[];
  snippetCount?: number;
}

export interface FolderWithSnippets extends Folder {
  snippets: Snippet[];
}