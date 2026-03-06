import { createBrowserRouter } from 'react-router';
import { Layout } from '@/app/components/Layout';
import { Home } from '@/app/components/Home';
import { ProjectDetails } from '@/app/components/ProjectDetails';
import { GithubPages } from '@/app/components/GithubPages';
import { PersonalPages } from '@/app/components/PersonalPages';
import { AssignmentsPage } from '@/app/components/AssignmentsPage';
import { PersonalPagesContent } from '@/app/components/PersonalPagesContent';
import { ProjectsPage } from '@/app/components/ProjectsPage';
import { AboutPage } from '@/app/components/AboutPage';
import { InterestsPage } from '@/app/components/InterestsPage';
import { PortfolioPage } from '@/app/components/PortfolioPage';
import { USCLifePage } from '@/app/components/USCLifePage';
import { VitaePage } from '@/app/components/VitaePage';
import { GreenvillePage } from '@/app/components/GreenvillePage';
import { Assignment1 } from '@/app/components/assignments/Assignment1';
import { Assignment2 } from '@/app/components/assignments/Assignment2';
import { Assignment3 } from '@/app/components/assignments/Assignment3';
import { Assignment4 } from '@/app/components/assignments/Assignment4';
import { Assignment5 } from '@/app/components/assignments/Assignment5';
import { Assignment6 } from '@/app/components/assignments/Assignment6';
import { Assignment7 } from '@/app/components/assignments/Assignment7';
import { Assignment8 } from '@/app/components/assignments/Assignment8';
import { Assignment9 } from '@/app/components/assignments/Assignment9';
import { Assignment10 } from '@/app/components/assignments/Assignment10';
import { Phase1 } from '@/app/components/projects/Phase1';
import { Phase2 } from '@/app/components/projects/Phase2';
import { Phase3 } from '@/app/components/projects/Phase3';
import { Phase4 } from '@/app/components/projects/Phase4';
import { Phase5 } from '@/app/components/projects/Phase5';
import { Phase6 } from '@/app/components/projects/Phase6';
import { Phase7 } from '@/app/components/projects/Phase7';
import { Phase8 } from '@/app/components/projects/Phase8';
import { Phase9 } from '@/app/components/projects/Phase9';
import { Phase10 } from '@/app/components/projects/Phase10';
import { DocumentsPage } from '@/app/components/DocumentsPage';
import { SettingsPage } from '@/app/components/SettingsPage';
import { LoginPage } from '@/app/components/LoginPage';
import { ReportsPage } from '@/app/components/ReportsPage';
import { ReleasesPage } from '@/app/components/ReleasesPage';
import { TeamPage } from '@/app/components/TeamPage';
import { MilestonesPage } from '@/app/components/MilestonesPage';
import { MyProjectsPage } from '@/app/components/MyProjectsPage';
import { VisitorRegisterPage } from '@/app/components/VisitorRegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'my-projects',
        Component: MyProjectsPage,
      },
      {
        path: 'render-react-info',
        Component: ProjectDetails,
      },
      {
        path: 'github-pages',
        Component: GithubPages,
      },
      {
        path: 'personal-pages',
        Component: PersonalPagesContent,
      },
      {
        path: 'personal-pages/about',
        Component: AboutPage,
      },
      {
        path: 'personal-pages/interests',
        Component: InterestsPage,
      },
      {
        path: 'personal-pages/portfolio',
        Component: PortfolioPage,
      },
      {
        path: 'personal-pages/usclife',
        Component: USCLifePage,
      },
      {
        path: 'personal-pages/vitae',
        Component: VitaePage,
      },
      {
        path: 'personal-pages/greenville',
        Component: GreenvillePage,
      },
      {
        path: 'assignments',
        Component: AssignmentsPage,
      },
      {
        path: 'assignments/1',
        Component: Assignment1,
      },
      {
        path: 'assignments/2',
        Component: Assignment2,
      },
      {
        path: 'assignments/3',
        Component: Assignment3,
      },
      {
        path: 'assignments/4',
        Component: Assignment4,
      },
      {
        path: 'assignments/5',
        Component: Assignment5,
      },
      {
        path: 'assignments/6',
        Component: Assignment6,
      },
      {
        path: 'assignments/7',
        Component: Assignment7,
      },
      {
        path: 'assignments/8',
        Component: Assignment8,
      },
      {
        path: 'assignments/9',
        Component: Assignment9,
      },
      {
        path: 'assignments/10',
        Component: Assignment10,
      },
      {
        path: 'projects',
        Component: ProjectsPage,
      },
      {
        path: 'projects/1',
        Component: Phase1,
      },
      {
        path: 'projects/2',
        Component: Phase2,
      },
      {
        path: 'projects/3',
        Component: Phase3,
      },
      {
        path: 'projects/4',
        Component: Phase4,
      },
      {
        path: 'projects/5',
        Component: Phase5,
      },
      {
        path: 'projects/6',
        Component: Phase6,
      },
      {
        path: 'projects/7',
        Component: Phase7,
      },
      {
        path: 'projects/8',
        Component: Phase8,
      },
      {
        path: 'projects/9',
        Component: Phase9,
      },
      {
        path: 'projects/10',
        Component: Phase10,
      },
      {
        path: 'documents',
        Component: DocumentsPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'reports',
        Component: ReportsPage,
      },
      {
        path: 'releases',
        Component: ReleasesPage,
      },
      {
        path: 'team',
        Component: TeamPage,
      },
      {
        path: 'milestones',
        Component: MilestonesPage,
      },
      {
        path: 'visitor-register',
        Component: VisitorRegisterPage,
      },
    ],
  },
]);