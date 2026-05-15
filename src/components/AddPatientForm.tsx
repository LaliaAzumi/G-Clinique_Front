// export default AddPatientForm;
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const AddPatientForm = ({ onSubmit, onCancel, initialData }: any) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    // On mappe les données de la BDD (nom/prenom) vers les champs du formulaire (lastName/firstName)
    defaultValues: {
      lastName: initialData?.nom || "",
      firstName: initialData?.prenom || "",
      email: initialData?.email || "",
      phone: initialData?.telephone || "",
      dateOfBirth: initialData?.dateNaissance || "",
      adresse: initialData?.adresse || "",
      sexe: initialData?.sexe || "M", // Par défaut Masculin si pas de donnée
    }
  });

  // Pour mettre à jour le formulaire si initialData change
 // AddPatientForm.tsx
useEffect(() => {
  if (initialData) {
    reset({
      lastName: initialData.nom,       // Reçu de l'API
      firstName: initialData.prenom,
      email: initialData.email,
      phone: initialData.telephone,
      dateOfBirth: initialData.dateNaissance,
      adresse: initialData.adresse,
      sexe: initialData.sexe || "M", // Par défaut Masculin si pas de donnée
    });
  } else {
    reset({ lastName: "", firstName: "", email: "", phone: "", dateOfBirth: "", adresse: "" });
  }
}, [initialData, reset]);

const handleInternalSubmit = (data: any) => {
  // Sécurité : transformer la date en YYYY-MM-DD
  let formattedDate = data.dateOfBirth;
  
  if (formattedDate.includes('/')) {
    // Si c'est du style DD/MM/YYYY
    const [day, month, year] = formattedDate.split('/');
    formattedDate = `${year}-${month}-${day}`;
  }

  const payload = {
    id: data.id, // Si on a un ID (pour l'édition), on le garde
    nom: data.lastName,
    prenom: data.firstName,
    email: data.email,
    telephone: data.phone,
    dateNaissance: formattedDate, // On envoie le format propre
    adresse: data.adresse,
    sexe: data.sexe || null, // Par défaut Masculin si pas de donnée
  };

  if (initialData?.id) {
    payload.id = initialData.id;
  }
  
  onSubmit(payload);
};
  return (
    <form onSubmit={handleSubmit(handleInternalSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/60">Nom</label>
          <input {...register("lastName", { required: true })} className="login-input" style={{color:"white"}} />
        </div>
        <div>
          <label className="text-xs text-white/60">Prénom</label>
          <input {...register("firstName")} className="login-input" style={{color:"white"}} />
        </div>
      </div>

      <div>
        <label className="text-xs text-white/60">Email</label>
        <input {...register("email")} className="login-input" style={{color:"white"}} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/60">Téléphone</label>
          <input {...register("phone")} className="login-input" style={{color:"white"}} />
        </div>
        <div>
          <label className="text-xs text-white/60">Adresse</label>
          <input {...register("adresse")} className="login-input" placeholder="Ville, Rue..." style={{color:"white"}} />
        </div>
      </div>

      <div>
        <label className="text-xs text-white/60 ml-1">Date de Naissance</label>
        <input 
          type="date" // <--- INDISPENSABLE
          {...register("dateOfBirth", { required: "La date est requise" })} 
          className="login-input" 
          style={{color:"white"}}
        />
      </div>
      <div>
      <label className="text-xs text-white/60 ml-1">Sexe</label>
      <select {...register("sexe")} className="login-input">
        <option style={{background:"#0b7c64", color:"#fff"}} value="">Non renseigné</option>
        <option style={{background:"#0b7c64", color:"#fff"}} value="M">Homme</option>
        <option style={{background:"#0b7c64", color:"#fff"}} value="F">Femme</option>
      </select>
    </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="google-btn !py-2 flex-1" style={{color:"white"}} >Annuler</button>
        <button type="submit" className="login-btn !py-2 flex-1">Enregistrer</button>
      </div>
    </form>
  );
};

export default AddPatientForm;