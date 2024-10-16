import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  form: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  submitForm(){
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    localStorage.setItem('name', this.form.get('name')?.value);
    
    this.router.navigate(['/upload']);
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      tyc: [false, Validators.required]
    });
  }


}
