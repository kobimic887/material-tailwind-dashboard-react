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
  MagnifyingGlassIcon,
  XMarkIcon,
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // User info state
  const [user, setUser] = useState({ name: "", simulationTokens: 0 });
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart data from localStorage
    loadCartFromStorage();
    
    // Set up storage event listener to update cart when changed in other tabs/components
    const handleStorageChange = (e) => {
      if (e.key === 'moleculeCart') {
        loadCartFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for cart updates periodically (for same-tab updates)
    const cartCheckInterval = setInterval(() => {
      loadCartFromStorage();
    }, 1000);
    
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
      
    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(cartCheckInterval);
    };
  }, [navigate]);

  // Function to load cart from localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('moleculeCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        
        // Calculate total price
        const total = parsedCart.reduce((sum, item) => sum + item.totalPrice, 0);
        setCartTotal(total);
        
        return parsedCart;
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
    setCartItems([]);
    setCartTotal(0);
    return [];
  };

  // Function to get cart summary
  const getCartSummary = () => {
    const itemCount = cartItems.length;
    const uniqueMolecules = [...new Set(cartItems.map(item => item.name))].length;
    return {
      itemCount,
      uniqueMolecules,
      total: cartTotal.toFixed(2)
    };
  };

  // Function to handle Stripe checkout
  const handleStripeCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      // Prepare checkout data
      const checkoutData = {
        items: cartItems.map(item => ({
          name: item.name,
          amount: item.amount,
          price: item.pricePerMg,
          total: item.totalPrice,
          smiles: item.smiles,
          moleculeId: item.moleculeId
        })),
        price: cartTotal,
        name: 'test cart',
        // Add any additional metadata if needed
        currency: 'usd',
        successUrl: `${window.location.origin}/dashboard/molstar3d?checkout=success`,
        cancelUrl: `${window.location.origin}/dashboard/molstar3d?checkout=cancel`
      };

      // Call Stripe checkout API
      const response = await fetch(`${getApiBaseUrl()}/create-checkout-session-onetime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(checkoutData)
      });

      if (response.ok) {
        const { sessionUrl } = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = sessionUrl;
      } else {
        const error = await response.json();
        alert(`Checkout failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
    }
  };

  // ...existing code...

  const handleSignOut = () => {
    // Clear tokens and user info (customize as needed)
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("simulation_tokens");
    localStorage.removeItem("moleculeCart"); // Clear cart on sign out
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
      <div className="flex flex-col-reverse justify-between gap-2 md:gap-6 md:flex-row md:items-center">
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
          <Typography variant="h6" color="blue-gray" className="text-lg md:text-xl">
            {page || "Home"}
          </Typography>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Mobile Search Toggle */}
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
            </IconButton>
            
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? (
                <XMarkIcon className="h-5 w-5 text-blue-gray-500" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />
              )}
            </IconButton>
          </div>

          {/* Desktop Search */}
          <div className="mr-auto md:mr-4 md:w-56 hidden md:block">
            <Input label="Search" />
          </div>
          
          {/* Replace sign-in link with user info and sign out */}
          <div className="flex items-center gap-2 md:gap-4 mr-2 md:mr-4">
            <Typography variant="small" color="blue-gray" className="font-medium hidden sm:block">
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
            {/* Mobile user info - compact */}
            <div className="flex items-center gap-1 sm:hidden">
              <Chip
                value={user.name}
                color="blue"
                className="px-2 py-1 text-xs font-bold"
              />
              <Chip
                value={`${user.simulationTokens}`}
                color="green"
                className="px-2 py-1 text-xs font-bold"
              />
            </div>
            <Button
              variant="text"
              color="blue-gray"
              className="items-center gap-1 px-2 md:px-4 normal-case min-w-0"
              onClick={handleSignOut}
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              <span className="hidden sm:inline">Sign Out</span>
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
          <Menu>
            <MenuHandler>
              <div className="relative">
                <IconButton
                  variant="text"
                  color="blue-gray"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-blue-gray-500"
                  >
                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </IconButton>
              </div>
            </MenuHandler>
            <MenuList className="w-80 border-0 shadow-lg">
              {cartItems.length > 0 ? (
                <>
                  <div className="p-3 border-b border-blue-gray-50">
                    <Typography variant="h6" color="blue-gray" className="mb-1">
                      Shopping Cart
                    </Typography>
                    <Typography variant="small" color="gray">
                      {getCartSummary().itemCount} items • {getCartSummary().uniqueMolecules} unique molecules
                    </Typography>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {cartItems.slice(0, 5).map((item, index) => (
                      <MenuItem key={item.id} className="flex items-center gap-3 p-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-500 to-blue-600">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                            {item.name}
                          </Typography>
                          <Typography variant="small" color="gray" className="flex items-center gap-1 text-xs">
                            {item.amount}mg • ${item.totalPrice.toFixed(2)}
                          </Typography>
                        </div>
                      </MenuItem>
                    ))}
                    {cartItems.length > 5 && (
                      <MenuItem className="p-3 text-center">
                        <Typography variant="small" color="gray">
                          and {cartItems.length - 5} more items...
                        </Typography>
                      </MenuItem>
                    )}
                  </div>
                  <div className="p-3 border-t border-blue-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Total:
                      </Typography>
                      <Typography variant="small" color="green" className="font-bold">
                        ${getCartSummary().total}
                      </Typography>
                    </div>
                    <Button size="sm" color="blue" fullWidth onClick={() => navigate('/dashboard/molstar3d')}>
                      View Cart
                    </Button>
                    <Button 
                      size="sm" 
                      color="green" 
                      fullWidth 
                      onClick={handleStripeCheckout}
                      className="mt-2"
                      disabled={cartItems.length === 0}
                    >
                      Checkout 
                    </Button>
                  </div>
                </>
              ) : (
                <MenuItem className="p-6 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-gray-50 mx-auto mb-2">
                    <svg className="h-6 w-6 text-blue-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    </svg>
                  </div>
                  <Typography variant="small" color="blue-gray" className="mb-1">
                    Your cart is empty
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs">
                    Add molecules from the Molstar3D page
                  </Typography>
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
        
        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="mt-4 md:hidden">
            <Input label="Search" />
          </div>
        )}
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
