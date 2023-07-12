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
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { HelpComponent } from './components/help/help.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  {
    path: 'sidenav',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'board', component: BoardComponent, },
      { path: 'addTask', component: AddTaskComponent, },
      { path: 'contacts', component: ContactsComponent,  },
      { path: 'legalNotice', component: LegalNoticeComponent,  },
      { path: 'help', component: HelpComponent,  },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
