import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Pets', icon: 'pets', route: '/pets' },
    { label: 'Tutores', icon: 'people', route: '/tutores' },
  ]);
  private activeMenuItemSubject = new BehaviorSubject<string>('');

  public isCollapsed$ = this.isCollapsedSubject.asObservable();
  public menuItems$ = this.menuItemsSubject.asObservable();
  public activeMenuItem$ = this.activeMenuItemSubject.asObservable();

  toggleMenu(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }

  setCollapsed(collapsed: boolean): void {
    this.isCollapsedSubject.next(collapsed);
  }

  setActiveMenuItem(item: string): void {
    this.activeMenuItemSubject.next(item);
  }

  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  get menuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  get activeMenuItem(): string {
    return this.activeMenuItemSubject.value;
  }
}
