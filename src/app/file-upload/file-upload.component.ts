import { Component, AfterViewInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

interface FileWithMetadata {
  file: File;
  isAcceptedManuscript: string;
  selectedLicense: string;
  comments: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements AfterViewInit {
  selectedFiles: File[] = [];
  filesWithMetadata: FileWithMetadata[] = [];
  showUploadButtons: boolean = false;
  showPopup: boolean = false;
  currentFileIndex: number = 0;
  
  // Données du formulaire popup pour le fichier actuel
  isAcceptedManuscript: string = '';
  selectedLicense: string = '';
  comments: string = '';

  constructor(private fileUploadService: FileUploadService, private translate: TranslateService) {}

  ngAfterViewInit() {
    // Gestion de la sélection de fichiers via l'input classique
    document.getElementById('fileInput')?.addEventListener('change', (event: any) => {
      const files = Array.from(event.target.files) as File[];
      if (files.length > 0) {
        this.selectedFiles.push(...files);
        this.showUploadButtons = true;
      }
      // Réinitialiser l'input pour permettre de sélectionner les mêmes fichiers
      event.target.value = '';
    });

    // Permettre le drag-and-drop
    const fileUploader = document.getElementById('fileUploader');

    if (fileUploader) {
      // Ajout de l'événement 'dragover'
      fileUploader.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileUploader.classList.add('is-dragover');
      });

      // Ajout de l'événement 'dragleave'
      fileUploader.addEventListener('dragleave', () => {
        fileUploader.classList.remove('is-dragover');
      });

      // Ajout de l'événement 'drop'
      fileUploader.addEventListener('drop', (event: any) => {
        event.preventDefault();
        fileUploader.classList.remove('is-dragover');

        const files = Array.from(event.dataTransfer.files) as File[];
        if (files.length > 0) {
          this.selectedFiles.push(...files);
          this.showUploadButtons = true;
        }
      });
    }
  }

  getCurrentFile(): File | null {
    return this.selectedFiles[this.currentFileIndex] || null;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    
    if (this.selectedFiles.length === 0) {
      this.showUploadButtons = false;
      this.showPopup = false;
      this.filesWithMetadata = [];
    }
  }

  closePopup(): void {
    this.showPopup = false;
    this.currentFileIndex = 0;
    this.filesWithMetadata = [];
    this.resetForm();
  }

  resetForm(): void {
    this.isAcceptedManuscript = '';
    this.selectedLicense = '';
    this.comments = '';
  }

  // Méthode appelée quand l'utilisateur clique sur le bouton d'envoi
  startUploadProcess(): void {
    if (this.selectedFiles.length === 0) {
      document.getElementById('uploadMessage')!.textContent = 
        this.translate.instant('NO_FILE_SELECTED');
      return;
    }
    
    // Commencer le processus avec le premier fichier
    this.currentFileIndex = 0;
    this.filesWithMetadata = [];
    this.showPopup = true;
  }

  submitPopup(): void {
    // Validation des champs obligatoires
    if (!this.isAcceptedManuscript || !this.selectedLicense) {
      alert(this.translate.instant('REQUIRED_FIELDS'));
      return;
    }

    // Sauvegarder les métadonnées pour le fichier actuel
    this.filesWithMetadata.push({
      file: this.selectedFiles[this.currentFileIndex],
      isAcceptedManuscript: this.isAcceptedManuscript,
      selectedLicense: this.selectedLicense,
      comments: this.comments
    });

    // Réinitialiser le formulaire
    this.resetForm();

    // Passer au fichier suivant ou terminer
    this.currentFileIndex++;
    
    if (this.currentFileIndex < this.selectedFiles.length) {
      // Il y a encore des fichiers, continuer avec le suivant
      this.showPopup = true;
    } else {
      // Tous les fichiers ont leurs métadonnées, procéder à l'upload
      this.showPopup = false;
      this.uploadFiles();
    }
  }

  isFormValid(): boolean {
    return !!this.isAcceptedManuscript && !!this.selectedLicense;
  }


  cancelSelection(): void {
    this.selectedFiles = [];
    this.filesWithMetadata = [];
    this.showUploadButtons = false;
    this.showPopup = false;
    this.currentFileIndex = 0;
    this.resetForm();
  }

  uploadFiles(): void {
    if (this.filesWithMetadata.length > 0) {
      let completedUploads = 0;
      const totalFiles = this.filesWithMetadata.length;

      this.filesWithMetadata.forEach((fileData, index) => {
        const metadata = {
            isAcceptedManuscript: fileData.isAcceptedManuscript, 
            license: fileData.selectedLicense,
            comments: fileData.comments
          };


        this.fileUploadService.uploadFile(fileData.file, metadata).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              const progress = Math.round((100 * event.loaded) / event.total);
              document.getElementById('uploadMessage')!.textContent = 
                `${this.translate.instant('UPLOADING')} ${index + 1}/${totalFiles}... ${progress}%`;
            } else if (event.type === HttpEventType.Response) {
              completedUploads++;
              if (completedUploads === totalFiles) {
                this.showUploadButtons = false;
                document.getElementById('uploadMessage')!.textContent = 
                  this.translate.instant('UPLOAD_SUCCESS');
                this.selectedFiles = [];
                this.filesWithMetadata = [];
              }
            }
          },
          (error: any) => {
            document.getElementById('uploadMessage')!.textContent = 
              this.translate.instant('UPLOAD_FAILED');
            console.error(error);
          }
        );
      });
    } else {
      document.getElementById('uploadMessage')!.textContent = 
        this.translate.instant('NO_FILE_SELECTED');
    }
  }
}