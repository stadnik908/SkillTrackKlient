import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {BehaviorSubject} from "rxjs";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})

export class DepartmentService {

	departmentSubject = new BehaviorSubject<any>({
		departments: [],
	})

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/departments'
	}

	findAll() {
		this.http.get(
			this.url,
		).subscribe({
			next: (res: any) => this.departmentSubject.next({
				...this.departmentSubject.value,
				departments: res.data,
			}),
			error: (e: any) => this.error(e),
		})
	}

	save(department: any) {
		return this.http.post(
			this.url,
			JSON.stringify(department),
			{headers: this.global.headersJsonToken}
		).subscribe({
			next: (res: any) => this.departmentSubject.next({
				...this.departmentSubject.value,
				departments: [res.data, ...this.departmentSubject.value.departments],
			}),
			error: (e: any) => this.error(e),
		})
	}

	update(id: number, department: any) {
		this.http.put(
			this.url + `/${id}`,
			JSON.stringify(department),
			{headers: this.global.headersJsonToken}
		).subscribe({
			next: (res: any) => {
				let departments = this.departmentSubject.value.departments;
				departments = departments.map((i: any) => i.id === id ? res.data : i);
				this.departmentSubject.next({
					...this.departmentSubject.value,
					departments: departments,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	delete(id: number) {
		this.http.delete(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: () => {
				let departments = this.departmentSubject.value.departments;
				departments = departments.filter((i: any) => i.id !== id);
				this.departmentSubject.next({
					...this.departmentSubject.value,
					departments: departments,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	private error(e: any) {
		console.log(e.error)
		this.alert.showAlertMessage(e.error.message);
	}

}
