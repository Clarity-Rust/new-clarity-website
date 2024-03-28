import "./Home.css";
import { Button } from "./ui/button";
// import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="background">
      <div className="flex h-screen items-center justify-center flex-col my-5 home-main">
        <div>
          <img src="/home-logo.png" width={600} />
        </div>
        <div className="flex gap-4">
          <Button size="lg">Store</Button>
          <Button size="lg">Discord</Button>
          <Button size="lg">Steam</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
