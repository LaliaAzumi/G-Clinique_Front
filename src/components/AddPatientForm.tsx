import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Patient } from "@/types/patient";

// Schéma de validation (Utile pour le Backend et la sécurité)
const patientSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Téléphone requis"),
  dateOfBirth: z.string(),
  gender: z.enum(["M", "F"]),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface AddPatientFormProps {
  onSubmit: (data: PatientFormValues) => void;
  onCancel: () => void;
}

const AddPatientForm = ({ onSubmit, onCancel }: AddPatientFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { gender: "M" }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Nom</label>
          <input {...register("lastName")} className="login-input" placeholder="Nom du patient" />
          {errors.lastName && <p className="text-red-400 text-[10px] mt-1">{errors.lastName.message}</p>}
        </div>
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Prénom</label>
          <input {...register("firstName")} className="login-input" placeholder="Prénom" />
        </div>
      </div>

      <div>
        <label className="text-xs text-primary-foreground/60 ml-1">Email professionnel / Personnel</label>
        <input {...register("email")} className="login-input" placeholder="exemple@clinique.com" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Téléphone</label>
          <input {...register("phone")} className="login-input" placeholder="034 XX XXX XX" />
        </div>
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Genre</label>
          <select {...register("gender")} className="login-input appearance-none bg-black/20">
            <option value="M" className="bg-slate-800">Masculin</option>
            <option value="F" className="bg-slate-800">Féminin</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="google-btn !py-2 flex-1"> Annuler </button>
        <button type="submit" className="login-btn !py-2 flex-1"> Enregistrer </button>
      </div>
    </form>
  );
};

export default AddPatientForm;