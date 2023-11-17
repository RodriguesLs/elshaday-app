import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PersonService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    people?: any[];

    constructor(private personService: PersonService) {}

    ngOnInit() {
        this.personService.getAll()
            .pipe(first())
            .subscribe(people => this.people = people);
    }

    deletePerson(id: string) {
        const person = this.people!.find(x => x.id === id);
        person.isDeleting = true;
        this.personService.delete(id)
            .pipe(first())
            .subscribe(() => this.people = this.people!.filter(x => x.id !== id));
    }
}