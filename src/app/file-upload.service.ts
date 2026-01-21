import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:3000/upload'; // URL de ton serveur de téléversement

  constructor(private http: HttpClient) {}

  uploadFile(file: File, metadata?: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Ajout du fichier sélectionné
    
    // Ajout des métadonnées si elles sont fournies
    if (metadata) {
      formData.append('isAcceptedManuscript', metadata.isAcceptedManuscript.toString());
      formData.append('license', metadata.license);
      formData.append('comments', metadata.comments || '');
    }
    //console.log(formData);
    return this.http.post(this.baseUrl, formData, {
      reportProgress: true,
      observe: 'events', // Permet de suivre la progression
    });
  }
}