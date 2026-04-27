import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { User as UserIcon, Phone, MapPin, Coins, Package, Gift, Loader2, Save, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FloatingBubbles from "@/components/FloatingBubbles";

const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(300).optional(),
});

interface Listing { id: string; title: string; price: number; status: string; points_reward: number; created_at: string; }
interface Redemption { id: string; points_spent: number; status: string; created_at: string; rewards: { name: string } | null; }

const Profile = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name ?? "", phone: profile.phone ?? "", address: profile.address ?? "" });
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: l }, { data: r }] = await Promise.all([
        supabase.from("products").select("id, title, price, status, points_reward, created_at").eq("seller_id", user.id).order("created_at", { ascending: false }),
        supabase.from("redemptions").select("id, points_spent, status, created_at, rewards(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setListings((l as Listing[] | null) ?? []);
      setRedemptions((r as Redemption[] | null) ?? []);
    })();
  }, [user]);

  if (authLoading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    await refreshProfile();
    toast.success("Profile saved 🌿");
  };

  return (
    <>
      <section className="relative py-12 px-6 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <FloatingBubbles count={12} hueRange={[100, 160]} />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center md:items-end justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-extrabold text-primary-foreground shadow-xl" style={{ background: "var(--gradient-leaf)" }}>
              {(profile?.full_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
            </div>
            <div>
              <div className="leaf-chip mb-1 inline-flex"><Leaf size={12} /> Eco-warrior</div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold">{profile?.full_name || "Welcome!"}</h1>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="glass-card-strong rounded-2xl px-5 py-3 flex items-center gap-3">
            <Coins className="text-accent leaf-pulse" size={28} />
            <div>
              <div className="text-xs text-muted-foreground">Green points</div>
              <div className="font-display text-2xl font-extrabold gradient-text-reward">{profile?.points ?? 0}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <form onSubmit={handleSave} className="md:col-span-2 glass-card-strong rounded-3xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2"><UserIcon size={20} className="text-primary" /> Your details</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full name</label>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={80} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Pickup address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-3 text-muted-foreground" />
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={300} rows={3} placeholder="Street, city, pincode" className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none resize-none" />
              </div>
            </div>
            <button disabled={saving} className="btn-leaf disabled:opacity-60">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save changes</>}
            </button>
          </form>

          <div className="space-y-4">
            <div className="glass-card-strong rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3"><Package size={18} className="text-primary" /><h3 className="font-bold">My listings</h3></div>
              {listings.length === 0 ? (
                <div className="text-sm text-muted-foreground">No listings yet. <Link to="/sell" className="text-primary font-semibold">Sell something →</Link></div>
              ) : (
                <ul className="space-y-2 text-sm">
                  {listings.slice(0, 5).map((l) => (
                    <li key={l.id} className="flex justify-between items-start gap-2 pb-2 border-b border-border last:border-0">
                      <div className="flex-1 truncate">
                        <div className="font-semibold truncate">{l.title}</div>
                        <div className="text-xs text-muted-foreground">₹{l.price} • {l.status}</div>
                      </div>
                      <span className="gold-chip whitespace-nowrap">+{l.points_reward}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="glass-card-strong rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3"><Gift size={18} className="text-accent" /><h3 className="font-bold">Redemptions</h3></div>
              {redemptions.length === 0 ? (
                <div className="text-sm text-muted-foreground">No rewards redeemed yet. <Link to="/rewards" className="text-primary font-semibold">Browse →</Link></div>
              ) : (
                <ul className="space-y-2 text-sm">
                  {redemptions.slice(0, 5).map((r) => (
                    <li key={r.id} className="flex justify-between items-start gap-2 pb-2 border-b border-border last:border-0">
                      <div className="flex-1 truncate">
                        <div className="font-semibold truncate">{r.rewards?.name ?? "Reward"}</div>
                        <div className="text-xs text-muted-foreground">{r.status}</div>
                      </div>
                      <span className="gold-chip whitespace-nowrap">-{r.points_spent}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
