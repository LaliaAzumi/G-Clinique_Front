import React from "react";
import { useForm } from "react-hook-form";
import { Secretary } from "@/types/secretary";

interface AddSecretaryFormProps {
  onSubmit: (data: Omit<Secretary, "id">) => void;
  onCancel: () => void;
}

const AddSecretaryForm: React.FC<AddSecretaryFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit } = useForm<Omit<Secretary, "id">>();

  return (
    /* Pas de div globale avec fond d'écran ici, juste le form */
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Nom</label>
          <input {...register("lastName")} className="login-input" placeholder="Nom" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Prénom</label>
          <input {...register("firstName")} className="login-input" placeholder="Prénom" required />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-white/60 ml-1">Email Professionnel</label>
        <input {...register("email")} type="email" className="login-input" placeholder="sec.nom@clinique.mg" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Téléphone</label>
          <input {...register("phone")} className="login-input" placeholder="034 XX XXX XX" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Service</label>
          <select {...register("assignedService")} className="login-input bg-slate-900/50">
            <option value="Accueil" className="bg-slate-900">Accueil</option>
            <option value="Radiologie" className="bg-slate-900">Radiologie</option>
            <option value="Urgences" className="bg-slate-900">Urgences</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="google-btn !py-2 flex-1">
          Annuler
        </button>
        <button type="submit" className="login-btn !py-2 flex-1">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default AddSecretaryForm;