import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { Service } from "@/types/service";
import { Clinic } from "@/types/clinic";
import { staticServices, staticClinics } from "@/lib/staticData";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>(staticServices);
  const [clinics] = useState<Clinic[]>(staticClinics);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clinicId: "",
    price: "",
    duration: "",
  });

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.clinicName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddService = (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.clinicId || !formData.price || !formData.duration) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const selectedClinic = clinics.find((c) => c.id === formData.clinicId);
    const newService: Service = {
      id: String(services.length + 1),
      name: formData.name,
      description: formData.description,
      clinicName: selectedClinic?.name || "",
      clinicId: formData.clinicId,
      price: Number(formData.price),
      duration: Number(formData.duration),
      isActive: true,
      createdAt: "",
      updatedAt: ""
    };

    setServices([...services, newService]);
    toast.success("Service ajouté avec succès !");
    setIsModalOpen(false);
    setFormData({ name: "", description: "", clinicId: "", price: "", duration: "" });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
    setServices(services.filter((s) => s.id !== id));
    toast.success("Service supprimé !");
  };

  return (
    <PageLayout
      title="Gestion des Services"
      subtitle="Gérez les services proposés par vos cliniques"
      action={
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="login-btn !w-auto px-6 flex items-center gap-2">
              <Plus size={18} /> Nouveau Service
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="text-primary" /> Ajouter un Service
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Nom du Service</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Consultation..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Description</label>
                <textarea
                  className="login-input"
                  placeholder="Description du service..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Clinique</label>
                <select
                  className="login-input appearance-none bg-black/20"
                  value={formData.clinicId}
                  onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                >
                  <option value="">Sélectionner une clinique</option>
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-800">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-primary-foreground/60 ml-1">Prix (Ar)</label>
                  <input
                    type="number"
                    className="login-input"
                    placeholder="50000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-primary-foreground/60 ml-1">Durée (min)</label>
                  <input
                    type="number"
                    className="login-input"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="google-btn !py-2 flex-1"
                >
                  Annuler
                </button>
                <button type="submit" className="login-btn !py-2 flex-1">
                  Enregistrer
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un service..."
      />

      {filteredServices.length === 0 ? (
        <div className="glass-card p-10 text-center text-white/40">
          Aucun service trouvé.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10 text-sm uppercase">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Clinique</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Durée</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-primary-foreground">{service.name}</p>
                      <p className="text-xs text-white/60 mt-1">{service.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-white/70">{service.clinicName}</td>
                  <td className="p-4 text-sm font-medium">{service.price.toLocaleString()} Ar</td>
                  <td className="p-4 text-sm">{service.duration} min</td>
                  <td className="p-4">
                    <StatusBadge
                      status={service.isActive ? "active" : "inactive"}
                    />
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-primary transition-colors">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
};

export default ServicesPage;
