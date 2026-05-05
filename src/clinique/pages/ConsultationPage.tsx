import React, { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPills, FaHeartbeat, FaCheckCircle } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { appointmentService } from "@/lib/api-appointments";
import { acteService } from "@/lib/api-actemedical";
import { medicamentService } from "@/lib/api-medicament";
import { Chambre } from "@/types/chambre";
import { apiChambre } from "@/services/apiChambre";
import { Medicament } from "@/types/medicament";

export default function ConsultationPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rdv, setRdv] = useState<any>(location.state?.rdvData ?? null);
  const [prestationResults, setPrestationResults] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [vitals, setVitals] = useState({
    temperature: "",
    tension: "",
    pouls: "",
    saturation: "",
    poids: "",
    maladie: "",
    observations: ""
  });

  const [medicamentsList, setMedicamentsList] = useState<Medicament[]>([]);
  const [medicamentsLoading, setMedicamentsLoading] = useState(false);
  const [medicamentsError, setMedicamentsError] = useState<string | null>(null);

  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [chambresLoading, setChambresLoading] = useState(false);
  const [chambresError, setChambresError] = useState<string | null>(null);
  const [hospitalisationEnabled, setHospitalisationEnabled] = useState(false);
  const [soinsIntensifs, setSoinsIntensifs] = useState(false);
  const [chambreAssignee, setChambreAssignee] = useState<Chambre | null>(null);
  const [chambreWarning, setChambreWarning] = useState<string | null>(null);

  const [selectedMedicaments, setSelectedMedicaments] = useState<any[]>([]);
  const [currentMed, setCurrentMed] = useState({ id: "", posologie: "", quantite: 0, duree: "" });
  const [actes, setActes] = useState<any[]>([]);
  const [selectedActeId, setSelectedActeId] = useState<string>("");
  const [newActes, setNewActes] = useState<any[]>([]);

  // À ajouter avec les autres states (vitals, rdv, etc.)
