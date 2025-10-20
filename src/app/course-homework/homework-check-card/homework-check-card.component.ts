import {Component, Input} from '@angular/core';
import {GlobalService} from "../../global.service";
import {HomeworkService} from "../homework.service";
import {NgIf} from "@angular/common";
import {AlertService} from "../../alert/alert.service";
import {FormsModule} from "@angular/forms";

@Component({
	selector: 'app-homework-check-card',
	imports: [
		NgIf,
		FormsModule
	],
	templateUrl: './homework-check-card.component.html',
	standalone: true
})

export class HomeworkCheckCardComponent {

	@Input() check: any;

	score: any = null;

	constructor(
		private global: GlobalService,
		private homeworkService: HomeworkService,
		private alert: AlertService,
	) {
	}

	get role() {
		return this.global.role;
	}

	updateScore() {
		this.homeworkService.checkUpdateScore(this.check.id, this.score).subscribe({
			next: (res: any) => this.check = res.data,
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
