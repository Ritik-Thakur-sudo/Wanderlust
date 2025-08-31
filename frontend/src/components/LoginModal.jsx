import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ open = true }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const isSignup = pathname.startsWith("/signup");
  const { signup, login } = useAuth();

  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onClose = () => {
    if (state?.background || window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (isSignup) {
        const { username, email, password, name } = signupForm;
        if (!username || !email || !password) {
          setErr("Username, email and password are required");
        } else {
          await signup({
            username: username.trim(),
            email: email.trim(),
            password,
            name: name.trim(),
          });
          onClose();
        }
      } else {
        const { identifier, password } = loginForm;
        if (!identifier || !password) {
          setErr("username/Email and password are required");
        } else {
          await login({
            identifier: identifier.trim(),
            password,
          });
          onClose();
        }
      }
    } catch (error) {
      const msg = error?.response?.data?.error || "Something went wrong";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-[min(640px,92vw)] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-black/5 grid place-items-center"
            aria-label="Close"
          >
            <img src="/cross-icon.svg" alt="Cross" className="w-4" />
          </button>
          <h2 className="text-lg font-semibold">
            {isSignup ? "Finish signing up" : "Log in"}
          </h2>
          <span className="w-9" />
        </div>

        <hr />

        <div className="px-6 py-6 space-y-5">
          <h3 className="text-2xl font-bold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h3>

          <form onSubmit={onSubmit} className="space-y-3">
            {isSignup ? (
              <>
                <Input
                  placeholder="Username"
                  autoComplete="username"
                  value={signupForm.username}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, username: e.target.value }))
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                />
                <Input
                  placeholder="Full name"
                  autoComplete="name"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </>
            ) : (
              <>
                <Input
                  placeholder="Email or username"
                  autoComplete="username"
                  value={loginForm.identifier}
                  onChange={(e) =>
                    setLoginForm((f) => ({ ...f, identifier: e.target.value }))
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                />
              </>
            )}

            {err && <p className="text-sm text-rose-600">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
            </button>
          </form>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-sm text-neutral-500">or</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="space-y-3">
            <SocialBtn
              icon={
                <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
              }
              label="Continue with Google"
              onClick={() =>
                alert("It's still in development. please signup with Email")
              }
            />
            <SocialBtn
              icon={
                <img src="/apple-icon.svg" alt="Apple" className="h-5 w-5" />
              }
              label="Continue with Apple"
              onClick={() =>
                alert("It's still in development. please signup with Email")
              }
            />
            <SocialBtn
              icon={
                <img
                  src="/facebook-icon.svg"
                  alt="Facebook"
                  className="h-5 w-5"
                />
              }
              label="Continue with Facebook"
              onClick={() =>
                alert("It's still in development. please signup with Email")
              }
            />
            <SocialBtn
              icon={
                <img src="/email-icon.svg" alt="Email" className="h-5 w-5" />
              }
              label="Continue with Email"
              onClick={() =>
                navigate("/signup", {
                  state: { background: state?.background || null },
                })
              }
            />
          </div>

          <p className="text-sm text-neutral-600">
            {isSignup ? "Already have an account? " : "New to Wanderlust? "}
            <button
              type="button"
              className="underline"
              onClick={() =>
                navigate(isSignup ? "/login" : "/signup", {
                  state: { background: state?.background || null },
                })
              }
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/80 " +
        (props.className || "")
      }
    />
  );
}

function SocialBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold hover:bg-black/5 active:bg-black/10"
      type="button"
    >
      <span className="h-5 w-5 flex items-center justify-center">{icon}</span>

      <span className="mx-auto">{label}</span>

      <span className="w-5" />
    </button>
  );
}
