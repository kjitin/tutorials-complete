import { getCollection, type CollectionEntry } from 'astro:content';
import { trackById, type TrackId } from '../site.config';

export type Lesson = CollectionEntry<'java'> | CollectionEntry<'spring-boot'> | CollectionEntry<'design-patterns'>;

export async function getLessons(track: TrackId): Promise<Lesson[]> {
  const groups = trackById(track).groups;
  const lessons = (await getCollection(track)) as Lesson[];
  return lessons.sort(
    (a, b) => groups.indexOf(a.data.group) - groups.indexOf(b.data.group) || a.data.order - b.data.order,
  );
}

export function groupLessons(track: TrackId, lessons: Lesson[]) {
  return trackById(track)
    .groups.map((group) => ({ group, lessons: lessons.filter((l) => l.data.group === group) }))
    .filter((g) => g.lessons.length);
}

export const lessonKey = (track: string, id: string) => `${track}/${id}`;
export const lessonUrl = (track: string, id: string) => `/${track}/${id}/`;
