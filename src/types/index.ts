export interface Response {
  id: string;
  text: string;
  rationale: string;
  isCorrect: boolean;
  examItemId?: string;
}

export interface ExamItem {
  id: string;
  questionId: string;
  stem: string;
  responses: Response[];
  lastSaved?: string;
} 