import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	employeeSubject = new BehaviorSubject<any>({
		employees: [],
	})

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private alert: AlertService
	) {
	}

	private get url() {
		return this.global.backendURL + '/users'
	}

	findAll() {
		this.http.get(
			this.url + '/employees',
			{headers: this.global.headersToken}
		).subscribe({
			next: (res: any) =>
				this.employeeSubject.next({
					...this.employeeSubject.value,
					employees: res.data,
				}),
			error: (e: any) => this.error(e)
		});
	}

	find(id: number) {
		return this.http.get(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		);
	}

	updateProfile(employee: any) {
		return this.http.patch(
			this.url + `/${employee.id}/profile`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					fio: employee.fio,
					email: employee.email,
					tel: employee.tel,
					grade: employee.grade,
					rang: employee.rang,
				})
			}
		);
	}

	updateLock(id: number) {
		return this.http.patch(
			this.url + `/${id}/lock`,
			"",
			{headers: this.global.headersToken,}
		);
	}

	updateImg(id: number, files: string) {
		let formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('file', files[i]);
		}
		return this.http.patch(
			this.url + `/${id}/img`,
			formData,
			{headers: this.global.headersToken,}
		);
	}

	updateDepartment(id: number, departmentId: number) {
		return this.http.patch(
			this.url + `/${id}/department`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({departmentId: departmentId,})
			}
		);
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
