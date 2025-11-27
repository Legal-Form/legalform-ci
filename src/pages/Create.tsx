import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Create = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    structureType: "",
    region: "",
    city: "",
    address: "",
    companyName: "",
    activity: "",
    capital: "",
    associatesCount: "",
    contactName: "",
    phone: "",
    email: "",
    additionalServices: [] as string[],
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const structureTypes = [
    { value: "sarl", label: "SARL - Société à Responsabilité Limitée" },
    { value: "sa", label: "SA - Société Anonyme" },
    { value: "sas", label: "SAS - Société par Actions Simplifiée" },
    { value: "suarl", label: "SUARL - Société Unipersonnelle à Responsabilité Limitée" },
    { value: "snc", label: "SNC - Société en Nom Collectif" },
    { value: "scs", label: "SCS - Société en Commandite Simple" },
    { value: "ei", label: "Entreprise Individuelle" },
    { value: "association", label: "Association" },
    { value: "ong", label: "ONG" },
    { value: "cooperative", label: "Coopérative" },
    { value: "gie", label: "GIE - Groupement d'Intérêt Économique" },
  ];

  const regions = [
    "Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "San-Pédro", "Korhogo", "Man",
    "Gagnoa", "Divo", "Soubré", "Abengourou", "Bondoukou", "Dimbokro", "Séguéla",
    "Odienné", "Touba", "Ferkessédougou", "Boundiali", "Tingréla", "Danané"
  ];

  const additionalServicesList = [
    { id: "dfe", label: "DFE - Déclaration Fiscale d'Existence" },
    { id: "ncc", label: "NCC - Numéro Compte Contribuable" },
    { id: "cnps", label: "CNPS - Immatriculation" },
    { id: "idu", label: "IDU - Identification Unique" },
    { id: "ntd", label: "NTD - Numéro de Télédéclarant" },
    { id: "domiciliation", label: "Domiciliation commerciale" },
  ];

  const handleSubmit = async () => {
    // Validation basique
    if (!formData.contactName || !formData.phone || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const estimatedPrice = formData.region === "Abidjan" ? 150000 : 200000;
      
      const { data, error } = await supabase
        .from('company_requests')
        .insert({
          structure_type: formData.structureType,
          company_name: formData.companyName,
          region: formData.region,
          city: formData.city,
          address: formData.address,
          activity: formData.activity,
          capital: formData.capital,
          associates_count: formData.associatesCount,
          contact_name: formData.contactName,
          phone: formData.phone,
          email: formData.email,
          additional_services: formData.additionalServices,
          estimated_price: estimatedPrice,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Demande envoyée avec succès !",
        description: `Numéro de suivi: ${data.tracking_number}. Un conseiller vous contactera sous 24h`,
      });
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.structureType) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un type de structure",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!formData.region || !formData.address)) {
      toast({
        title: "Informations requises",
        description: "Veuillez renseigner la région et l'adresse",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-4">
              Créer Mon Entreprise
            </h1>
            <p className="text-lg text-muted-foreground">
              Suivez les étapes pour démarrer votre projet
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {num}
                </div>
                <div className="text-xs mt-2 text-center">
                  {num === 1 && "Type"}
                  {num === 2 && "Localisation"}
                  {num === 3 && "Informations"}
                  {num === 4 && "Services"}
                  {num === 5 && "Validation"}
                </div>
              </div>
            ))}
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                {step === 1 && <><Building2 className="mr-2" /> Type de structure</>}
                {step === 2 && <><MapPin className="mr-2" /> Localisation</>}
                {step === 3 && <><FileText className="mr-2" /> Informations de la structure</>}
                {step === 4 && <><CheckCircle2 className="mr-2" /> Services complémentaires</>}
                {step === 5 && <><CheckCircle2 className="mr-2" /> Récapitulatif</>}
              </CardTitle>
              <CardDescription>Étape {step} sur 5</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: Structure Type */}
              {step === 1 && (
                <div className="space-y-4">
                  <Label htmlFor="structureType">Que souhaitez-vous créer ?</Label>
                  <Select 
                    value={formData.structureType} 
                    onValueChange={(value) => setFormData({...formData, structureType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {structureTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="region">Région</Label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(value) => setFormData({...formData, region: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre région" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Ville/Département</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Ex: Cocody, Abobo..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Adresse complète</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Entrez l'adresse complète de votre structure"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Company Info */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nom de la structure</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Nom de votre entreprise/structure"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="activity">Secteur d'activité</Label>
                    <Input
                      id="activity"
                      value={formData.activity}
                      onChange={(e) => setFormData({...formData, activity: e.target.value})}
                      placeholder="Ex: Commerce, Agriculture, Services..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="capital">Capital social (FCFA)</Label>
                    <Input
                      id="capital"
                      type="number"
                      value={formData.capital}
                      onChange={(e) => setFormData({...formData, capital: e.target.value})}
                      placeholder="Ex: 1000000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="associatesCount">Nombre d'associés</Label>
                    <Input
                      id="associatesCount"
                      type="number"
                      value={formData.associatesCount}
                      onChange={(e) => setFormData({...formData, associatesCount: e.target.value})}
                      placeholder="Ex: 2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactName">Nom du contact principal</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ex: +225 0101010101"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Additional Services */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Sélectionnez les services complémentaires dont vous avez besoin :
                  </p>
                  
                  {additionalServicesList.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={formData.additionalServices.includes(service.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              additionalServices: [...formData.additionalServices, service.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              additionalServices: formData.additionalServices.filter(s => s !== service.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={service.id} className="cursor-pointer">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Summary */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg mb-4">Récapitulatif de votre demande</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Type de structure</p>
                        <p className="font-medium">
                          {structureTypes.find(t => t.value === formData.structureType)?.label}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Région</p>
                        <p className="font-medium">{formData.region}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Nom de la structure</p>
                        <p className="font-medium">{formData.companyName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">{formData.contactName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                    </div>
                    
                    {formData.additionalServices.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Services complémentaires</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.additionalServices.map(serviceId => (
                            <span key={serviceId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {additionalServicesList.find(s => s.id === serviceId)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-hero text-white p-6 rounded-lg">
                    <h4 className="font-bold text-xl mb-2">Tarif estimé</h4>
                    <p className="text-3xl font-bold text-accent mb-2">
                      {formData.region === "Abidjan" ? "150 000 FCFA" : "Jusqu'à 200 000 FCFA"}
                    </p>
                    <p className="text-sm text-white/80">
                      Modalité : 50% d'acompte, puis paiement progressif
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    Précédent
                  </Button>
                )}
                
                {step < 5 ? (
                  <Button onClick={nextStep} className="ml-auto">
                    Suivant
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="ml-auto bg-accent hover:bg-accent/90">
                    Soumettre ma demande
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Create;
