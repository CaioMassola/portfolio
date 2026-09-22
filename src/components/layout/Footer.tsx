import { Code2, ArrowUp } from 'lucide-react';

import type { Copy } from '../../content';

export default function Footer({ t }: { t: Copy }) {
  return (
    <footer className="shell footer">
      <a
        className="brand"
        href="#inicio"
      >
        <Code2 size={22} />
        <span>
          caio<span>massola</span>
          <b>.</b>
        </span>
      </a>
      <p>
        © {new Date().getFullYear()} Caio Massola. {t.footer}
      </p>
      <a
        href="#inicio"
        aria-label={t.top}
      >
        <ArrowUp size={19} />
      </a>
    </footer>
  );
}
