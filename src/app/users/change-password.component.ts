import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'change-password.component.html' })
export class ChangePassword implements OnInit {
    form!: FormGroup;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        debugger;
        this.form = this.formBuilder.group({
            oldPassword: ['',  [Validators.minLength(6), Validators.required]],
            newPassword: ['',  [Validators.minLength(6), Validators.required]],
            newPasswordAgain: ['',  [Validators.minLength(6), Validators.required]],
            personId: JSON.parse(localStorage.getItem('user') || "{}")?.id
        });

        this.title = 'Alteração de senha';
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if (this.form.value.newPassword != this.form.value.newPasswordAgain) {
            return this.alertService.error('Digite a mesma senha nos dois campos.');
        }

        this.submitting = true;

        this.accountService.changePassword(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Senha alterada!', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/login');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }
}