import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

interface AddRdvFormProps {
  rdvToEdit?: any;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

const AddRdvForm = ({ rdvToEdit, onSuccess, onCancel }: AddRdvFormProps) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [medecins, setMedecins] = useState<any[]>([]);
  
  const [searchPatient, setSearchPatient] = useState("");
  const [searchMedecin, setSearchMedecin] = useState("");
  const [openPatient, setOpenPatient] = useState(false);
  const [openMedecin, setOpenMedecin] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
        id: rdvToEdit?.id || "", // AJOUT de l'ID ici
        patientId: rdvToEdit?.patient?.id || "",
        patientName: rdvToEdit ? `${rdvToEdit.patient?.nom} ${rdvToEdit.patient?.prenom}` : "",
        medecinId: rdvToEdit?.medecin?.id || "",
        medecinName: rdvToEdit?.medecin ? `Dr. ${rdvToEdit.medecin.nom}` : "",
        date: rdvToEdit?.date || "",
        heure: rdvToEdit?.heure || "",
        motif: rdvToEdit?.motif || ""
    }
    });

  const selectedPatientName = watch("patientName");
  const selectedMedecinName = watch("medecinName");

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };
    try {
      // 1. Charger Patients (Vérifiez si l'API patient renvoie aussi un ApiResponse ou un tableau direct)
      const resP = await fetch("http://localhost:8000/api/v1/patients", { headers });
      const jsonP = await resP.json();
      // Si votre API Patient suit la même structure ApiResponse :
      setPatients(jsonP.data?.patients || jsonP || []);

      // 2. Charger Médecins (Adapté à votre MedecinApiController.java)
      const resM = await fetch("http://localhost:8000/api/v1/medecins", { headers });
      const jsonM = await resM.json();
      
      console.log("Réponse API Médecins:", jsonM);

      // extraction du tableau depuis l'objet ApiResponse { success, message, data: { medecins: [] } }
      if (jsonM.success && jsonM.data && Array.isArray(jsonM.data.medecins)) {
        setMedecins(jsonM.data.medecins);
      } else {
        console.error("Format de données médecin inconnu", jsonM);
        setMedecins([]);
      }
    } catch (err) {
      console.error("Erreur de connexion à l'API", err);
    }
  };
  fetchData();
}, []);

  useEffect(() => {
    if (rdvToEdit) {
      reset({
        patientId: rdvToEdit.patient?.id,
        patientName: `${rdvToEdit.patient?.nom} ${rdvToEdit.patient?.prenom}`,
        medecinId: rdvToEdit.medecin?.id,
        medecinName: `Dr. ${rdvToEdit.medecin?.nom}`,
        date: rdvToEdit.date,
        heure: rdvToEdit.heure,
        motif: rdvToEdit.motif
      });
    }
  }, [rdvToEdit, reset]);

  // Filtrage sécurisé (vérifie si m.nom existe avant le toLowerCase)
  const filteredMedecins = medecins.filter(m => 
    m.nom?.toLowerCase().includes(searchMedecin.toLowerCase()) || 
    m.specialite?.toLowerCase().includes(searchMedecin.toLowerCase())
  );

  const handleInternalSubmit = (data: any) => {
    console.log("Données envoyées au service API:", data);
    const payload = {
      ...(rdvToEdit?.id && { id: Number(rdvToEdit.id) }),
      patientId: Number(data.patientId),
      medecinId: Number(data.medecinId),
      date: data.date,
      heure: data.heure,
      motif: data.motif
    };
    onSuccess(payload);
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10 w-full max-w-md shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6">
        {rdvToEdit ? "Modifier le rendez-vous" : "Planifier un rendez-vous"}
      </h2>

      <form onSubmit={handleSubmit(handleInternalSubmit)} className="space-y-4">
        <input type="hidden" {...register("id")} />
        {/* DROPDOWN PATIENT */}
        <div className="relative">
          <label className="text-xs text-white/60 ml-1">Patient</label>
          <div className="login-input flex justify-between items-center cursor-pointer" onClick={() => { setOpenPatient(!openPatient); setOpenMedecin(false); }}>
            <span className={selectedPatientName ? "text-white" : "text-white/40"}>
              {selectedPatientName || "Choisir un patient..."}
            </span>
          </div>
          {openPatient && (
            <div className="absolute z-50 w-full mt-1 bg-[#0f172a] border border-white/10 rounded-lg shadow-2xl max-h-40 overflow-y-auto">
              <input type="text" className="w-full p-2 bg-transparent border-b border-white/10 text-white text-sm" placeholder="Filtrer..." value={searchPatient} onChange={(e) => setSearchPatient(e.target.value)} autoFocus />
              {patients.filter(p => `${p.nom} ${p.prenom}`.toLowerCase().includes(searchPatient.toLowerCase())).map(p => (
                <div key={p.id} className="p-2 hover:bg-blue-600 text-white text-sm cursor-pointer" onClick={() => {
                  setValue("patientId", p.id);
                  setValue("patientName", `${p.nom} ${p.prenom}`);
                  setOpenPatient(false);
                }}>{p.nom} {p.prenom}</div>
              ))}
            </div>
          )}
          <input type="hidden" {...register("patientId", { required: true })} />
        </div>

        {/* DROPDOWN MÉDECIN */}
        <div className="relative">
          <label className="text-xs text-white/60 ml-1">Médecin</label>
          <div className="login-input flex justify-between items-center cursor-pointer" onClick={() => { setOpenMedecin(!openMedecin); setOpenPatient(false); }}>
            <span className={selectedMedecinName ? "text-white" : "text-white/40"}>
              {selectedMedecinName || "Choisir un médecin..."}
            </span>
          </div>
          {openMedecin && (
            <div className="absolute z-40 w-full mt-1 bg-[#0f172a] border border-white/10 rounded-lg shadow-2xl max-h-40 overflow-y-auto">
              <input type="text" className="w-full p-2 bg-transparent border-b border-white/10 text-white text-sm sticky top-0 bg-[#0f172a]" placeholder="Filtrer..." value={searchMedecin} onChange={(e) => setSearchMedecin(e.target.value)} autoFocus />
              {filteredMedecins.length > 0 ? (
                filteredMedecins.map(m => (
                  <div key={m.id} className="p-2 hover:bg-blue-600 text-white text-sm cursor-pointer" onClick={() => {
                    setValue("medecinId", m.id);
                    setValue("medecinName", `Dr. ${m.nom}`);
                    setOpenMedecin(false);
                  }}>
                    Dr. {m.nom} <span className="text-white/40 text-xs ml-2">- {m.specialite}</span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-white/30 text-xs italic">Aucun médecin disponible</div>
              )}
            </div>
          )}
          <input type="hidden" {...register("medecinId", { required: true })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/60 ml-1">Date</label>
            <input type="date" {...register("date", { required: true })} className="login-input" />
          </div>
          <div>
            <label className="text-xs text-white/60 ml-1">Heure</label>
            <input type="time" {...register("heure", { required: true })} className="login-input" />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 ml-1">Motif</label>
          <textarea {...register("motif")} className="login-input min-h-[60px] pt-2" placeholder="Motif..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="google-btn !py-2 flex-1">Annuler</button>
          <button type="submit" className="login-btn !py-2 flex-1">Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default AddRdvForm;