import { supabase } from '@/integrations/supabase/client';
import { Snippet } from '../types/Snippet';

export async function getSnippets(): Promise<Snippet[]> {
  const { data: snippetsData, error } = await supabase
    .from('snippets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching snippets:', error);
    throw error;
  }

  // Fetch tags for each snippet
  const snippets = await Promise.all(
    snippetsData.map(async (snippet) => {
      const { data: snippetTags, error: tagsError } = await supabase
        .from('snippet_tags')
        .select('tags(id, name, type)')
        .eq('snippet_id', snippet.id);

      if (tagsError) {
        console.error('Error fetching snippet tags:', tagsError);
        return {
          ...snippet,
          tags: [],
        };
      }

      const tags = snippetTags.map(item => ({
        name: item.tags.name,
        type: item.tags.type as 'auto' | 'user',
      }));

      return {
        ...snippet,
        tags,
      };
    })
  );

  return snippets;
}

export async function getSnippetById(id: string): Promise<Snippet | null> {
  const { data: snippet, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching snippet:', error);
    return null;
  }

  // Fetch tags for the snippet
  const { data: snippetTags, error: tagsError } = await supabase
    .from('snippet_tags')
    .select('tags(id, name, type)')
    .eq('snippet_id', id);

  if (tagsError) {
    console.error('Error fetching snippet tags:', tagsError);
    return {
      ...snippet,
      tags: [],
    };
  }

  const tags = snippetTags.map(item => ({
    name: item.tags.name,
    type: item.tags.type as 'auto' | 'user',
  }));

  return {
    ...snippet,
    tags,
  };
}

export async function createSnippet(snippet: Omit<Snippet, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'user_id'>): Promise<Snippet | null> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return null;
  }

  // Insert snippet
  const { data: newSnippet, error } = await supabase
    .from('snippets')
    .insert({
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      code: snippet.code,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating snippet:', error);
    return null;
  }

  // Handle tags
  if (snippet.tags && snippet.tags.length > 0) {
    for (const tag of snippet.tags) {
      // Check if tag exists or create it
      const { data: existingTag, error: tagError } = await supabase
        .from('tags')
        .select('*')
        .eq('name', tag.name)
        .single();

      let tagId;
      if (tagError) {
        // Create new tag
        const { data: newTag, error: createTagError } = await supabase
          .from('tags')
          .insert({
            name: tag.name,
            type: tag.type,
          })
          .select()
          .single();

        if (createTagError) {
          console.error('Error creating tag:', createTagError);
          continue;
        }

        tagId = newTag.id;
      } else {
        tagId = existingTag.id;
      }

      // Create snippet-tag relationship
      await supabase
        .from('snippet_tags')
        .insert({
          snippet_id: newSnippet.id,
          tag_id: tagId,
        });
    }
  }

  return getSnippetById(newSnippet.id);
}

export async function updateSnippet(id: string, updates: Partial<Snippet>): Promise<Snippet | null> {
  const { data: snippet, error } = await supabase
    .from('snippets')
    .update({
      title: updates.title,
      description: updates.description,
      language: updates.language,
      code: updates.code,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating snippet:', error);
    return null;
  }

  // Handle tags if they're being updated
  if (updates.tags) {
    // Delete existing tag associations
    await supabase
      .from('snippet_tags')
      .delete()
      .eq('snippet_id', id);

    // Add new tags
    for (const tag of updates.tags) {
      // Check if tag exists or create it
      const { data: existingTag, error: tagError } = await supabase
        .from('tags')
        .select('*')
        .eq('name', tag.name)
        .single();

      let tagId;
      if (tagError) {
        // Create new tag
        const { data: newTag, error: createTagError } = await supabase
          .from('tags')
          .insert({
            name: tag.name,
            type: tag.type,
          })
          .select()
          .single();

        if (createTagError) {
          console.error('Error creating tag:', createTagError);
          continue;
        }

        tagId = newTag.id;
      } else {
        tagId = existingTag.id;
      }

      // Create snippet-tag relationship
      await supabase
        .from('snippet_tags')
        .insert({
          snippet_id: id,
          tag_id: tagId,
        });
    }
  }

  return getSnippetById(id);
}

export async function deleteSnippet(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting snippet:', error);
    return false;
  }

  return true;
}

export async function incrementUsageCount(id: string): Promise<void> {
  const { data: snippet, error: fetchError } = await supabase
    .from('snippets')
    .select('usage_count')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching snippet usage count:', fetchError);
    return;
  }

  const { error: updateError } = await supabase
    .from('snippets')
    .update({ 
      usage_count: (snippet.usage_count || 0) + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating usage count:', updateError);
  }
}
