import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <div className="w-full shadow-lg bg-gray-100 p-7 sticky top-0 z-100">
      <div className="flex justify-between">
        <Link to="/">
          <div className="flex items-center">
            <img src="/logo.png" alt="airbnb logo" className="h-8 mr-1 ml-2" />
            <h2 className="text-red-500 font-semibold text-2xl">airbnb</h2>
          </div>
        </Link>

        <div className="flex space-x-10 items-center">
          <Link to="/homes">
            <div
              className={`flex items-center transition-all duration-300 cursor-pointer  ${
                isActive("/homes")
                  ? "border-b-[3px] border-black text-black font-bold"
                  : ""
              }hover:text-black`}
            >
              <img
                src="/home.png"
                alt="Homes"
                className={`h-20  transition-transform duration-300 ${
                  isActive("/homes") ? "" : "hover:scale-110"
                }`}
              />
              <span className="text-sm">Homes</span>
            </div>
          </Link>

          <Link to="/experiences">
            <div
              className={`flex items-center transition-all duration-300 cursor-pointer relative ${
                isActive("/experiences")
                  ? "border-b-[3px] border-black font-bold"
                  : ""
              }hover:text-black`}
            >
              <img
                src="/experience.png"
                alt="Experiences"
                className={`h-20 transition-transform duration-300 ${
                  isActive("/experiences") ? "" : "hover:scale-110"
                }`}
              />
              <span className="text-sm">Experiences</span>
              <span className="text-xs bg-gray-500 text-white px-1 rounded absolute -top-0  left-16">
                NEW
              </span>
            </div>
          </Link>

          <Link to="/services">
            <div
              className={`flex items-center transition-all duration-300 cursor-pointer relative ${
                isActive("/services")
                  ? "border-b-[3px] border-black font-bold"
                  : ""
              } hover:text-black`}
            >
              <img
                src="/service.png"
                alt="Services"
                className={`h-20 transition-transform duration-300 ${
                  isActive("/services") ? "" : "hover:scale-110"
                }`}
              />
              <span className="text-sm">Services</span>
              <span className="text-xs bg-gray-500 text-white px-1 rounded absolute -top-0 right-12 ">
                NEW
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-start space-x-7 px-5">
          <Link>
            <span className="text-sm font-medium">Become a host</span>
          </Link>
          <Link>
            <img src="/world.svg" alt="language" className="h-5" />
          </Link>
          <Link>
            <img src="/menu.svg" alt="menu" className="h-5" />
          </Link>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <div className="w-[850px] flex rounded-full shadow-md overflow-hidden bg-white border p-1 px-2">
          <Link className="flex-1">
            <div className="px-4 py-2 border-r">
              <p className="text-xs">Where</p>
              <p className="text-sm text-gray-500">Search destinations</p>
            </div>
          </Link>
          <Link className="flex-1">
            <div className="px-4 py-2 border-r">
              <p className="text-xs">Check in</p>
              <p className="text-sm text-gray-500">Add dates</p>
            </div>
          </Link>
          <Link className="flex-1">
            <div className="px-4 py-2 border-r">
              <p className="text-xs">Check out</p>
              <p className="text-sm text-gray-500">Add dates</p>
            </div>
          </Link>
          <Link className="flex-1">
            <div className="px-4 py-2 flex items-center justify-between pr-4">
              <div>
                <p className="text-xs">Who</p>
                <p className="text-sm text-gray-500">Add guests</p>
              </div>
              <button className="bg-rose-500 text-white p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
