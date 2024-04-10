import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { IoIosLogIn, IoIosArrowDropdown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { sharedState, setSharedState } = useAppContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const logout = () => {
    setSharedState({
      ...sharedState,
      authenticated: false,
      username: "",
      checkoutURL: "",
      basketIdent: "",
      authURL: "",
      packages: [],
    });
    localStorage.clear();

    navigate("/store");
  };

  useEffect(() => {
    const handleUrlChange = async () => {
      const queryParam = searchParams.get("authed");
      if (queryParam === "true") {
        const url = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/baskets/${sharedState.basketIdent}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setSharedState((prevState) => ({
          ...prevState,
          authenticated: true,
          username: data.data.username,
        }));
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("username", data.data.username);
      }
    };

    handleUrlChange();
  }, [searchParams, setSharedState, sharedState]);

  function ProfileMenu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="dark">
          <Button variant="outline" className="flex gap-2">
            Hello, {sharedState.username}{" "}
            <span>
              {" "}
              <IoIosArrowDropdown size={23} />{" "}
            </span>{" "}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark w-56">
          <DropdownMenuLabel>Contact Us</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className=" text-sm hover:cursor-pointer">
              <Button asChild variant="link">
                <Link to="https://steamcommunity.com/groups/clarityrust">
                  Steam
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm hover:cursor-pointer">
              <Button asChild variant="link">
                <Link to="https://discord.gg/clarityrust">Discord</Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logout();
            }}
            className="hover:cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const Profile: React.FC = () => (
    <div>
      {sharedState.authenticated ? (
        <ProfileMenu />
      ) : (
        <Link className="flex gap-1" to={sharedState.authURL}>
          Login to purchase items
          <IoIosLogIn size={23} />
        </Link>
      )}
    </div>
  );

  const Cart: React.FC = () => {
    if (!sharedState.authenticated) return null;
    // Calculate the number of items correctly, assuming 'packages' is an array
    const itemCount = sharedState.packages.length;
    return (
      <Link to="/store/cart">
        Cart - {itemCount} item{itemCount !== 1 ? "s" : ""}
      </Link>
    );
  };

  return (
    <nav className="navbar h-15 bg-gray-800 p-3 text-white">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex gap-2">
            <img src="/clarity-text.svg" alt="logo" className="h-10 " />
          </Link>
          <Link to="/store">Store</Link>
          <Link to="/staff">Staff</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/store/event">Live Events</Link>
        </div>

        <div className="flex items-center gap-4">
          <Cart />
          <Profile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
