import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DepartmentCompetenceService} from "../department-competence.service";

@Component({
	selector: 'app-department-competence-card',
	imports: [
		FormsModule,
		ReactiveFormsModule
	],
	templateUrl: './department-competence-card.component.html',
	standalone: true,
})

export class DepartmentCompetenceCardComponent implements OnInit {

	@Input() competence: any;

	competenceFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
	})

	constructor(
		private service: DepartmentCompetenceService
	) {
	}

	ngOnInit(): void {
		this.competenceFormGroup.setValue({
			name: this.competence.name,
		})
	}

	update() {
		this.service.update(this.competence.id, this.competenceFormGroup.value);
	}

	delete() {
		this.service.delete(this.competence.id);
	}

}
