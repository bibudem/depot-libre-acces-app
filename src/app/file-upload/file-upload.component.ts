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
    // Gestion de la sélection de fichiers via l'input classique
    document.getElementById('fileInput')?.addEventListener('change', (event: any) => {
      const files = Array.from(event.target.files) as File[];
      if (files.length > 0) {
        this.selectedFiles.push(...files);
        this.showUploadButtons = true;
      }
    });

    // Permettre le drag-and-drop
    const fileUploader = document.getElementById('fileUploader');

    if (fileUploader) {
      // Ajout de l'événement 'dragover'
      fileUploader.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileUploader.classList.add('is-dragover'); // Ajoute la classe pour hover
      });

      // Ajout de l'événement 'dragleave'
      fileUploader.addEventListener('dragleave', () => {
        fileUploader.classList.remove('is-dragover'); // Retire la classe pour hover
      });

      // Ajout de l'événement 'drop'
      fileUploader.addEventListener('drop', (event: any) => {
        event.preventDefault();
        fileUploader.classList.remove('is-dragover'); // Retire la classe lors du dépôt

        const files = Array.from(event.dataTransfer.files) as File[];
        if (files.length > 0) {
          this.selectedFiles.push(...files);
          this.showUploadButtons = true;
        }
      });
    }

    // Gestion du clic sur le bouton d'upload
    document.getElementById('uploadButton')?.addEventListener('click', () => {
      this.uploadFiles();
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.showUploadButtons = false;
    }
  }

  cancelSelection(): void {
    this.selectedFiles = [];
    this.showUploadButtons = false;
  }

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
