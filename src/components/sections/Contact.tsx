import { ArrowUpRight, Mail, Linkedin, Github } from 'lucide-react';

import type { Copy } from '../../content';
import { github, linkedin } from '../../lib/profile';

interface ContactProps {
  t: Copy;
}

export default function Contact({ t }: ContactProps) {
  return (
    <section
      className="shell contact section reveal"
      id="contato"
    >
      <div
        className="contact-orbit"
        aria-hidden="true"
      />
      <p className="eyebrow">{t.contactLabel}</p>
      <h2>
        {t.contactTitle[0]}
        <br />
        <span>{t.contactTitle[1]}</span>
      </h2>
      <p>{t.contactText}</p>
      <a
        className="button primary"
        href="mailto:chmassola@gmail.com"
      >
        {t.email}
        <ArrowUpRight size={18} />
      </a>
      <a
        className="contact-email"
        href="mailto:chmassola@gmail.com"
      >
        <Mail size={16} />
        chmassola@gmail.com
      </a>
      <div className="contact-socials">
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin size={17} />
          LinkedIn
          <ArrowUpRight size={14} />
        </a>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
        >
          <Github size={17} />
          GitHub
          <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
