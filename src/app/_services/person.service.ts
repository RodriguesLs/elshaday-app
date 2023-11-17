import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Person } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PersonService {
    private personSubject: BehaviorSubject<Person | null>;
    public person: Observable<Person | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.personSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('person')!));
        this.person = this.personSubject.asObservable();
    }

    public get personValue() {
        return this.personSubject.value;
    }

    logout() {
        // remove person from local storage and set current person to null
        localStorage.removeItem('person');
        this.personSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(person: Person) {
        return this.http.post(`${environment.apiUrl}/api/people`, person);
    }

    getAll() {
        return this.http.get<Person[]>(`${environment.apiUrl}/api/people`);
    }

    getById(id: string) {
        return this.http.get<Person>(`${environment.apiUrl}/people/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/people/${id}`, params)
            .pipe(map(x => {
                // update stored person if the logged in person updated their own record
                if (id == this.personValue?.id) {
                    // update local storage
                    const person = { ...this.personValue, ...params };
                    localStorage.setItem('person', JSON.stringify(person));

                    // publish updated person to subscribers
                    this.personSubject.next(person);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/people/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in person deleted their own record
                if (id == this.personValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }
}