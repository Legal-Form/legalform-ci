import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Regions = () => {
  const regions = [
    {
      name: "Abidjan",
      districts: ["Cocody", "Plateau", "Marcory", "Yopougon", "Abobo", "Adjamé", "Treichville", "Koumassi", "Port-Bouët", "Attécoubé"],
      phone: "+225 27 22 XX XX XX",
      email: "abidjan@legalform.ci"
    },
    {
      name: "Yamoussoukro",
      districts: ["Yamoussoukro"],
      phone: "+225 27 30 XX XX XX",
      email: "yamoussoukro@legalform.ci"
    },
    {
      name: "Bouaké",
      districts: ["Bouaké", "Katiola", "Dabakala", "Béoumi"],
      phone: "+225 27 31 XX XX XX",
      email: "bouake@legalform.ci"
    },
    {
      name: "Daloa",
      districts: ["Daloa", "Issia", "Vavoua", "Zoukougbeu"],
      phone: "+225 27 32 XX XX XX",
      email: "daloa@legalform.ci"
    },
    {
      name: "San-Pédro",
      districts: ["San-Pédro", "Sassandra", "Tabou", "Soubré"],
      phone: "+225 27 34 XX XX XX",
      email: "sanpedro@legalform.ci"
    },
    {
      name: "Korhogo",
      districts: ["Korhogo", "Ferkessédougou", "Boundiali", "Tingréla"],
      phone: "+225 27 36 XX XX XX",
      email: "korhogo@legalform.ci"
    },
    {
      name: "Man",
      districts: ["Man", "Danané", "Biankouma", "Zouan-Hounien"],
      phone: "+225 27 33 XX XX XX",
      email: "man@legalform.ci"
    },
    {
      name: "Gagnoa",
      districts: ["Gagnoa", "Oumé", "Divo", "Lakota"],
      phone: "+225 27 32 XX XX XX",
      email: "gagnoa@legalform.ci"
    },
    {
      name: "Abengourou",
      districts: ["Abengourou", "Agnibilékrou", "Bettié"],
      phone: "+225 27 35 XX XX XX",
      email: "abengourou@legalform.ci"
    },
    {
      name: "Bondoukou",
      districts: ["Bondoukou", "Bouna", "Tanda"],
      phone: "+225 27 35 XX XX XX",
      email: "bondoukou@legalform.ci"
    },
    {
      name: "Dimbokro",
      districts: ["Dimbokro", "Bongouanou", "M'Bahiakro"],
      phone: "+225 27 30 XX XX XX",
      email: "dimbokro@legalform.ci"
    },
    {
      name: "Séguéla",
      districts: ["Séguéla", "Mankono", "Kani"],
      phone: "+225 27 33 XX XX XX",
      email: "seguela@legalform.ci"
    },
    {
      name: "Odienné",
      districts: ["Odienné", "Minignan", "Samatiguila"],
      phone: "+225 27 33 XX XX XX",
      email: "odienne@legalform.ci"
    },
    {
      name: "Touba",
      districts: ["Touba", "Borotou"],
      phone: "+225 27 33 XX XX XX",
      email: "touba@legalform.ci"
    },
    {
      name: "Soubré",
      districts: ["Soubré", "Méagui", "Buyo"],
      phone: "+225 27 34 XX XX XX",
      email: "soubre@legalform.ci"
    },
    {
      name: "Grand-Bassam",
      districts: ["Grand-Bassam", "Bonoua"],
      phone: "+225 27 21 XX XX XX",
      email: "grandbassam@legalform.ci"
    },
    {
      name: "Adzopé",
      districts: ["Adzopé", "Alépé", "Yakassé-Attobrou"],
      phone: "+225 27 23 XX XX XX",
      email: "adzope@legalform.ci"
    },
    {
      name: "Agboville",
      districts: ["Agboville", "Tiassalé", "Sikensi"],
      phone: "+225 27 23 XX XX XX",
      email: "agboville@legalform.ci"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              Nos Régions d'Intervention
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              LegalForm est présent dans toute la Côte d'Ivoire pour vous accompagner au plus près de vos projets
            </p>
          </div>

          {/* Regions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {regions.map((region, index) => (
              <Card key={index} className="hover:shadow-strong transition-all hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <MapPin className="h-5 w-5 mr-2" />
                    {region.name}
                  </CardTitle>
                  <CardDescription>
                    {region.districts.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {region.phone}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {region.email}
                  </div>
                  <Link to="/create">
                    <Button className="w-full mt-4" variant="outline">
                      Créer dans cette région
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-hero rounded-2xl p-12 text-center text-white">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
              Votre Région n'est pas listée ?
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Contactez-nous ! Nous intervenons partout en Côte d'Ivoire
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Regions;
