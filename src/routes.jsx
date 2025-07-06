import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CogIcon,
  BeakerIcon,
  Square2StackIcon,
  CubeTransparentIcon,
  CloudIcon,
} from "@heroicons/react/24/solid";
import { DashboardHome, Profile, Tables, Notifications, PaidPlans, Simulation , MoleculeViewer, Molecule2D, Molstar3D, ApiTest} from "@/pages/dashboard";
import { MainHome } from "@/pages/main";

import { SignIn, SignUp } from "@/pages/auth";
import { EyeIcon, GiftIcon } from "@heroicons/react/24/outline";



const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
{
  title: "main",
  layout: "main",
  pages: [   
    {
      icon: <ServerStackIcon {...icon} />,
      name: "mainHome",
      path: "/mainHome",
      element: <MainHome />,
    },
  ],
},
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/dashboardHome",
        element: <DashboardHome />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
  { 
        icon: <GiftIcon {...icon} />,
        name: "paidplans",
        path: "/paidplans",
        element: <PaidPlans />,
      },
{ 
        icon: <EyeIcon {...icon} />,
        name: "simulation",
        path: "/simulation",
        element: <Simulation />,
      },      { 
        icon: <BeakerIcon {...icon} />,
        name: "molecule viewer",
        path: "/moleculeviewer",
        element: <MoleculeViewer />,
      },
      { 
        icon: <Square2StackIcon {...icon} />,
        name: "2D molecule viewer",
        path: "/molecule2d",
        element: <Molecule2D />,
      },
      { 
        icon: <CubeTransparentIcon {...icon} />,
        name: "3D molstar viewer",
        path: "/molstar3d",
        element: <Molstar3D />,
      },
      { 
        icon: <CloudIcon {...icon} />,
        name: "API test",
        path: "/apitest",
        element: <ApiTest />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  
];

export default routes;