import { Component, OnInit } from '@angular/core';
import { LoaderService } from './../services/loader.service';
import {LeaderboardService} from './leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderBoardData: any[] = [];
  leaderBoardListData: any[] = [];

  constructor(private leaderboardService: LeaderboardService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.display(true);
    const listUrl = '../assets/static-data/leaderboardList.json';
    this.leaderboardService.getLeaderBoardListAPi(listUrl).subscribe(data => {
      // console.log('success in leaderboard list', data);
      this.leaderBoardListData = data;
      for (const value of data) {
        // console.log('list obj', value.LeaderboardID);
        this.getLeaderboardData(value.LeaderboardID);
      }
    },
    error => {
      this.loaderService.display(false);
      console.log('error in leaderboard list', error);
    });
  }
  getLeaderboardData(id) {
    const dataUrl = '../assets/static-data/' + id + '.json';
    this.leaderboardService.getLeaderBoardDataAPi(dataUrl).subscribe(data => {
      this.loaderService.display(false);
      this.leaderBoardData.push(data);
      // console.log('success in leaderboard data', this.leaderBoardData);
    },
    error => {
      this.loaderService.display(false);
      console.log('error in leaderboard data', error);
    });
  }

}
