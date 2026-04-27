import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, Leaf, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FloatingBubbles from "@/components/FloatingBubbles";

const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be 6+ characters").max(72),
});
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password too short").max(72),
});

const Auth = () => {
  const [params] = useSearchParams();
  const initial = params.get("mode") === "signup";
  const [isSignup, setIsSignup] = useState(initial);
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: parsed.data.full_name },
          },
        });
        if (error) {
          if (error.message.includes("already")) toast.error("This email is already registered. Try logging in.");
          else toast.error(error.message);
          return;
        }
        toast.success("🎉 Welcome to EcoCycle! You're in.");
        navigate("/profile");
      } else {
        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
        if (error) {
          toast.error("Invalid email or password");
          return;
        }
        toast.success("Welcome back! 🌿");
        navigate("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-12 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <FloatingBubbles count={18} hueRange={[100, 150]} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <Leaf className="mx-auto text-primary leaf-pulse mb-2" size={40} />
          <h1 className="font-display text-3xl font-extrabold mb-1">
            {isSignup ? "Join EcoCycle" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Get 100 free points + start earning today 🪙" : "Sign in to track your green journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-strong rounded-3xl p-7 space-y-4">
          {isSignup && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full name</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required maxLength={80} placeholder="Your name" className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required maxLength={255} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6} maxLength={72} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
            </div>
          </div>
          <button disabled={loading} type="submit" className="btn-leaf w-full disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>{isSignup ? "Create account" : "Sign in"} <ArrowRight size={16} /></>}
          </button>
          <div className="text-center text-sm text-muted-foreground pt-2">
            {isSignup ? "Already an eco-warrior?" : "New here?"}{" "}
            <button type="button" onClick={() => setIsSignup((s) => !s)} className="text-primary font-semibold hover:underline">
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </div>
        </form>
        <div className="text-center text-xs text-muted-foreground mt-5">
          By continuing, you agree to recycle responsibly 🌱
        </div>
      </div>
    </section>
  );
};

export default Auth;
