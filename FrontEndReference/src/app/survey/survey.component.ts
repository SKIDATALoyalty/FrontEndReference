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
              'question': this.allSurveys[i].Questions[j]
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

            // pushing only unanswered questions to surveylist array. Fix for OSC-416
            if (!isAnswered) {
              this.surveyList.push(quizObj);
              this.counter++;
            }
          }
        }

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
  'question': {}
};
