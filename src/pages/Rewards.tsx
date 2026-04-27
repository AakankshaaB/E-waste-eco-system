import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Gift, Coins, Loader2, Sparkles, Leaf, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import FloatingBubbles from "@/components/FloatingBubbles";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  stock: number;
}

const rewardEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("tree")) return "🌳";
  if (n.includes("amazon") || n.includes("gift")) return "🎁";
  if (n.includes("tote") || n.includes("bag")) return "👜";
  if (n.includes("toothbrush") || n.includes("bamboo")) return "🪥";
  if (n.includes("solar") || n.includes("power")) return "🔋";
  if (n.includes("movie")) return "🎬";
  return "✨";
};

const Rewards = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("rewards").select("*").eq("is_active", true).order("points_required");
      setRewards((data as Reward[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  const handleRedeem = async (r: Reward) => {
    if (!user) {
      toast.error("Please log in to redeem rewards");
      return;
    }
    if ((profile?.points ?? 0) < r.points_required) {
      toast.error(`You need ${r.points_required - (profile?.points ?? 0)} more points`);
      return;
    }
    setRedeeming(r.id);
    const { error } = await supabase.from("redemptions").insert({
      user_id: user.id,
      reward_id: r.id,
      points_spent: r.points_required,
    });
    setRedeeming(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success(`🎉 Redeemed ${r.name}! Check your email for next steps.`);
  };

  const userPoints = profile?.points ?? 0;

  return (
    <>
      <section className="relative py-12 px-6 overflow-hidden" style={{ background: "var(--gradient-cream)" }}>
        <FloatingBubbles count={14} hueRange={[40, 90]} />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="gold-chip mb-3 inline-flex"><Sparkles size={14} /> Rewards catalog</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
            Cash in your <span className="gradient-text-reward">green points</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Every gram of e-waste you recycle = points. Redeem for trees, gift cards, and eco-friendly goodies.
          </p>
          {user ? (
            <div className="inline-flex items-center gap-3 glass-card-strong rounded-2xl px-6 py-4">
              <Coins className="text-accent leaf-pulse" size={28} />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Your balance</div>
                <div className="font-display text-2xl font-extrabold gradient-text-reward">{userPoints} pts</div>
              </div>
            </div>
          ) : (
            <Link to="/auth?mode=signup" className="btn-leaf">Sign up to start earning</Link>
          )}
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((r) => {
                const canRedeem = user && userPoints >= r.points_required;
                const progress = Math.min(100, Math.round((userPoints / r.points_required) * 100));
                return (
                  <div key={r.id} className="product-card p-6 flex flex-col">
                    <div className="text-6xl mb-3 floating-fast">{rewardEmoji(r.name)}</div>
                    <h3 className="font-display font-bold text-lg mb-2">{r.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{r.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="gold-chip"><Coins size={12} /> {r.points_required} pts</div>
                      <div className="text-xs text-muted-foreground">{r.stock} left</div>
                    </div>
                    {user && (
                      <div className="mb-3">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full transition-all duration-700" style={{ width: `${progress}%`, background: "var(--gradient-reward)" }} />
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {canRedeem ? "✓ You can redeem this!" : `${r.points_required - userPoints} more points to go`}
                        </div>
                      </div>
                    )}
                    <button
                      disabled={!canRedeem || redeeming === r.id}
                      onClick={() => handleRedeem(r)}
                      className={`w-full ${canRedeem ? "btn-leaf" : "btn-cream"} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {redeeming === r.id ? <Loader2 className="animate-spin" size={16} /> : canRedeem ? <><Gift size={16} /> Redeem now</> : "Keep recycling 🌱"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Rewards;
