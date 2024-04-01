import { Link } from "react-router-dom";
import "./Home.css";
import { Button } from "./ui/button";

const Home: React.FC = () => {
  return (
    <div className="background">
      <div className="home-main flex h-screen flex-col items-center justify-center">
        <div>
          <img src="/home-logo.png" width={600} />
        </div>
        <div className="flex gap-4">
          <Button size="lg" className="bg-amber-600" asChild>
            <Link to="/store"> Store </Link>
          </Button>
          <Button size="lg" className="bg-gray-800" asChild>
            <Link to="https://steamcommunity.com/groups/clarityrust">
              {" "}
              Steam{" "}
            </Link>
          </Button>
          <Button size="lg" className="bg-blue-800" asChild>
            <Link to="https://discord.gg/clarityrust"> Discord </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
