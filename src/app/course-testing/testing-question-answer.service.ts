import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";

@Injectable({
	providedIn: 'root'
})
export class TestingQuestionAnswerService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses/testings/questions/answers'
	}

	save(answer: any, questionId: number) {
		console.log(answer);
		return this.http.post(
			this.url,
			JSON.stringify(answer),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({questionId: questionId})
			}
		)
	}

	update(id: number, answer: any) {
		return this.http.put(
			this.url + `/${id}`,
			JSON.stringify(answer),
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
