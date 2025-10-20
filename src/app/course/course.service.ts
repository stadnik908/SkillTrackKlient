import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";
import {AlertService} from "../alert/alert.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class CourseService {

	courseSubject = new BehaviorSubject<any>({
		courses: [],
	})

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private router: Router,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses'
	}

	findAll() {
		this.http.get(
			this.url,
			{headers: this.global.headersToken}
		).subscribe({
			next: (res: any) => this.courseSubject.next({
				...this.courseSubject.value,
				courses: res.data,
			}),
			error: (e: any) => this.error(e)
		})
	}

	find(id: number) {
		return this.http.get(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		)
	}

	save(course: any, departmentId: number) {
		this.http.post(
			this.url,
			JSON.stringify(course),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({departmentId: departmentId}),
			}
		).subscribe({
			next: (res: any) => this.page(res.data.id),
			error: (e: any) => this.error(e)
		})
	}

	update(id: number, course: any, departmentId: number) {
		this.http.put(
			this.url + `/${id}`,
			JSON.stringify(course),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({departmentId: departmentId}),
			}
		).subscribe({
			next: (res: any) => this.page(res.data.id),
			error: (e: any) => this.error(e)
		})
	}

	updateStatus(id: number) {
		return this.http.patch(
			this.url + `/${id}/status`,
			"",
			{headers: this.global.headersToken}
		);
	}

	delete(id: number) {
		this.http.delete(
			this.url + `/${id}`,
			{headers: this.global.headersJsonToken}
		).subscribe({
			next: () => this.router.navigate(['/courses']),
			error: (e: any) => this.error(e)
		})
	}

	private page(id: number) {
		this.router.navigate(['/course'], {queryParams: {id: id}})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
