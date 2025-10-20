import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {CourseFeedbackService} from "./course-feedback.service";
import {AlertService} from "../alert/alert.service";
import {NavigateDirective} from "../navigate.directive";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
	selector: 'app-course-feedback',
	imports: [
		NavigateDirective,
		NgIf,
		FormsModule,
	],
	templateUrl: './course-feedback.component.html',
	standalone: true
})

export class CourseFeedbackComponent implements OnInit {

	id: number = 0;

	feedbacks: any[] = [];

	text: string = '';

	constructor(
		private router: Router,
		private global: GlobalService,
		private feedbackService: CourseFeedbackService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.id = param['id'];
			this.feedbackService.findAll(param['id']).subscribe({
				next: (res: any) => this.feedbacks = res.data,
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

	save() {
		this.feedbackService.save(this.text, this.id).subscribe({
			next: (res: any) => {
				this.feedbacks.unshift(res.data)
				this.text = '';
			},
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
