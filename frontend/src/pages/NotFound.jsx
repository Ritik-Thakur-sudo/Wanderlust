import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Page Not Found - Airbnb Clone";
  }, []);

  return (
    <div className="flex items-center justify-center bg-white p-5">
      <div className="mx-auto grid grid-cols-2 gap-14 items-center">
        <div>
          <h1 className="text-9xl font-bold text-gray-600 mb-6">
            O<span className="text-gray-600">ops!</span>
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            We can't seem to find the page you're looking for.
          </p>
          <p className="text-md text-gray-500 mb-6">
            <strong>Error code:</strong> 404
          </p>
          <p className="text-gray-600 mb-4">
            Here are some helpful links instead:
          </p>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="text-[#8BBEC1]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-[#8BBEC1]">
                Search
              </Link>
            </li>
            <li>
              <Link to="/help" className="text-[#8BBEC1]">
                Help
              </Link>
            </li>
            <li>
              <Link to="/travel" className="text-[#8BBEC1]">
                Traveling on Airbnb
              </Link>
            </li>
            <li>
              <Link to="/hosting" className="text-[#8BBEC1]">
                Hosting on Airbnb
              </Link>
            </li>
            <li>
              <Link to="/trust" className="text-[#8BBEC1]">
                Trust & Safety
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="text-[#8BBEC1]">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <img
            src="/notFound.gif"
            alt="page not found img"
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
