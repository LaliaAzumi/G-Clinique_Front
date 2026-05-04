// import { useEffect, useState } from "react";
// import { medicamentService } from "@/lib/api-medicament";
// import { Medicament } from "@/types/medicament";
// import { Edit, Trash2 } from "lucide-react";

// import "./medicament.css";

// export default function ListeMedicaments() {
//   const [medicaments, setMedicaments] = useState<Medicament[]>([]);
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState<Medicament[]>([]);
//   const [selectedFilter, setSelectedFilter] = useState("ALL");

//   const [priceOrder, setPriceOrder] = useState("NONE");

//   const [selectedMed, setSelectedMed] = useState<Medicament | null>(null);
//   const [openModal, setOpenModal] = useState(false);

//   const load = async () => {
//     const res = await medicamentService.getAll();
//      console.log("GET ALL RESPONSE:", res);
//     setMedicaments(res.content || res);
//   };

//     const emptyMed: Medicament = {
//         id: null,
//         nom: "",
//         description: "",
//         pu: null,
//         qStock: null,
//     };

//     const [newMed, setNewMed] = useState<Medicament>(emptyMed);
//     const [openAddModal, setOpenAddModal] = useState(false);

//   useEffect(() => {
//     load();
//   }, []);

//   const handleSearch = async (value: string) => {
//     setSearch(value);

//     if (value.length < 1) {
//       setSuggestions([]);
//       return;
//     }

//     const res = await medicamentService.search(value);
//     setSuggestions(res.content || res);
//   };

//   const selectSuggestion = (item: Medicament) => {
//     setSearch(item.nom);
//     setSuggestions([]);
//     setMedicaments([item]);
//   };

//   // FILTER + SORT
//   let filtered = medicaments.filter((m) => {
//     if (selectedFilter === "LOW_STOCK") return m.qStock < 10;
//     return true;
//   });

//   if (priceOrder === "ASC") {
//     filtered = [...filtered].sort((a, b) => a.pu - b.pu);
//   } else if (priceOrder === "DESC") {
//     filtered = [...filtered].sort((a, b) => b.pu - a.pu);
//   }

//   const handleDelete = async (id: number) => {
//     const c1 = window.confirm("Supprimer ?");
//     if (!c1) return;

//     const c2 = window.confirm("Vraiment supprimer définitivement ?");
//     if (!c2) return;

//     await medicamentService.delete(id.toString());
//     load();
//   };

//   return (
//     <div className="med-container">

//       <div className="med-header">
//         <h2>Médicaments</h2>

//         <div className="search-box">
//           <input
//             value={search}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Rechercher..."
//           />

//           {suggestions.length > 0 && (
//             <div className="suggestions">
//               {suggestions.map((s) => (
//                 <div
//                   key={s.id}
//                   className="suggestion-item"
//                   onClick={() => selectSuggestion(s)}
//                 >
//                   {s.nom}
//                 </div>
//               ))}
//             </div>
//           )}
         
//         </div>
//  <div className="header-actions">
//   <button
//     onClick={() => setOpenAddModal(true)}
//     className="add-btn"
//   >
//     + Ajouter médicament
//   </button>
// </div>
//         <div className="filters">
//           <button onClick={() => setSelectedFilter("ALL")}>Tous</button>

//           <button onClick={() => setSelectedFilter("LOW_STOCK")}>
//             Stock faible
//           </button>

//           <button
//             onClick={() =>
//               setPriceOrder((prev) =>
//                 prev === "ASC" ? "DESC" : prev === "DESC" ? "NONE" : "ASC"
//               )
//             }
//           >
//             Prix {priceOrder === "ASC" ? "↑" : priceOrder === "DESC" ? "↓" : ""}
//           </button>
//         </div>
        
//       </div>

//       <div className="med-grid">
//         {filtered.map((m) => (
//           <div key={m.id} className="med-card">

//             <div className="med-img">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
//                 alt="medicament"
//               />
//             </div>

//             <div className="med-info">

//               <div className="med-top">
//                 <h3 className="med-title">{m.nom}</h3>
//                 <p className="med-desc">{m.description}</p>
//               </div>

//               <div className="med-bottom">
//                 <div className="med-meta">
//                   <span>{m.pu} Ar</span>
//                   <span className={m.qStock < 10 ? "danger" : ""}>
//                     Stock: {m.qStock}
//                   </span>
//                 </div>

//                 <div className="actions">
//                   <button onClick={() => { setSelectedMed(m); setOpenModal(true); }}>
//                     <Edit size={16} />
//                   </button>

//                   <button onClick={() => handleDelete(Number(m.id))}>
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {openModal && selectedMed && (
//         <div className="modal">
//           <div className="modal-content">

//             <h2>Modifier médicament</h2>

//             <input
//             style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}
//               value={selectedMed.nom}
//               onChange={(e) =>
//                 setSelectedMed({ ...selectedMed, nom: e.target.value })
//               }
//             />

//             <textarea
//             style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}

//               value={selectedMed.description}
//               onChange={(e) =>
//                 setSelectedMed({ ...selectedMed, description: e.target.value })
//               }
//             />

//             <input
//             style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}

//               type="number"
//               value={selectedMed.pu}
//               onChange={(e) =>
//                 setSelectedMed({ ...selectedMed, pu: Number(e.target.value) })
//               }
//             />

//             <input
//                 style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}
//               type="number"
//               value={selectedMed.qStock}
//               onChange={(e) =>
//                 setSelectedMed({ ...selectedMed, qStock: Number(e.target.value) })
//               }
//             />

//             <button
//               onClick={async () => {
//                 await medicamentService.update(Number(selectedMed.id), selectedMed);
//                 setOpenModal(false);
//                 load();
//               }}
//             >
//               Sauvegarder
//             </button>

//             <button onClick={() => setOpenModal(false)}>Fermer</button>

//           </div>
//         </div>
//       )}

//       {openAddModal && (
//         <div className="modal">
//             <div className="modal-content">

//             <h2>Ajouter médicament</h2>

//             <span>NOM </span>
//             <input
//                 style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}
//                 placeholder="Nom"
//                 value={newMed.nom}
//                 onChange={(e) =>
//                 setNewMed({ ...newMed, nom: e.target.value })
//                 }
//             />
//             <span>DESCRIPTION</span>
//             <textarea
//                 style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}
//                 placeholder="Description"
//                 value={newMed.description}
//                 onChange={(e) =>
//                 setNewMed({ ...newMed, description: e.target.value })
//                 }
//             />
//             <span>PRIX UNITAIRE</span>
//             <input
//                 style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}
//                 type="number"
//                 placeholder="Prix"
//                 value={newMed.pu}
//                 onChange={(e) =>
//                 setNewMed({ ...newMed, pu: Number(e.target.value) })
//                 }
//             />
            
//             <span>STOCK</span>
//             <input
//                 style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%", marginBottom: "10px"}}
//                 type="number"
//                 min={1}
//                 placeholder="Stock"
//                 value={newMed.qStock}
//                 onChange={(e) =>
//                 setNewMed({ ...newMed, qStock: Number(e.target.value) })
//                 }
//             />

//             <button
//                 onClick={async () => {
//                 // await medicamentService.save(newMed);
//                 console.log("Nouveau médicament à ajouter:", newMed); // Debug
//                 await medicamentService.save({
//                     ...newMed,
//                     pu: Number(newMed.pu),
//                     qStock: Number(newMed.qStock),
//                 });
//                 setOpenAddModal(false);
//                 setNewMed(emptyMed);
//                 load();
//                 }}
//             >
//                 Ajouter
//             </button>

//             <button onClick={() => setOpenAddModal(false)}>
//                 Annuler
//             </button>

//             </div>
//         </div>
//        )}
//     </div>
//   );
// }
import { useEffect, useState, useMemo } from "react";
import { medicamentService } from "@/lib/api-medicament";
import { Medicament } from "@/types/medicament";
import { Edit, Trash2 } from "lucide-react";

import "./medicament.css";

export default function ListeMedicaments() {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [priceOrder, setPriceOrder] = useState("NONE");

  const [selectedMed, setSelectedMed] = useState<Medicament | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);

  const emptyMed: Medicament = {
    id: null,
    nom: "",
    description: "",
    pu: null,
    qStock: null,
  };

  const [newMed, setNewMed] = useState<Medicament>(emptyMed);

//   const load = async () => {
//     const res = await medicamentService.getAll();
//     const data = res.content ?? res;
//     setMedicaments(Array.isArray(data) ? data : []);
//   };
const load = async () => {
  try {
    const res = await medicamentService.getAll();

    const data = res?.content ?? res;

    setMedicaments(Array.isArray(data) ? data : []);

  } catch (e) {
    console.error("Load error:", e);
  }
};

  useEffect(() => {
    load();
  }, []);

  // 🔥 SEARCH GOOGLE STYLE (local filter)
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    return medicaments
      .filter((m) =>
        m.nom.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5); // max 5 suggestions
  }, [search, medicaments]);

  // 🔥 FILTER + SEARCH + SORT COMBINED
  const filtered = useMemo(() => {
    let data = [...medicaments];

    // filter stock
    if (selectedFilter === "LOW_STOCK") {
      data = data.filter((m) => m.qStock < 10);
    }

    // search
    if (search.trim()) {
      data = data.filter((m) =>
        m.nom.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort price
    if (priceOrder === "ASC") {
      data.sort((a, b) => a.pu - b.pu);
    } else if (priceOrder === "DESC") {
      data.sort((a, b) => b.pu - a.pu);
    }

    return data;
  }, [medicaments, selectedFilter, priceOrder, search]);

  const handleDelete = async (id: number) => {
  if (!window.confirm("Supprimer ?")) return;

  await medicamentService.delete(id.toString());

  console.log("DELETE OK, reload..."); // 🔍 test

  await load(); // ⚠️ important le await
};

  const selectSuggestion = (item: Medicament) => {
    setSearch(item.nom);
  };

  return (
    <div className="med-container">

      {/* HEADER */}
      <div className="med-header">
        <h2>Médicaments</h2>

        {/* SEARCH GOOGLE STYLE */}
        <div className="search-box" style={{ position: "relative" }}>
          <input
            style={{background: "rgba(255, 255, 255, 0.212)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%"}}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un médicament..."
          />

          {/* DROPDOWN SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="suggestion-item"
                  style={{background: "rgba(5, 61, 54, 0.72)", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%"}}
                  onClick={() => selectSuggestion(s)}
                >
                  {s.nom}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          <button onClick={() => setOpenAddModal(true)} className="add-btn">
            + Ajouter médicament
          </button>
        </div>

        {/* FILTERS */}
        <div className="filters">
          <button onClick={() =>
          {

              setSelectedFilter("ALL");
              setSearch(""); // 🔥 clear input
          } 

          }>Tous</button>

          <button onClick={() => {
            setSelectedFilter("LOW_STOCK")
             setSearch(""); // 🔥 clear input
         }}>
            Stock faible
          </button>

          <button
            onClick={() =>{
              setPriceOrder((prev) =>
                prev === "ASC" ? "DESC" : prev === "DESC" ? "NONE" : "ASC"
              )
              setSearch(""); // 🔥 clear input
         }
            }
          >
            Prix {priceOrder === "ASC" ? "↑" : priceOrder === "DESC" ? "↓" : ""}
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="med-grid">
        {filtered.map((m) => (
          <div key={m.id} className="med-card">

            <div className="med-img">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
                alt="medicament"
              />
            </div>

            <div className="med-info">

              <div className="med-top">
                <h3 className="med-title">{m.nom}</h3>
                <p className="med-desc">{m.description}</p>
              </div>

              <div className="med-bottom">
                <div className="med-meta">
                  <span>{m.pu} Ar</span>
                  <span className={m.qStock < 10 ? "danger" : ""}>
                    Stock: {m.qStock}
                  </span>
                </div>

                <div className="actions">
                  <button
                    onClick={() => {
                      setSelectedMed(m);
                      setOpenModal(true);
                    }}
                  >
                    <Edit size={16} />
                  </button>

                  <button onClick={() => handleDelete(Number(m.id))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT */}
      {openModal && selectedMed && (
        <div className="modal">
          <div className="modal-content">

            <h2>Modifier médicament</h2>

            <input
              value={selectedMed.nom}
              onChange={(e) =>
                setSelectedMed({ ...selectedMed, nom: e.target.value })
              }
            />

            <textarea
              value={selectedMed.description}
              onChange={(e) =>
                setSelectedMed({ ...selectedMed, description: e.target.value })
              }
            />

            <input
              type="number"
              value={selectedMed.pu}
              onChange={(e) =>
                setSelectedMed({ ...selectedMed, pu: Number(e.target.value) })
              }
            />

            <input
              type="number"
              value={selectedMed.qStock}
              onChange={(e) =>
                setSelectedMed({ ...selectedMed, qStock: Number(e.target.value) })
              }
            />

            <button
              onClick={async () => {
                await medicamentService.update(
                  Number(selectedMed.id),
                  selectedMed
                );
                setOpenModal(false);
                load();
              }}
            >
              Sauvegarder
            </button>

            <button onClick={() => setOpenModal(false)}>Fermer</button>

          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {openAddModal && (
        <div className="modal">
          <div className="modal-content">

            <h2>Ajouter médicament</h2>

            <input
              placeholder="Nom"
              value={newMed.nom}
              onChange={(e) =>
                setNewMed({ ...newMed, nom: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={newMed.description}
              onChange={(e) =>
                setNewMed({ ...newMed, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Prix"
              value={newMed.pu}
              onChange={(e) =>
                setNewMed({ ...newMed, pu: Number(e.target.value) })
              }
            />

            <input
              type="number"
              placeholder="Stock"
              value={newMed.qStock}
              onChange={(e) =>
                setNewMed({ ...newMed, qStock: Number(e.target.value) })
              }
            />

            <button
              onClick={async () => {
                await medicamentService.save({
                  ...newMed,
                  pu: Number(newMed.pu),
                  qStock: Number(newMed.qStock),
                });

                setOpenAddModal(false);
                setNewMed(emptyMed);
                load();
              }}
            >
              Ajouter
            </button>

            <button onClick={() => setOpenAddModal(false)}>
              Annuler
            </button>

          </div>
        </div>
      )}

    </div>
  );
}