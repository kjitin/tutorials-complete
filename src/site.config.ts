// Central site configuration — rename the site, wire analytics/ads, or swap the
// code runner here without touching any component.
export const SITE = {
  name: 'StackWise',
  tagline: 'Java, Spring Boot & Design Patterns — with code you can run.',
  description:
    'Learn modern Java 21, Spring Boot 4 and all 23 Gang of Four design patterns with runnable examples, UML diagrams, quizzes and 150+ interview questions.',
  url: 'https://tutorials.jitinkayyala.com',
  author: 'StackWise',
  github: '',

  // Analytics: 'none' | 'ga4' | 'plausible'
  analytics: {
    provider: 'none' as 'none' | 'ga4' | 'plausible',
    ga4Id: '', // e.g. 'G-XXXXXXXXXX'
    plausibleDomain: '', // e.g. 'stackwise.dev'
  },

  // Google AdSense. Slots render nothing while `enabled` is false.
  ads: {
    enabled: false,
    client: '', // e.g. 'ca-pub-1234567890123456'
    slots: { inArticle: '', sidebar: '' },
  },

  // In-browser Java runner. Wandbox is free, CORS-enabled and supports Java 21.
  // Point `endpoint` at a self-hosted runner with the same API to replace it.
  playground: {
    endpoint: 'https://wandbox.org/api/compile.json',
    compiler: 'openjdk-jdk-21+35',
    timeoutMs: 30000,
  },
} as const;

export type TrackId = 'java' | 'spring-boot' | 'design-patterns';

export interface Track {
  id: TrackId;
  title: string;
  short: string;
  description: string;
  accent: string;
  icon: string;
  groups: string[];
}

export const TRACKS: Track[] = [
  {
    id: 'java',
    title: 'Modern Java',
    short: 'Java',
    description:
      'From OOP fundamentals to records, sealed types, streams, virtual threads and JVM internals — targeting Java 21 LTS.',
    accent: '#f97316',
    icon: 'coffee',
    groups: ['Fundamentals', 'Collections', 'Functional Java (Java 8+)', 'Modern Java (17–21)', 'Concurrency', 'JVM Internals'],
  },
  {
    id: 'spring-boot',
    title: 'Spring Boot 4',
    short: 'Spring Boot',
    description:
      'Dependency injection, REST APIs, JPA, security, testing and production readiness with Spring Boot 4 and Spring Framework 7.',
    accent: '#22c55e',
    icon: 'leaf',
    groups: ['Core Concepts', 'Web & REST', 'Data Access', 'Security', 'Testing', 'Production & Microservices'],
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns',
    short: 'Patterns',
    description:
      'SOLID principles and all 23 Gang of Four patterns, each with a UML diagram, a runnable Java example and interview notes.',
    accent: '#a855f7',
    icon: 'shapes',
    groups: ['Principles', 'Creational', 'Structural', 'Behavioral'],
  },
];

export const trackById = (id: string) => TRACKS.find((t) => t.id === id)!;
