import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lesson = z.object({
  title: z.string(),
  description: z.string(),
  group: z.string(),
  order: z.number(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  minutes: z.number().optional(),
  tags: z.array(z.string()).default([]),
});

const lessonCollection = (dir: string) =>
  defineCollection({ loader: glob({ pattern: '**/*.mdx', base: `./src/content/${dir}` }), schema: lesson });

export const collections = {
  java: lessonCollection('java'),
  'spring-boot': lessonCollection('spring-boot'),
  'design-patterns': lessonCollection('design-patterns'),
  interview: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/interview' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      track: z.enum(['java', 'spring-boot', 'design-patterns']),
      order: z.number(),
    }),
  }),
};
