import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { PersonService, AlertService, CepService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private personService: PersonService,
        private cepService: CepService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            nickname: ['', Validators.required],
            role: ['', Validators.required],
            personType: ['', Validators.required],
            address: this.formBuilder.group({
                postalCode: ['', Validators.required],
                street: ['', Validators.required],
                neighborhood: ['', Validators.required],
                state: ['', Validators.required]
             }),
            document: ['', Validators.required]
        });

        this.title = 'Adicionar Pessoa';
        if (this.id) {
            // edit mode
            this.title = 'Editar';
            this.loading = true;
            this.personService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    get addressF() {
        return (this.form.get('address') as FormGroup).controls;
    }

    getCep() {
        this.cepService.getAddresByCep(this.form.value.address.postalCode)
            .subscribe({
                next: (resp) => {
                    this.form.patchValue({
                        address: {
                            postalCode: resp.cep,
                            street: resp.logradouro,
                            neighborhood: resp.bairro,
                            state: resp.uf
                        }
                    });
                },
                error: error => {
                    console.log(error);
                }
            });

    }

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
            .subscribe({
                next: () => {
                    this.alertService.success('Cadastrado com sucesso!', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/people');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveUser() {
        // create or update user based on id param
        return this.id
            ? this.personService.update(this.id!, this.form.value)
            : this.personService.register(this.form.value);
    }
}