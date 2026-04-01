import { useState } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { Appointment } from "@/types/appointment";
import { staticAppointments } from "@/lib/staticData";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    serviceName: "",
    clinicName: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAppointment = (e: any) => {
    e.preventDefault();
    if (!formData.patientId || !formData.serviceName || !formData.clinicName || 
        !formData.appointmentDate || !formData.appointmentTime) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const newAppointment: Appointment = {
      id: String(appointments.length + 1),
      patientName: formData.patientId,
      serviceName: formData.serviceName,
      clinicName: formData.clinicName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      status: "pending",
      notes: formData.notes,
    };

    setAppointments([newAppointment, ...appointments]);
    toast.success("Rendez-vous créé avec succès !");
    setIsModalOpen(false);
    setFormData({
      patientId: "",
      serviceName: "",
      clinicName: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: status as any } : apt
      )
    );
    toast.success("Statut mis à jour !");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) return;
    setAppointments(appointments.filter((a) => a.id !== id));
    toast.success("Rendez-vous supprimé !");
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
                <label className="text-xs text-primary-foreground/60 ml-1">Nom du Patient</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Nom complet du patient"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Service</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Consultation, Dentologie..."
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Clinique</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Nom de la clinique"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
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

      {filteredAppointments.length === 0 ? (
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
