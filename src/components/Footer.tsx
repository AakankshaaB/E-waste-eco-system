import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Github, Instagram, Twitter } from "lucide-react";
import logoLeaf from "@/assets/logo-leaf.png";

const Footer = () => (
  <footer className="bg-secondary/40 border-t border-border mt-20">
    <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <img src={logoLeaf} alt="" className="w-8 h-8" width={32} height={32} />
          <span className="font-display font-extrabold text-lg gradient-text">EcoCycle</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Recycle electronics. Earn rewards. Save the planet — one device at a time. 🌱
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-3">Explore</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/products" className="hover:text-primary">Browse e-waste</Link></li>
          <li><Link to="/sell" className="hover:text-primary">Sell your device</Link></li>
          <li><Link to="/rewards" className="hover:text-primary">Rewards catalog</Link></li>
          <li><Link to="/profile" className="hover:text-primary">My account</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3">Contact</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> hello@ecocycle.in</li>
          <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +91 98765 43210</li>
          <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> Visakhapatnam, India</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3">Follow</h4>
        <div className="flex gap-3">
          {[Instagram, Twitter, Github].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition" aria-label="social">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} EcoCycle. Made with 🌿 for a greener tomorrow.
    </div>
  </footer>
);

export default Footer;
