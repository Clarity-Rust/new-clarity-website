import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { Button } from "./ui/button";

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
      packages: [""],
    });
    // clear local storage
    localStorage.removeItem("basketIdent");
    localStorage.removeItem("checkoutURL");
    localStorage.removeItem("authURL");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("packages");

    // redirect to home
    navigate("/");
  };

  useEffect(() => {
    const handleUrlChange = async () => {
      const queryParam = searchParams.get("authed");

      if (queryParam === "true") {
        // re-call basket endpoint to get username
        const url = `https://headless.tebex.io/api/accounts/${
          import.meta.env.VITE_WEBSTORE_IDENT
        }/baskets/${sharedState.basketIdent}`;
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
        localStorage.setItem("packages", sharedState.packages.join(","));
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
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="navbar bg-gray-800 p-3 text-white">
      <div className="flex justify-between items-center w-full">
        {/* Left items */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex">
            <img src="/clarity-logo.svg" alt="logo" className="h-10" />
            <img src="/clarity-text.svg" alt="logo" className="h-10" />
          </Link>
          <Link to="/store">Store</Link>
          {sharedState.authenticated && (
            <Link to="/store/cart">
              Cart - {sharedState.packages.length - 1} items
            </Link>
          )}
          <Link to="/staff">Staff</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>

        {/* Right items */}
        <div className="flex items-center gap-4">
          <Profile />
          {sharedState.authenticated && (
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          )}
          {/* <Button asChild>
        <Link to="https://discord.gg/clarityrust">Discord</Link>
      </Button>
      <Button asChild>
        <Link to="https://steamcommunity.com/groups/clarityrust">Steam</Link>
      </Button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
