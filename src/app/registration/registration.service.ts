import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegistrationRequest } from './models/RegistrationRequest';
import { RegistrationResponse } from './models/RegistrationResponse';
import { environment } from '../../environments/environment';

@Injectable()
export class RegistrationService {

    constructor(private http: HttpClient) { }

    registerUser(username, email, firstName, lastName) {
        const url = environment.apiBase + '/user/' + environment.portalId + '/v1/user';
        const body = new RegistrationRequest(username, email, 'Developer Portal', firstName, lastName);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-api-key': environment.apiKey
            })
        };

        return this.http.post<RegistrationResponse>(url, body, httpOptions);
    }
}
