import {Component, Input, OnInit} from '@angular/core';
import {DecimalPipe, NgIf} from "@angular/common";

@Component({
	selector: 'app-matrix-card',
	imports: [
		NgIf,
		DecimalPipe
	],
	templateUrl: './matrix-card.component.html',
	standalone: true,
})

export class MatrixCardComponent implements OnInit {

	@Input() employee: any;
	@Input() competences: any[] = [];

	ngOnInit(): void {
	}

	competence(id: number): number {
		for (let i of this.employee.competences) {
			if (i.competenceId == id) {
				return i.score;
			}
		}

		return 0;
	}

	level() {
		let res: number = 0;
		let competences: any[] = this.employee.competences;
		for (let i of competences) {
			switch (i.score) {
				case 1:
					res += 33;
					break;
				case 2:
					res += 66;
					break;
				case 3:
					res += 100;
					break;
			}
		}
		return res / competences.length;
	}

}
