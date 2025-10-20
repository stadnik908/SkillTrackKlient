import {Component, OnInit} from '@angular/core';
import {NavigateDirective} from "../../navigate.directive";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../global.service";
import {EmployeeService} from "../employee.service";
import {AlertService} from "../../alert/alert.service";
import {DepartmentService} from "../../department/department.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CertificateService} from "../certificate.service";
import {DepartmentCompetenceService} from "../../department-competence/department-competence.service";
import {EmployeeCompetenceCardComponent} from "../employee-competence-card/employee-competence-card.component";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

@Component({
	selector: 'app-employee-page',
	imports: [
		NavigateDirective,
		NgIf,
		ReactiveFormsModule,
		FormsModule,
		EmployeeCompetenceCardComponent
	],
	templateUrl: './employee-page.component.html',
	standalone: true
})

export class EmployeePageComponent implements OnInit {

	employee: any = {
		fio: '',
	};

	courseId: number = 0;

	score: any = null;
	file: any = null;

	departments: any[] = [];

	departmentCompetences: any[] = [];

	get employeeCompetences() {
		return this.employee.competences
	}

	get competences() {
		const allCompetences = [...this.employeeCompetences, ...this.departmentCompetences];
		const uniqueMap = new Map();

		allCompetences.forEach(comp => {
			const id = comp.competenceId || comp.id;
			if (!uniqueMap.has(id)) {
				uniqueMap.set(id, comp);
			}
		});

		return Array.from(uniqueMap.values()).sort((a, b) => (b.competenceId || b.id) - (a.competenceId || a.id));
	}

	constructor(
		private router: Router,
		private global: GlobalService,
		private service: EmployeeService,
		private activatedRoute: ActivatedRoute,
		private alert: AlertService,
		private departmentService: DepartmentService,
		private certificateService: CertificateService,
		private departmentCompetenceService: DepartmentCompetenceService,
	) {
	}

	get coursesForCertificate() {
		return this.upgrades.filter((u: any) => !this.certificates.some((c: any) => u.courseId === c.courseId));
	}

	get certificates() {
		return this.employee.certificates;
	}

	get upgrades() {
		return this.employee.upgrades;
	}

	get testingChecks() {
		return this.employee.testingChecks;
	}

	get role() {
		return this.global.role;
	}

	ngOnInit(): void {
		if (this.role === 'USER' || this.role === 'NOT') this.router.navigate(['/login']);

		this.activatedRoute.queryParams.subscribe(param => {
			this.service.find(param['id']).subscribe({
				next: (res: any) => {
					this.employee = res.data
					if (this.role === 'ADMIN' || this.role === 'LEAD') {
						if (this.employee.departmentId !== 0) {
							this.departmentCompetenceService.competenceSubject.subscribe(value => {
								this.departmentCompetences = value.competences;
							})
							this.departmentCompetenceService.findAll(this.employee.departmentId)
						}
					}
				},
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

		if (this.role === 'HR') {
			this.departmentService.departmentSubject.subscribe(value => {
				this.departments = value.departments;
			})
			this.departmentService.findAll();
		}


	}

	updateImg(event: any) {
		this.service.updateImg(this.employee.id, event.target.files).subscribe({
			next: (res: any) => this.employee = res.data,
			error: (e: any) => this.error(e),
		})
	}

	updateLock() {
		this.service.updateLock(this.employee.id).subscribe({
			next: (res: any) => this.employee = res.data,
			error: (e: any) => this.error(e),
		})
	}

	updateDepartment(event: any) {
		this.service.updateDepartment(this.employee.id, event.target.value).subscribe({
			next: (res: any) => {
				this.alert.showAlertMessage("Данные обновлены!");
				this.employee = res.data
			},
			error: (e: any) => this.error(e),
		})
	}

	checkUpdateProfile(): boolean {
		if (this.employee.fio === '') return false;
		if (this.employee.email === '') return false;
		if (this.employee.tel === '') return false;

		return true;
	}

	updateProfile() {
		this.service.updateProfile(this.employee).subscribe({
			next: (res: any) => {
				this.alert.showAlertMessage("Данные обновлены!");
				this.employee = res.data
			},
			error: (e: any) => this.error(e),
		})
	}

	changeFile(event: any) {
		this.file = event.target.files;
	}

	checkSaveCertificate() {
		if (this.courseId === 0) return false;
		if (this.score === null) return false;
		if (this.file === null) return false;

		return true;
	}

	saveCertificate() {
		this.certificateService.save(this.file, this.score, this.courseId, this.employee.id).subscribe({
			next: (res: any) => {
				this.certificates.unshift(res.data);
				this.score = null;
				this.file = null;
				this.courseId = 0;
			},
			error: (e: any) => this.error(e),
		})
	}

	private error(e: any) {
		console.log(e.error);
		this.alert.showAlertMessage(e.error.message);
	}

	generatePDF() {
		let data: any = document.getElementById('pdf');
		html2canvas(data).then(canvas => {
			const content = canvas.toDataURL('image/png');

			let jsPdf;
			if (canvas.width > canvas.height) {
				jsPdf = new jsPDF('p', 'cm', 'a4');
				jsPdf.addImage(content, 'PNG', 0, 0, 21, 0);
			} else {
				jsPdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
				jsPdf.addImage(content, 'PNG', 0, 0, canvas.width, canvas.height);
			}

			jsPdf.save('pdf.pdf');
		});
	}

}