// const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    const loadActes = async () => {
      try {
        const data = await acteService.getAll();
        setActes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement actes :", err);
      }
    };

    const loadMedicaments = async () => {
      setMedicamentsLoading(true);
      setMedicamentsError(null);
      try {
        const data = await medicamentService.getAll(0, 200);
        const items = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];
        setMedicamentsList(items);
      } catch (err: any) {
        console.error("Erreur chargement médicaments :", err);
        setMedicamentsError(err?.message || "Impossible de charger les médicaments.");
      } finally {
        setMedicamentsLoading(false);
      }
    };

    const loadChambres = async () => {
      setChambresLoading(true);
      setChambresError(null);
      try {
        const token = localStorage.getItem("token") || "";
        const data: any = await apiChambre.getAll(token);
        const items: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data?.chambres)
          ? data.data.chambres
          : Array.isArray(data?.chambres)
          ? data.chambres
          : [];

        const normalized: Chambre[] = items.map((ch: any) => ({
          ...ch,
          id: String(ch.id ?? ch.numero ?? ""),
          etat: ch.etat === true || ch.etat === "true" || ch.etat === 1 || ch.etat === "1",
          isSoinsIntensifs:
            ch.isSoinsIntensifs === true ||
            ch.isSoinsIntensifs === "true" ||
            ch.isSoinsIntensifs === 1 ||
            ch.isSoinsIntensifs === "1",
        }));

        setChambres(normalized);
      } catch (err: any) {
        console.error("Erreur chargement chambres :", err);
        setChambresError(err?.message || "Impossible de charger les chambres.");
      } finally {
        setChambresLoading(false);
      }
    };

    loadActes();
    loadMedicaments();
    loadChambres();

    const fetchRdv = async (rdvId: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await appointmentService.getById(rdvId);
        setRdv(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Impossible de charger le rendez-vous.");
      } finally {
        setLoading(false);
      }
    };

    if (!rdv && id) {
      const rdvId = Number(id);
      if (!Number.isNaN(rdvId)) {
        fetchRdv(rdvId);
      } else {
        setLoading(false);
        setError("Identifiant de rendez-vous invalide.");
      }
    } else {
      setLoading(false);
    }
  }, [id, rdv]);

  useEffect(() => {
    if (rdv?.prestations) {
      const initialResults: Record<string, string> = {};
      rdv.prestations.forEach((prestation: any) => {
        initialResults[String(prestation.id)] = prestation.resultat || "";
      });
      setPrestationResults(initialResults);
    }
  }, [rdv?.prestations]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  const handleResultChange = (prestationId: string, value: string) => {
    setPrestationResults(prev => ({ ...prev, [prestationId]: value }));
  };

  const removeSelectedMed = (index: number) => {
    setSelectedMedicaments(prev => prev.filter((_: any, idx: number) => idx !== index));
  };

  const removeActe = (index: number) => {
    setNewActes(prev => prev.filter((_: any, idx: number) => idx !== index));
  };

  const assignChambre = (intensive: boolean) => {
    const available = chambres.filter(c => c.etat === true);
    const preferred = available.find(c => c.isSoinsIntensifs === intensive);
    const fallback = available.find(c => c.isSoinsIntensifs !== intensive);

    if (preferred) {
      setChambreAssignee(preferred);
      setChambreWarning(null);
      return;
    }

    if (fallback) {
      setChambreAssignee(fallback);
      setChambreWarning(intensive
        ? "Aucune chambre de soins intensifs libre, assignation automatique à une chambre standard disponible."
        : "Aucune chambre standard libre, assignation automatique à une chambre de soins intensifs disponible.");
      return;
    }

    setChambreAssignee(null);
    setChambreWarning("Aucune chambre libre disponible pour le moment.");
  };

  useEffect(() => {
    if (!hospitalisationEnabled) {
      setChambreAssignee(null);
      setChambreWarning(null);
      return;
    }

    assignChambre(soinsIntensifs);
  }, [hospitalisationEnabled, soinsIntensifs, chambres]);

  const addPrescription = () => {
    const med = medicamentsList.find(m => String(m.id) === String(currentMed.id));
    if (!med) return;
    if (!currentMed.posologie.trim()) {
      alert("Veuillez renseigner une posologie avant d'ajouter le médicament.");
      return;
    }
    if (!currentMed.quantite || currentMed.quantite <= 0) {
      alert("Veuillez indiquer une quantité valide.");
      return;
    }
    if (!currentMed.duree.trim()) {
      alert("Veuillez renseigner une durée avant d'ajouter le médicament.");
      return;
    }

    const outOfStock = med.qStock === 0;
    const overRequested = currentMed.quantite > med.qStock;
    const warning = outOfStock
      ? "Rupture de stock"
      : overRequested
      ? "Quantité demandée supérieure au stock"
      : "";

    setSelectedMedicaments(prev => [
      ...prev,
      {
        ...currentMed,
        nom: `${med.nom}${outOfStock || overRequested ? ' - NA' : ''}`,
        qStock: med.qStock,
        warning
      }
    ]);

    setCurrentMed({ id: "", posologie: "", quantite: 0, duree: "" });
  };

  const addActe = () => {
    const acte = actes.find(a => String(a.id) === selectedActeId);
    if (!acte) return;
    if (newActes.some(a => a.id === acte.id)) return;
    setNewActes(prev => [...prev, acte]);
    setSelectedActeId("");
  };

  // const handleSubmit = async () => {
  //   if (!rdv) {
  //     alert("Aucun rendez-vous chargé.");
  //     return;
  //   }

  //   setIsSaving(true);
  //   try {
  //     const updatedPrestations = rdv.prestations?.map((prestation: any) => ({
  //       id: prestation.id,
  //       resultat: prestationResults[String(prestation.id)] ?? prestation.resultat ?? ""
  //     })) || [];

  //     const newActeIds = newActes.map(a => Number(a.id));

  //     if (updatedPrestations.length > 0 || newActeIds.length > 0) {
  //       await appointmentService.updatePrestations(Number(rdv.id), updatedPrestations, newActeIds);
  //     }

  //     alert("Consultation et résultats sauvegardés avec succès.");
  //     setRdv({
  //       ...rdv,
  //       prestations: [
  //         ...(rdv.prestations?.map((prestation: any) => ({
  //           ...prestation,
  //           resultat: prestationResults[String(prestation.id)] ?? prestation.resultat ?? ""
  //         })) || []),
  //         ...newActes.map(acte => ({
  //           id: `new-${acte.id}`,
  //           acte,
  //           prixApplique: acte.prix,
  //           resultat: ""
  //         }))
  //       ]
  //     });
  //   } catch (err: any) {
  //     console.error(err);
  //     alert(err?.message || "Erreur lors de l'enregistrement.");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

// const handleSubmit = async () => {
//     if (!rdv) return;
//     setIsSaving(true);

//     try {
//         const updatedPrestations = rdv.prestations?.map((p: any) => ({
//             id: p.id,
//             resultat: prestationResults[String(p.id)] ?? ""
//         })) || [];

//         const newActeIds = newActes.map(a => Number(a.id));

//         // On passe 'vitals' en 4ème argument
//         await appointmentService.updatePrestations(
//             Number(rdv.id), 
//             updatedPrestations, 
//             newActeIds, 
//             vitals 
//         );

//         alert("Consultation et examens enregistrés avec succès !");
//     } catch (err: any) {
//         console.error(err);
//         alert(err.message);
//     } finally {
//         setIsSaving(false);
//     }
// };

const handleSubmit = async () => {
    if (!rdv) return;
    setIsSaving(true);

    try {
        // 1. Préparer les résultats des examens existants
        const updatedPrestations = rdv.prestations?.map((p: any) => ({
            id: p.id,
            resultat: prestationResults[String(p.id)] ?? ""
        })) || [];

        // 2. Préparer les nouveaux actes ajoutés
        const newActeIds = newActes.map(a => Number(a.id));

        // Validation des données avant envoi
        if (!vitals.maladie || !vitals.maladie.trim()) {
            alert("Veuillez saisir un diagnostic avant de finaliser la consultation.");
            return;
        }

        // 3. Transformer les prescriptions pour le backend
        const prescriptions = selectedMedicaments
            .filter(med => med.id && med.posologie && med.posologie.trim() && med.quantite > 0 && med.duree && med.duree.trim()) // Validation stricte
            .map(med => ({
                medicamentId: Number(med.id), // S'assurer que c'est un nombre
                posologie: med.posologie.trim(),
                quantite: Number(med.quantite), // S'assurer que c'est un nombre
                duree: med.duree.trim()
            }));

        // 4. Appeler le service avec TOUTES les données (Prestations + Vitals + Prescriptions)
        await appointmentService.updatePrestations(
            Number(rdv.id), 
            updatedPrestations, 
            newActeIds, 
            vitals,
            prescriptions // <--- On envoie les prescriptions transformées
        );

        alert("Consultation, examens et ordonnance enregistrés. Email envoyé au patient !");
        // Optionnel : rediriger vers la liste des rendez-vous
    } catch (err: any) {
        console.error(err);
        alert("Erreur : " + err.message);
    } finally {
        setIsSaving(false);
    }
};

  const rdvDate = rdv?.date ? new Date(rdv.date).toLocaleDateString("fr-FR") : "-";
  const rdvTime = rdv?.heure || "-";
  const selectedMedItem = medicamentsList.find(m => String(m.id) === String(currentMed.id));
  const currentMedWarning = selectedMedItem
    ? selectedMedItem.qStock === 0
      ? "Ce médicament est en rupture de stock. Il sera ajouté avec NA dans le nom."
      : currentMed.quantite > selectedMedItem.qStock
      ? `Quantité demandée (${currentMed.quantite}) supérieure au stock disponible (${selectedMedItem.qStock}).`
      : ""
    : "";

  return (
    <>
      <div className="w-full max-w-6xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3">Consultation du rendez-vous</h2>
          {loading ? (
            <p>Chargement du rendez-vous...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="rounded-2xl bg-slate-800/80 p-4">
                <p className="text-slate-400">Patient</p>
                <p className="font-semibold text-white">{rdv?.patient?.nom} {rdv?.patient?.prenom}</p>
              </div>
              <div className="rounded-2xl bg-slate-800/80 p-4">
                <p className="text-slate-400">Date / Heure</p>
                <p className="font-semibold text-white">{rdvDate} · {rdvTime}</p>
              </div>
              <div className="rounded-2xl bg-slate-800/80 p-4">
                <p className="text-slate-400">Motif</p>
                <p className="font-semibold text-white">{rdv?.motif || "-"}</p>
              </div>
            </div>
          )}
        </div>

        {rdv?.prestations?.length > 0 && (
          <div className="mb-8 rounded-3xl bg-slate-800/80 p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4">Actes prévus</h3>
            <div className="space-y-4">
              {rdv.prestations.map((prestation: any) => (
                <div key={prestation.id} className="grid grid-cols-1 gap-3 md:grid-cols-3 items-center rounded-2xl bg-slate-900/80 p-4 border border-white/10">
                  <div>
                    <p className="text-slate-400">Acte</p>
                    <p className="font-semibold text-white">{prestation.acte?.libelle || prestation.acte?.nom || "Acte inconnu"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Prix appliqué</p>
                    <p className="font-semibold text-white">{prestation.prixApplique ?? "-"} Ar</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Résultat / compte-rendu</label>
                    <textarea
                      value={prestationResults[String(prestation.id)] ?? ""}
                      onChange={(e) => handleResultChange(String(prestation.id), e.target.value)}
                      className="w-full min-h-[80px] rounded-2xl bg-white/5 border border-white/10 p-3 text-white"
                      placeholder="Saisir le résultat de l'acte"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} 

        <div className="flex justify-between mb-10 relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10" />
          {[1, 2, 3, 4].map((s) => (
            <div key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-blue-500 text-white scale-110 shadow-lg' : 'bg-slate-700 text-slate-400'}`}>
              {s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaHeartbeat /> Examen</h3>
              <div className="grid grid-cols-2 gap-4">
                <input name="temperature" placeholder="Température" onChange={handleInputChange} className="input" value={vitals.temperature} />
                <input name="tension" placeholder="Tension" onChange={handleInputChange} className="input" value={vitals.tension} />
                <input name="pouls" placeholder="Pouls" onChange={handleInputChange} className="input" value={vitals.pouls} />
                <input name="saturation" placeholder="Saturation" onChange={handleInputChange} className="input" value={vitals.saturation} />
              </div>
              <input name="poids" placeholder="Poids" onChange={handleInputChange} className="input mt-3" value={vitals.poids} />
              <input name="maladie" placeholder="Diagnostic" onChange={handleInputChange} className="input mt-3" value={vitals.maladie} />
              <textarea name="observations" placeholder="Observations" onChange={handleInputChange} className="input mt-3" value={vitals.observations} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaPills /> Prescription</h3>
              <div className="grid gap-4">
                <div>
                  <p className="text-slate-300 mb-2 font-semibold">Ajouter un acte médical au RDV</p>
                  <div className="flex gap-3 flex-col md:flex-row">
                    <select
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
                      value={selectedActeId}
                      onChange={(e) => setSelectedActeId(e.target.value)}
                    >
                      <option value="">Choisir un acte</option>
                      {actes.map((acte) => (
                        <option key={acte.id} value={acte.id}>
                          {acte.libelle || acte.nom} - {acte.prix} Ar
                        </option>
                      ))}
                    </select>
                    <button onClick={addActe} className="w-full md:w-auto bg-violet-600 p-3 rounded-xl font-bold">
                      Ajouter l'acte
                    </button>
                  </div>
                </div>

                {newActes.length > 0 && (
                  <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/10">
                    <p className="text-slate-400 mb-3">Actes supplémentaires ajoutés</p>
                    <div className="space-y-2">
                      {newActes.map((acte, idx) => (
                        <div key={acte.id} className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-sm">
                          <span>{acte.libelle || acte.nom} · {acte.prix} Ar</span>
                          <button
                            type="button"
                            onClick={() => removeActe(idx)}
                            className="text-red-400 hover:text-red-200 text-xs"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-slate-300 mb-3 font-semibold">Prescription</p>
                {medicamentsLoading ? (
                  <p className="text-slate-400 mb-3">Chargement des médicaments...</p>
                ) : medicamentsError ? (
                  <p className="text-red-400 mb-3">{medicamentsError}</p>
                ) : (
                  <select
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                    value={currentMed.id}
                    onChange={(e) => setCurrentMed({ ...currentMed, id: e.target.value })}
                  >
                    <option value="">Choisir médicament</option>
                    {medicamentsList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nom} · {m.qStock === 0 ? 'Rupture de stock' : `${m.qStock} en stock`}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                  placeholder="Posologie"
                  value={currentMed.posologie}
                  onChange={(e) => setCurrentMed({ ...currentMed, posologie: e.target.value })}
                />
                <input
                  type="number"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                  placeholder="Quantité"
                  value={currentMed.quantite}
                  onChange={(e) => setCurrentMed({ ...currentMed, quantite: Number(e.target.value) })}
                />
                <input
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-3"
                  placeholder="Durée (ex: 7 jours)"
                  value={currentMed.duree}
                  onChange={(e) => setCurrentMed({ ...currentMed, duree: e.target.value })}
                />
                {currentMedWarning && (
                  <p className="text-amber-300 mb-3 text-sm">{currentMedWarning}</p>
                )}
                <button onClick={addPrescription} className="w-full bg-green-500 p-3 rounded-xl font-bold">
                  Ajouter
                </button>
                <div className="mt-4 space-y-2">
                  {selectedMedicaments.length === 0 ? (
                    <p className="text-slate-400">Aucun médicament ajouté</p>
                  ) : (
                    selectedMedicaments.map((m, idx) => (
                      <div key={`${m.id}-${m.posologie}-${m.quantite}-${idx}`} className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span>
                            {m.nom} · {m.posologie} · {m.quantite} unité{m.quantite > 1 ? 's' : ''} · {m.duree}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSelectedMed(idx)}
                            className="text-red-400 hover:text-red-200 text-xs"
                          >
                            Supprimer
                          </button>
                        </div>
                        {m.warning && (
                          <p className="text-amber-300 text-xs">{m.warning}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h3 className="text-xl font-bold mb-6">Hébergement (optionnel)</h3>
              <p className="text-slate-400 text-sm mb-4">Si un hébergement est nécessaire, le système choisit automatiquement la chambre libre. VIP correspond uniquement à <strong>soins intensifs</strong>.</p>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hospitalisationEnabled}
                    onChange={(e) => setHospitalisationEnabled(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-slate-800"
                  />
                  <span className="text-white">Hospitalisation demandée</span>
                </label>

                {hospitalisationEnabled && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={soinsIntensifs}
                        onChange={(e) => setSoinsIntensifs(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 bg-slate-800"
                      />
                      <span className="text-white">Soins intensifs (VIP)</span>
                    </label>

                    <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/10 text-sm">
                      <p className="text-slate-300 mb-2 font-semibold">Chambre assignée automatiquement</p>
                      {chambresLoading ? (
                        <p className="text-slate-400">Chargement des chambres...</p>
                      ) : chambresError ? (
                        <p className="text-red-400">{chambresError}</p>
                      ) : chambreAssignee ? (
                        <div className="space-y-1">
                          <p className="text-white">{`#${chambreAssignee.numero} — ${chambreAssignee.isSoinsIntensifs ? 'Soins intensifs' : 'Standard'}`}</p>
                          <p className="text-slate-400 text-xs">Étage {chambreAssignee.etage ?? 'N/A'} • Prix / jour {chambreAssignee.prixJ} Ar</p>
                        </div>
                      ) : (
                        <p className="text-slate-400">Aucune chambre libre disponible</p>
                      )}
                      {chambreWarning && <p className="text-amber-300 text-xs mt-2">{chambreWarning}</p>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h3 className="text-xl font-bold mb-6">Résumé</h3>
              <div className="space-y-3 text-slate-200">
                <p><strong>Diagnostic :</strong> {vitals.maladie}</p>
                <p><strong>Observations :</strong> {vitals.observations || "Aucune observation"}</p>
                <p><strong>Examens :</strong> Température {vitals.temperature || "-"}, Tension {vitals.tension || "-"}, Pouls {vitals.pouls || "-"}, Saturation {vitals.saturation || "-"}, Poids {vitals.poids || "-"}</p>
                <div>
                  <strong>Médicaments prescrits :</strong>
                  <div className="mt-2 space-y-2">
                    {selectedMedicaments.length === 0 ? (
                      <p className="text-slate-400">Aucun médicament ajouté</p>
                    ) : (
                      selectedMedicaments.map((m) => (
                        <div key={`${m.id}-${m.posologie}-${m.quantite}`} className="rounded-2xl bg-slate-900/80 p-3 border border-white/10">
                          {m.nom} · {m.posologie} · {m.quantite} unité{m.quantite > 1 ? 's' : ''} · {m.duree}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {hospitalisationEnabled && (
                  <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/10 mt-4">
                    <p className="text-slate-300 mb-1 font-semibold">Hospitalisation demandée</p>
                    {chambreAssignee ? (
                      <p className="text-white">Chambre assignée : #{chambreAssignee.numero} ({chambreAssignee.isSoinsIntensifs ? 'Soins intensifs' : 'Standard'})</p>
                    ) : (
                      <p className="text-amber-300">Aucune chambre libre disponible pour l’instant.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 bg-white/10 p-3 rounded-xl">
              Retour
            </button>
          )}
          <button
            onClick={() => (step === 4 ? handleSubmit() : setStep(step + 1))}
            disabled={isSaving}
            className="flex-[2] bg-blue-600 p-3 rounded-xl font-bold flex justify-center gap-2 items-center disabled:opacity-50"
          >
            {step === 4 ? <><FaCheckCircle /> {isSaving ? "Sauvegarde..." : "Valider"}</> : "Suivant"}
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

        textarea.input {
          min-height: 120px;
          resize: vertical;
        }
      `}</style>
    </>
  );
}