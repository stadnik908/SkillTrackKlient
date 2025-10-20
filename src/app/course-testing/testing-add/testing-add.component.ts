import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {TestingService} from "../testing.service";

@Component({
	selector: 'app-testing-add',
	imports: [
		NavigateDirective,
		ReactiveFormsModule
	],
	templateUrl: './testing-add.component.html',
	standalone: true
})

export class TestingAddComponent implements OnInit {

	courseId: number = 0;

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
			this.courseId = param['courseId'];
		})
	}

	checkSubmit(): boolean {
		if (this.testingFormGroup.invalid) return false;
		return true;
	}

	save() {
		this.testingService.save(this.testingFormGroup.value, this.courseId)
	}

}
