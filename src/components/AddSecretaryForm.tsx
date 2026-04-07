import React from "react";
import { useForm } from "react-hook-form";
import { Secretary } from "@/types/secretary";

interface AddSecretaryFormProps {
  onSubmit: (data: { username: string; email: string }) => void;
  onCancel: () => void;
}

const AddSecretaryForm: React.FC<AddSecretaryFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit } = useForm<{ username: string; email: string }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-1">
        <label className="text-xs text-white/60 ml-1">Nom d'utilisateur</label>
        <input 
          {...register("username")} 
          className="login-input" 
          placeholder="Ex: jean.dupont" 
          required 
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-white/60 ml-1">Email Professionnel</label>
        <input 
          {...register("email")} 
          type="email" 
          className="login-input" 
          placeholder="sec.nom@clinique.mg" 
          required 
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="google-btn !py-2 flex-1">
          Annuler
        </button>
        <button type="submit" className="login-btn !py-2 flex-1">
          Enregistrer le secrétaire
        </button>
      </div>
    </form>
  );
};

export default AddSecretaryForm;