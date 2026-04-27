import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Coins, MapPin, Loader2, PackageSearch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FloatingBubbles from "@/components/FloatingBubbles";
import laptopImg from "@/assets/product-laptop.jpg";
import mobileImg from "@/assets/product-mobile.jpg";
import headphonesImg from "@/assets/product-headphones.jpg";
import cablesImg from "@/assets/product-cables.jpg";
import motherboardImg from "@/assets/product-motherboard.jpg";
import tvImg from "@/assets/product-tv.jpg";

const categoryImages: Record<string, string> = {
  laptop: laptopImg,
  mobile: mobileImg,
  headphones: headphonesImg,
  cables: cablesImg,
  motherboard: motherboardImg,
  tv: tvImg,
};

const categories = ["all", "laptop", "mobile", "headphones", "tv", "cables", "motherboard", "battery", "other"];

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  brand: string | null;
  condition: string | null;
  price: number;
  points_reward: number;
  image_url: string | null;
  status: string;
  created_at: string;
}

// Demo fallback products shown when DB is empty
const demoProducts: Product[] = [
  { id: "d1", title: "Lenovo ThinkPad X1 (Used)", description: "Lightly used, 8GB RAM, 256GB SSD. Battery still strong.", category: "laptop", brand: "Lenovo", condition: "Good", price: 12500, points_reward: 250, image_url: null, status: "available", created_at: "" },
  { id: "d2", title: "Samsung Galaxy S20 (Cracked)", description: "Cracked screen but fully functional. Good for parts or repair.", category: "mobile", brand: "Samsung", condition: "Fair", price: 4500, points_reward: 100, image_url: null, status: "available", created_at: "" },
  { id: "d3", title: "Sony WH-1000XM3 Headphones", description: "Premium noise-cancelling. One ear cushion worn.", category: "headphones", brand: "Sony", condition: "Good", price: 3200, points_reward: 80, image_url: null, status: "available", created_at: "" },
  { id: "d4", title: "Bundle of 15+ Chargers & Cables", description: "Mixed lot of USB, micro-USB, lightning and old chargers.", category: "cables", brand: "Mixed", condition: "Used", price: 350, points_reward: 50, image_url: null, status: "available", created_at: "" },
  { id: "d5", title: "ASUS Motherboard B450M", description: "AM4 socket. Tested working. No accessories.", category: "motherboard", brand: "ASUS", condition: "Working", price: 2800, points_reward: 90, image_url: null, status: "available", created_at: "" },
  { id: "d6", title: "LG 32-inch LED TV", description: "Full HD, working condition. Light scratches on bezel.", category: "tv", brand: "LG", condition: "Good", price: 6500, points_reward: 180, image_url: null, status: "available", created_at: "" },
  { id: "d7", title: "Dell Inspiron Laptop (For parts)", description: "Won't boot. Hard drive removed. Good for spares.", category: "laptop", brand: "Dell", condition: "Parts only", price: 1500, points_reward: 60, image_url: null, status: "available", created_at: "" },
  { id: "d8", title: "Redmi Note 9 (Working)", description: "Used 2 years. All accessories included.", category: "mobile", brand: "Redmi", condition: "Excellent", price: 5800, points_reward: 120, image_url: null, status: "available", created_at: "" },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("status", "available").order("created_at", { ascending: false });
      const dbProducts = (data as Product[] | null) ?? [];
      setProducts(dbProducts.length > 0 ? [...dbProducts, ...demoProducts] : demoProducts);
      setLoading(false);
    })();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.brand?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <section className="relative py-12 px-6 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <FloatingBubbles count={12} hueRange={[100, 150]} />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="leaf-chip mb-3 inline-flex"><PackageSearch size={14} /> E-waste marketplace</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
            Browse <span className="gradient-text">eco-treasures</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Hundreds of pre-loved electronics waiting for a second life. Buy responsibly. 🌱</p>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-strong rounded-2xl p-4 md:p-5 mb-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search laptops, mobiles, brands…"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-primary/10"
                  }`}
                >
                  {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <PackageSearch size={48} className="mx-auto mb-3 opacity-40" />
              No items match your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <div key={p.id} className="product-card group">
                  <div className="aspect-square bg-secondary/40 overflow-hidden relative">
                    <img
                      src={p.image_url || categoryImages[p.category] || laptopImg}
                      alt={p.title}
                      loading="lazy"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 gold-chip">
                      <Coins size={12} /> +{p.points_reward}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="leaf-chip !text-[10px] !py-0.5">{p.category}</span>
                      {p.brand && <span className="text-xs text-muted-foreground">• {p.brand}</span>}
                    </div>
                    <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="font-display font-extrabold text-lg gradient-text">₹{p.price.toLocaleString()}</div>
                      <button className="btn-leaf !py-2 !px-4 text-xs">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;
