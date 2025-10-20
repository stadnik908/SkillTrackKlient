import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";

@Injectable({
	providedIn: 'root'
})
export class TestingQuestionService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses/testings/questions'
	}

	save(question: any, testingId: number) {
		return this.http.post(
			this.url,
			JSON.stringify(question),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({testingId: testingId})
			}
		)
	}

	update(id: number, question: any) {
		return this.http.put(
			this.url + `/${id}`,
			JSON.stringify(question),
			{headers: this.global.headersJsonToken}
		)
	}

	delete(id: number) {
		return this.http.delete(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		)
	}

}
