import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { DepartmentService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    departments?: any[];

    constructor(private departmentService: DepartmentService) {}

    ngOnInit() {
        this.departmentService.getAll()
            .pipe(first())
            .subscribe(departments => this.departments = departments);
    }

    // deleteUser(id: string) {
    //     const user = this.departments!.find(x => x.id === id);
    //     user.isDeleting = true;
    //     this.departmentService.delete(id)
    //         .pipe(first())
    //         .subscribe(() => this.departments = this.departments!.filter(x => x.id !== id));
    // }
}