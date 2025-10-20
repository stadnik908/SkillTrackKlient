import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {CourseService} from "../course.service";
import {DepartmentService} from "../../department/department.service";

@Component({
	selector: 'app-course-update',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './course-update.component.html',
	standalone: true
})

export class CourseUpdateComponent implements OnInit {

	id: number = 0;

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
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit(): void {
		if (this.global.role !== 'METHOD') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.id = param['id'];
			this.courseService.find(param['id']).subscribe({
				next: (res: any) => {
					this.courseFormGroup.setValue({
						name: res.data.name,
					})
					this.departmentId = res.data.departmentId;
				},
				error: (e: any) => {
					console.log(e.error)
					if (e.error.code === 404) {
						this.router.navigate(['/error'], {queryParams: {message: e.error.message}});
					} else {
						this.router.navigate(['/login']);
					}
				}
			})
		})

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

	update() {
		this.courseService.update(this.id, this.courseFormGroup.value, this.departmentId)
	}

}
