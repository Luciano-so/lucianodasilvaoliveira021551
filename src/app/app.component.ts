import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AppFacade } from './core/facades/app.facade';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MenuComponent } from './shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoadingComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showPreload = false;
  isCollapsed = false;
  isAuthenticated = false;

  private readonly facade = inject(AppFacade);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.facade.appState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.showPreload = state.isLoading;
        this.isCollapsed = state.isCollapsed;
        this.isAuthenticated = state.isAuthenticated;
        this.cdr.detectChanges();
      });
  }
}
