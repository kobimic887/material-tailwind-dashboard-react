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
import {
  DashboardHome,
  Profile,
  Tables,
  Notifications,
  PaidPlans,
  Simulation,
  MoleculeViewer,
  Molecule2D,
  Molstar3D,
  } from "@/pages/dashboard";
import {
  MainHome,  
  Services,
  AboutUs,
  ContactUs,
  Insights,
  PaidPlansDescription
} from "@/pages/main";

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
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "mainHome",
        path: "/mainHome",
        element: <MainHome />,
      },
      {
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "services",
        path: "/services",
        element: <Services />,
      },
      {
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "about-us",
        path: "/about-us",
        element: <AboutUs />,
      },
      {
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "contact-us",
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "insights",
        path: "/insights",
        element: <Insights />,
      },
      {
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "paidplansdescription",
        path: "/paidplansdescription",
        element: <PaidPlansDescription />,
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
          hideFromMenu: true,
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
          hideFromMenu: true,
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
      },
      {
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
      
    ],
  },
  {
    
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        hideFromMenu: true,
      },
      {        
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
        hideFromMenu: true,
      },
    ],
  },
];

export default routes;