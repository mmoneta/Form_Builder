import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question, IQuestion } from '../models/question';

@Component({
  selector: 'app-main-question',
  templateUrl: './main-question.component.html',
  styleUrls: ['./main-question.component.css'],
  providers: [QuestionService]
})
export class MainQuestionComponent implements OnInit {
  @Input() main_question_content: string;
  @Input() main_question_type: string;
  @Input() main_question_index: number;
  @Input() main_question_childrens_length: number;
  @Input() main_question_answer: any;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onMainQuestionAddSubInput = new EventEmitter<number>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onMainQuestionDestroy = new EventEmitter<number>();
  mainQuestionAnswer: any;

  _questions = [];
  private _service: QuestionService;

  constructor(service: QuestionService) {
    this._service = service;
  }

  ngOnInit() {
    this.getQuestionWhere(this.main_question_index, this.main_question_content);
  }

  getQuestionWhere(main_index, question) {
    this._service.getQuestionWhere(main_index, question).then(questions => {
      this._questions = questions;
      if (this._questions.length === 0) {
        const data = {
          main_index: this.main_question_index,
          question: this.main_question_content,
          answer: '',
          level: 0,
          parameter: ''
        };

        this.insertQuestion(data);
      } else {
        const [{ answer }] = this._questions;
        this.mainQuestionAnswer = answer;
      }
    }).catch(error => {
      console.error(error);
    });
  }

  insertQuestion(data) {
    this._service.insertQuestion(data);
  }

  updateQuestionAnswer(main_index, question, answer) {
    this._service.updateQuestionAnswer(main_index, question, answer, '');
  }

  vote() {
    this.main_question_answer = this.mainQuestionAnswer;
    this.onMainQuestionAddSubInput.emit(this.main_question_index);
  }

  delete() {
    this.onMainQuestionDestroy.emit(this.main_question_index);
  }

  change() {
    this.updateQuestionAnswer(this.main_question_index, this.main_question_content, this.mainQuestionAnswer);
  }
}
