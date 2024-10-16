import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  goToWebsite() {
    window.location.href = 'https://www.umontreal.ca/';
  }

  goToWebsiteBib() {
    window.location.href = 'https://bib.umontreal.ca/';
  }
}
