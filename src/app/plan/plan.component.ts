import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../global.service";
import {PlanService} from "./plan.service";
import {Router} from "@angular/router";
import {DepartmentService} from "../department/department.service";
import {EmployeeService} from "../employee/employee.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CourseService} from "../course/course.service";
import {PlanCardComponent} from "./plan-card/plan-card.component";

@Component({
	selector: 'app-plan',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgIf,
		PlanCardComponent
	],
	templateUrl: './plan.component.html',
	standalone: true,
})

export class PlanComponent implements OnInit {

	plans: any[] = [];

	departments: any[] = [];
	departmentId: number = 0;

	employees: any[] = [];
	userId: number = 0;

	save: number = 0;

	get employeesSorted() {
		let res = this.employees.filter((i: any) => i.role === 'EMPLOYEE');

		res = res.filter((i: any) => i.departmentId == this.departmentId)

		return res;
	}

	constructor(
		private global: GlobalService,
		private service: PlanService,
		private router: Router,
		private departmentService: DepartmentService,
		private employeeService: EmployeeService,
		private courseService: CourseService,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'EMPLOYEE' && this.role !== 'HR' && this.role !== 'LEAD') this.router.navigate(['/login'])

		if (this.role === 'HR') {
			this.departmentService.departmentSubject.subscribe(value => {
				this.departments = value.departments;
			})
			this.departmentService.findAll();
		}

		if (this.role === 'LEAD') {
			this.departmentId = Number(this.global.departmentId);
		}

		if (this.role === 'HR' || this.role === 'LEAD') {
			this.employeeService.employeeSubject.subscribe(value => {
				this.employees = value.employees;
			})
			this.employeeService.findAll();

			this.courseService.courseSubject.subscribe(value => {
				this.courses = value.courses
			})
			this.courseService.findAll();

		}

		this.service.planSubject.subscribe(value => {
			this.plans = value.plans
		})
		this.plans = []

		if (this.role === 'EMPLOYEE') {
			this.userId = this.global.userid;
			this.departmentId = Number(this.global.departmentId);
			this.service.findAll(this.userId);
		}
	}

	changeDepartmentId(event: any) {
		this.departmentId = event.target.value;
	}

	changeUserId(event: any) {
		this.userId = event.target.value;
		this.service.findAll(this.userId);
	}

	// course

	courses: any[] = [];
	courseId: number = 0;

	get coursesSorted() {
		return this.courses.filter((i: any) => i.departmentId == this.departmentId);
	}

	percent: any = null;

	changeCourseId(event: any) {
		this.courseId = event.target.value;
	}

	checkPostCourse(): boolean {
		if (this.courseId == 0) return true;
		if (this.percent < 1) return true;
		if (this.percent > 100) return true;

		return false;
	}

	postCourse() {
		this.service.postCourse(this.courseId, this.percent, this.userId).add(() => {
			this.percent = null;
		})
	}

	// choice and score

	text: string = '';

	// choice

	checkPostChoice(): boolean {
		if (this.text == '') return true;

		return false;
	}

	postChoice() {
		this.service.postChoice(this.text, this.userId).add(() => {
			this.text = '';
		})
	}

	// score

	scoreMin: any = null;

	checkPostScore(): boolean {
		if (this.text == '') return true;
		if (this.scoreMin < 1) return true;
		if (this.scoreMin > 10) return true;

		return false;
	}

	postScore() {
		this.service.postScore(this.text, this.scoreMin, this.userId).add(() => {
			this.text = '';
			this.scoreMin = null;
		})
	}

}
