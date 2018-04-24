import { Component, OnInit, Pipe } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import {AuthServiceService} from '../auth-service.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private authService: AuthServiceService, private modalService: NgbModal) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;

    this.settingsForm = new FormGroup({
      settings: new FormGroup({
        redirectUrl: new FormControl('', Validators.required),
        apiKey: new FormControl('', Validators.required),
        clientId: new FormControl('', Validators.required),
        portalId: new FormControl('', Validators.required),
        apiUrl: new FormControl('', Validators.required)
      })
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
