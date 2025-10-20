import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})
export class LessonService {

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private router: Router,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/courses/lessons'
	}

	find(id: number) {
		return this.http.get(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		)
	}

	checkSave(lessonId: number) {
		return this.http.post(
			this.url + '/checks',
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({lessonId: lessonId})
			}
		)
	}

	save(lesson: any, courseId: number, file: any) {
		this.http.post(
			this.url,
			JSON.stringify(lesson),
			{
				headers: this.global.headersJsonToken,
				params: new HttpParams().appendAll({courseId: courseId})
			}
		).subscribe({
			next: (res: any) => this.updateFile(res.data.id, file),
			error: (e: any) => this.error(e)
		})
	}

	update(id: number, lesson: any, file: any) {
		this.http.put(
			this.url + `/${id}`,
			JSON.stringify(lesson),
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
		this.router.navigate(['/course_lesson'], {queryParams: {id: id}})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}
}
