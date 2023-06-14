import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// route Guard
import { AuthGuard } from './shared/guard/auth.guard';

// Components
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SummaryComponent } from './components/summary/summary.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BoardComponent } from './components/board/board.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ContactsComponent } from './components/contacts/contacts.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  {
    path: 'sidenav',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'summary', component: SummaryComponent, outlet: 'main' },
      { path: 'board', component: BoardComponent, outlet: 'main' },
      { path: 'addTask', component: AddTaskComponent, outlet: 'main' },
      { path: 'contacts', component: ContactsComponent, outlet: 'main' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
