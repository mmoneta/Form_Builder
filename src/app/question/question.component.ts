import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question, IQuestion } from '../models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() main_index: number;
  @Input() question_index: number;
  @Input() last_answer: any;
  @Input() question_answer: any;
  @Input() last_type: string;
  @Input() question: string;
  @Input() type: string;
  @Input() level: number;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onQuestionAddSubInput = new EventEmitter<object>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onQuestionDestroy = new EventEmitter<object>();
  view_question: string;
  parameter: string;

  _questions = [];
  private _service: QuestionService;

  constructor(service: QuestionService) {
    this._service = service;
  }

  ngOnInit() {
    this.parameter = '';
    this.view_question = this.last_answer;
    this.getQuestionWhere(this.main_index, this.question);
  }

  getQuestionWhere(main_index, question) {
    this._service.getQuestionWhere(main_index, question).then(questions => {
      this._questions = questions;
      if (this._questions.length === 0) {
        const data = {
          main_index: this.main_index,
          question: this.question,
          answer: '',
          level: this.level,
          parameter: ''
        };

        this.insertQuestion(data);
      } else {
        this.question_answer = this._questions[0].answer;
        if (this._questions[0].parameter !== undefined) {
          this.parameter = this._questions[0].parameter;
        } else {
          this.parameter = '';
        }
      }
    }).catch(error => {
      console.error(error);
    });
  }

  insertQuestion(data) {
    this._service.insertQuestion(data);
  }

  updateQuestionAnswer(main_index: number, question: string, answer: any, parameter: string) {
    this._service.updateQuestionAnswer(main_index, question, answer, parameter);
  }

  vote() {
    if (this.question_answer) {
      this.onQuestionAddSubInput.emit({ main_index: this.main_index, question_index: this.question_index, question_answer: this.question_answer, level: this.level });
    }
  }

  delete() {
    this.onQuestionDestroy.emit({ main_index: this.main_index, question_index: this.question_index });
  }

  change() {
    this.updateQuestionAnswer(this.main_index, this.question, this.question_answer, this.parameter);
  }

  change_parameter() {
    this.updateQuestionAnswer(this.main_index, this.question, this.question_answer, this.parameter);
  }
}
