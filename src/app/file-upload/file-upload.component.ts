import { Component } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  message: string = '';

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      this.message = 'Veuillez sélectionner un fichier.';
      return;
    }

    this.fileUploadService.uploadFile(this.selectedFile).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / event.total!);
          this.message = `Téléchargement en cours : ${progress}%`;
        } else if (event.type === HttpEventType.Response) {
          this.message = 'Fichier téléchargé avec succès';
        }
      },
      (error) => {
        console.error(error);
        this.message = 'Erreur lors du téléchargement';
      }
    );
  }
}
