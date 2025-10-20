import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {LessonService} from "../lesson.service";

@Component({
	selector: 'app-lesson-update',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './lesson-update.component.html',
	standalone: true
})

export class LessonUpdateComponent implements OnInit {

	id: number = 0;

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
			this.id = param['id'];
			this.lessonService.find(param['id']).subscribe({
				next: (res: any) => {
					this.lessonFormGroup.setValue({
						name: res.data.name,
						theme: res.data.theme,
						video: res.data.video,
						description: res.data.description,
					})
				},
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

	changeFile(event: any) {
		this.file = event.target.files;
	}

	checkSubmit(): boolean {
		if (this.lessonFormGroup.invalid) return false;
		return true;
	}

	update() {
		this.lessonService.update(this.id, this.lessonFormGroup.value, this.file)
	}

}
