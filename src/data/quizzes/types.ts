import type { TrackId } from '../../site.config';

interface BaseQuestion {
  q: string;
  code?: string;
  explain: string;
}

/** Classic multiple choice (the default when `type` is omitted). */
export interface McqQuestion extends BaseQuestion {
  type?: 'mcq';
  options: string[];
  answer: number; // index into options
}

/** Back-of-envelope estimate: the learner types a number; within 2× counts as correct. */
export interface EstimateQuestion extends BaseQuestion {
  type: 'estimate';
  given?: string[]; // facts to work from
  answer: number; // reference value, in `unit`
  unit: string; // e.g. 'TB', 'QPS', 'servers'
  speedSec?: number; // answer within this many seconds for a speed bonus (default 60)
}

/** Trade-off duel: pick a side AND every reason that justifies it. */
export interface TradeoffQuestion extends BaseQuestion {
  type: 'tradeoff';
  constraint?: string;
  options: [string, string];
  answer: 0 | 1;
  reasons: { text: string; valid: boolean }[];
}

export type QuizQuestion = McqQuestion | EstimateQuestion | TradeoffQuestion;

export interface Quiz {
  id: string;
  title: string;
  track: TrackId;
  description: string;
  mode?: string; // short label shown on the quiz card, e.g. 'Speed round'
  questions: QuizQuestion[];
}
