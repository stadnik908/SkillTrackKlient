import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {UserService} from "../user/user.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-account',
	imports: [
		FormsModule,
		NgIf
	],
	templateUrl: './account.component.html',
	standalone: true
})

export class AccountComponent implements OnInit {

	user: any = null;

	constructor(
		private router: Router,
		private global: GlobalService,
		private userService: UserService,
	) {
	}

	ngOnInit(): void {
		if (this.global.role !== 'EMPLOYEE' && this.global.role !== 'LEAD') this.router.navigate(['/login']);

		this.userService.find().subscribe({
			next: (res: any) => this.user = res.data,
			error: (e: any) => console.log(e.error)
		})
	}

}
