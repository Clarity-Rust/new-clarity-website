// components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
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
      </ul>
    </nav>
  );
};

export default Navbar;
