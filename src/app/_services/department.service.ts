import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Department } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private departmentSubject: BehaviorSubject<Department | null>;
    public department: Observable<Department | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.departmentSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('department')!));
        this.department = this.departmentSubject.asObservable();
    }

    public get departmentValue() {
        return this.departmentSubject.value;
    }

    register(department: Department) {
        return this.http.post(`${environment.apiUrl}/api/departments`, department);
    }

    getAll() {
        return this.http.get<Department[]>(`${environment.apiUrl}/api/departments`);
    }

    getEmployees() {
        return this.http.get<any[]>(`${environment.apiUrl}/api/departments/employees`)
    }

    // update(x, y) {};
}
