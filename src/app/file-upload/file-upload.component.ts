import { Component, AfterViewInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import * as $ from 'jquery';
import { HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements AfterViewInit {
  selectedFile: File | null = null;
  showUploadButtons: boolean = false;

  constructor(private fileUploadService: FileUploadService, private translate: TranslateService) {}

  ngAfterViewInit() {
    // Gérer la sélection de fichier via l'input
    $('#fileInput').on('change', (event: any) => {
      const files = event.target.files; // Use target.files
      if (files.length > 0) {
        this.selectedFile = files[0];
        $('#fileName').text(`${this.translate.instant('SELECTED_FILE')}: ${this.selectedFile?.name}`);
        this.showUploadButtons = true;
      }
    });

    // Gérer le drag and drop
    $('#fileUploader').on('dragover', (event: any) => {
      event.preventDefault();
      $(event.currentTarget).addClass('is-dragover');
    });

    $('#fileUploader').on('drop', (event: any) => {
      event.preventDefault();
      const files = event.originalEvent.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
        $('#fileName').text(`${this.translate.instant('SELECTED_FILE')}: ${this.selectedFile?.name}`);
        this.showUploadButtons = true;
      }
      $(event.currentTarget).removeClass('is-dragover');
    });

    $('#fileUploader').on('dragleave', (event: any) => {
      $(event.currentTarget).removeClass('is-dragover');
    });

    $('#uploadButton').on('click', () => {
      this.uploadFile();
    });
  }

  // Annuler la sélection
  cancelSelection(): void {
    this.selectedFile = null;
    $('#fileName').text('');
    this.showUploadButtons = false;
    $('#uploadMessage').text('');
  }

  // Démarrer le processus d'upload
  uploadFile(): void {
    if (this.selectedFile) {
      // Start the upload process
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            $('#uploadMessage').text(`Uploading... ${progress}%`);
          } else if (event.type === HttpEventType.Response) {
            this.showUploadButtons = false;
            $('#uploadMessage').text(this.translate.instant('UPLOAD_SUCCESS'));

            // Show the upload message for 10 seconds
            setTimeout(() => {
              $('#fileName').text('');
              $('#uploadMessage').text('');
            }, 5000);

          }
        },
        (error: any) => {
          $('#uploadMessage').text(this.translate.instant('UPLOAD_FAILED'));
          console.error(error);
        }
      );

      // Show the progress for 5 seconds after the upload starts
      setTimeout(() => {
        $('#uploadMessage').text('');
      }, 5000);
    } else {
      $('#uploadMessage').text(this.translate.instant('NO_FILE_SELECTED'));
    }
  }

}
