import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCounter = 0;
  private stateSubject = new BehaviorSubject<boolean>(false);

  state$ = this.stateSubject.asObservable();

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

  private updateLoadingState(): void {
    this.stateSubject.next(this.loadingCounter > 0);
  }
}
