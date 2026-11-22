import type { Quiz } from './types';
import javaCore from './java-core';
import collectionsStreams from './collections-streams';
import modernJava from './modern-java';
import concurrencyJvm from './concurrency-jvm';
import springBoot from './spring-boot';
import springDataSecurity from './spring-data-security';
import designPatterns from './design-patterns';
import systemDesign from './system-design';
import napkinMath from './napkin-math';
import tradeoffDuels from './tradeoff-duels';

export const QUIZZES: Quiz[] = [
  javaCore,
  collectionsStreams,
  modernJava,
  concurrencyJvm,
  springBoot,
  springDataSecurity,
  designPatterns,
  systemDesign,
  napkinMath,
  tradeoffDuels,
];
