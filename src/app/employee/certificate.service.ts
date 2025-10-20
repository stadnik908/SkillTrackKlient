import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})

export class CertificateService {

	constructor(
		private http: HttpClient,
		private router: Router,
		private global: GlobalService,
		private alert: AlertService
	) {
	}

	private get url() {
		return this.global.backendURL + '/certificates'
	}

	save(files: any, score: number, courseId: number, userId: number) {
		let formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('file', files[i]);
		}
		return this.http.post(
			this.url,
			formData,
			{
				headers: this.global.headersMultipartToken,
				params: new HttpParams().appendAll({
					score: score,
					courseId: courseId,
					userId: userId,
				})
			}
		);
	}

}
