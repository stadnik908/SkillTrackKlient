import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../navigate.directive";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";
import {LessonService} from "./lesson.service";

@Component({
	selector: 'app-lesson',
	imports: [
		NavigateDirective,
		NgIf
	],
	templateUrl: './lesson.component.html',
	standalone: true
})

export class LessonComponent implements OnInit {

	lesson: any = {
		name: '',
	};

	constructor(
		private router: Router,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
		private lessonService: LessonService,
	) {
	}

	get lessonCheck(): boolean {
		for (let i of this.lesson.checks) if (i.employeeId === this.global.userid) return false
		return true;
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.lessonService.find(param['id']).subscribe({
				next: (res: any) => this.lesson = res.data,
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
		this.lessonService.delete(this.lesson.id, this.lesson.courseId);
	}

	checkSave() {
		this.lessonService.checkSave(this.lesson.id).subscribe({
			next: (res: any) => this.lesson.checks.unshift(res.data),
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
