import { Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const Navbar: React.FC = () => {
  const { sharedState, setSharedState } = useAppContext();

  async function login() {
    const response = await fetch("/api/basket", {
      method: "POST",
    });
    const data = await response.json();
    setSharedState({
      ...sharedState,
      basketId: data.basketId,
    });
  }

  const Profile: React.FC = () => {
    return (
      // if authenticated, show username. else show banner
      <div>
        {sharedState.authenticated
          ? "hello," + sharedState.username
          : "Login to purchase items."}
      </div>
    );
  };

  return (
    <nav className="bg-gray-800 p-3 text-white">
      <ul className="flex gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/store">Store</Link>
        </li>
        <li>
          <Link to="/store/cart">Cart</Link>
        </li>
        <li>
          <Profile />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
