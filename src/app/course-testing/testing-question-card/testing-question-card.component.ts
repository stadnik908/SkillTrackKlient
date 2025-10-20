import {Component, Input, OnInit} from '@angular/core';
import {TestingQuestionService} from "../testing-question.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertService} from "../../alert/alert.service";
import {TestingQuestionAnswerService} from "../testing-question-answer.service";
import {
	TestingQuestionAnswerCardComponent
} from "../testing-question-answer-card/testing-question-answer-card.component";

@Component({
	selector: 'app-testing-question-card',
	imports: [
		ReactiveFormsModule,
		TestingQuestionAnswerCardComponent
	],
	templateUrl: './testing-question-card.component.html',
	standalone: true
})

export class TestingQuestionCardComponent implements OnInit {

	@Input() question: any;
	questionFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
	})
	answerFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		score: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(10)]),
	})

	constructor(
		private alert: AlertService,
		private questionService: TestingQuestionService,
		private answerService: TestingQuestionAnswerService,
	) {
	}

	get answers() {
		return this.question.answers;
	}

	ngOnInit(): void {
		this.questionFormGroup.setValue({
			name: this.question.name,
		})
	}

	update() {
		this.questionService.update(this.question.id, this.questionFormGroup.value).subscribe({
			next: (res: any) => this.question = res.data,
			error: (e: any) => this.error(e)
		})
	}

	questionDelete() {
		this.questionService.delete(this.question.id).subscribe({
			next: () => {
				this.alert.showAlertMessage('Вопрос удален');
				// здесь можно, например, уведомить родителя, чтобы убрать карточку из списка
			},
			error: (e: any) => this.error(e)
		});
	}

	answerSave() {
		this.answerService.save(this.answerFormGroup.value, this.question.id).subscribe({
			next: (res: any) => {
				this.answers.push(res.data)
				this.answerFormGroup.reset()
			},
			error: (e: any) => this.error(e)
		})
	}

	answerDelete(id: number) {
		this.answerService.delete(id).subscribe({
			next: () => {
				let answers = this.answers;
				answers = answers.filter((i: any) => i.id !== id)
				this.question.answers = answers;
			},
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
