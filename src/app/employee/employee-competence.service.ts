import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";

@Injectable({
	providedIn: 'root'
})

export class EmployeeCompetenceService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/users/competences'
	}

	save(userId: number, score: number, competenceId: number) {
		return this.http.post(
			this.url + `/${userId}`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					score: score,
					competenceId: competenceId,
				})
			}
		);
	}

}
