import { supabase } from "@/lib/supabaseClient"
import type { UINote, UINoteInput } from "../types"

const TABLE = "notes"

export async function listNotes(): Promise<UINote[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      id, user_id, title, description, is_pinned, created_at, updated_at,
      users ( name, role )
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data ?? []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.users?.name,
    userRole: r.users?.role,
    title: r.title,
    description: r.description,
    isPinned: !!r.is_pinned,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }))
}

export async function createNote(input: UINoteInput): Promise<UINote> {
  const payload = {
    user_id: input.userId,
    title: input.title,
    description: input.description,
    is_pinned: !!input.isPinned,
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([payload])
    .select(`
      id, user_id, title, description, is_pinned, created_at, updated_at,
      users ( name, role )
    `)
    .single()

  if (error) throw error

  return {
    id: data.id,
    userId: data.user_id,
    userName: data.users?.[0]?.name,
    userRole: data.users?.[0]?.role,
    title: data.title,
    description: data.description,
    isPinned: !!data.is_pinned,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<UINote, "title" | "description" | "isPinned">>
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      title: patch.title,
      description: patch.description,
      is_pinned: typeof patch.isPinned === "boolean" ? patch.isPinned : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id)
  if (error) throw error
}
