import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Check, Mail, MapPin } from 'lucide-react';
import { config } from '@/data/config';
import { formatDateBR, whatsappLink } from '@/utils/helpers';
import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { WhatsAppIcon } from './BrandIcons';

type FormState = {
  nome: string;
  telefone: string;
  email: string;
  tipo: string;
  data: string;
  cidade: string;
  mensagem: string;
};

const EMPTY: FormState = { nome: '', telefone: '', email: '', tipo: '', data: '', cidade: '', mensagem: '' };

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/55">{label}</span>
      {children}
    </label>
  );
}

export function Contrate() {
  const { contact } = config;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<null | 'whatsapp' | 'email'>(null);

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const buildMessage = () => {
    const details = [
      `*Nome:* ${form.nome}`,
      `*Telefone:* ${form.telefone}`,
      form.email && `*E-mail:* ${form.email}`,
      form.tipo && `*Tipo de evento:* ${form.tipo}`,
      form.data && `*Data:* ${formatDateBR(form.data)}`,
      form.cidade && `*Cidade:* ${form.cidade}`,
      form.mensagem && `*Mensagem:* ${form.mensagem}`,
    ].filter(Boolean);
    return `Olá! Gostaria de um orçamento de show do ${config.name} 🎶\n\n${details.join('\n')}`;
  };

  const send = (channel: 'whatsapp' | 'email') => {
    if (!form.nome.trim() || !form.telefone.trim()) {
      setError('Preencha pelo menos seu nome e telefone. 😉');
      setSent(null);
      return;
    }
    setError('');
    const message = buildMessage();
    if (channel === 'whatsapp') {
      window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    } else {
      const subject = encodeURIComponent(`Orçamento de show — ${config.name}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${encodeURIComponent(message.replace(/\*/g, ''))}`;
    }
    setSent(channel);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send('whatsapp');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="contrate" className="relative scroll-mt-16 overflow-hidden py-24 md:py-32">
      {/* Fundo */}
      <div aria-hidden="true" className="absolute inset-0">
        <img src={config.contrateImage} alt="" loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-0 bg-ink-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(242,168,29,0.2),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink-950 to-transparent" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Shows e eventos" title="Contrate" />

        <Reveal animation="fadeIn" delay={300}>
          <p className="mx-auto -mt-4 mb-14 max-w-2xl text-center text-base leading-relaxed text-white/65 md:text-lg">
            Leve a energia do <strong className="text-gold-300">{config.name}</strong> para o seu evento! Casamentos, aniversários,
            eventos corporativos, bares e casas de show — montamos o repertório ideal pra sua festa.
          </p>
        </Reveal>

        <div className="mx-auto w-full max-w-4xl min-w-0">
          <Reveal animation="fadeInLeft" delay={150} className="mb-8 w-full min-w-0">
            <div className="w-full min-w-0 rounded-2xl border border-gold-500/25 bg-gold-500/[0.06] p-5 sm:p-6">
              <div className="flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
                <div className="min-w-0">
                  <p className="break-words text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold-400">{contact.managerRole}</p>
                  <p className="mt-1 font-display text-2xl tracking-wide text-cream">{contact.manager}</p>
                </div>
                <p className="flex min-w-0 items-start gap-2 text-sm text-white/55 sm:max-w-[48%] sm:justify-end">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" />
                  <span className="min-w-0 break-words">{contact.area}</span>
                </p>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {config.eventTypes.slice(0, 6).map((t) => (
                  <span key={t} className="max-w-full break-words rounded-full border border-white/10 bg-ink-950/50 px-3 py-1 text-xs font-medium text-white/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Formulário */}
          <Reveal animation="fadeInRight" delay={200} className="w-full min-w-0">
            <form onSubmit={onSubmit} className="glass w-full min-w-0 max-w-full rounded-3xl p-5 sm:p-6 md:p-9" noValidate>
              <h3 className="max-w-full break-words font-display text-3xl tracking-wide text-cream md:text-4xl">Peça seu orçamento</h3>
              <p className="mt-1 break-words text-sm text-white/55">Preencha os dados e envie direto pelo WhatsApp ou por e-mail.</p>

              <div className="mt-7 grid min-w-0 gap-4 sm:grid-cols-2">
                <Field label="Nome *">
                  <input className="field" value={form.nome} onChange={update('nome')} placeholder="Seu nome" autoComplete="name" />
                </Field>
                <Field label="WhatsApp / Telefone *">
                  <input
                    className="field"
                    type="tel"
                    value={form.telefone}
                    onChange={update('telefone')}
                    placeholder="(11) 90000-0000"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="voce@email.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Tipo de evento">
                  <select className="field" value={form.tipo} onChange={update('tipo')}>
                    <option value="">Selecione...</option>
                    {config.eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Data do evento">
                  <input className="field" type="date" min={today} value={form.data} onChange={update('data')} />
                </Field>
                <Field label="Cidade / UF">
                  <input className="field" value={form.cidade} onChange={update('cidade')} placeholder="São Paulo / SP" />
                </Field>
                <Field label="Mensagem" className="sm:col-span-2">
                  <textarea
                    className="field resize-none"
                    rows={4}
                    value={form.mensagem}
                    onChange={update('mensagem')}
                    placeholder="Conte um pouco sobre o evento: local, horário, número de convidados..."
                  />
                </Field>
              </div>

              {error && <p className="mt-4 text-sm font-semibold text-samba">{error}</p>}
              {sent && (
                <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <Check className="size-4 shrink-0" />
                  {sent === 'whatsapp'
                    ? 'Abrimos o WhatsApp com sua mensagem pronta. É só enviar!'
                    : 'Abrimos seu e-mail com a mensagem pronta. É só enviar!'}
                </p>
              )}

              <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-gold flex w-full min-w-0 flex-1 whitespace-normal px-4 text-center sm:w-auto">
                  <WhatsAppIcon className="size-5" />
                  Enviar pelo WhatsApp
                </button>
                <button type="button" onClick={() => send('email')} className="btn-outline w-full min-w-0 flex-1 whitespace-normal px-4 text-center sm:w-auto">
                  <Mail className="size-5" />
                  Enviar por e-mail
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
