import {Component, Input, OnInit} from '@angular/core';
import {DepartmentService} from "../department.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
	selector: 'app-department-card',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './department-card.component.html',
	standalone: true
})

export class DepartmentCardComponent implements OnInit {

	@Input() department: any;

	departmentFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]),
	})

	constructor(
		private departmentService: DepartmentService
	) {
	}

	ngOnInit(): void {
		this.departmentFormGroup.setValue({
			name: this.department.name,
			description: this.department.description,
		})
	}

	update() {
		this.departmentService.update(this.department.id, this.departmentFormGroup.value);
	}

	delete() {
		this.departmentService.delete(this.department.id);
	}

}
