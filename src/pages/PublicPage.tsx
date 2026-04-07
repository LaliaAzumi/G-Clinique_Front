import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, MapPin, Calendar, Stethoscope, 
  Loader2, Clock, CreditCard, Mail, Hash, ChevronRight, ChevronLeft, Check 
} from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";

const PublicPage = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 pour suivant, -1 pour retour
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", datenaissance: "",
    telephone: "", adresse: "", medecinId: "1",
    date: "", heure: "", acteIds: [1],
    nomExpediteur: "", codeTransaction: "", montantEnvoye: 0
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep(step + 1);
  };
  const prevStep = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/save-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erreur");
      alert(`Succès ! RDV n°${result.id} enregistré.`);
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Configuration des animations de glissement
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const renderStepper = () => (
    <div className="mb-10 mt-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/3 right-0 w-10000 h-1 bg-white/10 -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/3 left-0 h-1 bg-primary -translate-y-1/2 z-0"  
          initial={false}
          animate={{ width: `${((step - 1) / 2) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <motion.div 
              animate={{ 
                scale: step === s ? 1.15 : 1,
                backgroundColor: step >= s ? "hsl(var(--primary))" : "#1e293b",
                borderColor: step >= s ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.2)"
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-white font-bold transition-colors duration-300`}
            >
              {step > s ? <Check className="h-5 w-5" /> : s}
            </motion.div>
            <motion.span 
              animate={{ opacity: step >= s ? 1 : 0.4 }}
              className={`text-xs mt-2 font-medium text-white`}
            >
              {s === 1 ? "Patient" : s === 2 ? "Rendez-vous" : "Paiement"}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-slate-900 font-sans overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${loginBg})` }} />
      
      <div className="glass-card w-full max-w-2xl px-6 py-8 z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Réservation de Santé</h1>
        </div>

        {renderStepper()}

        {/* On utilise AnimatePresence pour animer la sortie/entrée des étapes */}
        <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col justify-between relative">
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-primary-foreground font-semibold flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" /> Informations du Patient
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input required placeholder="Nom" className="login-input" value={formData.nom} onChange={(e) => handleChange('nom', e.target.value)} />
                      <input required placeholder="Prénom" className="login-input" value={formData.prenom} onChange={(e) => handleChange('prenom', e.target.value)} />
                    </div>
                    <input required type="email" placeholder="Email" className="login-input" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="date" className="login-input" value={formData.datenaissance} onChange={(e) => handleChange('datenaissance', e.target.value)} />
                      <input required type="tel" placeholder="Téléphone" className="login-input" value={formData.telephone} onChange={(e) => handleChange('telephone', e.target.value)} />
                    </div>
                    <textarea required placeholder="Adresse" className="login-input h-20" value={formData.adresse} onChange={(e) => handleChange('adresse', e.target.value)} />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-primary-foreground font-semibold flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" /> Détails du rendez vous
                    </h2>
                    <div className="space-y-4">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                        <input required type="date" className="login-input pl-11" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                        <input required type="time" className="login-input pl-11" value={formData.heure} onChange={(e) => handleChange('heure', e.target.value)} />
                      </div>
                      <select className="login-input" value={formData.medecinId} onChange={(e) => handleChange('medecinId', e.target.value)}>
                         <option value="1">Dr. Jean Dupont (Généraliste)</option>
                         <option value="2">Dr. Marie Curie (Spécialiste)</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-primary-foreground font-semibold flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-primary" /> Validation du Paiement
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                      <p className="text-xs text-primary-foreground/80 leading-relaxed">
                        Veuillez effectuer le transfert Mobile Money, puis saisissez les détails de la transaction ci-dessous.
                      </p>
                    </div>
                    <input required placeholder="Nom de l'expéditeur" className="login-input" value={formData.nomExpediteur} onChange={(e) => handleChange('nomExpediteur', e.target.value)} />
                    <input required placeholder="Code de Transaction (ID)" className="login-input" value={formData.codeTransaction} onChange={(e) => handleChange('codeTransaction', e.target.value)} />
                    <div className="relative">
                      <input required type="number" min="30000" placeholder="Montant Exact envoyé (30000 Ar pour la consultation)" className="login-input pl-8" value={formData.montantEnvoye} onChange={(e) => handleChange('montantEnvoye', e.target.value)} />
                      <span className="absolute left-3 top-3 text-white/40">Ar</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOUTONS DE NAVIGATION FIXES EN BAS DU FORMULAIRE */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={prevStep}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10"
              >
                <ChevronLeft className="h-5 w-5" /> Retour
              </motion.button>
            )}
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              type={step < 3 ? "button" : "submit"}
              onClick={step < 3 ? nextStep : undefined}
              disabled={loading}
              className={`flex-[2] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold transition-all shadow-lg ${
                step === 3 ? "bg-green-600 hover:bg-green-500 shadow-green-900/20" : "bg-primary hover:brightness-110 shadow-primary/20"
              }`}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  {step === 3 ? "Confirmer le RDV" : "Suivant"} 
                  {step < 3 && <ChevronRight className="h-5 w-5" />}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicPage;