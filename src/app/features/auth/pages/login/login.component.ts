import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AppFacade } from '../../../../core/facades/app.facade';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatErrorMessagesDirective,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastSrv = inject(ToastService);
  private facade = inject(AppFacade);
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.facade.isAuthenticated()) {
      this.facade.logout();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.facade.showLoading();

    this.facade.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.toastSrv.onShowOk('Login realizado com sucesso!');
        this.facade.closeLoading();
      },
      error: (_) => {
        this.facade.closeLoading();
        this.toastSrv.onShowError(
          'Erro ao fazer login. Verifique suas credenciais.',
        );
      },
    });
  }
}
