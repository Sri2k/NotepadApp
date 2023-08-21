import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { stickyNote } from '../interfaces/stickynote.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StickyJsonService {


  backendurl = environment.apiUrl;
  constructor(private httpClient:HttpClient) {

   }

  getUserNotes():Observable<stickyNote[]>{
    return this.httpClient.get<stickyNote[]>(this.backendurl+"?_sort=id&_order=desc");
  }

  addUserNotes(newNote:stickyNote):Observable<any>{
    return this.httpClient.post<stickyNote>(this.backendurl,newNote);

  }

  // updateUserNotes(updatedNote:stickyNote):Observable<any>{
  //   return this.httpClient.put<stickyNote>(this.backendurl+'/'+updatedNote.id,updatedNote)
  // }

  updateUserNotes(updatedNote: stickyNote): Observable<any> {
    return this.httpClient.put<stickyNote>(`${this.backendurl}/${updatedNote.id}`, updatedNote);
  }

  deleteUserNotes(deleteNote:number):Observable<any>{
    return this.httpClient.delete(this.backendurl+'/'+deleteNote);
  }
}
