import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { GMCSidebar } from "@/components/GMCSidebar";
import { GMCHeader } from "@/components/GMCHeader";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Payments from "./pages/Payments";
import Maintenance from "./pages/Maintenance";
import Contracts from "./pages/Contracts";
import Clients from "./pages/Clients";
import Finance from "./pages/Finance";
import SettingsPage from "./pages/Settings";
import { AutoInsurance } from "./pages/AutoInsurance";
import InsuranceDashboard from "./pages/InsuranceDashboard";
import InsuranceContracts from "./pages/InsuranceContracts";
import InsurancePayments from "./pages/InsurancePayments";
import Accounting from "./pages/Accounting";
import AdvancedAccounting from "./pages/AdvancedAccounting";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { FlightReservations } from "./pages/FlightReservations";
import { HotelReservations } from "./pages/HotelReservations";
import { CarRentals } from "./pages/CarRentals";
import { TravelPayments } from "./pages/TravelPayments";
import { UnifiedPayments } from "./pages/UnifiedPayments";
import TravelDashboard from "./pages/TravelDashboard";
import ImmobilierDashboard from "./pages/ImmobilierDashboard";
import ClientTrackerPage from "./pages/ClientTracker";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <GMCSidebar />
          <SidebarInset>
            <GMCHeader onLogout={signOut} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/immobilier-dashboard" element={<ImmobilierDashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/payments" element={<UnifiedPayments />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/client-tracker" element={<ClientTrackerPage />} />
              <Route path="/insurance-dashboard" element={<InsuranceDashboard />} />
              <Route path="/insurance-contracts" element={<InsuranceContracts />} />
              <Route path="/insurance-payments" element={<UnifiedPayments />} />
              <Route path="/auto-insurance" element={<AutoInsurance />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/advanced-accounting" element={<AdvancedAccounting />} />
              <Route path="/travel-dashboard" element={<TravelDashboard />} />
              <Route path="/flight-reservations" element={<FlightReservations />} />
              <Route path="/hotel-reservations" element={<HotelReservations />} />
              <Route path="/car-rentals" element={<CarRentals />} />
              <Route path="/travel-payments" element={<UnifiedPayments />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
