import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})
export class HomeworkService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private router: Router,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses/homeworks'
	}

	find(id: number) {
		return this.http.get(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		)
	}

	checkSave(files: any, homeworkId: number) {
		let formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("file", files[i]);
		}
		return this.http.post(
			this.url + '/checks',
			formData,
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({homeworkId: homeworkId})
			}
		)
	}

	checkUpdateScore(id: number, score: number) {
		return this.http.patch(
			this.url + `/checks/${id}/score`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({score: score})
			}
		)
	}

	save(homework: any, courseId: number, file: any) {
		this.http.post(
			this.url,
			JSON.stringify(homework),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({courseId: courseId})
			}
		).subscribe({
			next: (res: any) => this.updateFile(res.data.id, file),
			error: (e: any) => this.error(e)
		})
	}

	update(id: number, homework: any, file: any) {
		this.http.put(
			this.url + `/${id}`,
			JSON.stringify(homework),
			{headers: this.global.headersJsonToken,}
		).subscribe({
			next: (res: any) => {
				if (file !== null) this.updateFile(res.data.id, file)
				else this.page(res.data.id)
			},
			error: (e: any) => this.error(e)
		})
	}

	updateFile(id: number, files: any) {
		let formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("file", files[i]);
		}
		this.http.patch(
			this.url + `/${id}/file`,
			formData,
			{headers: this.global.headersMultipartToken,}
		).subscribe({
			next: (res: any) => this.page(res.data.id),
			error: (e: any) => this.error(e)
		})
	}

	delete(id: number, courseId: number) {
		this.http.delete(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: () => this.router.navigate(['/course'], {queryParams: {id: courseId}}),
			error: (e: any) => this.error(e)
		})
	}

	private page(id: number) {
		this.router.navigate(['/course_homework'], {queryParams: {id: id}})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}
}
