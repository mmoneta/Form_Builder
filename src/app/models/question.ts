export class IQuestion {
  Id: number;
  main_index: number;
  question: string;
  answer: string;
  level: number;
  parameter: string;
}

export class Question implements IQuestion {
  Id = 0;
  main_index = 0;
  question = '';
  answer = '';
  level = 0;
  parameter: string;
}
