import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../shared/services/conversation.service';
import { welcomeDialog } from '../shared/dialogs/welcome.dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly conversationService: ConversationService = inject(ConversationService);

  form: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.registerFirstEntrance();
  }

  submitForm() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    localStorage.setItem('name', this.form.get('name')?.value);

    this.router.navigate(['/upload']);
  }

  registerFirstEntrance() {
    if (localStorage.getItem('firstEntrance')) return;
    localStorage.setItem('firstEntrance', 'false');
    this.conversationService.startDialogue(welcomeDialog);
  }

  initForm() {
    this.form = this.fb.group({
      name: [localStorage.getItem('name') || '', Validators.required],
      tyc: [false, Validators.required]
    });
  }


}
