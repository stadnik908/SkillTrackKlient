import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})
export class DepartmentCompetenceService {

	competenceSubject = new BehaviorSubject<any>({
		competences: [],
	})

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/departments/competences'
	}

	findAll(departmentId: number) {
		this.http.get(
			this.url + `/${departmentId}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: (res: any) => this.competenceSubject.next({
				...this.competenceSubject.value,
				competences: res.data,
			}),
			error: (e: any) => this.error(e),
		})
	}

	save(competence: any, departmentId: number) {
		return this.http.post(
			this.url,
			JSON.stringify(competence),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({departmentId: departmentId})
			}
		).subscribe({
			next: (res: any) => this.competenceSubject.next({
				...this.competenceSubject.value,
				competences: [res.data, ...this.competenceSubject.value.competences],
			}),
			error: (e: any) => this.error(e),
		})
	}

	update(id: number, competence: any) {
		this.http.put(
			this.url + `/${id}`,
			JSON.stringify(competence),
			{headers: this.global.headersJsonToken}
		).subscribe({
			next: (res: any) => {
				let competences = this.competenceSubject.value.competences;
				competences = competences.map((i: any) => i.id === id ? res.data : i);
				this.competenceSubject.next({
					...this.competenceSubject.value,
					competences: competences,
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
				let competences = this.competenceSubject.value.competences;
				competences = competences.filter((i: any) => i.id !== id);
				this.competenceSubject.next({
					...this.competenceSubject.value,
					competences: competences,
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
