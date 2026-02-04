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
    ],
  },
]);