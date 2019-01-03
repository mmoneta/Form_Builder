import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { MainQuestionComponent } from './main-question/main-question.component';
import { CommonService } from './services/common.service';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    MainQuestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent],
  entryComponents: [MainQuestionComponent, QuestionComponent]
})
export class AppModule { }
