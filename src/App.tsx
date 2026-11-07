import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CookieNotice } from '@/components/layout/CookieNotice';
import { DashboardPage } from '@/pages/DashboardPage';
import { ConversationsPage } from '@/pages/ConversationsPage';
import { LegalPage } from '@/pages/LegalPage';
import { MemoryMapPage } from '@/pages/MemoryMapPage';
import { MemoryPage } from '@/pages/MemoryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LEGAL_DOCUMENTS } from '@/config/legal';
import { WorkspaceProvider } from '@/context/WorkspaceProvider';
import { useActiveView } from '@/hooks/useActiveView';
import type { NavItem } from '@/config/navigation';

function renderView(item: NavItem) {
  if (item.path === 'overview') return <DashboardPage />;
  if (item.path === 'conversations') return <ConversationsPage />;
  if (item.path === 'memory') return <MemoryPage />;
  if (item.path === 'memory-map') return <MemoryMapPage />;
  if (item.path === 'settings') return <SettingsPage />;
  return <PlaceholderPage item={item} />;
}

function App() {
  const activeItem = useActiveView();
  const legalDocument = LEGAL_DOCUMENTS[window.location.pathname.replace(/\/$/, '')];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeItem?.path, legalDocument]);

  useEffect(() => {
    if (activeItem) document.title = `${activeItem.label} | ORLINA`;
  }, [activeItem]);

  if (legalDocument) {
    return (
      <>
        <LegalPage document={legalDocument} />
        <CookieNotice />
      </>
    );
  }

  if (!activeItem) {
    return (
      <>
        <NotFoundPage />
        <CookieNotice />
      </>
    );
  }

  return (
    <WorkspaceProvider>
      <AppShell activeItem={activeItem}>{renderView(activeItem)}</AppShell>
      <CookieNotice />
    </WorkspaceProvider>
  );
}

export default App;
