import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Cep } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CepService {
    private cepSubject: BehaviorSubject<Cep | null>;
    public cep: Observable<Cep | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.cepSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('cep')!));
        this.cep = this.cepSubject.asObservable();
    }

    public get cepValue() {
        return this.cepSubject.value;
    }

    getAddresByCep(cep: string) {
        return this.http.get<Cep>(`${environment.apiUrl}/api/Cep/${cep}`);
    }
}