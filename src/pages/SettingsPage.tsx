import { useState } from "react";
import { Save, Mail, Bell, Shield, User } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    clinicName: "Clinique Central",
    email: "contact@central.com",
    phone: "+261 20 XX XXX XX",
    address: "123 Rue Principale",
    emailNotifications: true,
    appointmentReminders: true,
    twoFactorAuth: false,
    darkMode: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuler une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Paramètres sauvegardés avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout title="Paramètres" subtitle="Gérez les paramètres de votre application">
      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
            <User className="text-primary" size={24} />
            Informations Générales
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-primary-foreground/60 ml-1">Nom de la Clinique</label>
              <input
                type="text"
                className="login-input"
                value={settings.clinicName}
                onChange={(e) => handleChange("clinicName", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Email</label>
                <input
                  type="email"
                  className="login-input"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-primary-foreground/60 ml-1">Téléphone</label>
                <input
                  type="tel"
                  className="login-input"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-primary-foreground/60 ml-1">Adresse</label>
              <input
                type="text"
                className="login-input"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
            <Bell className="text-primary" size={24} />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground font-medium">Notifications Email</p>
                <p className="text-xs text-white/60">Recevoir les notifications par email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground font-medium">Rappels de Rendez-vous</p>
                <p className="text-xs text-white/60">Rappels avant les rendez-vous</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appointmentReminders}
                  onChange={(e) => handleChange("appointmentReminders", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
            <Shield className="text-primary" size={24} />
            Sécurité
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground font-medium">
                  Authentification à Deux Facteurs
                </p>
                <p className="text-xs text-white/60">
                  Sécurisez votre compte avec 2FA
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div>
              <button className="w-full py-3 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors font-medium">
                Changer le mot de passe
              </button>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
            <Mail className="text-primary" size={24} />
            Apparence
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground font-medium">Mode Sombre</p>
                <p className="text-xs text-white/60">Activer le thème sombre</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange("darkMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 login-btn flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
