import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  _connection;

  constructor(service: CommonService) {
    this._connection = service._connection;
  }

  getQuestions = function () {
    return this._connection.select({
      from: 'questions'
    });
  };

  getQuestionWhere = function (main_index, question) {
    return this._connection.select({
      from: 'questions',
      where: {
        main_index: main_index,
        question: question
      }
    });
  };

  insertQuestion = function (data) {
    this._connection.insert({
      into: 'questions',
      values: [data],
    }).then(function(rowsInserted) {
      if (rowsInserted > 0) {
        // console.log('Successfully Added');
      }
    }).catch(function(error) {
      console.log(error.message);
    });
  };

  updateQuestionAnswer = function(main_index: number, question: string, answer: string, parameter: string) {
    this._connection.update({
      in: 'questions',
      set: {
        answer: answer,
        parameter: parameter
      },
      where: {
        main_index: main_index,
        question: question
      }
    }).then(function(rowsUpdated) {
      // console.log(rowsUpdated + ' rows updated');
    }).catch(function(err) {
      console.log(err);
    });
  };
}
