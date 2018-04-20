import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  page = 1;
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.hide();
  }

}
