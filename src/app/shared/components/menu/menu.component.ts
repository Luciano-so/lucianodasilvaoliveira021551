import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppFacade } from '../../../core/facades/app.facade';
import { MenuService } from '../../../shared/services/menu.service';
import { MenuItem } from '../../models/shared.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private facade = inject(AppFacade);
  private menuService = inject(MenuService);
  private destroy$ = new Subject<void>();

  activeMenuItem = '';
  isCollapsed = false;
  isAuthenticated = false;
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.checkScreenSize();
    this.facade.appState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.menuItems = state.menuItems;
      this.isCollapsed = state.isCollapsed;
      this.activeMenuItem = state.activeMenuItem;
      this.isAuthenticated = state.isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth < 768;
    this.menuService.setCollapsed(isSmallScreen);
  }

  onMenuItemClick(route: string): void {
    this.facade.setActiveMenuItem(route);
    this.router.navigate([route]);
  }

  toggleMenu(): void {
    this.facade.toggleMenu();
  }

  logout(): void {
    this.facade.logout();
  }
}
