
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '../types/Tag';

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('count', { ascending: false });

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data.map(tag => ({
    name: tag.name,
    type: tag.type as 'auto' | 'user',
    count: tag.count
  }));
}

export async function getLanguageCounts(): Promise<{ name: string; count: number }[]> {
  const { data, error } = await supabase
    .from('snippets')
    .select('language');

  if (error) {
    console.error('Error fetching languages:', error);
    return [];
  }

  // Calculate counts for each language
  const languageCounts: Record<string, number> = {};
  data.forEach(snippet => {
    const language = snippet.language;
    languageCounts[language] = (languageCounts[language] || 0) + 1;
  });

  // Convert to array format for the frontend
  return Object.entries(languageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
