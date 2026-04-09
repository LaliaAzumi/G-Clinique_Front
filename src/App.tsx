import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CliniqueAppLayout from "./clinique/CliniqueAppLayout";
import Dashboard from "./clinique/pages/Dashboard";
import ListePatients from "./clinique/pages/ListePatients";
import ListeMedecins from "./clinique/pages/ListeMedecins";
import ListeSecretaires from "./clinique/pages/ListeSecretaires";
import PlaceholderPage from "./clinique/pages/PlaceholderPage";
import FullProject from "./pages/FullProject";
import ChambresPage from "./pages/ChambresPage";
import RevenueDashboard from "./clinique/pages/RevenueDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 1. Page d'accueil */}
          <Route path="/" element={<Index />} />

          {/* 2. Redirections automatiques vers le layout de la clinique */}
          
          <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
          <Route path="/medecins" element={<Navigate to="/app/medecins" replace />} />
          <Route path="/secretaires" element={<Navigate to="/app/secretaires" replace />} />
          <Route path="/chambres" element={<ChambresPage />} />

          {/* 3. Groupe "App" avec Layout (Tout ce qui est dedans s'affiche dans le Layout) */}
          <Route path="/app" element={<CliniqueAppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<RevenueDashboard />} />
            <Route path="patients" element={<ListePatients />} />
            <Route path="medecins" element={<ListeMedecins />} />
            <Route path="secretaires" element={<ListeSecretaires />} />
            <Route path="rendez-vous" element={<PlaceholderPage title="Rendez-vous" />} />
            <Route path="consultations" element={<PlaceholderPage title="Consultations" />} />
            <Route path="ordonnances" element={<PlaceholderPage title="Ordonnances" />} />
            <Route path="paiements" element={<PlaceholderPage title="Paiements" />} />
            <Route path="fullProject" element={<FullProject />} />
            
            {/* Si on tape une mauvaise adresse dans /app/, on revient au dashboard */}
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Route>

          {/* 4. Page 404 (TOUJOURS EN DERNIER) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;