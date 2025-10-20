import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {NavigateDirective} from "../../navigate.directive";
import {LessonService} from "../lesson.service";

@Component({
	selector: 'app-lesson-add',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './lesson-add.component.html',
	standalone: true
})

export class LessonAddComponent implements OnInit {

	courseId: number = 0;

	lessonFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		theme: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		video: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]),
		description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]),
	})
	file: any = null;

	constructor(
		private router: Router,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private lessonService: LessonService,
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
		if (this.lessonFormGroup.invalid) return false;
		if (this.file === null) return false;
		return true;
	}

	save() {
		this.lessonService.save(this.lessonFormGroup.value, this.courseId, this.file)
	}

}
