import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/component/loading.component';
import { LoadingService } from './shared/components/loading/service/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected readonly title = signal('pet-manage');
  showPreload = false;

  private readonly loadingService = inject(LoadingService);

  ngOnInit() {
    this.loadingService.state$.subscribe((response: boolean) => {
      setTimeout(() => {
        this.showPreload = response;
      });
    });
  }
}
