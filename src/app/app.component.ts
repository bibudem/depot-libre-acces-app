import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr'); // Vous pouvez changer la langue ici.
    this.translate.get('PROJECT_TITLE').subscribe((title: string) => {
      document.title = title;
    });
  }
}
