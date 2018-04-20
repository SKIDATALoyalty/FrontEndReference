import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  readUrl(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const target: any = e.target;
        const imgData = target.result;
        const imgName = input.files[0].name;
        input.setAttribute('data-title', imgName);
        console.log(target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

}
