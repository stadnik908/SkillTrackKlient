import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {CourseService} from "../course.service";
import {NavigateDirective} from "../../navigate.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../alert/alert.service";

@Component({
	selector: 'app-course-page',
	imports: [
		NavigateDirective,
		ReactiveFormsModule,
		NgIf
	],
	templateUrl: './course-page.component.html',
	standalone: true
})

export class CoursePageComponent implements OnInit {

	course: any = {
		name: '',
	};

	constructor(
		private router: Router,
		private global: GlobalService,
		private courseService: CourseService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
	) {
	}

	get lessons(): any[] {
		return this.course.lessons;
	}

	get homeworks(): any[] {
		return this.course.homeworks;
	}

	get testings(): any[] {
		return this.course.testings;
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE' && this.role !== 'LEAD') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.courseService.find(param['id']).subscribe({
				next: (res: any) => this.course = res.data,
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
		this.courseService.delete(this.course.id);
	}

	updateStatus() {
		this.courseService.updateStatus(this.course.id).subscribe({
			next: (res: any) => this.course = res.data,
			error: (e: any) => this.error(e),
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
