import type { Quiz } from './types';
import javaCore from './java-core';
import collectionsStreams from './collections-streams';
import modernJava from './modern-java';
import concurrencyJvm from './concurrency-jvm';
import springBoot from './spring-boot';
import springDataSecurity from './spring-data-security';
import designPatterns from './design-patterns';

export const QUIZZES: Quiz[] = [
  javaCore,
  collectionsStreams,
  modernJava,
  concurrencyJvm,
  springBoot,
  springDataSecurity,
  designPatterns,
];
