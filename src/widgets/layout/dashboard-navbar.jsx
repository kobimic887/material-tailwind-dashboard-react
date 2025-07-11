import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import React, { useState, useEffect } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  // User info state
  const [user, setUser] = useState({ name: "", simulationTokens: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Example: get user info and tokens from localStorage (customize as needed)
    const storedUser = JSON.parse(localStorage.getItem("user_info")) || {};
    const simulationTokens = Number(
      localStorage.getItem("simulation_tokens")
    ) || 0;
    setUser({
      name: storedUser.name || storedUser.username || "User",
      simulationTokens,
    });

    // Validate auth token
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/main/mainhome", { replace: true });
      return;
    }
    // Optionally, validate token with backend
    fetch(`https://${window.location.hostname}:3000/api/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        if (!data.valid) {
          navigate("/main/mainhome", { replace: true });
        } else {
          // If backend returns user info and tokens, update localStorage and state
          if (data.user) {
            localStorage.setItem("user_info", JSON.stringify(data.user));
          }
          if (typeof data.user.simulationTokens !== 'undefined') {
            localStorage.setItem("simulation_tokens", data.user.simulationTokens);
          }
          setUser({
            name: (data.user && (data.user.name || data.user.username)) || "User",
            simulationTokens: data.user.simulationTokens || 0,
          });
        }
      })
      .catch(() => {
        navigate("/main/mainhome", { replace: true });
      });
  }, [navigate]);

  const handleSignOut = () => {
    // Clear tokens and user info (customize as needed)
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("simulation_tokens");
    window.location.href = "/auth/sign-in";
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout || "Home"}
              </Typography>
            </Link>
            {page && (
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {page}
              </Typography>
            )}
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page || "Home"}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          {/* Replace sign-in link with user info and sign out */}
          <div className="flex items-center gap-4 mr-4">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Hello:{" "}
              <Chip
                value={user.name}
                color="blue"
                className="inline-block px-2 py-1 text-xs font-bold ml-1 align-middle"
              />{" "}
              | You have{" "}
              <Chip
                value={`${user.simulationTokens} `}
                color="green"
                className="inline-block px-2 py-1 text-xs font-bold ml-1 align-middle"
              /> Simulation Tokens left
            </Typography>
            <Button
              variant="text"
              color="blue-gray"
              className="items-center gap-1 px-4 normal-case"
              onClick={handleSignOut}
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              Sign Out
            </Button>
          </div>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            {/* <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList> */}
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
