import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppFacade } from './core/facades/app.facade';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MenuComponent } from './shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoadingComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  showPreload = false;
  isAuthenticated = false;
  isCollapsed = false;

  private readonly facade = inject(AppFacade);
  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.facade.appState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      this.showPreload = state.isLoading;
      this.isCollapsed = state.isCollapsed;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
