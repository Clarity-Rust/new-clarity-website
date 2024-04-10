import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="bg-inherit h-screen grid place-content-center gap-5">
      <h1 className="text-4xl">Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500">Go back to the home page</Link>
    </div>
  );
}

export default PageNotFound;