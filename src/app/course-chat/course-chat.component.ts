import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {AlertService} from "../alert/alert.service";
import {CourseChatService} from "./course-chat.service";
import {FormsModule} from "@angular/forms";
import {NavigateDirective} from "../navigate.directive";
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-course-chat',
	imports: [
		FormsModule,
		NavigateDirective,
		NgIf
	],
	templateUrl: './course-chat.component.html',
	standalone: true
})

export class CourseChatComponent implements OnInit {

	id: number = 0;

	chats: any[] = [];

	text: string = '';

	constructor(
		private router: Router,
		private global: GlobalService,
		private chatService: CourseChatService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
	) {
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role !== 'METHOD' && this.role !== 'EMPLOYEE' && this.role !== 'LEAD') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.id = param['id'];
			this.chatService.findAll(param['id']).subscribe({
				next: (res: any) => this.chats = res.data,
				error: (e: any) => {
					console.log(e.error)
					if (e.error.code === 404) {
						this.router.navigate(['/error'], {queryParams: {message: e.error.message}});
					} else {
						this.router.navigate(['/login']);
					}
				}
			})
		})
	}

	save() {
		this.chatService.save(this.text, this.id).subscribe({
			next: (res: any) => {
				this.chats.unshift(res.data)
				this.text = '';
			},
			error: (e: any) => this.error(e)
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

}
