import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})

export class UserService {

	userSubject = new BehaviorSubject<any>({
		users: [],
		employees: [],
	})

	constructor(
		private http: HttpClient,
		private router: Router,
		private global: GlobalService,
		private alert: AlertService
	) {
	}

	private get url() {
		return this.global.backendURL + '/users'
	}

	findAll() {
		return this.http.get(
			this.url + '/all',
			{headers: this.global.headersToken}
		).subscribe({
			next: (res: any) =>
				this.userSubject.next({
					...this.userSubject.value,
					users: res.data,
				}),
			error: (e: any) => this.error(e)
		});
	}

	find() {
		return this.http.get(
			this.url,
			{headers: this.global.headersToken}
		)
	}

	updateRole(user: any) {
		return this.http.patch(
			this.url + `/${user.id}/role`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({role: user.role})
			}
		).subscribe({
			error: (e: any) => this.error(e)
		});
	}

	delete(user: any) {
		return this.http.delete(
			this.url + `/${user.id}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: () => {
				let users = this.userSubject.value.users;
				users = users.filter((i: any) => i.id !== user.id);
				this.userSubject.next({
					...this.userSubject.value,
					users: users
				});
			},
			error: (e: any) => this.error(e)
		});
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
