import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit, ComponentRef, ComponentFactory } from '@angular/core';
import { get_next_question, get_sequence } from './services/operations.service';
import * as json from '../assets/questions.json';

import { QuestionComponent } from './question/question.component';
import { MainQuestionComponent } from './main-question/main-question.component';
import { QuestionService } from './services/question.service';
import { Question, IQuestion } from './models/question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QuestionService]
})
export class AppComponent implements OnInit {

  constructor(private resolver: ComponentFactoryResolver) { }

  title = 'Form Builder';

  questions: any;
  main_index = 0;

  mainQuestionComponents = [];
  questionComponents = [];

  mainQuestionsComponentRef: any;
  questionsComponentRef: any;

  _questions: Array<Question> = [];
  private _service: QuestionService;

  @ViewChild('questionsContainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  ngOnInit() {
    this.questions = json.default;
  }

  createMainQuestionComponent() {
    const factory = this.resolver.resolveComponentFactory(MainQuestionComponent);
    this.mainQuestionsComponentRef = this.entry.createComponent(factory);
    this.mainQuestionComponents.push(this.mainQuestionsComponentRef);
    this.mainQuestionsComponentRef.instance.main_question_index = this.main_index;
    this.mainQuestionsComponentRef.instance.main_question_content = this.questions[this.main_index].main_question.content;
    this.mainQuestionsComponentRef.instance.main_question_type = this.questions[this.main_index].main_question.type;
    this.mainQuestionsComponentRef.instance.main_question_answer = null;
    this.mainQuestionsComponentRef.instance.main_question_childrens_length = 0;
    this.mainQuestionsComponentRef.instance.onMainQuestionAddSubInput.subscribe(msg => this.onMainQuestionAddSubInput(msg));
    this.mainQuestionsComponentRef.instance.onMainQuestionDestroy.subscribe(msg => this.onMainQuestionDestroy(msg));
  }

  createQuestionComponent(main_index: any, sub_index: any, last_answer: any, last_type: any, question: any, type: any, level: number) {
    const factory = this.resolver.resolveComponentFactory(QuestionComponent);
    this.questionsComponentRef = this.entry.createComponent(factory);
    this.questionComponents.push(this.questionsComponentRef);
    this.questionsComponentRef.instance.main_index = main_index;
    this.questionsComponentRef.instance.question_index = sub_index;
    this.questionsComponentRef.instance.last_answer = last_answer;
    this.questionsComponentRef.instance.question_answer = null;
    this.questionsComponentRef.instance.last_type = last_type;
    this.questionsComponentRef.instance.question = question;
    this.questionsComponentRef.instance.type = type;
    this.questionsComponentRef.instance.level = level;
    this.questionsComponentRef.instance.onQuestionAddSubInput.subscribe(msg => this.onQuestionAddSubInput(msg));
    this.questionsComponentRef.instance.onQuestionDestroy.subscribe(msg => this.onQuestionDestroy(msg));
  }

  addMainQuestion() {
    if (this.main_index < this.questions.length) {
      this.createMainQuestionComponent();
      this.main_index++;
    }
  }

  onMainQuestionAddSubInput(main_index) {
    switch (this.mainQuestionComponents[main_index].instance.main_question_type) {
      case 'select':
        if (this.mainQuestionComponents[main_index].instance.main_question_answer === 'Yes') {
          // tslint:disable-next-line:no-shadowed-variable
          const possible = get_next_question(this.questions, this.questionComponents, main_index, 0);
          if (possible && possible.length > 0) {
            const [data] = possible,
            last_answer = this.mainQuestionComponents[main_index].instance.main_question_answer,
            last_type = this.mainQuestionComponents[main_index].instance.main_question_type,
            question = data.content,
            type = data.type;

            this.createQuestionComponent(main_index, this.mainQuestionComponents[main_index].instance.main_question_childrens_length, last_answer, last_type, question, type, 1);
            this.mainQuestionComponents[main_index].instance.main_question_childrens_length++;
          }
        }
        break;
      default:
        const possible = get_next_question(this.questions, this.questionComponents, main_index, 0);
        if (possible.length > 0) {
          const [data] = possible,
          last_answer = this.mainQuestionComponents[main_index].instance.main_question_answer,
          last_type = this.mainQuestionComponents[main_index].instance.main_question_type,
          question = data.content,
          type = data.type;

          this.createQuestionComponent(main_index, this.mainQuestionComponents[main_index].instance.main_question_childrens_length, last_answer, last_type, question, type, 1);
          this.mainQuestionComponents[main_index].instance.main_question_childrens_length++;
        }
        break;
    }
  }

  onQuestionAddSubInput(data) {
    if (get_next_question(this.questions, this.questionComponents, data.main_index, data.level).length > 0) {
      const [possible] = get_next_question(this.questions, this.questionComponents, data.main_index, data.level);
      let last_object = null;

      for (const questionComponent of this.questionComponents) {
        if (questionComponent.instance.main_index === data.main_index && questionComponent.instance.question_index === data.question_index) {
          last_object = questionComponent;
        }
      }

      if (get_sequence(this.questions, data.main_index, last_object.instance.question, possible.content)) {
        const { question_answer } = last_object.instance,
        last_type = last_object.instance.type,
        { content } = possible,
        { type } = possible,
        { level } = possible;

        this.createQuestionComponent(data.main_index, this.mainQuestionComponents[data.main_index].instance.main_question_childrens_length, question_answer, last_type, content, type, level);
        this.mainQuestionComponents[data.main_index].instance.main_question_childrens_length++;
      }
    }
  }

  onMainQuestionDestroy(index: number) {
    this.mainQuestionComponents[index].destroy();
    for (const questionComponent of this.questionComponents) {
      if (questionComponent.instance.main_index === index) {
        questionComponent.destroy();
      }
    }
  }

  onQuestionDestroy(data) {
    for (const questionComponent of this.questionComponents) {
      if (questionComponent.instance.main_index === data.main_index && questionComponent.instance.question_index === data.question_index) {
        questionComponent.destroy();
      }
    }
  }
}
