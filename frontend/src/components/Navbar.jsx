import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, ready, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  function openAuth(path) {
    navigate(path, { state: { background: location } });
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    function onClick(event) {
      if (!menuOpen) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const [mode, setMode] = useState("full");
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const TOP_RESET = 16;
    const HYST = 80;
    let lastY = window.scrollY;
    let lastSwitchY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY;

        if (y <= TOP_RESET) {
          if (modeRef.current !== "full") setMode("full");
          lastSwitchY = y;
        } else {
          if (
            modeRef.current === "full" &&
            goingDown &&
            y - lastSwitchY > HYST
          ) {
            setMode("compact");
            lastSwitchY = y;
          }
          if (
            modeRef.current === "compact" &&
            !goingDown &&
            lastSwitchY - y > HYST
          ) {
            setMode("full");
            lastSwitchY = y;
          }
        }

        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const compact = mode === "compact";

  return (
    <div
      className={`w-full sticky top-0 z-[1] will-change-transform transition-all duration-300 ${
        compact
          ? "backdrop-blur bg-white/80 shadow-md"
          : "bg-gray-100 shadow-lg"
      }`}
      style={{ minHeight: compact ? 0 : undefined }}
    >
      <div className={`px-6 ${compact ? "py-3" : "p-7"}`}>
        <div className="flex justify-between items-center relative">
          <Link to="/">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="logo"
                className={`mr-1 ml-2 transition-all ${
                  compact ? "h-7" : "h-8"
                }`}
              />
              <h2
                className={`text-red-500 font-semibold transition-all ${
                  compact ? "text-xl" : "text-2xl"
                }`}
              >
                Wanderlust
              </h2>
            </div>
          </Link>

          {!compact && (
            <div className="flex space-x-10 items-center">
              <Link to="/homes">
                <div
                  className={`flex items-center cursor-pointer ${
                    isActive("/homes")
                      ? "border-b-[3px] border-black text-black font-bold"
                      : ""
                  } hover:text-black`}
                >
                  <img
                    src="/home.png"
                    alt="Homes"
                    className="h-20 transition-transform duration-300 hover:scale-110"
                  />
                  <span className="text-sm">Homes</span>
                </div>
              </Link>
              <Link to="/experiences">
                <div
                  className={`flex items-center cursor-pointer relative ${
                    isActive("/experiences")
                      ? "border-b-[3px] border-black font-bold"
                      : ""
                  } hover:text-black`}
                >
                  <img
                    src="/experience.png"
                    alt="Experiences"
                    className="h-20 transition-transform duration-300 hover:scale-110"
                  />
                  <span className="text-sm">Experiences</span>
                  <span className="text-xs bg-gray-500 text-white px-1 rounded absolute -top-0 left-16">
                    NEW
                  </span>
                </div>
              </Link>
              <Link to="/services">
                <div
                  className={`flex items-center cursor-pointer relative ${
                    isActive("/services")
                      ? "border-b-[3px] border-black font-bold"
                      : ""
                  } hover:text-black`}
                >
                  <img
                    src="/service.png"
                    alt="Services"
                    className="h-20 transition-transform duration-300 hover:scale-110"
                  />
                  <span className="text-sm">Services</span>
                  <span className="text-xs bg-gray-500 text-white px-1 rounded absolute -top-0 right-12">
                    NEW
                  </span>
                </div>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 px-2 relative">
            <Link to="/listings/create">
              <span className="text-sm font-medium">Become a host</span>
            </Link>

            <button
              type="button"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              aria-label="Language and region"
              title="Language and region"
            >
              <img src="/world.svg" alt="language" className="h-5" />
            </button>

            <button
              ref={btnRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="user-menu"
              title="Menu"
            >
              <img src="/menu.svg" alt="menu" className="h-5" />
            </button>

            <div
              ref={menuRef}
              id="user-menu"
              role="menu"
              aria-hidden={!menuOpen}
              className={`absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border translate-y-2 ${
                menuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              } transition duration-150 origin-top-right`}
              style={{ display: menuOpen ? "block" : "none" }}
            >
              <div className="p-4 flex flex-col justify-between min-h-[320px] h-full">
                <div>
                  <Link
                    to="/help-center"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <span className="flex items-center justify-center w-5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium">
                      ?
                    </span>

                    <span className="font-semibold text-gray-800">
                      Help Centre
                    </span>
                  </Link>

                  <hr className="my-1" />

                  <Link
                    to="/listings/create"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-between items-start gap-3 px-3 py-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900">
                        Become a host
                      </p>
                      <p className="text-sm text-gray-500 leading-snug">
                        It's easy to start hosting and earn extra income
                      </p>
                    </div>

                    <img
                      src="/home.png"
                      alt="Host"
                      className="w-12 h-12 object-contain"
                    />
                  </Link>

                  <hr className="my-1" />

                  <Link
                    to="/refer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded-lg px-2"
                  >
                    <span>Refer a host</span>
                  </Link>
                  <Link
                    to="/co-host"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded-lg px-2"
                  >
                    <span>Find a co-host</span>
                  </Link>

                  {user && (
                    <>
                      <hr className="my-3" />
                      <Link
                        to="/account"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        Account
                      </Link>
                      <Link
                        to="/trips"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        Trips
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        Wishlists
                      </Link>
                    </>
                  )}
                </div>

                <div>
                  <hr className="my-3" />
                  {ready && user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-2 text-rose-600 font-semibold hover:bg-gray-50 rounded-lg"
                    >
                      Log out
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuth("/signup")}
                        className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-2 font-semibold"
                      >
                        Sign up
                      </button>
                      <button
                        onClick={() => openAuth("/login")}
                        className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-2"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {compact ? (
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-3 rounded-full shadow-md bg-white px-4 py-2 border">
              <button className="text-sm font-medium px-2">Anywhere</button>
              <span className="h-5 w-px bg-gray-300" />
              <button className="text-sm font-medium px-2">Anytime</button>
              <span className="h-5 w-px bg-gray-300" />
              <button className="text-sm font-medium px-2 text-gray-600">
                Add guests
              </button>
              <button className="ml-2 p-2 rounded-full bg-rose-500">
                <img src="/search.svg" alt="Search" className="w-4 white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <div className="w-[850px] flex rounded-full shadow-md overflow-hidden bg-white border p-1 px-2">
              <div className="flex-1 px-4 py-2 border-r">
                <p className="text-xs">Where</p>
                <p className="text-sm text-gray-500">Search destinations</p>
              </div>
              <div className="flex-1 px-4 py-2 border-r">
                <p className="text-xs">Check in</p>
                <p className="text-sm text-gray-500">Add dates</p>
              </div>
              <div className="flex-1 px-4 py-2 border-r">
                <p className="text-xs">Check out</p>
                <p className="text-sm text-gray-500">Add dates</p>
              </div>
              <div className="flex-1 px-4 py-2 flex items-center justify-between pr-4">
                <div>
                  <p className="text-xs">Who</p>
                  <p className="text-sm text-gray-500">Add guests</p>
                </div>
                <button className="bg-rose-500 text-white p-3 rounded-full ">
                  <img src="/search.svg" alt="Search" className="w-4 white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

