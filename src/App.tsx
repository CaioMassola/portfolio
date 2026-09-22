import ActionTooltips from './components/layout/ActionTooltips';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SectionNavigation from './components/layout/SectionNavigation';
import Hero from './components/sections/Hero';
import TechnologyStrip from './components/sections/TechnologyStrip';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import { usePreferences } from './hooks/usePreferences';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useReveal } from './hooks/useReveal';

export default function App() {
  const { language, theme, setLanguage, setTheme, t } = usePreferences();
  const reduced = useReducedMotion();

  useReveal();

  return (
    <>
      <a
        className="skip-link"
        href="#main"
      >
        {t.skip}
      </a>
      <Header
        t={t}
        language={language}
        theme={theme}
        setLanguage={setLanguage}
        setTheme={setTheme}
      />
      <main id="main">
        <Hero
          t={t}
          language={language}
          reduced={reduced}
        />
        <TechnologyStrip />
        <About t={t} />
        <Skills t={t} />
        <Experience t={t} />
        <Projects
          t={t}
          reduced={reduced}
        />
        <Contact t={t} />
      </main>
      <SectionNavigation language={language} />
      <Footer t={t} />
      <ActionTooltips />
    </>
  );
}
