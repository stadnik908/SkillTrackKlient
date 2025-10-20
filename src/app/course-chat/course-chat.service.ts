import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";

@Injectable({
	providedIn: 'root'
})
export class CourseChatService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses/chats'
	}

	findAll(id: number) {
		return this.http.get(
			this.url + `/${id}`,
			{headers: this.global.headersToken,}
		);
	}

	save(text: string, courseId: number) {
		return this.http.post(
			this.url,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					text: text,
					courseId: courseId,
				})
			}
		);
	}

}
