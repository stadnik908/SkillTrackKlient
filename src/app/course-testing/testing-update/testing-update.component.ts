import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {TestingService} from "../testing.service";

@Component({
	selector: 'app-testing-update',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './testing-update.component.html',
	standalone: true
})

export class TestingUpdateComponent implements OnInit {

	id: number = 0;

	testingFormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
	})

	constructor(
		private router: Router,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private testingService: TestingService,
	) {
	}

	ngOnInit(): void {
		if (this.global.role !== 'METHOD') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.id = param['id'];
			this.testingService.find(param['id']).subscribe({
				next: (res: any) => {
					this.testingFormGroup.setValue({
						name: res.data.name,
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

	checkSubmit(): boolean {
		if (this.testingFormGroup.invalid) return false;
		return true;
	}

	update() {
		this.testingService.update(this.id, this.testingFormGroup.value)
	}

}
