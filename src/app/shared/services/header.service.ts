import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private logoSource = new BehaviorSubject<string>('https://in.pinterest.com/3c72e245-74bc-4781-99b8-8058937628ca');
    private titleSource = new BehaviorSubject<string>('RF Application');

    logo$ = this.logoSource.asObservable();
    title$ = this.titleSource.asObservable();

    setLogo(url: string) {
        this.logoSource.next(url);
    }

    setTitle(title: string) {
        this.titleSource.next(title);
    }
}
