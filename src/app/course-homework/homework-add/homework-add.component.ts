import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {HomeworkService} from "../homework.service";

@Component({
	selector: 'app-homework-add',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './homework-add.component.html',
	standalone: true
})

export class HomeworkAddComponent implements OnInit {

	courseId: number = 0;

	homeworkFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		deadline: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]),
	})
	file: any = null;

	constructor(
		private router: Router,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private homeworkService: HomeworkService,
	) {
	}

	ngOnInit(): void {
		if (this.global.role !== 'METHOD') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.courseId = param['courseId'];
		})
	}

	changeFile(event: any) {
		this.file = event.target.files;
	}

	checkSubmit(): boolean {
		if (this.homeworkFormGroup.invalid) return false;
		if (this.file === null) return false;
		return true;
	}

	save() {
		this.homeworkService.save(this.homeworkFormGroup.value, this.courseId, this.file)
	}

}
