import { type ReactNode, useState } from 'react';
import {
  LayoutDashboard, User, Briefcase, GraduationCap, FolderKanban,
  Wrench, Sparkles, Workflow, Mail, Image, Settings, Search,
  LogOut, Menu, X, Link2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useHashRoute } from '@/hooks/useHashRoute';

interface AdminLayoutProps {
  children: ReactNode;
  active: string;
  breadcrumb: string[];
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Profile', icon: User, path: '/admin/profile' },
  { label: 'Hero', icon: Sparkles, path: '/admin/hero' },
  { label: 'Career', icon: Briefcase, path: '/admin/career' },
  { label: 'Education', icon: GraduationCap, path: '/admin/education' },
  { label: 'Projects', icon: FolderKanban, path: '/admin/projects' },
  { label: 'Services', icon: Wrench, path: '/admin/services' },
  { label: 'Skills', icon: Sparkles, path: '/admin/skills' },
  { label: 'Process', icon: Workflow, path: '/admin/process' },
  { label: 'Messages', icon: Mail, path: '/admin/messages' },
  { label: 'Social Links', icon: Link2, path: '/admin/social' },
  { label: 'Media Library', icon: Image, path: '/admin/media' },
  { label: 'Site Settings', icon: Settings, path: '/admin/settings' },
  { label: 'SEO', icon: Search, path: '/admin/seo' },
];

export default function AdminLayout({ children, active, breadcrumb }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const { navigate } = useHashRoute();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return active === '/admin';
    return active.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-900 border-r hairline z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b hairline">
          <button onClick={() => navigate('/admin')} className="text-left">
            <div className="text-display text-lg text-bone-50">Donart D.</div>
            <div className="text-bone-500 text-xs font-mono mt-1">CMS Dashboard</div>
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-bone-400 hover:text-bone-100 hover:bg-ink-850 border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t hairline">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-medium">
              {(user?.email?.[0] ?? 'D').toUpperCase()}
            </div>
            <span className="text-bone-400 text-xs truncate">{user?.email}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 text-center text-xs text-bone-500 hover:text-bone-100 px-3 py-2 rounded-lg hover:bg-ink-850 transition-colors"
            >
              View Site
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1 text-xs text-bone-500 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-ink-850 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-950/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 glass px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-bone-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className={i === breadcrumb.length - 1 ? 'text-bone-100' : 'text-bone-500'}>
                  {crumb}
                  {i < breadcrumb.length - 1 && <span className="mx-2 text-bone-600">/</span>}
                </span>
              ))}
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
