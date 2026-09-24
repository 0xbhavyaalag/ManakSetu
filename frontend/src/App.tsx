import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { KeypadSimulatorModal } from './components/KeypadSimulatorModal';
import { MissedCallModal } from './components/MissedCallModal';
import { RejectionPreventionModal } from './components/RejectionPreventionModal';
import { RescheduleModal } from './components/RescheduleModal';
import { DemoTourController } from './components/DemoTourController';

import { FarmerDashboard } from './pages/FarmerDashboard';
import { SmartBookingPage } from './pages/SmartBookingPage';
import { LiveQueuePage } from './pages/LiveQueuePage';
import { FamilyManagementPage } from './pages/FamilyManagementPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ProcurementStatusPage } from './pages/ProcurementStatusPage';
import { PaymentStatusPage } from './pages/PaymentStatusPage';
import { CentreOperatorPage } from './pages/CentreOperatorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { api } from './services/api';
import { UserRole, Booking, CentreRecommendation, Family, NotificationItem } from './types';
import { LanguageProvider } from './hooks/useLanguage';

export const MainAppContent: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('farmer');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data State
  const [booking, setBooking] = useState<Booking | null>(null);
  const [recommendations, setRecommendations] = useState<CentreRecommendation[]>([]);
  const [family, setFamily] = useState<Family | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  // Modals
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);
  const [isMissedCallOpen, setIsMissedCallOpen] = useState<boolean>(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isPreVisitOpen, setIsPreVisitOpen] = useState<boolean>(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  // Initial Fetch
  const loadInitialData = async () => {
    try {
      const [bookingsRes, recsRes, famRes, notifsRes] = await Promise.all([
        api.getBookings().catch(() => []),
        api.getRecommendations('Wheat').catch(() => []),
        api.getFamily('F101').catch(() => null),
        api.getNotifications().catch(() => [])
      ]);

      if (bookingsRes && bookingsRes.length > 0) {
        setBooking(bookingsRes[0]);
      }
      setRecommendations(recsRes);
      setFamily(famRes);
      setNotifications(notifsRes);
      setUnreadCount(notifsRes.filter((n: any) => !n.is_read).length || 3);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'operator') {
      setActiveTab('operator');
    } else if (role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleMarkNotificationRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const handleDemoStepChange = (step: number, role: UserRole, targetTab: string) => {
    setCurrentRole(role);
    setActiveTab(targetTab);
    loadInitialData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Global Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenKeypad={() => setIsKeypadOpen(true)}
        onOpenMissedCall={() => setIsMissedCallOpen(true)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        
        {/* Role-Specific Routing */}
        {currentRole === 'operator' ? (
          <CentreOperatorPage
            booking={booking}
            onRefreshBooking={loadInitialData}
          />
        ) : currentRole === 'admin' ? (
          <AdminDashboardPage />
        ) : (
          /* Farmer Portal Views */
          <>
            {activeTab === 'dashboard' && (
              <FarmerDashboard
                booking={booking}
                recommendations={recommendations}
                onNavigate={setActiveTab}
                onOpenReschedule={() => setIsRescheduleOpen(true)}
                onOpenPreVisit={() => setIsPreVisitOpen(true)}
              />
            )}

            {activeTab === 'booking' && (
              <SmartBookingPage
                recommendations={recommendations}
                family={family}
                onBookingCreated={(newB) => {
                  setBooking(newB);
                  loadInitialData();
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'queue' && (
              <LiveQueuePage
                booking={booking}
                onOpenReschedule={() => setIsRescheduleOpen(true)}
                onOpenPreVisit={() => setIsPreVisitOpen(true)}
              />
            )}

            {activeTab === 'family' && (
              <FamilyManagementPage
                family={family}
                onRefreshFamily={loadInitialData}
              />
            )}

            {activeTab === 'assistant' && (
              <AIAssistantPage
                booking={booking}
              />
            )}

            {activeTab === 'procurement' && (
              <ProcurementStatusPage
                booking={booking}
              />
            )}

            {activeTab === 'payment' && (
              <PaymentStatusPage
                booking={booking}
              />
            )}
          </>
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      {currentRole === 'farmer' && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Interactive Modals */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
      />

      <KeypadSimulatorModal
        isOpen={isKeypadOpen}
        onClose={() => setIsKeypadOpen(false)}
        onBookingChanged={loadInitialData}
      />

      <MissedCallModal
        isOpen={isMissedCallOpen}
        onClose={() => setIsMissedCallOpen(false)}
        phone={booking?.farmer_phone || '9876543210'}
      />

      <RejectionPreventionModal
        isOpen={isPreVisitOpen}
        onClose={() => setIsPreVisitOpen(false)}
        bookingId={booking?.id || 1}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        booking={booking}
        onRescheduleSuccess={(updated) => {
          setBooking(updated);
          loadInitialData();
        }}
      />

      <DemoTourController
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onStepChange={handleDemoStepChange}
        onOpenKeypad={() => setIsKeypadOpen(true)}
      />

    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-slate-900">Application Notice</h2>
            <p className="text-xs text-slate-600">
              {this.state.error?.message || "A temporary rendering issue occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-800 transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

