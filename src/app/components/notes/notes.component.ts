import { Component } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  userData: any[] = [];
  formData: any;
  editing: boolean = false; // Added editing flag
  noteId: number | undefined; // Added noteId variable
  recognition: any;
  isListening!: boolean;
  transcript!: string;
  isProcessing: boolean = false;
  successMessage:any;
  fontSize: number = 16;
}
