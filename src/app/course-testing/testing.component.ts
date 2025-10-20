import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../navigate.directive";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";
import {TestingService} from "./testing.service";
import {TestingQuestionService} from "./testing-question.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TestingQuestionCardComponent} from "./testing-question-card/testing-question-card.component";

@Component({
	selector: 'app-testing',
	imports: [
		NavigateDirective,
		NgIf,
		ReactiveFormsModule,
		TestingQuestionCardComponent,
	],
	templateUrl: './testing.component.html',
	standalone: true
})

export class TestingComponent implements OnInit {

	testing: any = {
		name: '',
	};
	questionFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
	})
	score: Map<number, number> = new Map();

	constructor(
		private router: Router,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
		private testingService: TestingService,
		private questionService: TestingQuestionService,
	) {
	}

	get questions() {
		return this.testing.questions;
	}

	get checks(): any[] {
		switch (this.role) {
			case 'METHOD' :
				return this.testing.checks;
			case 'EMPLOYEE':
				return this.testing.checks.filter((i: any) => i.employeeId === this.userid);
			default:
				return [];
		}
	}

	get testingCheck(): boolean {
		for (let i of this.testing.checks) if (i.employeeId === this.userid) return false
		return true;
	}

	get role() {
		return this.global.role;
	}

	get userid() {
		return this.global.userid;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.testingService.find(param['id']).subscribe({
				next: (res: any) => this.testing = res.data,
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
	}

	delete() {
		this.testingService.delete(this.testing.id, this.testing.courseId);
	}

	questionSave() {
		this.questionService.save(this.questionFormGroup.value, this.testing.id).subscribe({
			next: (res: any) => {
				this.questions.push(res.data)
				this.questionFormGroup.reset()
			},
			error: (e: any) => this.error(e)
		})
	}

	questionDelete(id: number) {
		this.questionService.delete(id).subscribe({
			next: () => {
				let questions = this.questions;
				questions = questions.filter((i: any) => i.id !== id)
				this.testing.questions = questions;
			},
			error: (e: any) => this.error(e)
		})
	}

	changeScore(event: any) {
		let numbers = event.target.value.split("|");
		let key = parseInt(numbers[0], 10);
		let value = parseInt(numbers[1], 10);
		this.score.set(key, value);
		console.log(this.score)
	}

	checkSave() {
		let res: number = 0;

		this.score.forEach((value, key) => {
			res += value;
		});

		this.testingService.checkSave(res, this.testing.id).subscribe({
			next: (res: any) => this.testing.checks.unshift(res.data),
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
