import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { environment } from './../../environments/environment';
import { LoaderService } from './../services/loader.service';
import { SurveyService } from './survey.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  allSurveys: any[] = [];
  surveyList: any[] = [];
  questionIndex = 0;
  quizesTaken = 0;
  noOfCorrectAns = 0;
  isNotAnswered = true;
  currentSurveyIndex = 0;
  currentSurvey: any;
  counter = 0;
  totalPagesCount = 1;
  totalPages = 0;
  noOfPages = 0;
  pageSize = 5;
  surveyForm: FormGroup;

  constructor(private surveyService: SurveyService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.display(true);
    const surveyUrl = environment.apidocs + 'v2/API/SimpleSurveys/';
    this.surveyService.getApi(surveyUrl).subscribe(
      data => {
        this.allSurveys = data['Data']['Records'];

        this.questionIndex = 0;
        for (let i = 0; i < this.allSurveys.length; i++) {
          for (let j = 0; j < this.allSurveys[i].Questions.length; j++) {

            const isEnd = j === this.allSurveys[i].Questions.length - 1 ? true : false;
            const isAnswered = this.allSurveys[i].Questions[j].SurveyQuestionAnswered;

            quizObj = {
              'SurveyID': this.allSurveys[i].SurveyID,
              'SurveyTypeName': this.allSurveys[i].SurveyTypeName,
              'SurveyTypeID': this.allSurveys[i].SurveyTypeID,
              'Title': this.allSurveys[i].Title,
              'Description': this.allSurveys[i].Description,
              'UserSurveyCompleted': this.allSurveys[i].UserSurveyCompleted,
              'IsActive': this.allSurveys[i].IsActive,
              'IsQuiz': this.allSurveys[i].IsQuiz,
              'surveyEnd': isEnd,
              'QuestionType': this.allSurveys[i].Questions[j].QuestionType,
              'QuestionTypeName': this.allSurveys[i].Questions[j].QuestionTypeName,
              'isAnswered': isAnswered,
              'surveyEndDate': this.allSurveys[i].EndDate,
              'question': this.allSurveys[i].Questions[j],
              'SurveyQuestion': this.allSurveys[i].Questions[j].SurveyQuestion,
              'SurveyQuestionID': this.allSurveys[i].Questions[j].SurveyQuestion.SurveyQuestionID
            };
            if (isAnswered) {
              this.quizesTaken++;
              if (quizObj.question['SurveyAnswer'].IsCorrect) {
                this.noOfCorrectAns++;
              }
            }

            if (!isAnswered && this.isNotAnswered) {
              this.currentSurvey = quizObj;
              this.currentSurveyIndex = this.counter;
              this.isNotAnswered = false;
            }

            // pushing only unanswered questions to surveylist array.
            if (!isAnswered) {
              this.surveyList.push(quizObj);
              this.counter++;
            }
          }
        }

        setTimeout(() => {
          const formGroup = {};
          for (const prop of this.surveyList) {
            formGroup[prop['SurveyQuestionID']] = new FormControl('');
          }
          this.surveyForm = new FormGroup(formGroup);
          // console.log('survey form--', this.surveyForm);
        }, 200);
        this.totalPages = this.surveyList.length;
        this.noOfPages = Math.ceil(this.totalPages / this.pageSize);

        let newPageCount = Math.ceil(data['Data'].TotalRecordCount / data['Data'].PageSize);
        if (newPageCount === 0) {
          newPageCount = 1;
        }
        this.totalPagesCount = newPageCount;

        // console.log('survey data', this.surveyList);
        this.loaderService.display(false);
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

  submitQuestion(form) {
    // console.log('survey form', form);
    for (const key in form) {
      if (form.hasOwnProperty(key) && form[key]) {
        // const element = form[key];
        const qtyUrl = environment.apidocs + 'v2/API/SimpleSurveyQuestions/' + key + '/SubmitQuestionAnswer?answer=' + form[key];
        const params = [];
        const pBody = {};
        // console.log('res', form[key]);
        // console.log('res', key);
        this.surveyService.post<any>(qtyUrl, params, pBody).subscribe(res => {
          // console.log('res', res);
          form = {};
          this.updateSurveyAfterSubmit(res['Data']['Question']);
        },
          error => {
            console.log('error', error);
          });
      }
    }
  }

  updateSurveyAfterSubmit(data: any) {
    for (let i = 0; i < this.surveyList.length; i++) {
      if (this.surveyList[i].SurveyQuestionID  === data.SurveyQuestion.SurveyQuestionID) {
        this.surveyList[i].isAnswered = true;
        this.surveyList[i].question.CorrectAnswer = data.CorrectAnswer;
        this.surveyList[i].question.Feedback = data.Feedback;
        this.surveyList[i].question.SurveyAnswer = data.SurveyAnswer;
      }
    }
    // console.log('suervey list after up', this.surveyList);
  }

}

export let quizObj = {
  'SurveyID': 0,
  'SurveyTypeName': null,
  'SurveyTypeID': 0,
  'Title': null,
  'Description': null,
  'UserSurveyCompleted': false,
  'IsActive': false,
  'IsQuiz': false,
  'surveyEnd': false,
  'QuestionType': 1,
  'QuestionTypeName': null,
  'isAnswered': false,
  'surveyEndDate': null,
  'question': {},
  'SurveyQuestion': {},
  'SurveyQuestionID': 0
};
