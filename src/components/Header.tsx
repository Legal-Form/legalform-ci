import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Nos Services", href: "/services" },
    { name: "Régions", href: "/regions" },
    { name: "Entreprises Créées", href: "/showcases" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-soft">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="Legal Form" className="h-12 w-12 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-primary">Legal Form</span>
              <span className="text-xs text-muted-foreground">Création d'entreprise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/create">
              <Button className="bg-gradient-accent hover:opacity-90 shadow-soft font-semibold">
                Créer mon entreprise
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Link to="/create" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-accent hover:opacity-90 shadow-soft font-semibold">
                  Créer mon entreprise
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
