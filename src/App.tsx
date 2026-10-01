import { AuthProvider, useAuth } from '@/lib/auth';
import { ToastProvider } from '@/components/admin/Toast';
import { PortfolioDataProvider } from '@/lib/portfolio-context';
import { useHashRoute } from '@/hooks/useHashRoute';
import { LoadingSpinner } from '@/components/admin/ui';

// Public site components
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Career from '@/components/Career';
import Education from '@/components/Education';
import Work from '@/components/Work';
import Services from '@/components/Services';
import Skills from '@/components/Skills';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollMotion from '@/components/ScrollMotion';
import PageMetadata from '@/components/PageMetadata';

// Admin components
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProfile from '@/components/admin/AdminProfile';
import AdminHero from '@/components/admin/AdminHero';
import AdminCareer from '@/components/admin/AdminCareer';
import AdminEducation from '@/components/admin/AdminEducation';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminProjectEditor from '@/components/admin/AdminProjectEditor';
import AdminServices from '@/components/admin/AdminServices';
import AdminSkills from '@/components/admin/AdminSkills';
import AdminProcess from '@/components/admin/AdminProcess';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminSocial from '@/components/admin/AdminSocial';
import AdminMedia from '@/components/admin/AdminMedia';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminSeo from '@/components/admin/AdminSeo';
import AdminSiteCopy from '@/components/admin/AdminSiteCopy';


function PublicSite() {
  return (
    <PortfolioDataProvider>
      <div className="relative bg-ink-950 min-h-screen">
        <PageMetadata />
        <CustomCursor />
        <ScrollProgress />
        <ScrollMotion />
        <Navigation />
        <main>
          <Hero />
          <About />
          <Career />
          <Education />
          <Work />
          <Services />
          <Skills />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    </PortfolioDataProvider>
  );
}

function AdminRouter() {
  const { session, loading } = useAuth();
  const { route, navigate } = useHashRoute();

  if (loading) return <LoadingSpinner />;

  if (!session) {
    if (route.segments[0] === 'admin' && route.segments[1] === 'login') {
      return <AdminLogin />;
    }
    navigate('/admin/login');
    return <LoadingSpinner />;
  }

  // Authenticated: redirect login to dashboard
  if (route.segments[0] === 'admin' && route.segments[1] === 'login') {
    navigate('/admin');
    return <LoadingSpinner />;
  }

  // Not admin route — show public site
  if (route.segments[0] !== 'admin') {
    return <PublicSite />;
  }

  const active = route.path;
  const seg1 = route.segments[1] ?? '';
  const seg2 = route.segments[2] ?? '';
  const seg3 = route.segments[3] ?? '';

  // Route matching
  let page: React.ReactNode = null;
  let breadcrumb: string[] = ['Admin'];

  if (!seg1 || seg1 === 'login') {
    page = <AdminDashboard />;
    breadcrumb = ['Admin', 'Dashboard'];
  } else if (seg1 === 'profile') {
    page = <AdminProfile />;
    breadcrumb = ['Admin', 'Profile'];
  } else if (seg1 === 'hero') {
    page = <AdminHero />;
    breadcrumb = ['Admin', 'Hero'];
  } else if (seg1 === 'career') {
    page = <AdminCareer />;
    breadcrumb = ['Admin', 'Career'];
  } else if (seg1 === 'education') {
    page = <AdminEducation />;
    breadcrumb = ['Admin', 'Education'];
  } else if (seg1 === 'projects') {
    if (seg2 === 'new') {
      page = <AdminProjectEditor />;
      breadcrumb = ['Admin', 'Projects', 'New'];
    } else if (seg2 && seg2 !== 'new') {
      page = <AdminProjectEditor projectId={seg2} />;
      breadcrumb = ['Admin', 'Projects', 'Edit'];
    } else {
      page = <AdminProjects />;
      breadcrumb = ['Admin', 'Projects'];
    }
  } else if (seg1 === 'services') {
    page = <AdminServices />;
    breadcrumb = ['Admin', 'Services'];
  } else if (seg1 === 'skills') {
    page = <AdminSkills />;
    breadcrumb = ['Admin', 'Skills'];
  } else if (seg1 === 'process') {
    page = <AdminProcess />;
    breadcrumb = ['Admin', 'Process'];
  } else if (seg1 === 'messages') {
    page = <AdminMessages />;
    breadcrumb = ['Admin', 'Messages'];
  } else if (seg1 === 'social') {
    page = <AdminSocial />;
    breadcrumb = ['Admin', 'Social Links'];
  } else if (seg1 === 'media') {
    page = <AdminMedia />;
    breadcrumb = ['Admin', 'Media Library'];
  } else if (seg1 === 'settings') {
    page = <AdminSettings />;
    breadcrumb = ['Admin', 'Site Settings'];
  } else if (seg1 === 'text') {
    page = <AdminSiteCopy />;
    breadcrumb = ['Admin', 'Website Text'];
  } else if (seg1 === 'seo') {
    page = <AdminSeo />;
    breadcrumb = ['Admin', 'SEO'];
  } else {
    page = <AdminDashboard />;
    breadcrumb = ['Admin', 'Dashboard'];
  }

  void seg3;

  return <AdminLayout active={active} breadcrumb={breadcrumb}>{page}</AdminLayout>;
}

function AppRouter() {
  const { route } = useHashRoute();
  const isAdmin = route.segments[0] === 'admin';

  if (isAdmin) return <AdminRouter />;
  return <PublicSite />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
