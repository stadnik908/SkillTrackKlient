import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../global.service";
import {DepartmentCompetenceService} from "./department-competence.service";
import {DepartmentService} from "../department/department.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {DepartmentCompetenceCardComponent} from "./department-competence-card/department-competence-card.component";
import {Router} from "@angular/router";

@Component({
	selector: 'app-department-competence',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgIf,
		DepartmentCompetenceCardComponent
	],
	templateUrl: './department-competence.component.html',
	standalone: true,
})

export class DepartmentCompetenceComponent implements OnInit {

	departments: any[] = [];
	departmentId: number = 0;

	competences: any[] = [];

	competenceFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
	})

	constructor(
		private global: GlobalService,
		private service: DepartmentCompetenceService,
		private departmentService: DepartmentService,
		private router: Router,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'ADMIN' && this.role !== 'LEAD') this.router.navigate(['/login']);


		this.departmentService.departmentSubject.subscribe(value => {
			this.departments = value.departments;
		})
		this.departmentService.findAll();

		this.service.competenceSubject.subscribe(value => {
			this.competences = value.competences;
		})

		this.competences = [];

		if (this.role === 'LEAD') {
			this.departmentId = Number(this.global.departmentId);
			if (this.departmentId != 0) this.service.findAll(this.departmentId);
		}

	}

	changeDepartmentId(event: any) {
		this.departmentId = event.target.value;
		if (this.departmentId != 0) this.service.findAll(this.departmentId);
	}

	save() {
		this.service.save(this.competenceFormGroup.value, this.departmentId).add(() => {
			this.competenceFormGroup.reset()
		});
	}

}
