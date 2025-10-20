import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {EmployeeService} from "./employee.service";
import {NgIf} from "@angular/common";
import {NavigateDirective} from "../navigate.directive";

@Component({
	selector: 'app-employee',
	imports: [
		NgIf,
		NavigateDirective
	],
	templateUrl: './employee.component.html',
	standalone: true
})

export class EmployeeComponent implements OnInit {

	employees: any[] = [];

	get employeesSorted() {
		let res = this.employees;

		if (this.role === 'LEAD') res = res.filter((i: any) => (i.departmentId == this.global.departmentId && i.role === 'EMPLOYEE'));

		return res;
	}

	constructor(
		private router: Router,
		private global: GlobalService,
		private employeeService: EmployeeService,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role === 'USER' || this.role === 'NOT') this.router.navigate(['/login']);

		this.employeeService.employeeSubject.subscribe(value => {
			this.employees = value.employees;
		})
		this.employeeService.findAll()
	}

}
