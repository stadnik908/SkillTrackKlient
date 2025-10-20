import {Component, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EmployeeCompetenceService} from "../employee-competence.service";
import {AlertService} from "../../alert/alert.service";
import {GlobalService} from "../../global.service";
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-employee-competence-card',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgIf
	],
	templateUrl: './employee-competence-card.component.html',
	standalone: true,
})

export class EmployeeCompetenceCardComponent implements OnInit {

	@Input() userId: any;
	@Input() competence: any;

	score: number = 0;

	constructor(
		private service: EmployeeCompetenceService,
		private alert: AlertService,
		private global: GlobalService,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.competence.score !== null && this.competence.score !== undefined) {
			this.score = this.competence.score;
		}
	}

	update() {
		let id = this.competence.competenceId || this.competence.id
		this.service.save(this.userId, this.score, id).subscribe({
			next: (res: any) => {
				this.alert.showAlertMessage('Данные обновлены');
				this.competence = res.data
			},
			error: (e: any) => {
				console.log(e.error)
				this.alert.showAlertMessage(e.error.message)
			}
		})
	}
}
