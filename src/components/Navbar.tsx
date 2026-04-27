import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, User, LogOut, Gift, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoLeaf from "@/assets/logo-leaf.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Browse" },
  { to: "/sell", label: "Sell" },
  { to: "/rewards", label: "Rewards" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass-card-strong py-2" : "py-4 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoLeaf} alt="EcoCycle logo" className="w-9 h-9 leaf-pulse" width={36} height={36} />
          <span className="font-display font-extrabold text-xl tracking-tight">
            <span className="gradient-text">EcoCycle</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive ? "bg-primary/15 text-primary" : "text-foreground/70 hover:text-primary hover:bg-primary/8"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="gold-chip">
                <Coins size={14} /> {profile?.points ?? 0} pts
              </div>
              <Link to="/profile" className="btn-cream !py-2 !px-4 text-sm">
                <User size={16} /> Profile
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition" aria-label="Sign out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-cream !py-2 !px-4 text-sm">Login</Link>
              <Link to="/auth?mode=signup" className="btn-leaf !py-2 !px-4 text-sm">Join Free</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-card-strong mx-4 mt-2 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl font-semibold ${isActive ? "bg-primary/15 text-primary" : "text-foreground/80"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-border my-2" />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl font-semibold text-foreground/80 flex items-center gap-2">
                <Gift size={16} /> {profile?.points ?? 0} pts • Profile
              </Link>
              <button onClick={() => { setOpen(false); handleSignOut(); }} className="px-4 py-2.5 rounded-xl font-semibold text-destructive text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)} className="btn-cream">Login</Link>
              <Link to="/auth?mode=signup" onClick={() => setOpen(false)} className="btn-leaf">Join Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
