import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable} from 'rxjs';
import {LeaderboardList} from './leaderboardModel';

@Injectable()
export class LeaderboardService {

  constructor(private http: HttpClient) { }

  getLeaderBoardListAPi(url): Observable<LeaderboardList[]> {
    return this.http.get<LeaderboardList[]>(url);
  }

  getLeaderBoardDataAPi(url) {
    return this.http.get(url);
  }
}
