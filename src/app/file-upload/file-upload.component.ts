import { Component, AfterViewInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements AfterViewInit {
  selectedFiles: File[] = [];
  showUploadButtons: boolean = false;

  constructor(private fileUploadService: FileUploadService, private translate: TranslateService) {}

  ngAfterViewInit() {
    document.getElementById('fileInput')?.addEventListener('change', (event: any) => {
      const files = Array.from(event.target.files) as File[];
      if (files.length > 0) {
        this.selectedFiles.push(...files); // Ajouter tous les fichiers sélectionnés
        this.showUploadButtons = true;
      }
    });

    document.getElementById('fileUploader')?.addEventListener('drop', (event: any) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files) as File[];
      if (files.length > 0) {
        this.selectedFiles.push(...files);
        this.showUploadButtons = true;
      }
    });

    document.getElementById('uploadButton')?.addEventListener('click', () => {
      this.uploadFiles();
    });
  }

  // Fonction pour retirer un fichier de la sélection
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Retirer le fichier de la liste
    if (this.selectedFiles.length === 0) {
      this.showUploadButtons = false;
    }
  }

  // Fonction pour annuler la sélection de tous les fichiers
  cancelSelection(): void {
    this.selectedFiles = [];
    this.showUploadButtons = false;
  }

  // Démarrer le processus d'upload
  uploadFiles(): void {
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        this.fileUploadService.uploadFile(file).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              const progress = Math.round((100 * event.loaded) / event.total);
              document.getElementById('uploadMessage')!.textContent = `Uploading... ${progress}%`;
            } else if (event.type === HttpEventType.Response) {
              this.showUploadButtons = false;
              document.getElementById('uploadMessage')!.textContent = this.translate.instant('UPLOAD_SUCCESS');
            }
            this.selectedFiles = [];
          },
          (error: any) => {
            document.getElementById('uploadMessage')!.textContent = this.translate.instant('UPLOAD_FAILED');
            console.error(error);
          }
        );
      });
    } else {
      document.getElementById('uploadMessage')!.textContent = this.translate.instant('NO_FILE_SELECTED');
    }
  }
}
