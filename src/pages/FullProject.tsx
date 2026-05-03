import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, Calendar, Shield, Clock, Users, ChevronRight, 
  ChevronLeft, Check, Star, Phone, MapPin, Mail, Loader2, 
  MessageSquare, Menu, X, CreditCard, Activity, ArrowUpRight,
  Sun, Moon , 
} from "lucide-react";

import { acteService } from "@/lib/api-actemedical";
import { rendezVousService } from "@/lib/api-actemedical";


import { medecinService } from "@/lib/api-medecins";

// --- DATA SIMULÉES ---
const DOCTORS = [
  { id: "1", name: "Dr. Rakoto Jean", spec: "Cardiologue", price: 40000, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200" },
  { id: "2", name: "Dr. Sarah Alson", spec: "Pédiatre", price: 30000, img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200" },
  { id: "3", name: "Dr. Marc V.", spec: "Généraliste", price: 25000, img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200" },
];


// --- VARIANTS ANIMATION ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// --- ANIMATION D'ÉCRITURE (TYPEWRITER) ---
const TypewriterText = ({ text, delay = 0, iteration }: { text: string; delay?: number; iteration: number }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.span 
        key={iteration} // C'est ici que la magie opère
        variants={container} 
        initial="hidden" 
        animate="visible" 
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="inline-block"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} className="inline-block">
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
};

// --- COMPOSANTS UI RÉUTILISABLES ---
const NavLink = ({ href, children, darkMode }: { href: string; children: React.ReactNode; darkMode: boolean }) => (
  <a href={href} className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-primary transition-colors font-medium text-sm`}>
    {children}
  </a>
);

const FullProject = () => {
  const [step, setStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState({
   datenaissance:"", nom: "", prenom: "", email: "", telephone: "",adresse:"", medecinId: " ", date: "", heure: "", transaction: "", montant:"", expediteur :""
  });
  // Fonction générique pour mettre à jour le formulaire
const updateForm = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

 // const nextStep = () => setStep(step + 1);
 const nextStep = () => {
  // Validation Étape 1 : Identité
  if (step === 1) {
    const { nom, prenom, email, adresse, telephone, datenaissance } = formData;
   
    if (!nom || !prenom || !email || !adresse || telephone.length < 10) {
      alert("Veuillez remplir tous les champs d'identité et le numéro de téléphone complet.");
      return; // On arrête la fonction ici, donc on ne passe pas au step suivant
    }
  }

  // Validation Étape 2 : Médecin et Date
  if (step === 2) {
    const { medecinId, date, heure } = formData;
    if (!selectedSpec || !medecinId || !date || !heure) {
      alert("Veuillez choisir une spécialité, un médecin, une date et une heure.");
      return;
    }
  }

  // Si tout est bon, on passe à la suite
  setStep(step + 1);
};
  const prevStep = () => setStep(step - 1);
  const toggleTheme = () => setDarkMode(!darkMode);

  const [iteration, setIteration] = useState(0);

  const [actes, setActes] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const phoneInputs = useRef([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  // On récupère la liste unique des spécialités depuis tes données médecins
const specialites = [...new Set(medecins.map(m => m.specialite))];
// 1. On extrait les spécialités, on enlève les doublons avec Set, et on TRIE par ordre alphabétique
const specialitesUniques = React.useMemo(() => {
  return [...new Set(medecins.map(m => m.specialite))]
    .filter(spec => spec) // Sécurité au cas où une spécialité est vide
    .sort((a, b) => a.localeCompare(b)); // Tri alphabétique (A -> Z)
}, [medecins]);

// 2. On filtre les médecins en fonction de la spécialité sélectionnée
const medecinsFiltrés = React.useMemo(() => {
  return medecins.filter(m => m.specialite === selectedSpec);
}, [medecins, selectedSpec]);

  useEffect(() => {
    // Calcul pour la phrase la plus longue ("aujourd'hui" avec son délai)
    // 1.2s (délai) + (10 lettres * 0.04s) + 5s (attente) = ~6.6s
    const timer = setTimeout(() => {
      setIteration(prev => prev + 1);
    }, 7000); // On arrondit à 7s pour être large et synchro

    return () => clearTimeout(timer);
  }, [iteration]);
  
  useEffect(() => {
  const loadData = async () => {
    console.log("Appel de loadData lancé...");
    try {
      const dataActes = await acteService.getAll();
      const dataMeds = await medecinService.getAll();
      console.log("les datas", dataMeds);
      setActes(dataActes);
      setMedecins(dataMeds);
    } catch (err) {
      console.error("Erreur chargement data:", err);
    }
  };
  loadData();
}, []);

const handlePhoneChange = (e, index) => {
  const value = e.target.value;

  // 1. Focus automatique
  if (value && index < 9) {
    phoneInputs.current[index + 1].focus();
  }

  // 2. CALCUL DU NUMÉRO COMPLET (La clé est ici)
  // On récupère les valeurs de toutes les cases
  const currentInputs = phoneInputs.current.map((input, i) => {
    // Si c'est la case qu'on vient de modifier, on prend la nouvelle valeur 'value'
    // Sinon on prend ce qu'il y a dans la ref
    return i === index ? value : (input?.value || "");
  });

  const numeroComplet = currentInputs.join("");
  
  // On met à jour le formData.telephone EN DIRECT
  updateForm('telephone', numeroComplet);
};

const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace') {
    // Si la case est vide, on recule le focus
    if (!e.target.value && index > 0) {
      phoneInputs.current[index - 1].focus();
    }
    
    // On met à jour le state APRÈS la suppression (léger délai pour laisser le DOM s'actualiser)
    setTimeout(() => {
      const telephoneComplet = phoneInputs.current.map(input => input?.value || "").join("");
      updateForm('telephone', telephoneComplet);
    }, 0);
  }
};

const handleConfirmRDV = async () => {

  // Préparation du gros objet JSON pour ton backend
  const payload = {
  nom: formData.nom,
  prenom: formData.prenom,
  email: formData.email,
  telephone: formData.telephone,
  adresse: formData.adresse,
  // datenaissance: formData.datenaissance,
  datenaissance: new Date(formData.datenaissance).toISOString().split('T')[0],

  medecinId: parseInt(formData.medecinId),

  // date: formData.date,      // ✅ corrigé
  date: new Date(formData.date).toISOString().split('T')[0],
  
  heure: formData.heure,    // ✅ corrigé

  acteIds: [1],

  nomExpediteur: formData.expediteur,       // ✅ corrigé
  codeTransaction: formData.transaction,    // ✅ corrigé
  montantEnvoye: parseFloat(formData.montant) // ✅ corrigé
};
  console.log("OBJET ENVOYÉ :", payload)

  try {
    const res = await rendezVousService.savePublic(payload);
    alert("Rendez-vous enregistré avec succès !");
    // Tu peux rediriger ou réinitialiser le formulaire ici
  } catch (err) {
    alert("Erreur : " + err.message);
  }
};
const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-primary/30 ${darkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-500 ${darkMode ? 'bg-[#020617]/80 border-white/5' : 'bg-white/80 border-slate-200'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 15 }} className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Stethoscope className="text-white h-6 w-6" />
            </motion.div>
            <span className="text-xl font-black tracking-tighter uppercase">G-Clinique</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <NavLink href="#home" darkMode={darkMode}>Accueil</NavLink>
            <NavLink href="#actemed" darkMode={darkMode}>Services</NavLink>
            <NavLink href="#doctors" darkMode={darkMode}>Médecins</NavLink>
            
            {/* Bouton Thème */}
            <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all ${darkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a href="#booking" className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${darkMode ? 'bg-white text-black hover:bg-primary hover:text-white' : 'bg-slate-900 text-white hover:bg-primary'}`}>
              Prendre RDV
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] blur-[120px] rounded-full -z-10 ${darkMode ? 'bg-primary/10' : 'bg-primary/5'}`} />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 inline-block ${darkMode ? 'border-primary/30 bg-primary/5 text-primary' : 'border-primary/20 bg-primary/10 text-primary'}`}>
              Disponible 24h/24 à Ankorondrano
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
              {/* <TypewriterText text="La santé de demain," /><span className="text-primary"><TypewriterText text="aujourd'hui." delay={1.2} /></span> */}
              <TypewriterText text="La santé de demain," iteration={iteration} />
      <span className="text-primary">
        <TypewriterText text="aujourd'hui." delay={1.2} iteration={iteration} />
      </span>
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Réservez votre consultation n'importe où, n'importe quand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#booking" className="bg-primary px-10 py-5 rounded-2xl font-bold text-lg text-white hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all flex items-center justify-center gap-2">
                Réserver maintenant <ChevronRight className="h-5 w-5" />
              </motion.a>
              <a href="#services" className={`px-10 py-5 rounded-2xl font-bold text-lg border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
                Voir nos services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      

      {/* --- TESTIMONIALS --- */}
      
     <section className={`py-24 space-y-20 overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
  
  {/* --- SECTION 1 : ACTES MÉDICAUX (Défilement Auto) --- */}
  <div id="actemed" className="max-w-7xl mx-auto px-6">
    <h3 className={`text-3xl font-bold mb-10 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
      Actes Médicaux
    </h3>
    
    <div className="relative flex overflow-hidden group">
      <motion.div 
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: [0, -1000] }} // Ajuste -1000 si la liste est très longue
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" } }}
      >
        {/* On double la liste pour l'effet de boucle infinie fluide */}
        {[...actes, ...actes].map((acte, i) => (
          <div 
            key={`acte-${i}`} 
            className={`w-[300px] flex-shrink-0 p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
<div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Activity size={20}/>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Service</span>
            </div>    
            </div>
            <h3 className="text-lg font-semibold mb-4 truncate text-center uppercase">{acte.libelle}</h3>
           <br></br>
           <p className="text-lg font-bold text-blue-600" style={{ float: 'right' }}>
            {acte.prix?.toLocaleString()} Ar
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
  {/* --- SERVICES --- */}
      <section id="services" className={`py-24 px-6 transition-colors duration-500 ${darkMode ? 'bg-white/[0.02]' : 'bg-slate-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard darkMode={darkMode} icon={<Shield />} title="Sécurité Totale" desc="Vos dossiers médicaux sont cryptés et accessibles uniquement par vous et votre médecin." />
            <ServiceCard darkMode={darkMode} icon={<Clock />} title="Gain de Temps" desc="Oubliez les files d'attente. Votre créneau est réservé et confirmé instantanément." />
            <ServiceCard darkMode={darkMode} icon={<Activity />} title="Suivi Digital" desc="Recevez vos ordonnances et vos résultats d'examens directement sur votre espace." />
          </div>
        </div>
      </section>

  {/* --- SECTION 2 : SPÉCIALISTES (Défilement Auto Inverse) --- */}
  <div id="doctors" className="max-w-7xl mx-auto px-6">
    <h3 className={`text-3xl font-bold mb-10 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
      Nos Spécialistes
    </h3>

    <div className="relative flex overflow-hidden group">
      <motion.div 
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: [-1000, 0] }} // Sens inverse pour dynamiser la page
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
      >
        {[...medecins, ...medecins].map((med, i) => (
          <div 
            key={`med-${i}`} 
            className={`w-[300px] flex-shrink-0 p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-900 border-indigo-500/20 text-white' : 'bg-indigo-50/50 border-indigo-100 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Stethoscope size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Spécialiste</span>
            </div>
            <h3 className="text-lg font-bold mb-6 truncate">{med.specialite}</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                {med?.nom ? med.nom.charAt(0) : "?"}
              </div>
              <div>
                <p className="font-bold text-sm">Dr. {med.nom}</p>
                <p className="text-[10px] text-slate-500 uppercase">G-Clinique</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
</section>

      {/* --- BOOKING FORM --- */}
      <section id="booking" className="py-32 px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Prendre Rendez-vous</h2>
          <p className={darkMode ? "text-slate-500" : "text-slate-600"}>Remplissez le formulaire ci-dessous pour bloquer votre créneau.</p>
        </motion.div>

        <div className={`max-w-2xl mx-auto border p-8 rounded-[2rem] backdrop-blur-md shadow-2xl transition-colors duration-500 ${darkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200'}`}>
          {/* Stepper */}
          <div className="flex justify-between mb-12 relative">
            <div className={`absolute top-5 left-0 w-full h-0.5 -z-10 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400')}`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                    key="s1" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    className="space-y-4 text-left"
                    >
                <label className={`text-sm font-semibold px-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Identité du patient
                </label>

                {/* Nom et Prénom */}
                <div className="grid grid-cols-2 gap-4">
                    <input 
                    value={formData.nom}
                    onChange={(e) => updateForm('nom', e.target.value)} // Ajouté
                    className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Nom" />
                    <input 
                    value={formData.prenom}
                    onChange={(e) => updateForm('prenom', e.target.value)} // Ajouté
                    className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Prénom" />

                    
                </div>
                {/* Adresse Habitat */}
                <input 
                
                     value={formData.datenaissance} // Ajouté
                    onChange={(e) => updateForm('datenaissance', e.target.value)} // Ajouté
                    type="date" className={`w-full p-4 rounded-xl focus:border-primary outline-none border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />

                <input 
                    type="text" 
                    value={formData.adresse || ""}
                    onChange={(e) => updateForm('adresse', e.target.value)} // Ajouté
                    
                    className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} 
                    placeholder="Adresse de résidence (Lot, Ville, etc.)" 
                />
                
                {/* Numéro de Téléphone (10 petits carrés) */}
                <div className="space-y-2">
                    <p className={`text-xs px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Numéro de téléphone (10 chiffres)</p>

                    <div className="flex justify-between gap-2">
                        {/* Carré Drapeau Madagascar */}
                    <div className={`flex-none w-12 h-12 flex items-center justify-center rounded-lg border text-xl shadow-sm ${
                    darkMode ? 'bg-white/10 border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}>
                    🇲🇬
                    </div>
                    {[...Array(10)].map((_, i) => (
                        <input
                            key={i}
                            ref={(el) => (phoneInputs.current[i] = el)} // On enregistre la référence de chaque case
                            maxLength={1}
                            type="text"
                            inputMode="numeric"
                            onChange={(e) => handlePhoneChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className={`w-full aspect-square text-center font-bold rounded-lg border focus:border-primary outline-none transition-all ${
                            darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                        />
                    ))}
                    </div>
                </div>

                {/* Email */}
                <input 
                    type="email" 
                    value={formData.email || ""}
                    onChange={(e) => updateForm('email', e.target.value)} // Ajouté
                    className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} 
                    placeholder="Adresse Email" 
                />

                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-left">
                  <label className={`text-sm font-semibold px-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Choix de la consultation</label>

                  <label className={`text-sm font-semibold px-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Choix de la spécialité
                </label>

                {/* Sélection de la Spécialité (SANS DOUBLONS) */}
                <select 
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className={`w-full p-4 rounded-xl focus:border-primary outline-none border transition-all ${
                    darkMode ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                >
                <option value="">-- Sélectionner une spécialité --</option>
                {specialitesUniques.map(spec => (
                    <option key={spec} value={spec}>
                    {spec}
                    </option>
                ))}
                </select>
                <label className={`text-sm font-semibold px-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Médecin disponible
                </label>

                {/* Sélection du Médecin filtré */}
                <select 
                disabled={!selectedSpec}
                value={formData.medecinId} // Ajouté
                onChange={(e) => updateForm('medecinId', e.target.value)} // Ajouté
                className={`w-full p-4 rounded-xl focus:border-primary outline-none border transition-all ${
                    !selectedSpec ? 'opacity-50' : ''
                } ${
                    darkMode ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                >
                <option value="">
                    {selectedSpec ? "Choisir parmi la liste..." : "En attente du choix de spécialité..."}
                </option>
                {medecinsFiltrés.map(d => (
                    <option key={d.medecinId} value={d.medecinId}>{d.nom}</option>
                ))}
                </select>


                  <div className="grid grid-cols-2 gap-4">
                    <input 
                    min={today} // Empeche de cliquer sur les dates passées
                     value={formData.date} // Ajouté
                    onChange={(e) => updateForm('date', e.target.value)} // Ajouté
                    type="date" className={`w-full p-4 rounded-xl focus:border-primary outline-none border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    
                    <input 
                    value={formData.heure} // Ajouté
                    onChange={(e) => updateForm('heure', e.target.value)} // Ajouté
                    type="time" className={`w-full p-4 rounded-xl focus:border-primary outline-none border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-left">
                  <div className={`p-6 border rounded-2xl mb-6 ${darkMode ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/10'}`}>
                    <p className="text-primary text-sm flex items-center gap-2 font-bold mb-2"><CreditCard className="h-4 w-4"/> Règlement Mobile Money</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Veuillez envoyer le montant exact pour la consultation au 034 04 004 04 au nom de G-Clinic puis saisissez les détails de la transaction.</p>
                  </div>
                  <input 
                  value={formData.expediteur}
                  onChange={(e) => updateForm('expediteur', e.target.value)} // Ajouté
                  className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Nom de Expediteur" />
                  <input 
                  value={formData.transaction}
                  onChange={(e) => updateForm('transaction', e.target.value)} // Ajouté
                  className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="ID de Transaction (ex: 124855...)" />
                  <input 
                  value={formData.montant}
                  onChange={(e) => updateForm('montant', e.target.value)} // Ajouté
                  min="25000" type="number" className={`w-full p-4 rounded-xl focus:border-primary outline-none transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Montant Envoyer" />

                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button onClick={prevStep} className={`flex-1 p-4 rounded-xl font-bold border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>
                  Retour
                </button>
              )}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
               onClick={step === 3 ? handleConfirmRDV : nextStep}
                className="flex-[2] p-4 rounded-xl bg-primary text-white font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {step === 3 ? "Confirmer le RDV" : "Étape Suivante"} <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </div>
          </form>
        </div>
      </section>

      

<footer className={`py-16 border-t px-6 transition-colors duration-500 ${darkMode ? 'border-white/5 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      
      {/* Colonne 1: Branding & Bio */}
      <div className="col-span-1 md:col-span-1">
        <div className={`flex items-center gap-2 font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <Stethoscope className="h-5 w-5"/>
          </div> 
          <span className="text-xl tracking-tight">G-CLINIQUE</span>
        </div>
        <p className="text-sm leading-relaxed">
          L'excellence médicale au cœur d'Antananarivo. Des soins de qualité accessibles à tous, portés par une technologie innovante.
        </p>
      </div>

      {/* Colonne 2: Liens Rapides */}
      <div>
        <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Services</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-primary transition-colors">Consultations</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Urgences 24/7</a></li>          
        </ul>
      </div>

      {/* Colonne 3: Support & Légal */}
      <div>
        <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Aide & Légal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
        </ul>
      </div>

      {/* Colonne 4: Contact & Réseaux */}
      <div>
        <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Restons connectés</h4>
        <p className="text-sm mb-4">Lot II-A, Antananarivo, Madagascar</p>
        <div className="flex gap-4">
          {/* Remplacez par vos icônes (Facebook, LinkedIn, etc.) */}
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
            <span className="text-xs">FB</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
            <span className="text-xs">LN</span>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className={`pt-8 border-t ${darkMode ? 'border-white/5' : 'border-slate-200'} flex flex-col md:flex-row justify-between items-center gap-4 text-xs`}>
      <p>© 2026 G-CLINIQUE. Tous droits réservés.</p>
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        <span>Système opérationnel • Antananarivo</span>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

// Composant Interne pour les Cartes
const ServiceCard = ({ icon, title, desc, darkMode }: { icon: any; title: string; desc: string; darkMode: boolean }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`p-10 rounded-[2.5rem] border transition-all group ${darkMode ? 'bg-slate-900/40 border-white/5 hover:border-primary/40' : 'bg-white border-slate-200 hover:border-primary/40 shadow-sm'}`}
  >
    <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
  </motion.div>
);

export default FullProject;