import { Building2, Users, FileText, Briefcase, ShieldCheck, Landmark, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  const companyTypes = [
    {
      name: "SARL",
      description: "Société à Responsabilité Limitée",
      details: "Structure flexible pour PME avec responsabilité limitée des associés",
    },
    {
      name: "SA",
      description: "Société Anonyme",
      details: "Pour grandes entreprises avec capital important et actionnaires multiples",
    },
    {
      name: "SAS",
      description: "Société par Actions Simplifiée",
      details: "Structure moderne offrant une grande liberté statutaire",
    },
    {
      name: "SUARL",
      description: "Société Unipersonnelle à Responsabilité Limitée",
      details: "SARL avec un seul associé, idéale pour entrepreneurs solo",
    },
    {
      name: "SNC",
      description: "Société en Nom Collectif",
      details: "Tous les associés ont la qualité de commerçant",
    },
    {
      name: "SCS",
      description: "Société en Commandite Simple",
      details: "Associés commanditaires et commandités avec statuts différents",
    },
    {
      name: "Entreprise Individuelle",
      description: "Pour exercer seul une activité",
      details: "Structure simple sans création de personne morale distincte",
    },
  ];

  const otherStructures = [
    {
      icon: Users,
      title: "Association",
      description: "Création et enregistrement d'associations à but non lucratif",
    },
    {
      icon: Landmark,
      title: "ONG",
      description: "Organisation Non Gouvernementale pour projets de développement",
    },
    {
      icon: Briefcase,
      title: "Coopérative",
      description: "Structure de collaboration économique entre membres",
    },
    {
      icon: Building2,
      title: "GIE",
      description: "Groupement d'Intérêt Économique pour actions communes",
    },
  ];

  const legalDocuments = [
    "Contrat de bail commercial",
    "Contrat de travail (CDI, CDD)",
    "Convention de partenariat",
    "Procurations et mandats",
    "Actes de cession de parts",
    "Protocoles d'accord",
    "Statuts personnalisés",
    "Modification de statuts",
  ];

  const complementaryServices = [
    {
      title: "RCCM",
      description: "Registre du Commerce et du Crédit Mobilier",
    },
    {
      title: "DFE",
      description: "Déclaration Fiscale d'Existence",
    },
    {
      title: "NCC",
      description: "Numéro de Compte Contribuable",
    },
    {
      title: "Immatriculation CNPS",
      description: "Caisse Nationale de Prévoyance Sociale",
    },
    {
      title: "IDU",
      description: "Identification Unique de l'entreprise",
    },
    {
      title: "NTD",
      description: "Numéro de Télédéclarant fiscal",
    },
    {
      title: "Domiciliation",
      description: "Adresse commerciale et siège social",
    },
    {
      title: "Avis de constitution",
      description: "Publication officielle de création",
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
              Nos Services
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Accompagnement complet de la structuration à la croissance : juridique, formation, financement et solutions digitales
            </p>
          </div>

          {/* Company Types */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h2 className="font-heading font-bold text-3xl text-foreground">
                Création d'Entreprise
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyTypes.map((type, index) => (
                <Card key={index} className="hover:shadow-strong transition-all hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-primary">{type.name}</CardTitle>
                    <CardDescription className="font-semibold text-foreground">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{type.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Other Structures */}
          <section className="mb-20">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-8">
              Autres Structures
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherStructures.map((structure, index) => {
                const Icon = structure.icon;
                return (
                  <Card key={index} className="hover:shadow-strong transition-all hover:border-primary text-center">
                    <CardHeader>
                      <div className="mx-auto mb-3 p-3 rounded-xl bg-primary/10 w-fit">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{structure.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{structure.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Legal Documents */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h2 className="font-heading font-bold text-3xl text-foreground">
                Documents Juridiques
              </h2>
            </div>
            
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {legalDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Complementary Services */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <ShieldCheck className="h-8 w-8 text-primary mr-3" />
              <h2 className="font-heading font-bold text-3xl text-foreground">
                Services Complémentaires
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complementaryServices.map((service, index) => (
                <Card key={index} className="hover:shadow-soft transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Pricing Info */}
          <section className="mb-20">
            <div className="bg-gradient-hero rounded-2xl p-12 text-center text-white">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Tarifs de Création d'Entreprise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-8">
                    <h3 className="font-heading font-bold text-2xl mb-2">Abidjan</h3>
                    <div className="text-4xl font-bold text-accent mb-2">150 000 FCFA</div>
                    <p className="text-white/80">Publication au journal officiel incluse</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-8">
                    <h3 className="font-heading font-bold text-2xl mb-2">Régions de l'intérieur</h3>
                    <div className="text-4xl font-bold text-accent mb-2">Jusqu'à 200 000 FCFA</div>
                    <p className="text-white/80">Tarifs variables selon la localisation</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-lg text-white/90 mb-8">
                Tous nos tarifs incluent la publication au journal officiel
              </p>
              <Link to="/create">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-strong text-lg px-8 py-6 h-auto font-semibold">
                  Démarrer mon projet
                </Button>
              </Link>
            </div>
          </section>
          
          {/* Additional Services Section */}
          <section className="mb-20">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-8 text-center">
              Services Additionnels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:shadow-strong transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <GraduationCap className="h-6 w-6 mr-2" />
                    Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Formation entrepreneuriale et accompagnement stratégique personnalisé</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-strong transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Briefcase className="h-6 w-6 mr-2" />
                    Financement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Recherche et mobilisation de financement pour votre projet</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-strong transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Building2 className="h-6 w-6 mr-2" />
                    Solutions Digitales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Conception de sites web, applications et identité visuelle complète</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
