export type BillMember = {
  id: string
  name: string
  is_active?: boolean | null
}

export function isMemberActive(member: BillMember): boolean {
  return member.is_active !== false
}

export function filterSelectableMembers<T extends BillMember>(
  members: T[],
  keepIds: Iterable<string> = []
): T[] {
  const keep = new Set(keepIds)
  return members.filter((member) => isMemberActive(member) || keep.has(member.id))
}
