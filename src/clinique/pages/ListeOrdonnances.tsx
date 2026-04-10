import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/FullPageLoader";
import { FileText, Plus, Search, Stethoscope, Pill, Activity, ChevronDown, ChevronUp, X, Check, Printer } from "lucide-react";

interface Traitement {
  id: number;
  nom: string;
  description: string;
  type: string;
  prix: number;
  forme: string;
  dosage: string;
  categorie: {
    id: number;
    nom: string;
    code: string;
  };
}

interface OrdonnanceItem {
  traitementId: number;
  nom: string;
  type: string;
  posologie: string;
  duree: string;
  quantite: number;
  prix: number;
  instructions: string;
}

export default function ListeOrdonnances() {
  const { user } = useAuth();
  const [specialite, setSpecialite] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [traitementsParCategorie, setTraitementsParCategorie] = useState<Record<string, Traitement[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ordonnanceItems, setOrdonnanceItems] = useState<OrdonnanceItem[]>([]);
  const [showOrdonnanceModal, setShowOrdonnanceModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTraitements();
  }, []);

  const fetchTraitements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/ordonnances/traitements", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      if (data.success) {
        setSpecialite(data.data.specialiteMedecin);
        setCategories(data.data.categories);
        setTraitementsParCategorie(data.data.traitementsParCategorie);
        // Expand all categories by default
        setExpandedCategories(new Set(Object.keys(data.data.traitementsParCategorie)));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToOrdonnance = (traitement: Traitement) => {
    const exists = ordonnanceItems.find(item => item.traitementId === traitement.id);
    if (exists) {
      alert("Ce traitement est déjà dans l'ordonnance");
      return;
    }

    const newItem: OrdonnanceItem = {
      traitementId: traitement.id,
      nom: traitement.nom,
      type: traitement.type,
      posologie: traitement.type === "MEDICAMENT" ? "1 comprimé 3x/jour" : "1 fois",
      duree: traitement.type === "MEDICAMENT" ? "7 jours" : "-",
      quantite: traitement.type === "MEDICAMENT" ? 21 : 1,
      prix: traitement.prix,
      instructions: "",
    };

    setOrdonnanceItems([...ordonnanceItems, newItem]);
    setShowOrdonnanceModal(true);
  };

  const removeFromOrdonnance = (traitementId: number) => {
    setOrdonnanceItems(ordonnanceItems.filter(item => item.traitementId !== traitementId));
  };

  const updateItem = (traitementId: number, field: string, value: string | number) => {
    setOrdonnanceItems(ordonnanceItems.map(item => 
      item.traitementId === traitementId ? { ...item, [field]: value } : item
    ));
  };

  const saveOrdonnance = async () => {
    if (!selectedConsultation) {
      alert("Veuillez sélectionner une consultation");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/ordonnances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consultationId: selectedConsultation,
          traitements: ordonnanceItems.map(item => ({
            traitementId: item.traitementId,
            posologie: item.posologie,
            duree: item.duree,
            quantite: item.quantite,
            instructions: item.instructions,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Ordonnance créée avec succès !");
        setOrdonnanceItems([]);
        setShowOrdonnanceModal(false);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = Object.entries(traitementsParCategorie).filter(([categorie, traitements]) => {
    if (selectedCategory && categorie !== selectedCategory) return false;
    if (!searchTerm) return true;
    return traitements.some(t => 
      t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const total = ordonnanceItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  if (loading) {
    return <FullPageLoader message="Chargement des traitements..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <FileText size={28} color="#0d9488" />
          <h1>Ordonnances</h1>
        </div>
        <p className="text-slate-500 mt-1">
          Spécialité: <strong>{specialite}</strong> | {categories.length} catégories disponibles
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="filters-container">
        <div className="search-filter">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un traitement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          className="category-select"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.nom}>{cat.nom}</option>
          ))}
        </select>

        {ordonnanceItems.length > 0 && (
          <button
            className="btn-primary"
            onClick={() => setShowOrdonnanceModal(true)}
          >
            <FileText size={16} />
            Voir l&apos;ordonnance ({ordonnanceItems.length})
          </button>
        )}
      </div>

      <div className="traitements-container">
        {filteredCategories.map(([categorie, traitements]) => (
          <div key={categorie} className="categorie-card">
            <div 
              className="categorie-header"
              onClick={() => toggleCategory(categorie)}
            >
              <h3>
                {categorie === "Cardiologie" && <Activity size={18} />}
                {categorie === "Dermatologie" && <Stethoscope size={18} />}
                {categorie !== "Cardiologie" && categorie !== "Dermatologie" && <Pill size={18} />}
                {categorie}
              </h3>
              <span className="badge">{traitements.length} traitements</span>
              {expandedCategories.has(categorie) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedCategories.has(categorie) && (
              <div className="traitements-grid">
                {(traitements as Traitement[]).map(traitement => (
                  <div key={traitement.id} className="traitement-card">
                    <div className="traitement-header">
                      <span className={`type-badge ${traitement.type.toLowerCase()}`}>
                        {traitement.type === "MEDICAMENT" ? "💊 Médicament" : "🔬 Acte médical"}
                      </span>
                      <span className="prix">{traitement.prix.toLocaleString()} Ar</span>
                    </div>
                    <h4>{traitement.nom}</h4>
                    {traitement.dosage && <p className="dosage">{traitement.dosage}</p>}
                    {traitement.forme && <p className="forme">{traitement.forme}</p>}
                    <p className="description">{traitement.description}</p>
                    <button
                      className="btn-add"
                      onClick={() => addToOrdonnance(traitement)}
                    >
                      <Plus size={14} />
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Ordonnance */}
      {showOrdonnanceModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>
                <FileText size={20} />
                Créer l&apos;ordonnance
              </h2>
              <button className="btn-close" onClick={() => setShowOrdonnanceModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Consultation</label>
                <select
                  value={selectedConsultation || ""}
                  onChange={(e) => setSelectedConsultation(Number(e.target.value))}
                  className="form-select"
                >
                  <option value="">Sélectionner une consultation...</option>
                  <option value={1}>Consultation #1 - Patient Dupont</option>
                </select>
              </div>

              {ordonnanceItems.length === 0 ? (
                <p className="empty-message">Aucun traitement sélectionné</p>
              ) : (
                <div className="ordonnance-items">
                  {ordonnanceItems.map((item, index) => (
                    <div key={item.traitementId} className="ordonnance-item">
                      <div className="item-header">
                        <span className="item-number">{index + 1}</span>
                        <h4>{item.nom}</h4>
                        <button
                          className="btn-remove"
                          onClick={() => removeFromOrdonnance(item.traitementId)}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="item-fields">
                        <div className="field-row">
                          <div className="field">
                            <label>Posologie</label>
                            <input
                              type="text"
                              value={item.posologie}
                              onChange={(e) => updateItem(item.traitementId, "posologie", e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>Durée</label>
                            <input
                              type="text"
                              value={item.duree}
                              onChange={(e) => updateItem(item.traitementId, "duree", e.target.value)}
                            />
                          </div>
                          <div className="field small">
                            <label>Qté</label>
                            <input
                              type="number"
                              value={item.quantite}
                              onChange={(e) => updateItem(item.traitementId, "quantite", Number(e.target.value))}
                              min={1}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label>Instructions spéciales</label>
                          <textarea
                            value={item.instructions}
                            onChange={(e) => updateItem(item.traitementId, "instructions", e.target.value)}
                            placeholder="Instructions particulières..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ordonnanceItems.length > 0 && (
                <div className="ordonnance-total">
                  <strong>Total: {total.toLocaleString()} Ar</strong>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowOrdonnanceModal(false)}>
                Annuler
              </button>
              {ordonnanceItems.length > 0 && (
                <button className="btn-primary" onClick={saveOrdonnance}>
                  <Check size={16} />
                  Valider l&apos;ordonnance
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
