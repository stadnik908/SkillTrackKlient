import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../navigate.directive";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";
import {HomeworkService} from "./homework.service";
import {HomeworkCheckCardComponent} from "./homework-check-card/homework-check-card.component";

@Component({
	selector: 'app-homework',
	imports: [
		NavigateDirective,
		NgIf,
		HomeworkCheckCardComponent
	],
	templateUrl: './homework.component.html',
	standalone: true
})

export class HomeworkComponent implements OnInit {

	homework: any = {
		name: '',
	};

	constructor(
		private router: Router,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
		private homeworkService: HomeworkService,
	) {
	}

	get checks(): any[] {
		switch (this.role) {
			case 'METHOD' :
				return this.homework.checks;
			case 'LEAD':
				return this.homework.checks;
			case 'EMPLOYEE':
				return this.homework.checks.filter((i: any) => i.employeeId === this.userid);
			default:
				return [];
		}
	}

	get homeworkCheck(): boolean {
		for (let i of this.homework.checks) if (i.employeeId === this.userid) return false
		return true;
	}

	get role() {
		return this.global.role;
	}

	get userid() {
		return this.global.userid;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE' && this.role !== 'LEAD') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.homeworkService.find(param['id']).subscribe({
				next: (res: any) => this.homework = res.data,
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
		this.homeworkService.delete(this.homework.id, this.homework.courseId);
	}

	checkSave(event: any) {
		this.homeworkService.checkSave(event.target.files, this.homework.id).subscribe({
			next: (res: any) => this.homework.checks.unshift(res.data),
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
