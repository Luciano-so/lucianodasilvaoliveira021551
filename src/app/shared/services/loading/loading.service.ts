import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LoadingState {
  show: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCounter = 0;
  private stateSubject = new BehaviorSubject<LoadingState>({ show: false });

  state$ = this.stateSubject.asObservable();
  isLoading$ = this.state$.pipe(map((state) => state.show));

  show(): void {
    this.loadingCounter++;
    this.updateLoadingState();
  }

  hide(): void {
    this.forceHide();
  }

  close(): void {
    if (this.loadingCounter > 0) {
      this.loadingCounter--;
    }
    this.updateLoadingState();
  }

  forceHide(): void {
    this.loadingCounter = 0;
    this.updateLoadingState();
  }

  get isLoading(): boolean {
    return this.stateSubject.value.show;
  }

  private updateLoadingState(): void {
    const show = this.loadingCounter > 0;
    this.stateSubject.next({ show });
  }
}
