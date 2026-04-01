import { useState, useEffect } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { appointmentService } from "@/lib/api-appointments";
import { patientService } from "@/lib/api-patients";
import { serviceService } from "@/lib/api-services";
import { clinicService } from "@/lib/api-clinics";
import { Appointment } from "@/types/appointment";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    serviceId: "",
    clinicId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data.sort((a, b) => 
        new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      ));
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAppointment = async (e: any) => {
    e.preventDefault();
    if (!formData.patientId || !formData.serviceId || !formData.clinicId || 
        !formData.appointmentDate || !formData.appointmentTime) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    try {
      await appointmentService.create(formData);
      toast.success("Rendez-vous créé avec succès !");
      setIsModalOpen(false);
      setFormData({
        patientId: "",
        serviceId: "",
        clinicId: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });
      loadAppointments();
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      await appointmentService.update({ id, status });
      toast.success("Statut mis à jour !");
      loadAppointments();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr ?")) return;
    try {
      await appointmentService.delete(id);
      toast.success("Rendez-vous supprimé !");
      loadAppointments();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <PageLayout
      title="Gestion des Rendez-vous"
      subtitle="Gérez tous les rendez-vous de vos cliniques"
      action={
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="login-btn !w-auto px-6 flex items-center gap-2">
              <Plus size={18} /> Nouveau Rendez-vous
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="text-primary" /> Créer un Rendez-vous
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Patient</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="ID ou nom du patient"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Service</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="ID du service"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Clinique</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="ID de la clinique"
                  value={formData.clinicId}
                  onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-primary-foreground/60 ml-1">Date</label>
                  <input
                    type="date"
                    className="login-input"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-primary-foreground/60 ml-1">Heure</label>
                  <input
                    type="time"
                    className="login-input"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Notes</label>
                <textarea
                  className="login-input"
                  placeholder="Notes additionnelles..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
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
                  Créer
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
        placeholder="Rechercher un rendez-vous..."
      />

      {isLoading ? (
        <div className="glass-card p-10 text-center text-white/40">Chargement...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="glass-card p-10 text-center text-white/40">
          Aucun rendez-vous trouvé.
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-white/10 uppercase sticky top-0">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Service</th>
                <th className="p-4">Clinique</th>
                <th className="p-4">Date & Heure</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{apt.patientName}</td>
                  <td className="p-4">{apt.serviceName}</td>
                  <td className="p-4 text-white/70">{apt.clinicName}</td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm">{formatDate(apt.appointmentDate)}</div>
                    <div className="text-xs text-white/60">{apt.appointmentTime}</div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {apt.status !== "completed" && apt.status !== "cancelled" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                            className="p-2 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
                            title="Confirmer"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, "cancelled")}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Annuler"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default AppointmentsPage;
