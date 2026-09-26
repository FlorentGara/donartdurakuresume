import { useEffect, useState } from 'react';
import { FolderKanban, Briefcase, GraduationCap, Image, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useHashRoute } from '@/hooks/useHashRoute';
import { Card, LoadingSpinner } from './ui';

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

  useEffect(() => {
    async function load() {
      const [projects, publishedProjects, career, education, media] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('career_entries').select('*', { count: 'exact', head: true }),
        supabase.from('education_entries').select('*', { count: 'exact', head: true }),
        supabase.from('media_assets').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projects.count ?? 0,
        publishedProjects: publishedProjects.count ?? 0,
        career: career.count ?? 0,
        education: education.count ?? 0,
        media: media.count ?? 0,
      });

      const { data: recent } = await supabase
        .from('projects')
        .select('id, title, updated_at, published')
        .order('updated_at', { ascending: false })
        .limit(5);
      setRecentProjects((recent as RecentProject[]) ?? []);

      setLoading(false);
    }
    load();
  }, []);

  if (loading || !stats) return <LoadingSpinner />;

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
