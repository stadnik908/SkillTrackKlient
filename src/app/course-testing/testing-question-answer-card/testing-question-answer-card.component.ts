import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TestingQuestionAnswerService} from "../testing-question-answer.service";
import {AlertService} from "../../alert/alert.service";

@Component({
	selector: 'app-testing-question-answer-card',
	imports: [
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: './testing-question-answer-card.component.html',
	standalone: true
})

export class TestingQuestionAnswerCardComponent implements OnInit {

	@Input() answer: any;

	answerFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		score: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(10)]),
	})

	constructor(
		private answerService: TestingQuestionAnswerService,
		private alert: AlertService,
	) {
	}

	ngOnInit(): void {
		this.answerFormGroup.setValue({
			name: this.answer.name,
			score: this.answer.score,
		})
	}

	update() {
		this.answerService.update(this.answer.id, this.answerFormGroup.value).subscribe({
			next: (res: any) => this.answer = res.data,
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
