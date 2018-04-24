import { Component, OnInit, Pipe } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/debounceTime';
import {AuthServiceService} from '../auth-service.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ProfileService} from '../profile/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/share';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  closeResult: string;
  settingsForm: FormGroup;
  settingsSuccessMsg: string;
  profileInfo: any;

  public pointsRemaining = 0;
  public pointsSpent = 0;
  public observable: Observable<boolean>;
  private observer: Observer<boolean>;

  constructor(private authService: AuthServiceService,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService) {
      this.observable = new Observable<boolean>((observer: any) => this.observer = observer).share();
     }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    const authToken = localStorage.getItem('id_token');
    this.settingsForm = new FormGroup({
      settings: new FormGroup({
        redirectUrl: new FormControl('', Validators.required),
        apiKey: new FormControl('', Validators.required),
        clientId: new FormControl('', Validators.required),
        portalId: new FormControl('', Validators.required),
        apiUrl: new FormControl('', Validators.required)
      })
    });

    this.authService.isLoggedIn.subscribe(status => {
      // console.log('logged in status', status);
      if (status) {
        this.spinner.show();
        const profileInfoApiUrl = environment.apidocs + 'v1/API/user';
        this.profileService.getProfileAPi(profileInfoApiUrl).subscribe(
          data => {
            this.spinner.hide();
            this.profileInfo = data;
            // console.log('data---', data);
            this.pointsRemaining = data['CurrentPoints']['PointsRemaining'];
            this.pointsSpent = data['CurrentPoints']['PointsSpent'];
          },
          error => {
            this.spinner.hide();
            console.log(error);
          });
      }
    });
  }

  loyaltylogout() {
    this.authService.logout();
  }

  openSettings(content) {

    this.settingsForm = new FormGroup({
      settings: new FormGroup({
        redirectUrl: new FormControl(localStorage.getItem('redirect_url'), Validators.required),
        apiKey: new FormControl(localStorage.getItem('api_key'), Validators.required),
        clientId: new FormControl(localStorage.getItem('client_id'), Validators.required),
        portalId: new FormControl(localStorage.getItem('portal_id'), Validators.required),
        apiUrl: new FormControl(localStorage.getItem('api_url'), Validators.required),
        portalApiDocsUrl: new FormControl(localStorage.getItem('portal_api_docs_url'), Validators.required)
      })
    });

    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmitSaveLocal() {
   this.settingsSuccessMsg = '';
  //  console.log('settings info', this.settingsForm.value.settings);
   localStorage.setItem('redirect_url', this.settingsForm.value.settings.redirectUrl);
   localStorage.setItem('api_key', this.settingsForm.value.settings.apiKey);
   localStorage.setItem('client_id', this.settingsForm.value.settings.clientId);
   localStorage.setItem('portal_id', this.settingsForm.value.settings.portalId);
   localStorage.setItem('api_url', this.settingsForm.value.settings.apiUrl);
   localStorage.setItem('portal_api_docs_url', this.settingsForm.value.settings.portalApiDocsUrl);
   this.settingsSuccessMsg = 'Settings Successfully Saved';
   setTimeout(() => {
    this.settingsSuccessMsg = '';
   }, 3000);
  }

}
