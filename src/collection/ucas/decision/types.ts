export enum QuestionType {
  CHOICE = 'choice',
}

export enum SignalType {
  DECIDE = 'decision.decide',
  DECIDED = 'decision.decided',
  ERROR = 'decision.error',
}

export enum DataType {
  REQUEST = 'Request',
  RESULT = 'Result',
  ERROR = 'Error',
}

export type {
  Body,
  ChoiceResult,
  DecisionPayload,
  Failure,
  OptionItem,
  Question,
  Request,
  Result,
} from './schema.js';
