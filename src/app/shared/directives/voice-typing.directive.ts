import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
  OnInit,
  HostBinding,
  Optional
} from '@angular/core';
import { VoiceTypingComponent } from '../components/voice-typing/voice-typing.component';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appVoiceTyping]',
  standalone: false
})
export class VoiceTypingDirective implements OnInit, OnDestroy {
  private micIcon: HTMLElement | null = null;
  private popupRef: ComponentRef<VoiceTypingComponent> | null = null;
  private wrapperDiv: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    @Optional() private ngControl: NgControl
  ) {}

  ngOnInit() {
    // Create the floating mic button container
    this.micIcon = this.renderer.createElement('button');
    this.renderer.addClass(this.micIcon, 'p-button');
    this.renderer.addClass(this.micIcon, 'p-component');
    this.renderer.addClass(this.micIcon, 'p-button-rounded');
    this.renderer.addClass(this.micIcon, 'p-button-primary');
    this.renderer.addClass(this.micIcon, 'p-button-icon-only');
    
    // Style as an incredibly attractive Floating Action Button
    this.renderer.setStyle(this.micIcon, 'position', 'fixed');
    this.renderer.setStyle(this.micIcon, 'bottom', '30px');
    this.renderer.setStyle(this.micIcon, 'right', '30px');
    this.renderer.setStyle(this.micIcon, 'width', '4rem');
    this.renderer.setStyle(this.micIcon, 'height', '4rem');
    this.renderer.setStyle(this.micIcon, 'border-radius', '50%');
    this.renderer.setStyle(this.micIcon, 'background', 'linear-gradient(135deg, var(--primary-400, #60A5FA), var(--primary-700, #1D4ED8))');
    this.renderer.setStyle(this.micIcon, 'color', 'white');
    this.renderer.setStyle(this.micIcon, 'border', 'none');
    this.renderer.setStyle(this.micIcon, 'box-shadow', '0 8px 16px rgba(29, 78, 216, 0.3), 0 0 0 0 rgba(29, 78, 216, 0.4)');
    this.renderer.setStyle(this.micIcon, 'z-index', '9999');
    this.renderer.setStyle(this.micIcon, 'display', 'none'); // Hidden by default
    this.renderer.setStyle(this.micIcon, 'justify-content', 'center');
    this.renderer.setStyle(this.micIcon, 'align-items', 'center');
    this.renderer.setStyle(this.micIcon, 'transition', 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)');
    
    // Inject keyframes for a continuous subtle pulse effect
    if (!document.getElementById('voice-typing-fab-styles')) {
      const style = document.createElement('style');
      style.id = 'voice-typing-fab-styles';
      style.innerHTML = `
        @keyframes fabPulse {
          0% { box-shadow: 0 8px 16px rgba(29, 78, 216, 0.3), 0 0 0 0 rgba(29, 78, 216, 0.4); }
          70% { box-shadow: 0 8px 16px rgba(29, 78, 216, 0.3), 0 0 0 15px rgba(29, 78, 216, 0); }
          100% { box-shadow: 0 8px 16px rgba(29, 78, 216, 0.3), 0 0 0 0 rgba(29, 78, 216, 0); }
        }
        .voice-typing-fab-active {
          animation: fabPulse 2s infinite;
        }
      `;
      document.head.appendChild(style);
    }
    
    this.renderer.addClass(this.micIcon, 'voice-typing-fab-active');

    // Create the inner icon
    const iconElement = this.renderer.createElement('span');
    this.renderer.addClass(iconElement, 'pi');
    this.renderer.addClass(iconElement, 'pi-microphone');
    this.renderer.setStyle(iconElement, 'font-size', '1.8rem');
    this.renderer.appendChild(this.micIcon, iconElement);

    // Add hover effect
    this.renderer.listen(this.micIcon, 'mouseenter', () => {
       this.renderer.setStyle(this.micIcon, 'transform', 'scale(1.1)');
       this.renderer.setStyle(this.micIcon, 'box-shadow', '0 6px 14px rgba(0,0,0,0.4)');
    });
    this.renderer.listen(this.micIcon, 'mouseleave', () => {
       this.renderer.setStyle(this.micIcon, 'transform', 'scale(1)');
       this.renderer.setStyle(this.micIcon, 'box-shadow', '0 4px 10px rgba(0,0,0,0.3)');
    });

    // Append directly to the body so it's always positioned relative to the screen
    this.renderer.appendChild(document.body, this.micIcon);

    // Listen to click on mic icon
    this.renderer.listen(this.micIcon, 'click', (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      this.openPopup();
    });
  }

  @HostListener('focusin')
  onFocus() {
    if (this.micIcon) {
      this.renderer.setStyle(this.micIcon, 'display', 'flex');
    }
  }

  // We don't hide immediately on blur because the user might be clicking the icon.
  // Instead, we use a timeout or listen to document clicks if needed.
  // But wait, the prompt says "when my input box is active then in bottom right I can see one icon".
  // If we just keep it visible when there's text or when focused.
  @HostListener('focusout', ['$event'])
  onBlur(event: FocusEvent) {
    // Only hide if the related target isn't the mic icon
    setTimeout(() => {
      // If the popup is open, don't hide the icon
      if (this.popupRef && this.popupRef.instance.isOpen) {
        return;
      }
      if (this.micIcon) {
        this.renderer.setStyle(this.micIcon, 'display', 'none');
      }
    }, 200);
  }

  openPopup() {
    // If popup already exists, just open it
    if (!this.popupRef) {
      this.popupRef = this.viewContainerRef.createComponent(VoiceTypingComponent);
      
      this.popupRef.instance.onApply.subscribe((text: string) => {
        this.applyTextToInput(text);
      });

      this.popupRef.instance.onClose.subscribe(() => {
        // When popup closes, we evaluate if we should show the mic icon again.
        // If the original input is still focused, we show it. Otherwise, keep it hidden.
        if (document.activeElement === this.el.nativeElement) {
           if (this.micIcon) {
               this.renderer.setStyle(this.micIcon, 'display', 'flex');
           }
        }
      });
    }

    this.popupRef.instance.openPopup();
    
    // Hide the floating button while the popup is open
    if (this.micIcon) {
      this.renderer.setStyle(this.micIcon, 'display', 'none');
    }
  }

  private applyTextToInput(text: string) {
    if (!text) return;
    
    const nativeElement = this.el.nativeElement;
    
    // Append the text or replace? The prompt says "whatever I will write it will be when I click it will be pest and in my input box"
    // Usually, we append to existing text with a space.
    const currentVal = (this.ngControl && this.ngControl.control ? this.ngControl.control.value : nativeElement.value) || '';
    
    // For object values (like in autocomplete), we might need special handling, but usually voice typing provides strings.
    // If it's a string, we append.
    let newVal;
    if (typeof currentVal === 'string') {
      newVal = currentVal ? currentVal + ' ' + text : text;
    } else if (currentVal && typeof currentVal === 'object' && currentVal.itemName) {
      // Very specific fallback for autocomplete objects
      newVal = currentVal.itemName + ' ' + text;
    } else {
      newVal = text;
    }
    
    nativeElement.value = newVal;

    // Trigger input event to update model if using ngModel / reactive forms
    nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(newVal);
      this.ngControl.control.markAsDirty();
      this.ngControl.control.updateValueAndValidity();
    }
    
    // Refocus the input
    nativeElement.focus();
  }

  ngOnDestroy() {
    if (this.micIcon && this.micIcon.parentNode) {
      this.micIcon.parentNode.removeChild(this.micIcon);
    }
    if (this.popupRef) {
      this.popupRef.destroy();
    }
  }
}
