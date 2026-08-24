import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.webp';
import workImage from './assets/images/jardin/trabajo-metodo.webp';
import mapImage from './assets/images/jardin/mapa-transformacion.webp';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import systemImage from './assets/images/sistema-digital.webp';
import { contact } from './data.js';
import {
  activeOfferUseCases,
  methodPrinciples,
  processRoadmap,
  pricingPrinciples,
  publicNavigation,
  resultIndicators,
  resultOutcomes,
  servicePricing,
  solutions,
  stackBadges,
  team,
  transformationPillars
} from './publicContent.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;
const apiBase = String(import.meta.env.VITE_API_BASE || 'https://os.metamorfosislab.cl').replace(/\/$/, '');
const PUBLIC_QUOTES_KEY = 'metamorfosis-public-quotes';
const PUBLIC_EVENTS_KEY = 'metamorfosis-public-events';


function getVisitorSessionId() {
  try {
    const existing = window.localStorage.getItem('metamorfosis-visitor-session');
    if (existing) return existing;
    const value = crypto.randomUUID ? crypto.randomUUID() : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem('metamorfosis-visitor-session', value);
    return value;
  } catch {
    return `visitor-${Date.now()}`;
  }
}

function savePublicEventLocally(event) {
  try {
    const current = JSON.parse(window.localStorage.getItem(PUBLIC_EVENTS_KEY) || '[]');
    const next = [event, ...(Array.isArray(current) ? current : [])].slice(0, 500);
    window.localStorage.setItem(PUBLIC_EVENTS_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent('storage', { key: PUBLIC_EVENTS_KEY, newValue: JSON.stringify(next) }));
  } catch {
    // El registro local es complementario y no debe bloquear la navegación.
  }
}

