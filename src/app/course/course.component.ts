import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {CourseService} from "./course.service";
import {NavigateDirective} from "../navigate.directive";
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-course',
	imports: [
		NavigateDirective,
		NgIf
	],
	templateUrl: './course.component.html',
	standalone: true
})

export class CourseComponent implements OnInit {

	courses: any[] = [];

	constructor(
		private router: Router,
		private global: GlobalService,
		private courseService: CourseService,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE' && this.role !== 'LEAD') this.router.navigate(['/login']);

		this.courseService.courseSubject.subscribe(value => {
			this.courses = value.courses;
		})
		this.courseService.findAll();
	}

}
