import type { TrackId } from '../../site.config';

export interface QuizQuestion {
  q: string;
  code?: string;
  options: string[];
  answer: number; // index into options
  explain: string;
}

export interface Quiz {
  id: string;
  title: string;
  track: TrackId;
  description: string;
  questions: QuizQuestion[];
}
