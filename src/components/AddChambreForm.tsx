// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Chambre } from "@/types/chambre";

// // Schéma de validation (Utile pour le Backend et la sécurité)
// const chambreSchema = z.object({
//   numero: z.string().min(2, "numero requis"),
//   etat: z.string().min(1, "etat requis"),
//   prixJ: z.string().min(5, "prixJ invalide"),
//   etage: z.string().min(1, "etage requis"),
//  isSoinsIntensifs : z.string().min(2, "PrixJ requis"),
// });

// type ChambreFormValues = z.infer<typeof chambreSchema>;

// interface AddChambreFormProps {
//   // On change le type de data ici pour accepter ce que le backend attend vraiment
//   onSubmit: (data: any) => void; 
//   onCancel: () => void;
//  initialData?: Partial<Chambre>; // 👈 pour edit
// }

// const AddChambreForm = ({ onSubmit, onCancel }: AddChambreFormProps) => {
//   const { register, handleSubmit, formState: { errors } } = useForm<ChambreFormValues>({
//     resolver: zodResolver(chambreSchema),
//   });

//   const handleDataBeforeSubmit = (data: ChambreFormValues) => {
//     // On convertit les types pour plaire à FastAPI
//     const formattedData = {
//       ...data,
//       prixJ: parseFloat(data.prixJ), // String -> Number
//       etage: parseInt(data.etage),   // String -> Number
//       etat: data.etat === "true",    // String -> Boolean
//       soinsIntensifs: data.isSoinsIntensifs === "true", // String -> Boolean + Renommé
//     };
//     onSubmit(formattedData);
//   };

//  return (
//     <form onSubmit={handleSubmit(handleDataBeforeSubmit)} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="text-xs text-primary-foreground/60 ml-1">Numero</label>
//           <input {...register("numero")} className="login-input" placeholder="Numero du chambre" style={{background:"#ffffff00", color:"white"}}/>
//           {errors.numero && <p className="text-red-400 text-[10px] mt-1">{errors.numero.message}</p>}
//         </div>
//         <div>
//           <label className="text-xs text-primary-foreground/60 ml-1">Etat</label>
//           <input {...register("etat")} className="login-input" placeholder="true (libre) /false (occupée)" style={{background:"#ffffff00", color:"white"}}/>
          
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="text-xs text-primary-foreground/60 ml-1">PrixJ</label>
//           <input {...register("prixJ")} className="login-input" placeholder="50 000 Ar" style={{background:"#ffffff00", color:"white"}}/>
//         </div>

//         <div>
//           <label className="text-xs text-primary-foreground/60 ml-1">etage</label>
//           <input {...register("etage")} className="login-input" placeholder="2" style={{background:"#ffffff00", color:"white"}}/>
//         </div>
//          <div>
//           <label className="text-xs text-primary-foreground/60 ml-1">isSoinsIntensifs</label>
//           <input {...register("isSoinsIntensifs")} className="login-input" placeholder="true/false" style={{background:"#ffffff00", color:"white"}} />
//         </div>
       
//       </div>

//       <div className="flex gap-3 pt-4">
//         <button type="button" onClick={onCancel} className="google-btn !py-2 flex-1"> Annuler </button>
//         <button type="submit" className="login-btn !py-2 flex-1"> Enregistrer </button>
//       </div>
//     </form>
//   );
// };

// export default AddChambreForm;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Chambre } from "@/types/chambre";

// 🔥 Schéma de validation
const chambreSchema = z.object({
  numero: z.string().min(2, "Numéro requis"),
  etat: z.string().min(1, "État requis"),
  prixJ: z.string().min(1, "Prix requis"),
  etage: z.string().min(1, "Étage requis"),
  isSoinsIntensifs: z.string().min(1, "Champ requis"),
});

type ChambreFormValues = z.infer<typeof chambreSchema>;

interface AddChambreFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Partial<Chambre>; // 👈 pour EDIT
}

const AddChambreForm = ({
  onSubmit,
  onCancel,
  initialData,
}: AddChambreFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChambreFormValues>({
    resolver: zodResolver(chambreSchema),
    defaultValues: {
      numero: initialData?.numero || "",
      etat: initialData?.etat ? "true" : "false",
      prixJ: initialData?.prixJ?.toString() || "",
      etage: initialData?.etage?.toString() || "",
      isSoinsIntensifs: initialData?.isSoinsIntensifs ? "true" : "false",
    },
  });

  // 🔥 conversion avant envoi backend
  const handleDataBeforeSubmit = (data: ChambreFormValues) => {
    const formattedData = {
      numero: data.numero,
      prixJ: parseFloat(data.prixJ),
      etage: parseInt(data.etage),
      etat: data.etat === "true",
      isSoinsIntensifs: data.isSoinsIntensifs === "true",
    };

    onSubmit(formattedData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataBeforeSubmit)}
      className="space-y-4"
    >
      {/* ROW 1 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/60 ml-1">Numéro</label>
          <input
            {...register("numero")}
            className="login-input"
            placeholder="Numéro de chambre"
            style={{ background: "#ffffff00", color: "white" }}
          />
          {errors.numero && (
            <p className="text-red-400 text-[10px] mt-1">
              {errors.numero.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-white/60 ml-1">État</label>
          <input
            {...register("etat")}
            className="login-input"
            placeholder="true / false"
            style={{ background: "#ffffff00", color: "white" }}
          />
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/60 ml-1">Prix journalier</label>
          <input
            {...register("prixJ")}
            className="login-input"
            placeholder="50000"
            style={{ background: "#ffffff00", color: "white" }}
          />
        </div>

        <div>
          <label className="text-xs text-white/60 ml-1">Étage</label>
          <input
            {...register("etage")}
            className="login-input"
            placeholder="2"
            style={{ background: "#ffffff00", color: "white" }}
          />
        </div>
      </div>

      {/* ROW 3 */}
      <div>
        <label className="text-xs text-white/60 ml-1">
          Soins intensifs
        </label>
        <input
          {...register("isSoinsIntensifs")}
          className="login-input"
          placeholder="true / false"
          style={{ background: "#ffffff00", color: "white" }}
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="google-btn !py-2 flex-1"
        >
          Annuler
        </button>

        <button type="submit" className="login-btn !py-2 flex-1">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default AddChambreForm;