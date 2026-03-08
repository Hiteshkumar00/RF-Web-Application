import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private sidebarVisibleSource = new BehaviorSubject<boolean>(false);
    sidebarVisible$ = this.sidebarVisibleSource.asObservable();

    toggleSidebar(): void {
        this.sidebarVisibleSource.next(!this.sidebarVisibleSource.value);
    }

    setSidebarVisible(visible: boolean): void {
        this.sidebarVisibleSource.next(visible);
    }
}
