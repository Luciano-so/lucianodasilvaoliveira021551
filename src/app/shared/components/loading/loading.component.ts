import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingState } from '../../models/shared.model';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() show = false;

  private loadingSrv = inject(LoadingService);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.loadingSrv.state$.subscribe((state: LoadingState) => {
        this.show = state.show;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
