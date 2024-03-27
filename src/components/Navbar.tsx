import { Link, useSearchParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  const { sharedState, setSharedState } = useAppContext();
  const [searchParams] = useSearchParams();

  const logout = () => {
    setSharedState({
      ...sharedState,
      authenticated: false,
      username: "",
      checkoutURL: "",
      basketIdent: "",
      authURL: "",
    });
    // clear local storage
    localStorage.removeItem("basketIdent");
    localStorage.removeItem("checkoutURL");
    localStorage.removeItem("authURL");
    localStorage.removeItem("authenticated");
  };

  useEffect(() => {
    const handleUrlChange = async () => {
      const queryParam = searchParams.get("authed");

      if (queryParam === "true") {
        // re-call basket endpoint to get username
        const url = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/baskets/${sharedState.basketIdent}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setSharedState({
          ...sharedState,
          authenticated: true,
          username: data.data.username,
        });
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("username", data.data.username);
      }
    };

    handleUrlChange();
  }, [searchParams, setSharedState]);

  const Profile: React.FC = () => {
    return (
      // if authenticated, show username. else show banner
      <div>
        {sharedState.authenticated ? (
          "hello, " + sharedState.username
        ) : (
          <div className="flex gap-3">
            <Link to={sharedState.authURL}>Login to purchase items</Link>
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="navbar bg-gray-800 p-3 text-white">
      <ul className="flex items-center justify-center gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/staff">Staff</Link>
        </li>
        <li>
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Button asChild>
            <Link to="https://discord.gg/clarityrust"> Discord </Link>
          </Button>
        </li>
        <li>
          <Button asChild>
            <Link to="https://steamcommunity.com/groups/clarityrust">
              Steam
            </Link>
          </Button>
        </li>
        <li>{/* <Profile /> */}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
