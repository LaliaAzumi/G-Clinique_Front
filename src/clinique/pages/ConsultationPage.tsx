import React, { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPills, FaHeartbeat, FaCheckCircle } from "react-icons/fa";

export default function ConsultationPage() {

  const [step, setStep] = useState(1);

  const [vitals, setVitals] = useState({
    temperature: "",
    tension: "",
    pouls: "",
    saturation: "",
    poids: "",
    maladie: "",
    observations: ""
  });

  const [medicamentsList] = useState([
    { id: "1", nom: "Paracétamol", qStock: 50 },
    { id: "2", nom: "Amoxicilline", qStock: 12 },
    { id: "3", nom: "Ibuprofène", qStock: 0 }
  ]);

  const [selectedMedicaments, setSelectedMedicaments] = useState<any[]>([]);
  const [currentMed, setCurrentMed] = useState({ id: "", posologie: "", quantite: 0 });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  const addPrescription = () => {
    const med = medicamentsList.find(m => m.id === currentMed.id);
    if (!med) return;

    setSelectedMedicaments([...selectedMedicaments, {
      ...currentMed,
      nom: med.nom
    }]);

    setCurrentMed({ id: "", posologie: "", quantite: 0 });
  };

  const handleSubmit = () => {
    console.log({ vitals, selectedMedicaments });
    alert("Consultation enregistrée !");
  };

  return (
    // <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
<>

      <div className="w-full max-w-6xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">

        {/* STEP */}
        <div className="flex justify-between mb-10 relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10" />

          {[1,2,3,4].map(s => (
            <div key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
              ${step >= s ? 'bg-blue-500 text-white scale-110 shadow-lg' : 'bg-slate-700 text-slate-400'}`}>
              {s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 PRESCRIPTION */}
          {step === 2 && (
            <motion.div key="step1" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaPills /> Prescription
              </h3>

              <select
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                value={currentMed.id}
                onChange={(e)=>setCurrentMed({...currentMed, id:e.target.value})}
              >
                <option value="">Choisir médicament</option>
                {medicamentsList.map(m=>(
                  <option key={m.id} value={m.id} disabled={m.qStock===0}>
                    {m.nom} ({m.qStock})
                  </option>
                ))}
              </select>

              <input
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                placeholder="Posologie"
                value={currentMed.posologie}
                onChange={(e)=>setCurrentMed({...currentMed, posologie:e.target.value})}
              />

              <input
                type="number"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                placeholder="Quantité"
                value={currentMed.quantite}
                onChange={(e)=>setCurrentMed({...currentMed, quantite:Number(e.target.value)})}
              />

              <button onClick={addPrescription} className="w-full bg-green-500 p-3 rounded-xl font-bold">
                Ajouter
              </button>

              <div className="mt-4 space-y-2">
                {selectedMedicaments.map(m=>(
                  <div key={m.id} className="p-3 bg-white/5 rounded-xl">
                    {m.nom} - {m.posologie}
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* STEP 2 EXAMEN */}
          {step === 1 && (
            <motion.div key="step2" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaHeartbeat /> Examen
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <input name="temperature" placeholder="Température" onChange={handleInputChange} className="input"/>
                <input name="tension" placeholder="Tension" onChange={handleInputChange} className="input"/>
                <input name="pouls" placeholder="Pouls" onChange={handleInputChange} className="input"/>
                <input name="saturation" placeholder="Saturation" onChange={handleInputChange} className="input"/>
              </div>

              <input name="poids" placeholder="Poids" onChange={handleInputChange} className="input mt-3"/>

              <input name="maladie" placeholder="Diagnostic" onChange={handleInputChange} className="input mt-3"/>

              <textarea name="observations" placeholder="Observations" onChange={handleInputChange} className="input mt-3"/>

            </motion.div>
          )}

          {/* STEP 3 CHAMBRE */}
          {step === 3 && (
            <motion.div key="step3" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>
              <h3 className="text-xl font-bold mb-6">Chambre</h3>

              <select className="input">
                <option>Chambre simple</option>
                <option>VIP</option>
              </select>
            </motion.div>
          )}

          {/* STEP 4 RESUME */}
          {step === 4 && (
            <motion.div key="step4" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>
              <h3 className="text-xl font-bold mb-6">Résumé</h3>

              <p><strong>Maladie:</strong> {vitals.maladie}</p>

              <div className="mt-3">
                {selectedMedicaments.map(m=>(
                  <div key={m.id}>{m.nom}</div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* NAV */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={()=>setStep(step-1)} className="flex-1 bg-white/10 p-3 rounded-xl">
              Retour
            </button>
          )}

          <button
            onClick={()=> step===4 ? handleSubmit() : setStep(step+1)}
            className="flex-[2] bg-blue-600 p-3 rounded-xl font-bold flex justify-center gap-2 items-center"
          >
            {step===4 ? <><FaCheckCircle/> Valider</> : "Suivant"}
          </button>
        </div>

      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          outline: none;
          color: white;
        }
      `}</style>
</>
    // </div>
  );
}