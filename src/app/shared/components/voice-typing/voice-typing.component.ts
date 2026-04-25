import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-voice-typing',
  standalone: false,
  templateUrl: './voice-typing.component.html',
  styleUrls: ['./voice-typing.component.scss']
})
export class VoiceTypingComponent {
  isOpen = false;
  isListening = false;
  
  finalTranscript = '';
  private lastInterimText = '';
  
  languages = [
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-IN', name: 'English (India)' },
  ];
  selectedLanguage = 'gu-IN'; // Default to Gujarati
  
  private recognition: any;
  private speechTimeout: any;

  @Output() onApply = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      
      this.recognition.onresult = (event: any) => {
        let newFinal = '';
        let newInterim = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            newFinal += event.results[i][0].transcript + ' ';
          } else {
            newInterim += event.results[i][0].transcript;
          }
        }
        
        // If the textarea currently ends with the previous interim text, remove it so we can replace it
        if (this.lastInterimText && this.finalTranscript.endsWith(this.lastInterimText)) {
          this.finalTranscript = this.finalTranscript.slice(0, -this.lastInterimText.length);
        }
        
        this.finalTranscript += newFinal + newInterim;
        this.lastInterimText = newInterim;
        
        // Explicitly trigger change detection since this runs outside Angular's standard zone
        this.cdr.detectChanges();

        // Auto-finalize after 2 seconds of silence
        clearTimeout(this.speechTimeout);
        if (this.lastInterimText) {
          this.speechTimeout = setTimeout(() => {
             this.forceFinalize();
          }, 2000);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        // Don't stop entirely on no-speech, just reset
        if (event.error !== 'no-speech') {
           this.isListening = false;
        }
      };

      this.recognition.onend = () => {
        // If it ended automatically but we still want to be listening
        if (this.isListening) {
           try {
             this.recognition.start();
           } catch(e) {}
        }
      };
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }
  }

  forceFinalize() {
    if (this.lastInterimText) {
      // It's already inside finalTranscript. Lock it in.
      if (!this.finalTranscript.endsWith(' ')) {
        this.finalTranscript += ' ';
      }
      this.lastInterimText = '';
      
      // Restart to flush the engine state
      if (this.isListening) {
        this.recognition.stop();
        // It will auto-restart via onend handler
      }
    }
  }

  openPopup() {
    this.isOpen = true;
    this.isListening = false;
    this.finalTranscript = '';
    this.lastInterimText = '';
  }

  closePopup() {
    this.stopListening();
    this.isOpen = false;
    this.onClose.emit();
  }

  toggleListen() {
    if (!this.recognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
      try {
        this.recognition.start();
      } catch(e) {}
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      clearTimeout(this.speechTimeout);
      // When stopping, whatever was interim is locked in
      this.lastInterimText = '';
    }
  }

  onLanguageChange() {
    if (this.isListening) {
      this.stopListening();
      setTimeout(() => this.startListening(), 300); // Restart with new language
    }
  }

  clearText() {
    this.finalTranscript = '';
    this.lastInterimText = '';
  }

  applyText() {
    const fullText = this.finalTranscript.trim();
    this.onApply.emit(fullText);
    this.closePopup();
  }
}
