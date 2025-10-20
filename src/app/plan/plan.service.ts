import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {BehaviorSubject} from "rxjs";
import {AlertService} from "../alert/alert.service";

@Injectable({
	providedIn: 'root'
})

export class PlanService {

	planSubject = new BehaviorSubject<any>({
		plans: [],
	})

	constructor(
		private http: HttpClient,
		private global: GlobalService,
		private alert: AlertService,
	) {
	}

	private get url() {
		return this.global.backendURL + '/plans'
	}

	private error(e: any) {
		console.log(e.error)
		this.alert.showAlertMessage(e.error.message)
	}

	findAll(userId: number) {
		this.http.get(
			this.url + `/${userId}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: (res: any) => this.planSubject.next({
				...this.planSubject.value,
				plans: res.data,
			}),
			error: (e: any) => this.error(e),
		})
	}

	// course

	postCourse(courseId: number, percent: number, userId: number) {
		return this.http.post(
			this.url + `/course`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					courseId: courseId,
					percent: percent,
					userId: userId,
				})
			}
		).subscribe({
			next: (res: any) => this.planSubject.next({
				...this.planSubject.value,
				plans: [res.data, ...this.planSubject.value.plans],
			}),
			error: (e: any) => this.error(e),
		})
	}

	putCourse(id: number, courseId: number, percent: number) {
		return this.http.put(
			this.url + `/${id}/course`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					courseId: courseId,
					percent: percent,
				})
			}
		).subscribe({
			next: (res: any) => {
				let plans: any = this.planSubject.value.plans;
				plans = plans.map((i: any) => i.id === id ? res.data : i);
				this.planSubject.next({
					...this.planSubject.value,
					plans: plans,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	// choice

	postChoice(text: string, userId: number) {
		return this.http.post(
			this.url + `/choice`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					text: text,
					userId: userId,
				})
			}
		).subscribe({
			next: (res: any) => this.planSubject.next({
				...this.planSubject.value,
				plans: [res.data, ...this.planSubject.value.plans],
			}),
			error: (e: any) => this.error(e),
		})
	}

	putChoice(id: number, text: string) {
		return this.http.put(
			this.url + `/${id}/choice`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					text: text,
				})
			}
		).subscribe({
			next: (res: any) => {
				let plans: any = this.planSubject.value.plans;
				plans = plans.map((i: any) => i.id === id ? res.data : i);
				this.planSubject.next({
					...this.planSubject.value,
					plans: plans,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	patchChoice(id: number) {
		return this.http.patch(
			this.url + `/${id}/choice`,
			"",
			{headers: this.global.headersToken}
		).subscribe({
			next: (res: any) => {
				let plans: any = this.planSubject.value.plans;
				plans = plans.map((i: any) => i.id === id ? res.data : i);
				this.planSubject.next({
					...this.planSubject.value,
					plans: plans,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	// score

	postScore(text: string, scoreMin: number, userId: number) {
		return this.http.post(
			this.url + `/score`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					text: text,
					scoreMin: scoreMin,
					userId: userId,
				})
			}
		).subscribe({
			next: (res: any) => this.planSubject.next({
				...this.planSubject.value,
				plans: [res.data, ...this.planSubject.value.plans],
			}),
			error: (e: any) => this.error(e),
		})
	}

	putScore(id: number, text: string, scoreMin: number) {
		return this.http.put(
			this.url + `/${id}/score`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					text: text,
					scoreMin: scoreMin,
				})
			}
		).subscribe({
			next: (res: any) => {
				let plans: any = this.planSubject.value.plans;
				plans = plans.map((i: any) => i.id === id ? res.data : i);
				this.planSubject.next({
					...this.planSubject.value,
					plans: plans,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	patchScore(id: number, score: number) {
		return this.http.patch(
			this.url + `/${id}/score`,
			"",
			{
				headers: this.global.headersToken,
				params: new HttpParams().appendAll({
					score: score,
				})
			}
		).subscribe({
			next: (res: any) => {
				let plans: any = this.planSubject.value.plans;
				plans = plans.map((i: any) => i.id === id ? res.data : i);
				this.planSubject.next({
					...this.planSubject.value,
					plans: plans,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

	delete(id: number) {
		return this.http.delete(
			this.url + `/${id}`,
			{headers: this.global.headersToken}
		).subscribe({
			next: () => {
				let plans: any = this.planSubject.value.plans;
				plans = plans.filter((i: any) => i.id !== id);
				this.planSubject.next({
					...this.planSubject.value,
					plans: plans,
				})
			},
			error: (e: any) => this.error(e),
		})
	}

}
