import { NotFoundComponent } from './not-found/not-found.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {FileUploadComponent} from "./file-upload/file-upload.component";
import {NgModule} from "@angular/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import {AppRoutingModule} from "./app-routing.module";
import { MaintenanceComponent } from './maintenance/maintenance.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, FileUploadComponent, HeaderComponent, FooterComponent, LoginComponent, NotFoundComponent, MaintenanceComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
