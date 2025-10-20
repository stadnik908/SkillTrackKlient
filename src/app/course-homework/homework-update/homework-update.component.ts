import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {HomeworkService} from "../homework.service";

@Component({
	selector: 'app-homework-update',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './homework-update.component.html',
	standalone: true
})

export class HomeworkUpdateComponent implements OnInit {

	id: number = 0;

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
			this.id = param['id'];
			this.homeworkService.find(param['id']).subscribe({
				next: (res: any) => {
					this.homeworkFormGroup.setValue({
						name: res.data.name,
						deadline: res.data.deadline,
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
		if (this.homeworkFormGroup.invalid) return false;
		return true;
	}

	update() {
		this.homeworkService.update(this.id, this.homeworkFormGroup.value, this.file)
	}

}
