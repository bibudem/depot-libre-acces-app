import { HttpClientModule } from '@angular/common/http';
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {FileUploadComponent} from "./file-upload/file-upload.component";
import {NgModule} from "@angular/core";

@NgModule({
  declarations: [AppComponent, FileUploadComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
