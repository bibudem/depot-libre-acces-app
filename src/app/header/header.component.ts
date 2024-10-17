import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {


  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('fr');
  }

  showUserInfo: boolean = false;
  userName: string = 'John Doe';
  userEmail: string = 'john.doe@example.com';


  // Fonction pour basculer l'affichage des infos utilisateur
  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
  }

  // Fonction pour gérer la déconnexion
  logout() {
    alert('Vous êtes déconnecté');
    this.showUserInfo = false;
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;

    if (lang) {
      this.translate.use(lang);
    }
  }

}
