import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../global.service";
import {DepartmentService} from "../department/department.service";
import {EmployeeService} from "../employee/employee.service";
import {Router} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {DepartmentCompetenceService} from "../department-competence/department-competence.service";
import {MatrixCardComponent} from "./matrix-card/matrix-card.component";
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-matrix',
	imports: [
		ReactiveFormsModule,
		MatrixCardComponent,
		NgIf
	],
	templateUrl: './matrix.component.html',
	standalone: true,
})

export class MatrixComponent implements OnInit {

	departments: any[] = [];
	departmentId: number = 0;

	competences: any[] = [];

	employees: any[] = [];

	get employeesSorted() {
		if (this.departmentId == 0) return [];

		return this.employees.filter((i: any) => i.departmentId == this.departmentId);
	}

	constructor(
		private global: GlobalService,
		private departmentService: DepartmentService,
		private competenceService: DepartmentCompetenceService,
		private employeeService: EmployeeService,
		private router: Router,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'ADMIN' && this.role !== 'LEAD') this.router.navigate(['/login']);

		if (this.role === 'ADMIN') {
			this.departmentService.departmentSubject.subscribe(value => {
				this.departments = value.departments;
			})
			this.departmentService.findAll();
		}

		this.competenceService.competenceSubject.subscribe(value => {
			this.competences = value.competences;
		})
		this.competences = [];

		if (this.role === 'LEAD') {
			this.departmentId = Number(this.global.departmentId);
			this.competenceService.findAll(this.departmentId);
		}

		this.employeeService.employeeSubject.subscribe(value => {
			this.employees = value.employees;
		})
		this.employeeService.findAll();
	}

	changeDepartmentId(event: any) {
		this.departmentId = event.target.value;
		this.competenceService.findAll(this.departmentId);
	}

}
