import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { ForgotPassword } from './forgot-password.component';
import { ChangePassword } from './change-password.component';
import { AuthGuard } from '@app/_helpers';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListComponent, canActivate: [AuthGuard] },
            { path: 'add', component: AddEditComponent, canActivate: [AuthGuard] },
            { path: 'edit/:id', component: AddEditComponent, canActivate: [AuthGuard] },
            { path: 'recovery-password/:token', component: ForgotPassword },
            { path: 'change-password', component: ChangePassword, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }