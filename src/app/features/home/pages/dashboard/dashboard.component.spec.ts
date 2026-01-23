import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct subtitle', () => {
    expect(component.subtitle).toContain('Gerencie seus pets e tutores');
    expect(component.subtitle).toContain('eficiência e carinho');
    expect(component.subtitle).toContain('sob controle em um só lugar');
  });

  it('should render title in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');

    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent).toContain('Pet Manager');
  });

  it('should render subtitle in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitleElement = compiled.querySelector('p');

    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement?.textContent).toContain('Gerencie seus pets');
  });

  it('should have dashboard CSS class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.dashboard')).toBeTruthy();
  });

  it('should have hero section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.dashboard__hero')).toBeTruthy();
    expect(compiled.querySelector('.dashboard__hero-content')).toBeTruthy();
  });

  it('should display icon in title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const iconElement = compiled.querySelector('mat-icon');

    expect(iconElement).toBeTruthy();
    expect(iconElement?.textContent).toBe('dashboard');
  });
});
