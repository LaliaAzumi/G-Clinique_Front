import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateClinicInput } from "@/types/clinic";

const clinicSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Téléphone requis"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  zipCode: z.string().min(2, "Code postal requis"),
  country: z.string().min(2, "Pays requis"),
  description: z.string().optional(),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

interface AddClinicFormProps {
  onSubmit: (data: ClinicFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<ClinicFormValues>;
}

const AddClinicForm = ({ onSubmit, onCancel, initialData }: AddClinicFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs text-primary-foreground/60 ml-1">Nom de la Clinique</label>
        <input
          {...register("name")}
          className="login-input"
          placeholder="Clinique..."
        />
        {errors.name && (
          <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Email</label>
          <input
            {...register("email")}
            className="login-input"
            placeholder="contact@clinique.com"
          />
          {errors.email && (
            <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Téléphone</label>
          <input
            {...register("phone")}
            className="login-input"
            placeholder="+261 XX XXX XX"
          />
          {errors.phone && (
            <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-primary-foreground/60 ml-1">Adresse</label>
        <input
          {...register("address")}
          className="login-input"
          placeholder="Rue..."
        />
        {errors.address && (
          <p className="text-red-400 text-[10px] mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Ville</label>
          <input
            {...register("city")}
            className="login-input"
            placeholder="Ville"
          />
          {errors.city && (
            <p className="text-red-400 text-[10px] mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Code Postal</label>
          <input
            {...register("zipCode")}
            className="login-input"
            placeholder="Code"
          />
          {errors.zipCode && (
            <p className="text-red-400 text-[10px] mt-1">{errors.zipCode.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-primary-foreground/60 ml-1">Pays</label>
          <input
            {...register("country")}
            className="login-input"
            placeholder="Pays"
          />
          {errors.country && (
            <p className="text-red-400 text-[10px] mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-primary-foreground/60 ml-1">Description</label>
        <textarea
          {...register("description")}
          className="login-input"
          placeholder="Description de la clinique..."
          rows={3}
        />
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

export default AddClinicForm;
