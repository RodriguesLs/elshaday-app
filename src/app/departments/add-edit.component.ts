import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    responsibles: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.departmentService
            .getEmployees()
            .pipe(first())
            .subscribe(responsibles => this.responsibles = responsibles);

        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            personId: ['', Validators.required]
        });

        // this.title = 'Add User';
        // if (this.id) {
        //     // edit mode
        //     this.title = 'Edit User';
        //     this.loading = true;
        //     this.departmentService.getById(this.id)
        //         .pipe(first())
        //         .subscribe(x => {
        //             this.form.patchValue(x);
        //             this.loading = false;
        //         });
        // }
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

        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Departamento criado!', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/departments');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveUser() {
        // create or update user based on id param
        // return this.id
        //     ? this.departmentService.update(this.id!, this.form.value)
        //     :
            return this.departmentService.register(this.form.value);
    }
}