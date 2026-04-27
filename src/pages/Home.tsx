import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Leaf, Recycle, Gift, ShieldCheck, ArrowRight, Sparkles, TrendingUp, Smartphone, Laptop, Headphones, Cable, Cpu, Tv, Coins, Heart } from "lucide-react";
import FloatingBubbles from "@/components/FloatingBubbles";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImg from "@/assets/hero-ewaste.jpg";

const taglines = [
  "Recycle. Earn. Repeat.",
  "Turn e-waste into rewards.",
  "Be the change. Start today.",
  "Every device deserves a second life.",
];

const categories = [
  { icon: Laptop, label: "Laptops", color: "bg-emerald-500/10 text-emerald-700" },
  { icon: Smartphone, label: "Mobiles", color: "bg-lime-500/10 text-lime-700" },
  { icon: Headphones, label: "Headphones", color: "bg-teal-500/10 text-teal-700" },
  { icon: Tv, label: "TV / Monitors", color: "bg-green-500/10 text-green-700" },
  { icon: Cable, label: "Cables", color: "bg-yellow-500/10 text-yellow-700" },
  { icon: Cpu, label: "Boards", color: "bg-amber-500/10 text-amber-700" },
];

const stats = [
  { value: "12K+", label: "Devices recycled", icon: Recycle },
  { value: "₹4.2L", label: "Earned by users", icon: Coins },
  { value: "8.6T", label: "CO₂ saved (tons)", icon: Leaf },
  { value: "5K+", label: "Happy eco-warriors", icon: Heart },
];

const steps = [
  { num: "01", title: "List your device", desc: "Snap a photo, set a price, and share its story.", icon: Smartphone },
  { num: "02", title: "Get verified buyers", desc: "We connect you with eco-conscious buyers in minutes.", icon: ShieldCheck },
  { num: "03", title: "Earn cash + points", desc: "Sell for money AND collect green points to redeem rewards.", icon: Coins },
  { num: "04", title: "Redeem cool gifts", desc: "Plant trees, get gift cards, eco merch & more.", icon: Gift },
];

const Home = () => {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const stepsAnim = useScrollAnimation();
  const catsAnim = useScrollAnimation();
  const statsAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  useEffect(() => {
    const current = taglines[taglineIdx];
    const speed = isDeleting ? 35 : 75;
    const t = setTimeout(() => {
      if (!isDeleting && text === current) {
        setTimeout(() => setIsDeleting(true), 1800);
        return;
      }
      if (isDeleting && text === "") {
        setIsDeleting(false);
        setTaglineIdx((p) => (p + 1) % taglines.length);
        return;
      }
      setText(isDeleting ? current.substring(0, text.length - 1) : current.substring(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, isDeleting, taglineIdx]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <FloatingBubbles count={22} hueRange={[90, 160]} />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px] floating" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/15 blur-[140px] floating-slow" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="leaf-chip mb-5 wiggle origin-bottom-left">
              <Sparkles size={14} /> India's #1 e-waste rewards platform
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-5">
              Refuse to <span className="gradient-text">reuse</span>?<br />
              The Earth pays.
            </h1>
            <div className="text-lg md:text-xl text-muted-foreground font-mono mb-7 h-7">
              <span className="text-primary">▸ </span>
              <span>{text}</span>
              <span className="typing-cursor" />
            </div>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Sell your old electronics in 60 seconds. Earn cash, collect{" "}
              <span className="gradient-text-reward font-bold">green points</span>, and redeem them for trees,
              gift cards, and eco-friendly goodies. 🌍
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/sell" className="btn-leaf">
                <Recycle size={18} /> Sell your e-waste
              </Link>
              <Link to="/products" className="btn-cream">
                Browse store <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["bg-emerald-300", "bg-lime-300", "bg-amber-300", "bg-green-400"].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full border-2 border-card ${c}`} />
                ))}
              </div>
              <div>
                <div className="font-bold text-foreground">5,000+ eco-warriors</div>
                <div>have joined this month 🌱</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative rounded-[3rem] overflow-hidden bg-card border border-border shadow-2xl floating">
              <img src={heroImg} alt="E-waste recycling illustration with green leaves" className="w-full h-auto" width={1024} height={1024} />
            </div>
            <div className="absolute -top-4 -left-4 glass-card-strong rounded-2xl px-4 py-3 floating-fast">
              <div className="flex items-center gap-2">
                <Coins className="text-accent" size={20} />
                <div>
                  <div className="text-xs text-muted-foreground">You earned</div>
                  <div className="font-bold text-sm">+250 points</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 glass-card-strong rounded-2xl px-4 py-3 floating-slow">
              <div className="flex items-center gap-2">
                <Leaf className="text-primary leaf-pulse" size={20} />
                <div>
                  <div className="text-xs text-muted-foreground">CO₂ saved</div>
                  <div className="font-bold text-sm">12.4 kg today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section ref={catsAnim.ref} className={`py-20 px-6 animate-on-scroll ${catsAnim.isVisible ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-chip mb-3 inline-flex"><Recycle size={14} /> Categories</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
              What can you <span className="gradient-text">recycle</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From dusty laptops to tangled cables — if it has a circuit, we'll take it.</p>
          </div>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children ${catsAnim.isVisible ? "visible" : ""}`}>
            {categories.map((c) => (
              <Link key={c.label} to="/products" className="product-card p-6 text-center group">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${c.color} group-hover:scale-110 transition-transform`}>
                  <c.icon size={26} />
                </div>
                <div className="font-semibold text-sm">{c.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={stepsAnim.ref} className={`py-20 px-6 relative overflow-hidden animate-on-scroll ${stepsAnim.isVisible ? "visible" : ""}`} style={{ background: "var(--gradient-cream)" }}>
        <FloatingBubbles count={10} hueRange={[40, 90]} />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="leaf-chip mb-3 inline-flex"><TrendingUp size={14} /> How it works</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
              Sell in <span className="gradient-text">4 easy steps</span>
            </h2>
          </div>
          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children ${stepsAnim.isVisible ? "visible" : ""}`}>
            {steps.map((s) => (
              <div key={s.num} className="product-card p-7 relative">
                <div className="text-6xl font-display font-extrabold gradient-text opacity-30 mb-2">{s.num}</div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <s.icon size={22} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsAnim.ref} className={`py-20 px-6 animate-on-scroll ${statsAnim.isVisible ? "visible" : ""}`}>
        <div className="max-w-6xl mx-auto rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden" style={{ background: "var(--gradient-leaf)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-primary-foreground">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon size={32} className="mx-auto mb-2 opacity-80" />
                <div className="font-display text-4xl md:text-5xl font-extrabold mb-1">{s.value}</div>
                <div className="text-sm opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaAnim.ref} className={`py-20 px-6 animate-on-scroll ${ctaAnim.isVisible ? "visible" : ""}`}>
        <div className="max-w-4xl mx-auto text-center glass-card-strong rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
          <Gift className="absolute top-6 right-8 text-accent/30 floating" size={80} />
          <Leaf className="absolute bottom-6 left-8 text-primary/30 floating-slow" size={80} />
          <div className="gold-chip mb-4 inline-flex"><Sparkles size={14} /> Welcome bonus</div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
            Get <span className="gradient-text-reward">100 free points</span> on signup
          </h2>
          <p className="text-muted-foreground mb-7 max-w-lg mx-auto">
            Join 5,000+ eco-warriors turning trash into treasure. Plant trees, redeem gift cards, save the planet.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/auth?mode=signup" className="btn-leaf">Start earning <ArrowRight size={16} /></Link>
            <Link to="/rewards" className="btn-cream">See rewards</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
