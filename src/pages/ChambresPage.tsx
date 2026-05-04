// import { useState, useEffect } from "react";
// import { UserPlus, Search, MoreVertical, Edit, Trash2, Stethoscope } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { apiChambre } from "@/services/apiChambre"; // service API centralisé
// import { toast } from "sonner"; // Pour les notifications (déjà dans ton package.json)
// //import { chambreService } from "@/lib/api-chambres";
// import { Chambre } from "@/types/chambre";
// import loginBg from "@/assets/login-bg.jpg";
// import AddchambreForm from "../components/AddChambreForm";

// const chambresPage = () => {
//   const [chambres, setchambres] = useState<Chambre[]>([]);
//   const [search, setSearch] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   //recup token
//   // Récupère ton vrai token ici (ex: via localStorage)
//   const token = localStorage.getItem("token") || "";

//   useEffect(() => {
//   const loadData = async () => {
//     try {
//       const response: any = await apiChambre.getAll(token);
//       console.log("Données reçues du Backend:", response);

//       // On vérifie si la structure contient .data.chambres
//       if (response && response.data && Array.isArray(response.data.chambres)) {
//         setchambres(response.data.chambres);
//       } else {
//         // Au cas où la structure changerait ou serait vide
//         setchambres([]);
//       }
//     } catch (error) {
//       console.error("Crash API:", error);
//       toast.error("Le serveur ne répond pas");
//     }
//   };
//   loadData();
// }, [token]);

//   const filteredchambres = chambres.filter(c => 
//   c.numero?.toLowerCase().includes(search.toLowerCase())
// );
// // 2. Ajout réel en base
//  const handleAddchambre = async (data: any) => {
//   try {
//     // 1. Envoi au backend
//     await apiChambre.create(data, token);
//     toast.success("Chambre ajoutée avec succès !");
//     setIsModalOpen(false);

//     // 2. Récupération de la nouvelle liste
//     const response: any = await apiChambre.getAll(token);
    
//     // IMPORTANT : On utilise la même structure que dans le useEffect
//     if (response && response.data && Array.isArray(response.data.chambres)) {
//       setchambres(response.data.chambres);
//     }
//   } catch (error) {
//     console.error("Erreur ajout:", error);
//     toast.error("Erreur lors de l'ajout");
//   }
// };

// //delete
// const handleDelete = async (id: string) => {
//   try {
//     await apiChambre.delete(id, token);
//     toast.success("Chambre supprimée");

//     // refresh liste
//     const response: any = await apiChambre.getAll(token);
//     if (response?.data?.chambres) {
//       setchambres(response.data.chambres);
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Erreur suppression");
//   }
// };

// //update
// const handleUpdate = async (id: string, data: Partial<Chambre>) => {
//   try {
//     await apiChambre.update(id, data, token);
//     toast.success("Chambre modifiée");

//     const response: any = await apiChambre.getAll(token);
//     if (response?.data?.chambres) {
//       setchambres(response.data.chambres);
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Erreur modification");
//   }
// };
 

//   return (
//     <div className="min-h-screen p-8 text-primary-foreground" 
//         //  style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}
//          >
//       {/* overlay sombre */}
//       {/* <div className="absolute inset-0 bg-black opacity-65"></div> */}
      
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header avec bouton Ajout */}
//         <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
//   <div>
//     <h1 className="text-3xl font-bold flex items-center gap-2">
//       <Stethoscope className="text-primary" /> Gestion des chambres
//     </h1>
//     <p className="text-white/60">Liste des chambres enregistrés dans la clinique</p>
//   </div>

//   <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//     <DialogTrigger asChild>
//       <button className="login-btn !w-auto px-6 flex items-center gap-2">
//         <UserPlus size={18} /> Nouveau chambre
//       </button>
//     </DialogTrigger>
    
//     <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]"
//     style={{background:"#ffffff1c"}}
//     >
//       <DialogHeader>
//         <DialogTitle className="text-2xl font-bold flex items-center gap-2">
//            <UserPlus className="text-primary" /> Enregistrer un chambre
//         </DialogTitle>
//       </DialogHeader>
      
//       <AddchambreForm 
//         onSubmit={handleAddchambre} 
//         onCancel={() => setIsModalOpen(false)} 
//       />
//     </DialogContent>
//   </Dialog>
// </div>

//         {/* Barre de Recherche */}
//         <div className="relative max-w-md">
//           <Search className="relative left-2 top-9 z-10" size={20} />
//           <input 
//             type="text" 
//             placeholder="Rechercher un nom..." 
//             className="login-input pl-10 placeholder-white/60"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{background:"#9797972d", color:"white"}}
//           />
//         </div>

