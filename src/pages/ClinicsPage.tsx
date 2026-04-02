import { useState } from "react";
import { Plus, MapPin, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import SearchBar from "@/components/SearchBar";
import AddClinicForm from "@/components/AddClinicForm";
import { Clinic } from "@/types/clinic";
import { staticClinics } from "@/lib/staticData";

const ClinicsPage = () => {
  const [clinics, setClinics] = useState<Clinic[]>(staticClinics);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClinics = clinics.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClinic = (data: any) => {
    const newClinic: Clinic = {
      id: String(clinics.length + 1),
      ...data,
      servicesCount: 0,
    };
    setClinics([...clinics, newClinic]);
    toast.success("Clinique ajoutée avec succès !");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette clinique ?")) return;
    setClinics(clinics.filter((c) => c.id !== id));
    toast.success("Clinique supprimée avec succès !");
  };

  return (
    <PageLayout
      title="Gestion des Cliniques"
      subtitle="Gérez vos cliniques et leurs informations"
      action={
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="login-btn !w-auto px-6 flex items-center gap-2">
              <Plus size={18} /> Nouvelle Clinique
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="text-primary" /> Ajouter une Clinique
              </DialogTitle>
            </DialogHeader>
            <AddClinicForm
              onSubmit={handleAddClinic}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      }
    >
      {/* Search Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher une clinique..."
      />

      {/* Clinics Grid or Table */}
      {filteredClinics.length === 0 ? (
        <div className="glass-card p-10 text-center text-white/40">
          Aucune clinique trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className="glass-card p-6 hover:bg-white/15 transition-all">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-primary-foreground">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/70 mt-1">
                      <MapPin size={14} />
                      {clinic.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {clinic.servicesCount}
                    </p>
                    <p className="text-xs text-white/60">services</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-white/70 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    {clinic.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    {clinic.email}
                  </div>
                  <div className="text-xs">{clinic.address}</div>
                </div>

                {/* Description */}
                {clinic.description && (
                  <p className="text-xs text-white/60 italic">{clinic.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-primary transition-colors text-sm font-medium">
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(clinic.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default ClinicsPage;
