import React from "react";
import { useForm } from "react-hook-form";
import { Medecin } from "@/types/medecins";

interface AddMedecinForm {
  onSubmit: (data: Omit<Medecin, "id">) => void;
  onCancel: () => void;
}

const AddMedecinForm: React.FC<AddMedecinForm> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit } = useForm<Omit<Medecin, "id">>();

  return (
    /* Pas de div globale avec fond d'écran ici, juste le form */
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Nom</label>
          <input {...register("Nom")} className="login-input" placeholder="Nom" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Spécialté</label>
          <input {...register("Specialite")} className="login-input" placeholder="Spécialté" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Téléphone</label>
          <input {...register("Telephone")} className="login-input" placeholder="Téléphone" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60 ml-1">Adress</label>
          <input {...register("Adress")} className="login-input" placeholder="Adress" required />
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

export default AddMedecinForm;