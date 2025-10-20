import {Component, Input, OnInit} from '@angular/core';
import {PlanService} from "../plan.service";
import {NgIf} from "@angular/common";
import {GlobalService} from "../../global.service";
import {CourseService} from "../../course/course.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'app-plan-card',
	imports: [
		NgIf,
		ReactiveFormsModule,
		FormsModule
	],
	templateUrl: './plan-card.component.html',
	standalone: true,
})

export class PlanCardComponent implements OnInit {

	@Input() plan: any;
	@Input() departmentId: any;

	constructor(
		private service: PlanService,
		private global: GlobalService,
		private courseService: CourseService,
	) {
	}

	get role() {
		return this.global.role;
	}

	get category() {
		return this.plan.category;
	}

	ngOnInit(): void {
		if (this.role === 'HR' || this.role === 'LEAD') {
			this.courseService.courseSubject.subscribe(value => {
				this.courses = value.courses
				console.log(this.courses)
			})
			this.courseService.findAll();
		}
	}

	// course

	courses: any[] = [];
	courseId: number = 0;

	get coursesSorted() {
		return this.courses.filter((i: any) => i.departmentId == this.departmentId);
	}

	changeCourseId(event: any) {
		this.courseId = event.target.value;
	}

	checkPutCourse(): boolean {
		if (this.plan.percent < 1) return true;
		if (this.plan.percent > 100) return true;

		return false;
	}

	putCourse() {
		this.service.putCourse(this.plan.id, this.plan.courseId, this.plan.percent)
	}

	// choice

	checkPutChoice(): boolean {
		if (this.plan.text == '') return true;

		return false;
	}

	putChoice() {
		this.service.putChoice(this.plan.id, this.plan.text)
	}

	patchChoice() {
		this.service.patchChoice(this.plan.id)
	}

	// score

	checkPutScore(): boolean {
		if (this.plan.text == '') return true;
		if (this.plan.scoreMin < 1) return true;
		if (this.plan.scoreMin > 10) return true;

		return false;
	}

	putScore() {
		this.service.putScore(this.plan.id, this.plan.text, this.plan.scoreMin)
	}

	checkPatchScore(): boolean {
		if (this.plan.score < 1) return true;
		if (this.plan.score > 10) return true;

		return false;
	}

	patchScore() {
		this.service.patchScore(this.plan.id, this.plan.score)
	}

	delete() {
		this.service.delete(this.plan.id);
	}
}
