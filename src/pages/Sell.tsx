import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, Recycle, Coins, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FloatingBubbles from "@/components/FloatingBubbles";

const schema = z.object({
  title: z.string().trim().min(3, "Title too short").max(120),
  category: z.enum(["laptop", "mobile", "headphones", "tv", "cables", "motherboard", "battery", "other"]),
  brand: z.string().trim().max(50).optional(),
  condition: z.string().trim().max(50).optional(),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().min(0).max(1000000),
});

const categories = ["laptop", "mobile", "headphones", "tv", "cables", "motherboard", "battery", "other"];
const conditions = ["Excellent", "Good", "Fair", "Working", "Parts only"];

const Sell = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "laptop",
    brand: "",
    condition: "Good",
    description: "",
    price: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const pointsPreview = Math.max(50, Math.min(500, Math.round(Number(form.price || 0) / 50)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to list a product");
      navigate("/auth?mode=signup");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("products").insert({
      seller_id: user.id,
      title: parsed.data.title,
      category: parsed.data.category,
      brand: parsed.data.brand || null,
      condition: parsed.data.condition || null,
      description: parsed.data.description || null,
      price: parsed.data.price,
      points_reward: pointsPreview,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success(`🎉 Listed! You earned +${pointsPreview} green points!`);
    navigate("/products");
  };

  return (
    <section className="relative min-h-[80vh] py-12 px-6 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <FloatingBubbles count={15} hueRange={[100, 160]} />
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="leaf-chip wiggle origin-left inline-flex"><Recycle size={14} /> Sell your e-waste</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            Turn old gadgets into <span className="gradient-text-reward">green points</span> 🪙
          </h1>
          <p className="text-muted-foreground">
            List once, earn forever. Every device you list awards you points instantly — even before it sells.
          </p>
          <div className="glass-card-strong rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Coins className="text-accent" size={28} />
              <div>
                <div className="text-sm text-muted-foreground">You'll earn</div>
                <div className="font-display text-2xl font-extrabold gradient-text-reward">+{pointsPreview} points</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Redeem points for trees planted, gift cards, eco merchandise & more.</p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Free listing — no commission</li>
            <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Points credited instantly</li>
            <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Verified buyer network</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 glass-card-strong rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold mb-2">Product details</h2>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Title *</label>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} required maxLength={120} placeholder="e.g. Lenovo ThinkPad X1 (Lightly used)" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Category *</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none capitalize">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Condition</label>
              <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none">
                {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Brand</label>
              <input value={form.brand} onChange={(e) => update("brand", e.target.value)} maxLength={50} placeholder="Apple, Sony…" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Asking price (₹) *</label>
              <input type="number" min={0} value={form.price} onChange={(e) => update("price", e.target.value)} required placeholder="2500" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={1000} rows={4} placeholder="Tell buyers more about its condition, accessories, age…" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none resize-none" />
          </div>
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center text-muted-foreground text-sm">
            <Upload className="mx-auto mb-2 text-primary" size={28} />
            Image upload coming soon — we'll use a category icon for now
          </div>
          <button disabled={submitting} type="submit" className="btn-leaf w-full !py-3.5 disabled:opacity-60">
            {submitting ? <><Loader2 className="animate-spin" size={18} /> Listing…</> : <>List & earn +{pointsPreview} points <Sparkles size={16} /></>}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Sell;
