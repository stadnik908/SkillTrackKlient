import {Routes} from '@angular/router';
import {ErrorComponent} from "./error/error.component";
import {StatsComponent} from "./stats/stats.component";
import {UserComponent} from "./user/user.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegComponent} from "./auth/reg/reg.component";
import {MainComponent} from "./main/main.component";
import {DepartmentComponent} from "./department/department.component";
import {EmployeeComponent} from "./employee/employee.component";
import {EmployeePageComponent} from "./employee/employee-page/employee-page.component";
import {CourseComponent} from "./course/course.component";
import {CoursePageComponent} from "./course/course-page/course-page.component";
import {CourseAddComponent} from "./course/course-add/course-add.component";
import {CourseUpdateComponent} from "./course/course-update/course-update.component";
import {LessonComponent} from "./course-lesson/lesson.component";
import {LessonAddComponent} from "./course-lesson/lesson-add/lesson-add.component";
import {LessonUpdateComponent} from "./course-lesson/lesson-update/lesson-update.component";
import {HomeworkComponent} from "./course-homework/homework.component";
import {HomeworkAddComponent} from "./course-homework/homework-add/homework-add.component";
import {HomeworkUpdateComponent} from "./course-homework/homework-update/homework-update.component";
import {TestingComponent} from "./course-testing/testing.component";
import {TestingAddComponent} from "./course-testing/testing-add/testing-add.component";
import {TestingUpdateComponent} from "./course-testing/testing-update/testing-update.component";
import {AccountComponent} from "./account/account.component";
import {CourseFeedbackComponent} from "./course-feedback/course-feedback.component";
import {CourseChatComponent} from "./course-chat/course-chat.component";
import {FeedbackComponent} from "./feedback/feedback.component";
import {DepartmentCompetenceComponent} from "./department-competence/department-competence.component";
import {PlanComponent} from "./plan/plan.component";
import {MatrixComponent} from "./matrix/matrix.component";

export const routes: Routes = [

	{path: "", component: MainComponent},

	{path: "reg", component: RegComponent},
	{path: "login", component: LoginComponent},

	{path: "users", component: UserComponent},

	{path: "departments", component: DepartmentComponent},

	{path: "departments_competences", component: DepartmentCompetenceComponent},

	{path: "employees", component: EmployeeComponent},
	{path: "employee", component: EmployeePageComponent},

	{path: "account", component: AccountComponent},

	{path: "plans", component: PlanComponent},

	{path: "courses", component: CourseComponent},
	{path: "course", component: CoursePageComponent},
	{path: "course_add", component: CourseAddComponent},
	{path: "course_update", component: CourseUpdateComponent},

	{path: "course_lesson", component: LessonComponent},
	{path: "course_lesson_add", component: LessonAddComponent},
	{path: "course_lesson_update", component: LessonUpdateComponent},

	{path: "course_homework", component: HomeworkComponent},
	{path: "course_homework_add", component: HomeworkAddComponent},
	{path: "course_homework_update", component: HomeworkUpdateComponent},

	{path: "course_feedbacks", component: CourseFeedbackComponent},
	{path: "course_chats", component: CourseChatComponent},

	{path: "course_testing", component: TestingComponent},
	{path: "course_testing_add", component: TestingAddComponent},
	{path: "course_testing_update", component: TestingUpdateComponent},

	{path: "feedbacks", component: FeedbackComponent},

	{path: "matrix", component: MatrixComponent},

	{path: "stats", component: StatsComponent},

	{path: "error", component: ErrorComponent},
	{path: "**", component: ErrorComponent},

];
