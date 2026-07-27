import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Staff from './pages/Staff';
import { NewsList, NewsDetail } from './pages/News';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';

/** Scroll to the top whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-7xl font-bold text-navy-200">404</div>
      <h1 className="mt-3 font-display text-2xl font-bold text-navy-800">Page not found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="mt-6 rounded-md bg-navy-700 px-6 py-3 font-semibold text-white hover:bg-navy-800">
        Return Home
      </Link>
    </div>
  );
}

/** Wraps public pages in the site header/footer */
const Public = (Page) => (
  <Layout>
    <Page />
  </Layout>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Standalone pages (no site chrome) */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        {/* Public site */}
        <Route path="/"            element={Public(Home)} />
        <Route path="/about"       element={Public(About)} />
        <Route path="/academics"   element={Public(Academics)} />
        <Route path="/admissions"  element={Public(Admissions)} />
        <Route path="/staff"       element={Public(Staff)} />
        <Route path="/news"        element={Public(NewsList)} />
        <Route path="/news/:slug"  element={Public(NewsDetail)} />
        <Route path="/gallery"     element={Public(Gallery)} />
        <Route path="/contact"     element={Public(Contact)} />
        <Route path="*"            element={Public(NotFound)} />
      </Routes>
    </>
  );
}
