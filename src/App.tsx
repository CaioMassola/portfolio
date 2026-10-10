import ArcadePortfolio, { ArcadeFooter } from './components/arcade/ArcadePortfolio';
import { useEffect, useState } from 'react';
import Arcade from './components/arcade/Arcade';
import { readPreference, savePreference } from './lib/storage';
import PrankButton from './components/layout/PrankButton';
import MemoryGame from './components/layout/MemoryGame';
import MiniGame from './components/layout/MiniGame';
import ActionTooltips from './components/layout/ActionTooltips';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SectionNavigation from './components/layout/SectionNavigation';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import { usePreferences } from './hooks/usePreferences';
import { useReveal } from './hooks/useReveal';
import { useSectionHash } from './hooks/useSectionHash';

export default function App() {
  const { language, theme, setLanguage, setTheme, t } = usePreferences();

  const [arcade, setArcade] = useState(() => readPreference('cm-arcade') === 'on');

  useEffect(() => {
    document.documentElement.dataset.arcade = String(arcade);
    savePreference('cm-arcade', arcade ? 'on' : 'off');

    return () => {
      delete document.documentElement.dataset.arcade;
    };
  }, [arcade]);

  const toggleArcade = () => {
    setArcade((value) => !value);
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search,
    );
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useReveal(arcade);
  useSectionHash(language);

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
        arcade={arcade}
        toggleArcade={toggleArcade}
      />
      <main id="main">
        {arcade ? <Arcade language={language} /> : <Hero language={language} />}
        {arcade ? (
          <ArcadePortfolio
            language={language}
            t={t}
          />
        ) : (
          <div className="post-intro">
            <About
              t={t}
              language={language}
            />

            <Skills
              t={t}
              language={language}
            />
            <Experience
              t={t}
              language={language}
            />
            <Projects
              language={language}
              t={t}
            />
            <Contact
              t={t}
              language={language}
            />
          </div>
        )}
      </main>
      <SectionNavigation
        language={language}
        arcade={arcade}
      />
      {arcade ? (
        <ArcadeFooter language={language} />
      ) : (
        <div className="post-intro">
          <Footer
            t={t}
            language={language}
          />
        </div>
      )}
      {!arcade && (
        <>
          <MiniGame language={language} />
          <MemoryGame language={language} />
        </>
      )}
      {arcade && <PrankButton language={language} />}
      <ActionTooltips />
    </>
  );
}
