import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPassword implements OnInit {
    form!: FormGroup;
    title!: string;
    token?: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.token = this.route.snapshot.params['token'];

        // form with validation rules
        this.form = this.formBuilder.group({
            newPassword: ['',  [Validators.minLength(6), Validators.required]],
            newPasswordAgain: ['',  [Validators.minLength(6), Validators.required]],
            token: this.token
        });

        this.title = 'Recuperação de senha';
    }

    // convenience getter for easy access to form fields
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
                    this.alertService.success('Nova senha cadastrada!', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/login');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }
}