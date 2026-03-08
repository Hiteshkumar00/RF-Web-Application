import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
    private messages$ = new BehaviorSubject<string[]>([]);
    private visible$ = new BehaviorSubject<boolean>(false);

    readonly messages = this.messages$.asObservable();
    readonly visible = this.visible$.asObservable();

    show(rawMessage: string): void {
        const msgs = rawMessage
            .split('|')
            .map(m => m.trim())
            .filter(m => m.length > 0);
        this.messages$.next(msgs);
        this.visible$.next(true);
    }

    close(): void {
        this.visible$.next(false);
        this.messages$.next([]);
    }
}
