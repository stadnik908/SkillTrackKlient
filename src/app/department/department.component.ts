import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {DepartmentService} from "./department.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DepartmentCardComponent} from "./department-card/department-card.component";

@Component({
	selector: 'app-department',
	imports: [
		ReactiveFormsModule,
		DepartmentCardComponent
	],
	templateUrl: './department.component.html',
	standalone: true
})

export class DepartmentComponent implements OnInit {

	departments: any[] = [];

	departmentFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]),
	})

	constructor(
		private authService: AuthService,
		private router: Router,
		private global: GlobalService,
		private departmentService: DepartmentService,
	) {
	}

	ngOnInit(): void {
		if (this.global.role !== 'ADMIN') this.router.navigate(['/login']);

		this.departmentService.departmentSubject.subscribe(value => {
			this.departments = value.departments;
		})
		this.departmentService.findAll();
	}

	save() {
		this.departmentService.save(this.departmentFormGroup.value).add(() => {
			this.departmentFormGroup.reset();
		});
	}

}
