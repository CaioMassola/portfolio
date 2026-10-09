import { Mail, MessageCircle } from 'lucide-react';
import type { Copy, Language } from '../../content';
import { sectionIds } from '../../lib/sections';
import { whatsapp } from '../../lib/profile';

const copy = {
  pt: { title: 'Vamos conversar?', text: 'Para falar sobre uma oportunidade, um projeto ou trocar experiências em tecnologia, entre em contato.', whatsapp: 'Conversar no WhatsApp', email: 'Prefere e-mail?', label: 'CONTATO DIRETO' },
  en: { title: 'Let’s talk.', text: 'Get in touch about an opportunity, a project, or to share experiences in technology.', whatsapp: 'Chat on WhatsApp', email: 'Prefer email?', label: 'GET IN TOUCH' },
  es: { title: '¿Conversamos?', text: 'Escríbeme para hablar de una oportunidad, un proyecto o compartir experiencias en tecnología.', whatsapp: 'Hablar por WhatsApp', email: '¿Prefieres un correo?', label: 'CONTACTO DIRECTO' },
};

export default function Contact({ t, language }: { t: Copy; language: Language }) {
  const text = copy[language];

  return (
    <section className="shell contact section reveal" id={sectionIds[language][4]}>
      <p className="eyebrow">{t.contactLabel}</p>
      <div className="contact-layout">
        <div className="contact-copy">
          <h2>{text.title}</h2>
          <p>{text.text}</p>
        </div>
        <div className="contact-actions">
          <p className="eyebrow">{text.label}</p>
          {whatsapp && (
            <a className="button primary whatsapp-link" href={whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={21} aria-hidden="true" />
              {text.whatsapp}
            </a>
          )}
          <div className="contact-email-option">
            <p>{text.email}</p>
            <a className="contact-email" href="mailto:chmassola@gmail.com">
              <Mail size={18} aria-hidden="true" />
              chmassola@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