function trackPublicEvent(eventType, metadata = {}) {
  if (typeof window === 'undefined') return;
  const event = {
    id: crypto.randomUUID ? crypto.randomUUID() : `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event_type: eventType,
    label: metadata.label || metadata.serviceTitle || metadata.section || eventType,
    metadata,
    path: `${window.location.pathname}${window.location.hash || ''}`,
    referrer: document.referrer || '',
    session_id: getVisitorSessionId(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    created_at: new Date().toISOString()
  };
  savePublicEventLocally(event);
  try {
    const endpoint = `${apiBase}/api/events`;
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    // El indicador local ya quedó disponible como respaldo.
  }
}

function scrollToPublicSection(id, { smooth = true, updateHash = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('.site-header');
  const headerHeight = header?.getBoundingClientRect().height || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  if (updateHash) window.history.replaceState(null, '', `#${id}`);
  window.scrollTo({ top: Math.max(0, targetTop), behavior: smooth ? 'smooth' : 'auto' });
}

function SectionLink({ id, className = '', children, onClick }) {
  return (
    <a
      className={className}
      href={`#${id}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToPublicSection(id);
        trackPublicEvent('navigation_click', { section: id, label: typeof children === 'string' ? children : id });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function Brand({ compact = false }) {
  return (
    <a
      className={`brand ${compact ? 'brand--compact' : ''}`}
      href="#inicio"
      aria-label="Metamorfosis Lab, ir al inicio"
      onClick={(event) => {
        event.preventDefault();
        scrollToPublicSection('inicio');
      }}
    >
      <img className="brand-logo" src="/logo-metamorfosis-transparente.png" alt="Isotipo de Metamorfosis Lab" width="44" height="44" />
      <span className="brand-copy">
        <strong>METAMORFOSIS LAB</strong>
        <small>operación · trazabilidad · capacidad</small>
      </span>
    </a>
  );
}

function IconButton({ label, icon, onClick, className = '', type = 'button', ariaExpanded, ariaControls }) {
  return (
    <button type={type} className={`icon-button ${className}`} onClick={onClick} aria-label={label} title={label} aria-expanded={ariaExpanded} aria-controls={ariaControls}>
      <Icon name={icon} />
    </button>
  );
}

function PublicHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (!id) return undefined;
    const timer = window.setTimeout(() => scrollToPublicSection(id, { smooth: false, updateHash: false }), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const goTo = (id) => {
    setOpen(false);
    scrollToPublicSection(id);
    trackPublicEvent('navigation_click', { section: id, label: id });
  };

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Brand />
        <nav id="site-navigation" className={`site-nav site-nav--audit ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          <div id="site-menu-panel" className="site-nav__links">
            {publicNavigation.map(({ id, label }) => (
              <button type="button" key={id} onClick={() => goTo(id)}>{label}</button>
            ))}
          </div>
          <button className="button button--small site-nav__conversation" type="button" onClick={() => goTo('contacto')}>
            <Icon name="mail" /> Solicitar evaluación inicial
          </button>
        </nav>
        <IconButton
          className="menu-button"
          label={open ? 'Cerrar menú' : 'Abrir menú'}
          icon={open ? 'close' : 'menu'}
          onClick={() => setOpen((value) => !value)}
          ariaExpanded={open}
          ariaControls="site-menu-panel"
        />
      </div>
    </header>
  );
}

function WhatsappFloating() {
  const message = encodeURIComponent('Hola, conocí Metamorfosis Lab a través de su página. Quiero conversar sobre un problema de operación u organización.');
  return (
    <a className="whatsapp-floating" href={`${waBase}?text=${message}`} target="_blank" rel="noreferrer" aria-label={`Conversar con Metamorfosis Lab por WhatsApp al ${contact.phoneDisplay}`}>
      <img src="/assets/icons/whatsapp.svg" alt="" width="28" height="28" />
      <span>WhatsApp</span>
    </a>
  );
}

function SectionHeading({ kicker, title, description, align = 'center' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function getMailtoUrl(form) {
  const subject = `Solicitud formal Metamorfosis Lab · ${form.company || form.contactName || 'Nueva organización'}`;
  const body = [
    'Hola Metamorfosis Lab,',
    '',
    'Quiero solicitar una evaluación inicial por correo.',
    '',
    `Entrada de interés: ${form.serviceType}`,
    `Organización: ${form.company || 'No indicada'}`,
    `Nombre: ${form.contactName || 'No indicado'}`,
    `Correo de respuesta: ${form.email || 'No indicado'}`,
    `Teléfono: ${form.phone || 'No indicado'}`,
    '',
    'Necesidad principal:',
    form.details || 'No indicada',
    '',
    'Gracias.'
  ];
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`;
}

function saveQuoteLocally(form, apiId = null) {
  const quote = {
    id: apiId || `web-${Date.now()}`,
    created_at: new Date().toISOString(),
    contact_name: form.contactName.trim(),
    company: form.company.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    service_type: form.serviceType,
    details: form.details.trim(),
    city: '',
    status: 'nueva',
    source: 'web-publica',
    channel: 'correo'
  };
  try {
    const current = JSON.parse(window.localStorage.getItem(PUBLIC_QUOTES_KEY) || '[]');
    const next = [quote, ...(Array.isArray(current) ? current : [])].slice(0, 200);
    window.localStorage.setItem(PUBLIC_QUOTES_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent('storage', { key: PUBLIC_QUOTES_KEY, newValue: JSON.stringify(next) }));
  } catch {
    // La solicitud igualmente seguirá hacia el correo formal.
  }
  return quote;
}

async function postQuoteToApi(form) {
  const endpoint = `${apiBase}/api/quotes`;
  const payload = {
    serviceType: form.serviceType,
    details: form.details.trim(),
    contactName: form.contactName.trim(),
    company: form.company.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    preferredContact: 'Correo',
    consent: form.consent,
    website: ''
  };
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const payloadResponse = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payloadResponse.message || 'No fue posible enviar la solicitud.');
  return payloadResponse;
}

function QuoteForm() {
  const empty = {
    serviceType: '',
    details: '',
    contactName: '',
    company: '',
    email: '',
    phone: '',
    consent: false
  };
  const [form, setForm] = useState(empty);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setStatus({ type: 'idle', message: '' });
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const cleanPhone = form.phone.replace(/\D/g, '');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneValid = !form.phone.trim() || cleanPhone.length >= 8;
  const stepOneReady = Boolean(form.serviceType && form.details.trim().length >= 10);
  const stepTwoReady = Boolean(form.company.trim().length >= 2 && form.contactName.trim().length >= 2);
  const stepThreeReady = Boolean(emailValid && phoneValid && form.consent);
  const isValid = stepOneReady && stepTwoReady && stepThreeReady;
  const emailUrl = useMemo(() => getMailtoUrl(form), [form]);

  const prepareFormalContact = async (event) => {
    event?.preventDefault();
    if (!isValid || status.type === 'loading' || status.type === 'success') return;
    trackPublicEvent('formal_request_prepared', { label: form.serviceType, serviceTitle: form.serviceType, section: 'contacto' });
    setStatus({ type: 'loading', message: 'Enviando solicitud formal…' });
    try {
      const response = await postQuoteToApi(form);
      if (!response.emailSent) throw new Error(response.message || 'El servidor recibió la solicitud, pero no confirmó el envío del correo.');
      saveQuoteLocally(form, response.id);
      setStatus({ type: 'success', message: 'Solicitud enviada correctamente a contacto@metamorfosislab.cl. Te responderemos al correo indicado.' });
      trackPublicEvent('formal_request_sent', { label: form.serviceType, serviceTitle: form.serviceType, section: 'contacto' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'No fue posible enviar la solicitud automáticamente. Puedes usar el enlace de correo alternativo.' });
    }
  };

  const chooseService = (option) => {
    setStatus({ type: 'idle', message: '' });
    setForm((current) => ({ ...current, serviceType: option }));
  };

  return (
    <form className="quote-wizard tpr-form tpr-form--steps" onSubmit={prepareFormalContact} noValidate>
      <div className="form-headline form-headline--steps">
        <span><Icon name="mail" /> Canal formal</span>
        <strong>Solicitud por correo</strong>
        <small>Se envía al correo institucional y queda registrada para seguimiento interno.</small>
      </div>

      <ol className="quote-steps" aria-label="Pasos de la solicitud">
        {[
          [1, 'Necesidad'],
          [2, 'Identificación'],
          [3, 'Contacto']
        ].map(([item, label]) => (
          <li key={item} className={`${step === item ? 'is-active' : ''} ${step > item ? 'is-complete' : ''}`} aria-current={step === item ? 'step' : undefined}>
            <span>{step > item ? '✓' : item}</span><small>{label}</small>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="quote-step-panel">
          <span className="quote-step-title"><Icon name="target" /> Elige una entrada</span>
          <div className="choice-grid choice-grid--compact">
            {['Diagnóstico productivo responsable', 'Vitrina Pyme', 'Ciclo Seguro', 'Sistema interno mínimo'].map((option) => (
              <button type="button" key={option} className={form.serviceType === option ? 'is-selected' : ''} onClick={() => chooseService(option)}>{option}</button>
            ))}
          </div>
          <label className="field-label field-label--full"><span><Icon name="edit" /> Qué necesitas resolver</span>
            <textarea name="details" value={form.details} onChange={update} placeholder="Ej.: ordenar roles, reducir pérdidas, explicar mejor la oferta o controlar el ciclo de vestuario laboral." required aria-describedby="details-help" />
            <small id="details-help" className="field-help">Selecciona una entrada y escribe al menos 10 caracteres. {form.details.trim().length}/10 mínimo.</small>
          </label>
          <button type="button" className="button button--full" disabled={!stepOneReady} onClick={() => setStep(2)}>Continuar <Icon name="arrow_forward" /></button>
        </div>
      )}

      {step === 2 && (
        <div className="quote-step-panel">
          <span className="quote-step-title"><Icon name="briefcase" /> Identificación</span>
          <div className="form-grid form-grid--two tpr-form-grid">
            <label className="field-label"><span><Icon name="briefcase" /> Organización</span>
              <input name="company" value={form.company} onChange={update} placeholder="Nombre de la empresa" required />
            </label>
            <label className="field-label"><span><Icon name="group" /> Contacto</span>
              <input name="contactName" value={form.contactName} onChange={update} placeholder="Tu nombre" required />
            </label>
          </div>
          <div className="quote-step-actions">
            <button type="button" className="button button--ghost-light" onClick={() => setStep(1)}><Icon name="arrow_back" /> Volver</button>
            <button type="button" className="button" disabled={!stepTwoReady} onClick={() => setStep(3)}>Continuar <Icon name="arrow_forward" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="quote-step-panel">
          <span className="quote-step-title"><Icon name="mail" /> Canal de respuesta</span>
          <div className="form-grid form-grid--two tpr-form-grid">
            <label className="field-label"><span><Icon name="mail" /> Correo</span>
              <input name="email" type="email" inputMode="email" value={form.email} onChange={update} placeholder="correo@empresa.cl" required />
            </label>
            <label className="field-label"><span><Icon name="phone" /> Teléfono opcional</span>
              <input name="phone" inputMode="tel" value={form.phone} onChange={update} placeholder="+56 9..." />
            </label>
          </div>
          <label className="check-line tpr-check"><input type="checkbox" name="consent" checked={form.consent} onChange={update} /> <span>Acepto ser contactado por Metamorfosis Lab para responder esta solicitud.</span></label>
          <div className="quote-step-actions">
            <button type="button" className="button button--ghost-light" onClick={() => setStep(2)}><Icon name="arrow_back" /> Volver</button>
            <button className="button form-submit" type="submit" disabled={!isValid || status.type === 'loading' || status.type === 'success'}>
              <Icon name="mail" /> {status.type === 'loading' ? 'Enviando…' : status.type === 'success' ? 'Solicitud enviada' : stepThreeReady ? 'Enviar solicitud formal' : 'Completa los datos'}
            </button>
          </div>
          {status.message && <p className={`form-helper form-helper--${status.type}`} role="status"><Icon name={status.type === 'error' ? 'warning' : 'check_circle'} /> {status.message}</p>}
          {status.type === 'error' && <a className="form-mail-fallback" href={emailUrl}><Icon name="mail" /> Enviar por correo manual</a>}
        </div>
      )}
    </form>
  );
}


function PricingTransparency() {
  const [openId, setOpenId] = useState(null);
  const selected = servicePricing.find((item) => item.id === openId) || null;

  const toggle = (item) => {
    const next = openId === item.id ? null : item.id;
    setOpenId(next);
    if (next) {
      trackPublicEvent('service_price_opened', {
        label: item.title,
        serviceId: item.id,
        serviceTitle: item.title,
        price: item.price,
        section: 'servicios-y-precios'
      });
    }
  };

  return (
    <div id="precios" className="pricing-transparency section-anchor">
      <div className="pricing-transparency__intro">
        <span className="kicker"><Icon name="payments" /> Servicios y precios</span>
        <h3>Transparencia antes de contratar</h3>
        <p>Trabajamos con alcances definidos, horas presupuestadas y autorización previa para cualquier ampliación. Los valores aparecen solo al revisar cada servicio, y esa interacción nos ayuda a entender qué necesita el mercado.</p>
      </div>
      <div className="pricing-shell">
        <div className="pricing-grid" aria-label="Servicios disponibles">
          {servicePricing.map((item) => {
            const open = openId === item.id;
            return (
              <button key={item.id} type="button" className={`pricing-card ${open ? 'is-open' : ''}`} onClick={() => toggle(item)} aria-expanded={open} aria-controls="pricing-detail-panel">
                <span className="tpr-icon"><Icon name={item.icon} /></span>
                <span><strong>{item.title}</strong><small>{item.scope}</small></span>
                <em>{open ? 'Ocultar' : 'Ver alcance y valor'}</em>
              </button>
            );
          })}
        </div>
        <aside id="pricing-detail-panel" className={`pricing-detail-panel ${selected ? 'is-visible' : ''}`} aria-live="polite">
          {selected ? (
            <>
              <span className="pricing-detail-panel__eyebrow"><Icon name={selected.icon} /> {selected.compact}</span>
              <h4>{selected.title}</h4>
              <div className="pricing-card__price"><span>Referencia inicial</span><strong>{selected.price}</strong></div>
              <ul>
                {selected.includes.map((entry) => <li key={entry}><Icon name="check_circle" /> {entry}</li>)}
              </ul>
              <p><b>Resultado:</b> {selected.result}</p>
            </>
          ) : (
            <>
              <span className="pricing-detail-panel__eyebrow"><Icon name="info" /> Criterio de contratación</span>
              <h4>Primero claridad, luego presupuesto</h4>
              <p>Antes de cobrar, delimitamos problema, trabajo incluido, resultado esperado, exclusiones y condiciones que podrían modificar el precio.</p>
            </>
          )}
        </aside>
      </div>
      <div className="pricing-principles">
        {pricingPrinciples.map((item) => (
          <article key={item.title}>
            <Icon name={item.icon} />
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </article>
        ))}
      </div>
      <p className="pricing-note"><Icon name="info" /> Hora profesional de referencia: <b>$35.000</b>. Los gastos externos se identifican y autorizan antes de incurrir en ellos.</p>
    </div>
  );
}

function ResultsShowcase() {
  return (
    <div className="results-audit-grid">
      <article className="results-audit-lead">
        <span className="tpr-icon"><Icon name="query_stats" /></span>
        <h3>No prometemos impacto antes de medirlo</h3>
        <p>Definimos desde el inicio qué evidencia puede observarse y qué cambios no corresponde atribuir a una intervención breve.</p>
        <div className="tpr-indicators tpr-indicators--compact">
          {resultIndicators.map((item) => <span key={item}>{item}</span>)}
        </div>
      </article>
      <div className="results-audit-cards">
        {resultOutcomes.map((item) => (
          <article key={item.title} className="tpr-card result-outcome-card">
            <span className="tpr-icon"><Icon name={item.icon} /></span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="team-audit-grid">
      {team.map((person) => (
        <article key={person.name} className="team-audit-card">
          <span className="team-audit-card__avatar" aria-hidden="true">{person.initials}</span>
          <div>
            <h3>{person.name}</h3>
            <strong>{person.role}</strong>
            <p>{person.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function PublicSite() {
  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <div className="public-site public-site--lab public-site--audit">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="tpr-hero section-anchor" style={{ '--section-image': `url(${heroImage})` }} onPointerMove={handleHeroMove}>
          <div className="tpr-hero__shade" aria-hidden="true" />
          <div className="shell tpr-hero__grid">
            <div className="tpr-hero__copy">
              <span className="kicker">Metamorfosis Lab · Biobío</span>
              <h1>Ordenamos operaciones para que puedan funcionar mejor y crecer con responsabilidad</h1>
              <p>Ayudamos a organizaciones a comprender problemas concretos, ordenar procesos y registros, implementar soluciones acotadas y dejar resultados que puedan observarse.</p>
              <div className="hero__actions">
                <SectionLink className="button" id="contacto">Solicitar evaluación inicial</SectionLink>
                <SectionLink className="button button--ghost-light" id="metodo">Cómo trabajamos</SectionLink>
              </div>
              <p className="hero-proofline">Primera conversación de 30 minutos · sin costo · si el problema no encaja con nuestras capacidades, lo diremos.</p>
            </div>
            <aside className="tpr-hero__card lab-pulse-card">
              <strong>¿Cuándo tiene sentido conversar?</strong>
              <ul className="hero-checklist">
                <li>Procesos que dependen demasiado de una persona o de la memoria</li>
                <li>Registros dispersos y poca trazabilidad</li>
                <li>Costos, pérdidas o tareas repetidas difíciles de ver</li>
                <li>Una exigencia nueva que obliga a ordenar la operación</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="que-hacemos" className="section section-anchor tpr-section tpr-section--intro surface-light">
          <div className="shell">
            <SectionHeading kicker="Qué hacemos" title="Entramos por un problema concreto, no por una solución predeterminada" description="La identidad de Metamorfosis es transversal. La intervención comienza delimitando qué problema vale la pena resolver y qué cambio sería suficiente." />
            <div className="tpr-pillar-grid">
              {transformationPillars.map((item) => (
                <article key={item.title} className="tpr-card tpr-pillar-card surface-light-card"><span className="tpr-icon"><Icon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="tpr-split-section section-anchor surface-dark" style={{ '--section-image': `url(${workImage})` }}>
          <div className="tpr-split-section__shade" aria-hidden="true" />
          <div className="shell tpr-split-grid">
            <div className="tpr-panel"><span className="kicker">Problemas de entrada</span><h2>Donde la informalidad empieza a costar</h2><p>Procesos, información, trazabilidad, presencia digital o recursos que ya no pueden depender solamente de conversaciones y memoria.</p></div>
            <div className="tpr-panel tpr-panel--accent"><span className="kicker">Criterio</span><h2>Primero evidencia, después escala</h2><p>Las líneas comerciales actuales son hipótesis en validación. Construimos solo lo necesario para aprender si existe valor real.</p></div>
          </div>
          <div className="shell tpr-usecase-grid">
            {activeOfferUseCases.map((item, index) => <article key={item.title} className="tpr-usecase"><span><Icon name={item.icon || 'arrow_forward'} />{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </section>

        <section className="section tpr-section tpr-section--bento surface-light">
          <div className="shell">
            <SectionHeading kicker="Capacidades" title="Una intervención debe dejar algo funcionando" description="No vendemos documentos por sí mismos: usamos diagnóstico, diseño, tecnología y documentación cuando ayudan a modificar una capacidad real." />
            <div className="tpr-bento-grid">
              {solutions.map((item, index) => <article key={item.title} className={`tpr-card tpr-solution-card tpr-bento-card tpr-bento-card--${index} surface-light-card`}><span className="tpr-icon"><Icon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p></article>)}
              <article className="tpr-card tpr-stack-card surface-light-card"><span className="tpr-icon"><Icon name="database" /></span><h3>Herramientas según necesidad</h3><p>La tecnología entra cuando reduce fricción, mejora trazabilidad o permite medir.</p><div className="stack-badges">{stackBadges.map((badge) => <span key={badge}>{badge}</span>)}</div></article>
            </div>
            <PricingTransparency />
          </div>
        </section>

        <section id="metodo" className="tpr-method-section section-anchor surface-dark" style={{ '--section-image': `url(${mapImage})` }}>
          <div className="tpr-method-section__shade" aria-hidden="true" />
          <div className="shell tpr-method-grid">
            <div className="tpr-panel tpr-panel--wide">
              <SectionHeading kicker="Cómo trabajamos" title="Entender → priorizar → intervenir → medir y transferir" description="El método busca reducir incertidumbre sin convertir una pyme o una organización pequeña en un proyecto infinito." />
              <div className="tpr-roadmap">{processRoadmap.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><Icon name={item.icon} /><strong>{item.title}</strong><p>{item.text}</p></article>)}</div>
              <div className="tpr-method-cards">{methodPrinciples.map((item) => <article key={item.title}><Icon name={item.icon} /><strong>{item.title}</strong><p>{item.text}</p></article>)}</div>
            </div>
            <figure className="tpr-method-visual"><img src={systemImage} alt="Representación de un sistema de organización, datos y seguimiento" loading="lazy" /><figcaption>El sistema sirve al trabajo; no reemplaza la comprensión del problema.</figcaption></figure>
          </div>
        </section>

        <section id="resultados" className="section tpr-section tpr-section--results surface-light">
          <div className="shell"><SectionHeading kicker="Qué buscamos dejar" title="Resultados verificables antes que relatos de éxito" description="Mientras no exista evidencia pública autorizada, mostramos con claridad los tipos de resultado que diseñamos y medimos." /><ResultsShowcase /></div>
        </section>

        <section id="equipo" className="section section-anchor team-audit-section surface-light">
          <div className="shell">
            <SectionHeading kicker="Quién está detrás" title="Un equipo pequeño, con responsabilidades visibles" description="Metamorfosis Lab combina lectura operacional, investigación, diseño de intervención y documentación. Cuando un problema requiere una especialidad habilitante, se incorpora de forma acotada o se deriva." />
            <TeamSection />
          </div>
        </section>

        <section id="contacto" className="story-section story-section--contact section-anchor tpr-contact surface-dark" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="story-section__shade" aria-hidden="true" />
          <div className="shell contact-layout contact-layout--immersive">
            <div className="contact-intro">
              <SectionHeading kicker="Siguiente paso" title="Cuéntanos el problema, no la solución que crees necesitar" description="Responderemos si vemos encaje y cuál sería el próximo paso más pequeño que tenga sentido." />
              <div className="contact-links contact-links--compact contact-links--email-only"><a href={`mailto:${contact.email}`}><Icon name="mail" /><span><small>Correo institucional</small><strong>{contact.email}</strong></span></a></div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <footer className="site-footer surface-dark">
        <div className="shell site-footer__grid site-footer__grid--public-only">
          <div className="site-footer__brand"><Brand /><p>Transformación organizacional con eficiencia operacional, condiciones humanas y responsabilidad con los sistemas vivos.</p></div>
          <div><span className="footer-title">Navegación</span><SectionLink id="que-hacemos">Qué hacemos</SectionLink><SectionLink id="metodo">Cómo trabajamos</SectionLink><SectionLink id="equipo">Equipo</SectionLink><SectionLink id="contacto">Contacto</SectionLink></div>
          <div><span className="footer-title">Contacto</span><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a><p>{contact.coverage}</p></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Biobío · Chile</span></div>
      </footer>
      <WhatsappFloating />
    </div>
  );
}

export default PublicSite;
