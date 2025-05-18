
export interface Snippet {
  id: string;
  title: string;
  description?: string;
  language: string;
  code: string;
  tags: {
    name: string;
    type: 'auto' | 'user';
  }[];
  usage_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}
