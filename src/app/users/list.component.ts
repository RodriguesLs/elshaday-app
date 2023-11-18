import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: any[];

    constructor(
        private accountService: AccountService,
        private router: Router
    ) {}

    ngOnInit() {
        const currentUser: any = JSON.parse(localStorage.getItem('user') || "{}");

        if (currentUser?.role !== 0) this.router.navigateByUrl('/people');

        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    inactiveUser(id: string) {
        if (window.confirm("Você realmente deseja desativar este usuário?")) {
            const user = this.users!.find(x => x.id === id);
            user.isDeleting = true;
            this.accountService.inactiveUser(id)
                .subscribe(() => this.users = this.users!.filter(x => x.id !== id));
        }
    }
}