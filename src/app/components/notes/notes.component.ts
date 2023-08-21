import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { stickyNote } from 'src/app/interfaces/stickynote.model';
import { StickyJsonService } from 'src/app/services/sticky-json.service';

declare const webkitSpeechRecognition: any;


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


  constructor(private stickyService: StickyJsonService, private fb: FormBuilder) {
    this.formData = this.fb.group({
      title: ['', Validators.required], // Added required validator for title
      content: ['', Validators.required] // Added required validator for content
    
    });
    this.recognition = new webkitSpeechRecognition();
    this.isListening = false;
    this.transcript = '';
    
  }

  toggleListening(): void {
    if (this.isListening) {
      this.recognition.stop();

      this.isListening = false;

    } else {
      this.recognition.start();
      this.isListening = true;
      this.isProcessing = true; // Set the flag to indicate processing
    }
  }
  


  
  clearAllTranscript(): void {
    // this.transcript = ''; // Clear the transcript
    this.formData.patchValue({ content: '' });

  }

  ngOnInit(): void {
    this.getUserData();
    this.speechRecognition();
    
  }

  getUserData() {
    this.stickyService.getUserNotes().subscribe({
      next: (userServerData) => {
        this.userData = userServerData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  speechRecognition(){
    this.recognition.addEventListener('result', (event: any) => {
      let transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      transcript = this.transcript + ' ' + transcript; // Concatenate with previous transcript
      this.transcript = transcript;
      this.formData.patchValue({ content: this.transcript });

    });
    
    // After the event listener, add the following line to reset the flag when processing is complete
    this.recognition.addEventListener('end', () => {
      this.isProcessing = false;
    });
  }


  addNewNote() {
    // if (this.formData.invalid) {
    //   // Display error message
    //   // For simplicity, I'm just logging the error message here, you can modify it to display it in the desired location
    //   console.log('Please fill in all the required fields');
    //   return;
    // }


    if (this.editing) {
      // Perform update operation
      const updatedNote: stickyNote = { ...this.formData.value, id: this.noteId };
      this.stickyService.updateUserNotes(updatedNote).subscribe({
        next: (userServerData) => {
          this.formData.reset(); // Reset the form fields
          this.successMessage = 'Note updated successfully'; // Show success message
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.editing = false; // Reset editing state
    } else {
      // Perform add operation
      if (this.formData.value) {
        const newNote: stickyNote = this.formData.value;
        this.stickyService.addUserNotes(newNote).subscribe({
          next: (userServerData) => {
            this.formData.reset(); // Reset the form fields
            this.successMessage = 'Note saved successfully'; // Show success message
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
  }
  
  newBand(){
    this.formData.patchValue({
      title: '',
      content: ''
    });
    this.editing=false;
  }
  editBand(note: any) {
    this.editing = true; // Set editing state
    this.formData.patchValue({
      title: note.title,
      content: note.content
    });
    this.noteId = note.id; // Save the noteId for the update operation
  }

  deleteBand(noteId: number) {
    this.stickyService.deleteUserNotes(noteId).subscribe({
      next: () => {
        
        this.userData = this.userData.filter((note) => note.id !== noteId);
        this.successMessage = 'Note deleted successfully'; // Show success message
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
}
