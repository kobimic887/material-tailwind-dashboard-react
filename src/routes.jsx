import {
  HomeIcon,
  UserCircleIcon,
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
  Notifications,
  PaidPlans,
  ControlPanel,
  Simulation,
  MoleculeViewer,
  Molstar3D,
  GenerateMolecules
  } from "@/pages/dashboard";
import {
  MainHome,  
  Services,
  AboutUs,
  ContactUs,
  Insights,
  PaidPlansDescription,
  Blog
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
      {
          hideFromMenu: true,
        icon: <ServerStackIcon {...icon} />,
        name: "blog",
        path: "/blog",
        element: <Blog />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [      {
        icon: <CogIcon {...icon} />,
        name: "control panel",
        path: "/controlpanel",
        element: <ControlPanel />,
      },
      {
        icon: <EyeIcon {...icon} />,
        name: "simulation",
        path: "/simulation",
        element: <Simulation />,
      },
            {
        icon: <CubeTransparentIcon {...icon} />,
        name: "simulation results",
        path: "/molstar3d",
        element: <Molstar3D />,
      },
      
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
        icon: <BeakerIcon {...icon} />,
        name: "RdKit Visualiser",
        path: "/moleculeviewer",
        element: <MoleculeViewer />,
      },      
      {
        icon: <CloudIcon {...icon} />,
        name: "Generate Molecules",
        path: "/generate-molecules",
        element: <GenerateMolecules />,
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