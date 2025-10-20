import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})
export class TestingService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private router: Router,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses/testings'
	}

	find(id: number) {
		return this.http.get(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		)
	}

	checkSave(score: number, testingId: number) {
		return this.http.post(
			this.url + '/checks',
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					testingId: testingId,
					score: score,
				})
			}
		)
	}

	save(testing: any, courseId: number) {
		this.http.post(
			this.url,
			JSON.stringify(testing),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({courseId: courseId})
			}
		).subscribe({
			next: (res: any) => this.page(res.data.id),
			error: (e: any) => this.error(e)
		})
	}

	update(id: number, testing: any) {
		this.http.put(
			this.url + `/${id}`,
			JSON.stringify(testing),
			{headers: this.global.headersJsonToken,}
		).subscribe({
			next: (res: any) => this.page(res.data.id),
			error: (e: any) => this.error(e)
		})
	}

	delete(id: number, courseId: number) {
		this.http.delete(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: () => this.router.navigate(['/course'], {queryParams: {id: courseId}}),
			error: (e: any) => this.error(e)
		})
	}

	private page(id: number) {
		this.router.navigate(['/course_testing'], {queryParams: {id: id}})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}
}
