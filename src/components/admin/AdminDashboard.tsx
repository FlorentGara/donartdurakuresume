import { useEffect, useState } from 'react';
import { FolderKanban, Briefcase, GraduationCap, Image, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { useHashRoute } from '@/hooks/useHashRoute';
import { Card, LoadingSpinner } from './ui';
import { hasEditablePortfolio, importPublishedPortfolio } from '@/lib/importPublishedPortfolio';

interface Stats {
  projects: number;
  publishedProjects: number;
  career: number;
  education: number;
  media: number;
}

interface RecentProject {
  id: string;
  title: string;
  updated_at: string;
  published: boolean;
}

export default function AdminDashboard() {
  const { navigate } = useHashRoute();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [canImport, setCanImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    async function load() {
      const [projectsSnap, publishedProjectsSnap, careerSnap, educationSnap, mediaSnap] = await Promise.all([
        getCountFromServer(collection(db, 'projects')),
        getCountFromServer(query(collection(db, 'projects'), where('published', '==', true))),
        getCountFromServer(collection(db, 'career_entries')),
        getCountFromServer(collection(db, 'education_entries')),
        getCountFromServer(collection(db, 'media_assets')),
      ]);

      setStats({
        projects: projectsSnap.data().count,
        publishedProjects: publishedProjectsSnap.data().count,
        career: careerSnap.data().count,
        education: educationSnap.data().count,
        media: mediaSnap.data().count,
      });

      const recentQ = query(collection(db, 'projects'), orderBy('updated_at', 'desc'), limit(5));
      const recentSnap = await getDocs(recentQ);
      const recent = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentProjects((recent as RecentProject[]) ?? []);

      setCanImport(!(await hasEditablePortfolio()));

      setLoading(false);
    }
    load();
  }, []);

  if (loading || !stats) return <LoadingSpinner />;

  const restoreContent = async () => {
    setImporting(true);
    setImportError('');
    try {
      await importPublishedPortfolio();
      window.location.reload();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Could not import the portfolio.');
      setImporting(false);
    }
  };

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, color: 'text-accent' },
    { label: 'Published Projects', value: stats.publishedProjects, icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Career Entries', value: stats.career, icon: Briefcase, color: 'text-blue-400' },
    { label: 'Education Entries', value: stats.education, icon: GraduationCap, color: 'text-purple-400' },
    { label: 'Total Media', value: stats.media, icon: Image, color: 'text-orange-400' },
  ];

  const quickActions = [
    { label: 'Add Project', path: '/admin/projects/new' },
    { label: 'Add Career', path: '/admin/career' },
    { label: 'Add Education', path: '/admin/education' },
    { label: 'Upload Media', path: '/admin/media' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-3xl text-bone-50">Welcome back, Donart</h1>
        <p className="text-bone-400 mt-1">Here's an overview of your portfolio.</p>
      </div>

      {canImport && (
        <Card className="mb-8 border-accent/40">
          <h2 className="text-bone-50 text-lg font-medium">Make your portfolio editable</h2>
          <p className="text-bone-300 text-sm mt-2">
            Your published site has content, but this dashboard's database is empty. Import the saved
            portfolio to edit its text, projects, and settings here. Existing work will never be overwritten.
          </p>
          {importError && <p className="text-red-400 text-sm mt-3">{importError}</p>}
          <button onClick={restoreContent} disabled={importing} className="btn-primary mt-5 disabled:opacity-50">
            {importing ? 'Importing...' : 'Import published portfolio'}
          </button>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="text-3xl text-display text-bone-50">{stat.value}</div>
            <div className="text-bone-500 text-xs mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-bone-300 text-sm font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group flex items-center justify-between p-5 rounded-2xl border hairline bg-ink-900 hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-accent" />
                </div>
                <span className="text-bone-200 text-sm">{action.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-bone-600 group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <h2 className="text-bone-300 text-sm font-medium mb-4">Recent Projects</h2>
        <Card>
          {recentProjects.length === 0 ? (
            <p className="text-bone-500 text-sm text-center py-6">No projects yet.</p>
          ) : (
            <div className="space-y-2">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-ink-850 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-bone-100 text-sm">{project.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      project.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-bone-500/10 text-bone-400'
                    }`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <span className="text-bone-500 text-xs">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