//         {/* Tableau Glassmorphisme */}
//         <div className="glass-card overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-white/10 text-sm uppercase">
//               <tr>
//                 <th className="p-4">n° chambre</th>
//                 <th className="p-4">etage</th>
//                 <th className="p-4">prixJ</th>
//                 <th className="p-4">etat</th>
//                 <th className="p-4">isSoinsIntensifs</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/10">
//               {filteredchambres.map((chambre) => (
//                 <tr key={chambre.id} className="hover:bg-white/5 transition-colors">
//                   <td className="p-4 font-medium">{chambre.numero} </td>
//                   <td className="p-4 text-sm text-white/70"> {chambre.etage}</td>
//                   <td className="p-4 text-sm text-white/70">{chambre.prixJ} </td>
//                     <td className="p-4 font-medium"> {chambre.etat ?  "Libre" : "Occupée"}</td>
//                   <td className="p-4 text-sm">{chambre.isSoinsIntensifs ? "urgence" : "nope"} </td>
//                   <td className="p-4 flex justify-center gap-3">
//                     {/* <button className="p-2 hover:bg-white/10 rounded-lg text-primary"><Edit size={16}/></button>
//                     <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16}/></button> */}
//                     <button
//                       onClick={() => handleUpdate(chambre.id, { etat: !chambre.etat })}
//                       className="p-2 hover:bg-white/10 rounded-lg text-primary"
//                     >
//                       <Edit size={16}/>
//                     </button>

//                     <button
//                       onClick={() => handleDelete(chambre.id)}
//                       className="p-2 hover:bg-white/10 rounded-lg text-red-400"
//                     >
//                       <Trash2 size={16}/>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredchambres.length === 0 && (
//             <div className="p-10 text-center text-white/40">Aucun chambre trouvé.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default chambresPage;
import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  Stethoscope,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { apiChambre } from "@/services/apiChambre";
import { toast } from "sonner";

import { Chambre } from "@/types/chambre";
import AddChambreForm from "../components/AddChambreForm";

const ChambresPage = () => {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [search, setSearch] = useState("");

  // CREATE MODAL
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // EDIT MODAL
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedChambre, setSelectedChambre] = useState<Chambre | null>(null);

  const token = localStorage.getItem("token") || "";

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const response: any = await apiChambre.getAll(token);

        if (response?.data?.chambres) {
          setChambres(response.data.chambres);
        } else {
          setChambres([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur chargement chambres");
      }
    };

    loadData();
  }, [token]);

  // =========================
  // CREATE
  // =========================
  const handleAddChambre = async (data: any) => {
    try {
      await apiChambre.create(data, token);
      toast.success("Chambre ajoutée");

      const res: any = await apiChambre.getAll(token);
      setChambres(res.data.chambres);

      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur ajout chambre");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await apiChambre.delete(id, token);
      toast.success("Chambre supprimée");

      setChambres((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Erreur suppression");
    }
  };

  // =========================
  // OPEN EDIT
  // =========================
  const openEdit = (chambre: Chambre) => {
    setSelectedChambre(chambre);
    setIsEditOpen(true);
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (data: any) => {
    if (!selectedChambre) return;

    try {
      await apiChambre.update(selectedChambre.id, data, token);

      toast.success("Chambre modifiée");

      setChambres((prev) =>
        prev.map((c) =>
          c.id === selectedChambre.id ? { ...c, ...data } : c
        )
      );

      setIsEditOpen(false);
      setSelectedChambre(null);
    } catch (error) {
      console.error(error);
      toast.error("Erreur modification");
    }
  };

  // =========================
  // FILTER
  // =========================
  const filtered = chambres.filter((c) =>
    c.numero?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Stethoscope /> Gestion des chambres
            </h1>
            <p className="text-white/60">
              Liste des chambres
            </p>
          </div>

          {/* CREATE */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              {/* <button className="login-btn flex items-center gap-2">
                <UserPlus size={18} /> Nouveau
              </button> */}
              <button className="login-btn !w-auto px-6 flex items-center gap-2">
                <UserPlus size={18} /> Nouveau chambre
              </button>
            </DialogTrigger>

            <DialogContent style={{ background: "#ffffff1c" }}>
              <DialogHeader>
                <DialogTitle style={{color: "white"}}>Ajouter chambre</DialogTitle>
              </DialogHeader>

              <AddChambreForm
                onSubmit={handleAddChambre}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          {/* <Search className="absolute left-2 top-3 text-white/70" size={18} /> */}
           <Search className="relative left-2 top-9 z-10" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="login-input pl-10 placeholder-white/60"
            style={{ background: "#9797972d", color: "white" }}
          />
        </div>

        {/* TABLE */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/10 text-sm uppercase">
              <tr>
                <th className="p-4">Numéro</th>
                <th className="p-4">Étage</th>
                <th className="p-4">Prix</th>
                <th className="p-4">État</th>
                <th className="p-4">Soins intensifs</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="p-4">{c.numero}</td>
                  <td className="p-4">{c.etage}</td>
                  <td className="p-4">{c.prixJ}</td>
                  <td className="p-4">
                    {c.etat ? "Libre" : "Occupée"}
                  </td>
                  <td className="p-4">
                    {c.isSoinsIntensifs ? "Oui" : "Non"}
                  </td>

                  {/* <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-primary"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td> */}
                  <td className="p-4">
                    <div className="flex justify-center gap-3 items-center">
                      <button onClick={() => openEdit(c)} className="text-primary">
                        <Edit size={16} />
                      </button>

                      <button onClick={() => handleDelete(c.id)} className="text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>   
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-6 text-center text-white/40">
              Aucun résultat
            </div>
          )}
        </div>
      </div>

      {/* =========================
          EDIT MODAL
      ========================= */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent style={{ background: "#ffffff1c" }}>
          <DialogHeader>
            <DialogTitle>Modifier chambre</DialogTitle>
          </DialogHeader>

          <AddChambreForm
            initialData={selectedChambre || undefined}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditOpen(false);
              setSelectedChambre(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChambresPage;