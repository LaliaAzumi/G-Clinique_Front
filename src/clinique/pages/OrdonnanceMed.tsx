// import React, { useState, useEffect } from 'react';
// import { Search, CreditCard, Eye, CheckCircle, XCircle, FileText, X } from 'lucide-react';
// import { SPRING_URL, ordonnanceService } from '@/lib/api-ordonnance';

// type Ordonnance = {
//   id: number;
//   patientName?: string;
//   clientName?: string;
//   date?: string;
//   pdfUrl?: string;
//   paye?: boolean;
//   consultation?: {
//     date?: string;
//   };
// };

// const getPatientName = (ord: Ordonnance) =>
//   ord.patientName || ord.clientName || "Patient";

// const getOrdonnanceDate = (ord: Ordonnance) =>
//   ord.date || ord.consultation?.date;

// const getOrdonnancePdfUrl = (ord: Ordonnance) =>
//   ord.pdfUrl
//     ? ord.pdfUrl.startsWith("http")
//       ? ord.pdfUrl
//       : `${SPRING_URL}${ord.pdfUrl}`
//     : ordonnanceService.getPdfUrl(ord.id);

// const OrdonnanceMed = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrdonnance, setSelectedOrdonnance] = useState<Ordonnance | null>(null);
//   const [error, setError] = useState("");
//   const[userRole, setUserRole] = useState();

//   const handleSearch = async () => {
//     if (!searchTerm.trim()) return;
//     setLoading(true);
//     setError("");
//     setSelectedOrdonnance(null);
//     try {
//       const data = await ordonnanceService.searchByPatient(searchTerm);
//       setOrdonnances(data);
//       console.log(data);
//     } catch (error) {
//       console.error("Erreur recherche:", error);
//       setOrdonnances([]);
//       setError("Impossible de récupérer les ordonnances du patient.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsPaid = async (id: number) => {
//     try {
//       await ordonnanceService.markAsPaid(id);
//       setOrdonnances(ordonnances.map(ord => 
//         ord.id === id ? { ...ord, paye: true } : ord
//       ));
//       setSelectedOrdonnance((ord) =>
//         ord?.id === id ? { ...ord, paye: true } : ord
//       );
//     } catch (error) {
//       alert("Erreur lors du paiement");
//     }
//   };

//  // --- ÉTAPE 2 : Récupérer le rôle au chargement ---
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       const parsedUser = JSON.parse(savedUser);
//       // On stocke le rôle (ex: "ADMIN")
//       setUserRole(parsedUser.role); 
//     }
//   }, []);



//   return (
//     <div className="page-container p-6 min-h-screen">
//       <div className="page-header mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <FileText className="text-blue-600" /> Gestion des Ordonnances
//         </h1>
//       </div>

//       {/* Barre de Recherche */}
//       <div className="table-toolbar mb-6 flex gap-3  p-4 rounded-xl shadow-sm">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
//           <input 
//             type="text"
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
//             placeholder="Rechercher par nom de patient..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           />
//         </div>
//         <button 
//           onClick={handleSearch}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//         >
//           Rechercher
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {loading ? (
//           <p className="col-span-full text-center py-10 text-gray-500">Chargement...</p>
//         ) : ordonnances.length > 0 ? (
//           ordonnances.map((ord) => (
//             <div key={ord.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900">{getPatientName(ord)} {ord.id}</h3>
//                   <p className="text-sm text-gray-500">
//                     {getOrdonnanceDate(ord)
//                       ? `Le ${new Date(getOrdonnanceDate(ord) as string).toLocaleDateString("fr-FR")}`
//                       : "Date non renseignée"}
//                   </p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
//                   ord.paye ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                 }`}>
//                   {ord.paye ? <CheckCircle size={14}/> : <XCircle size={14}/>}
//                   {ord.paye ? "Payé" : "Non Payé"}
//                 </span>
//               </div>

//               <div className="flex gap-2 mt-6">
//                 {/* <button 
//                   onClick={() => setSelectedOrdonnance(ord)}
//                   className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
//                 >
//                   <Eye size={16} /> PDF 
//                 </button>
//                  */}
//                 <button 
//                 onClick={() => window.open(getOrdonnancePdfUrl(ord), "_blank")}
//                 className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
//                 >
//                 <Eye size={16} /> PDF
//                 </button>

//                 {!ord.paye && userRole === "SECRETAIRE" && (
//                   <button 
//                     onClick={() => handleMarkAsPaid(ord.id)}
//                     className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
//                   >
//                     <CreditCard size={16} /> Encaisser
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed">
//             <p className="text-gray-400 font-medium">Aucune ordonnance trouvée. Tapez un nom pour commencer.</p>
//           </div>
//         )}
//       </div>

//       {selectedOrdonnance && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
//           <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b px-4 py-3">
//               <div>
//                 <h2 className="font-semibold text-gray-900">
//                   Ordonnance de {getPatientName(selectedOrdonnance)}
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   {getOrdonnanceDate(selectedOrdonnance)
//                     ? new Date(getOrdonnanceDate(selectedOrdonnance) as string).toLocaleDateString("fr-FR")
//                     : "Date non renseignée"}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setSelectedOrdonnance(null)}
//                 className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//                 title="Fermer"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <iframe
//               title={`Ordonnance ${selectedOrdonnance.id}`}
//               src={getOrdonnancePdfUrl(selectedOrdonnance)}
//               className="h-full w-full bg-gray-100"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdonnanceMed;
import React, { useState, useEffect, useMemo } from 'react';
import { Search, CreditCard, Eye, CheckCircle, XCircle, FileText, X } from 'lucide-react';
import { SPRING_URL, ordonnanceService } from '@/lib/api-ordonnance';

type Ordonnance = {
  id: number;
  patientName?: string;
  clientName?: string;
  date?: string;
  pdfUrl?: string;
  paye?: boolean;
  consultation?: {
    date?: string;
  };
};

const getPatientName = (ord: Ordonnance) =>
  ord.patientName || ord.clientName || "Patient";

const getOrdonnanceDate = (ord: Ordonnance) =>
  ord.date || ord.consultation?.date;

const getOrdonnancePdfUrl = (ord: Ordonnance) =>
  ord.pdfUrl
    ? ord.pdfUrl.startsWith("http")
      ? ord.pdfUrl
      : `${SPRING_URL}${ord.pdfUrl}`
    : ordonnanceService.getPdfUrl(ord.id);

const OrdonnanceMed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState<Ordonnance | null>(null);
  const [error, setError] = useState("");

  const [userRole, setUserRole] = useState<string | undefined>();

  // FILTRES
  const [filterDate, setFilterDate] = useState("");
  const [filterId, setFilterId] = useState("");
  const [filterPaid, setFilterPaid] = useState<"ALL" | "PAID" | "UNPAID">("ALL");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setSelectedOrdonnance(null);

    try {
      const data = await ordonnanceService.searchByPatient(searchTerm);
      setOrdonnances(data);
    } catch (error) {
      console.error("Erreur recherche:", error);
      setOrdonnances([]);
      setError("Impossible de récupérer les ordonnances du patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await ordonnanceService.markAsPaid(id);

      setOrdonnances(prev =>
        prev.map(ord =>
          ord.id === id ? { ...ord, paye: true } : ord
        )
      );

      setSelectedOrdonnance(prev =>
        prev?.id === id ? { ...prev, paye: true } : prev
      );
    } catch (error) {
      alert("Erreur lors du paiement");
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  // FILTRAGE LOCAL
  const filteredOrdonnances = useMemo(() => {
    return ordonnances.filter((ord) => {
      const matchId = filterId ? ord.id.toString().includes(filterId) : true;

      const ordDate = getOrdonnanceDate(ord)?.split("T")[0];
      const matchDate = filterDate ? ordDate === filterDate : true;

      const matchPaid =
        filterPaid === "ALL"
          ? true
          : filterPaid === "PAID"
          ? ord.paye
          : !ord.paye;

      return matchId && matchDate && matchPaid;
    });
  }, [ordonnances, filterId, filterDate, filterPaid]);

  return (
    <div className="page-container">
      <div className="page-header mb-6">
          <div>
          <h1 className="page-title">Historique des Ordonnances</h1>
          <p className="breadcrumb">Ordonnances › Historiques </p>
        </div>
      </div>

      {/* RECHERCHE */}
      <div className="table-toolbar mb-3 flex gap-3 p-4 rounded-xl shadow-sm">
        
        <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
            type="text"
            // className="w-full pl-10 pr-4 py-2 border rounded-lg"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none text-gray-900"
            placeholder="Rechercher par nom de patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              style={{ backgroundColor: '#1fb468', borderColor: '#1fb468', padding:"15px 15px" }} 
        >
          Rechercher
        </button>
      </div>

      {/* FILTRES */}
      <div className="mb-6 flex flex-wrap gap-3 p-4 rounded-xl shadow-sm">

        {/* ID */}
        <input
          type="text"
          placeholder="Filtrer par ID"
          className="border px-3 py-2 rounded-lg"
          style={{background:"#f8f8f81e", color:"#000000f"}}
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />

        {/* DATE */}
        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          style={{background:"#f8f8f81e", color:"#c0c0c0"}}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* PAYÉ */}
        <select
          className="border px-3 py-2 rounded-lg"
          style={{background:"#f8f8f81e", color:"#c0c0c0"}}
          value={filterPaid}
          onChange={(e) => setFilterPaid(e.target.value as any)}
        >
          <option  style={{background:"#f8f8f81e", color:"#424242"}} value="ALL">Tous</option>
          <option style={{background:"#f8f8f81e", color:"#424242"}} value="PAID">Payés</option>
          <option  style={{background:"#f8f8f81e", color:"#424242"}} value="UNPAID">Non payés</option>
        </select>

        {/* RESET */}
        <button
          onClick={() => {
            setFilterId("");
            setFilterDate("");
            setFilterPaid("ALL");
          }}
          className="px-4 py-2 bg-gray-100 rounded-lg"
            style={{background:"#818181", color:"#ffffff"}}
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LISTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-full text-center py-10 text-gray-500">Chargement...</p>
        ) : filteredOrdonnances.length > 0 ? (
          filteredOrdonnances.map((ord) => (
            <div key={ord.id} className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md" style={{background:"#0706063b", borderColor:"#c0c0c0"}}>

              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {getPatientName(ord)} 
                    <br/>
                    #{ord.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getOrdonnanceDate(ord)
                      ? new Date(getOrdonnanceDate(ord)!).toLocaleDateString("fr-FR")
                      : "Date inconnue"}
                      
                  </p>
                </div>

                {/* <span 
                style={{padding:"2px 2px 2px 2px"}}
                className={`px-3 py-1 text-xs flex items-center gap-1 ${
                  ord.paye ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {ord.paye ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {ord.paye ? "Payé" : "Non payé"}
                </span> */}
                <span
                className={`inline-flex items-center gap-1 px-2 py-0 text-[11px] leading-none font-medium rounded-md ${
                    ord.paye
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                >
                {ord.paye ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <span className="leading-none">{ord.paye ? "Payé" : "Non payé"}</span>
                </span>
              </div>
                <br/>
                <br/>
              {/* <div className="flex gap-2 mt-6">

                <button
                  onClick={() => window.open(getOrdonnancePdfUrl(ord), "_blank")}
                  className="flex-1 bg-gray-100 py-2 rounded-lg"
                  style={{background:"#f8f8f81e", color:"#c0c0c0"}}
                >
                  <Eye size={16} /> PDF
                </button>

                {!ord.paye && userRole === "SECRETAIRE" && (
                  <button
                    onClick={() => handleMarkAsPaid(ord.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                  >
                    <CreditCard size={16} /> Encaisser
                  </button>
                )}
              </div> */}
              <div className="flex gap-2 mt-6">
                

                <button
                    onClick={() => window.open(getOrdonnancePdfUrl(ord), "_blank")}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                    style={{background:"#8a8989",borderColor:"#4e4e4e", color:"#ffffff"}}
                >
                    <Eye size={16} />
                    <span className="text-sm font-medium">PDF</span>
                </button>

                {!ord.paye && userRole === "SECRETAIRE" && (
                    <button
                    onClick={() => handleMarkAsPaid(ord.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                    <CreditCard size={16} />
                    <span className="text-sm font-medium">Encaisser</span>
                    </button>
                )}

                </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 py-10">
            Aucune ordonnance
          </p>
        )}
      </div>

      {/* MODAL PDF */}
      {selectedOrdonnance && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-lg overflow-hidden">
            <div className="flex justify-between p-3 border-b">
              <div>
                <h2 className="font-semibold">
                  {getPatientName(selectedOrdonnance)}
                </h2>
              </div>

              <button onClick={() => setSelectedOrdonnance(null)}>
                <X />
              </button>
            </div>

            <iframe
              src={getOrdonnancePdfUrl(selectedOrdonnance)}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdonnanceMed;