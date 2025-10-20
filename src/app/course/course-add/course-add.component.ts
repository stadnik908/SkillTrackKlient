import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {CourseService} from "../course.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DepartmentService} from "../../department/department.service";

@Component({
	selector: 'app-course-add',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './course-add.component.html',
	standalone: true
})

export class CourseAddComponent implements OnInit {

	courseFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
	})

	departments: any[] = [];
	departmentId: number = 0;

	constructor(
		private router: Router,
		private global: GlobalService,
		private courseService: CourseService,
		private departmentService: DepartmentService,
	) {
	}

	ngOnInit(): void {
		if (this.global.role !== 'METHOD') this.router.navigate(['/login']);

		this.departmentService.departmentSubject.subscribe(value => {
			this.departments = value.departments;
		})
		this.departmentService.findAll();
	}

	changeDepartmentId(event: any) {
		this.departmentId = event.target.value;
	}

	checkSubmit(): boolean {
		if (this.courseFormGroup.invalid) return false;
		if (this.departmentId === 0) return false;
		return true;
	}

	save() {
		this.courseService.save(this.courseFormGroup.value, this.departmentId)
	}

}
