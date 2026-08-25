import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.webp';
import mapImage from './assets/images/jardin/mapa-transformacion.webp';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import pillarOperationImage from './assets/images/lab-showcase/pillar-operacion.png';
import pillarPeopleImage from './assets/images/lab-showcase/pillar-personas.png';
import pillarSystemsImage from './assets/images/lab-showcase/pillar-sistemas.png';
import methodUnderstandImage from './assets/images/lab-showcase/method-entender.png';
import methodPrioritizeImage from './assets/images/lab-showcase/method-priorizar.png';
import methodInterveneImage from './assets/images/lab-showcase/method-intervenir.png';
import methodMeasureImage from './assets/images/lab-showcase/method-medir.png';
import { contact } from './data.js';
import {
  activeOfferUseCases,
  methodPrinciples,
  processRoadmap,
  publicNavigation,
  team,
  transformationPillars
} from './publicContent.js';

const OS_SITE_URL = 'https://os.metamorfosislab.cl';
const apiBase = String(import.meta.env.DEV ? (import.meta.env.VITE_API_BASE || 'http://localhost:4173') : OS_SITE_URL).replace(/\/$/, '');
const PUBLIC_QUOTES_KEY = 'metamorfosis-public-quotes';
const PUBLIC_EVENTS_KEY = 'metamorfosis-public-events';


const pillarIllustrations = [pillarOperationImage, pillarPeopleImage, pillarSystemsImage];
const methodIllustrations = [methodUnderstandImage, methodPrioritizeImage, methodInterveneImage, methodMeasureImage];


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

  const openOs = () => {
    setOpen(false);
    trackPublicEvent('os_access_click', { label: 'Acceso OS', section: 'header' });
  };

  return (
    <header className="site-header public-header">
      <div className="site-header__inner shell">
        <Brand />
        <nav id="site-navigation" className={`site-nav site-nav--audit ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          <div id="site-menu-panel" className="site-nav__links">
            {publicNavigation.map(({ id, label }) => (
              <button type="button" key={id} onClick={() => goTo(id)}>{label}</button>
            ))}
          </div>
          <div className="site-nav__actions">
            <a className="site-nav__os" href={OS_SITE_URL} onClick={openOs} aria-label="Acceso al sistema interno de Metamorfosis Lab">
              <Icon name="lock" /> <span>Acceso OS</span>
            </a>
            <button className="button button--small site-nav__conversation" type="button" onClick={() => goTo('contacto')}>
              Conversemos
            </button>
          </div>
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
        <strong>Solicitud de conversación</strong>
        <small>Cuéntanos lo suficiente para decidir si corresponde conversar.</small>
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
          <span className="quote-step-title"><Icon name="target" /> ¿Qué necesitas ordenar?</span>
          <div className="choice-grid choice-grid--compact">
            {['Operación y procesos', 'Trazabilidad y registros', 'Presencia digital', 'Otro / no estoy seguro'].map((option) => (
              <button type="button" key={option} className={form.serviceType === option ? 'is-selected' : ''} onClick={() => chooseService(option)}>{option}</button>
            ))}
          </div>
          <label className="field-label field-label--full"><span><Icon name="edit" /> Qué necesitas resolver</span>
            <textarea name="details" value={form.details} onChange={update} placeholder="Describe brevemente qué está ocurriendo, qué se está haciendo difícil o qué necesitas ordenar." required aria-describedby="details-help" />
            <small id="details-help" className="field-help">Selecciona una opción y escribe al menos 10 caracteres. {form.details.trim().length}/10 mínimo.</small>
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


function TeamSection() {
  return (
    <div className="team-audit-grid">
      {team.map((person) => (
        <article key={person.name} className="team-audit-card">
          <span className="team-audit-card__avatar" aria-hidden="true">{person.initials}</span>
          <div className="team-audit-card__body">
            <div className="team-audit-card__copy">
              <h3>{person.name}</h3>
              <strong>{person.role}</strong>
            </div>
            <div className="team-audit-card__meta" aria-label={`Perfil de ${person.name}`}>
              <span className="team-audit-card__tag team-audit-card__tag--profession"><Icon name="briefcase" /> {person.profession}</span>
              <span className="team-audit-card__tag team-audit-card__tag--institution"><Icon name="menu_book" /> {person.institution}</span>
            </div>
            <p>{person.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function PublicSite() {
  return (
    <div className="public-site public-site--lab public-site--audit public-site--v50">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="audit-scene audit-hero section-anchor" style={{ '--section-image': `url(${heroImage})` }}>
          <div className="audit-scene__shade" aria-hidden="true" />
          <div className="shell audit-hero__grid">
            <div className="audit-hero__copy">
              <span className="kicker">Metamorfosis Lab · Biobío</span>
              <h1>Ordenamos operaciones cuando la informalidad empieza a costar</h1>
              <p>Ayudamos a pymes y organizaciones a comprender un problema operativo, ordenar procesos y registros e implementar cambios acotados que puedan sostenerse.</p>
              <div className="hero__actions">
                <SectionLink className="button audit-primary-cta" id="contacto">Conversemos</SectionLink>
                <SectionLink className="button button--ghost-light" id="metodo">Ver el método</SectionLink>
              </div>
              <p className="hero-proofline">Primera conversación de 30 minutos · sin costo · si el problema no encaja con nuestras capacidades, lo diremos.</p>
            </div>
            <aside className="audit-hero__aside" aria-label="Señales para conversar">
              <span className="audit-aside-label">Vale la pena conversar cuando</span>
              <ul>
                <li>la operación depende demasiado de memoria, mensajes o una sola persona;</li>
                <li>hay registros, pero cuesta seguir lo que ocurrió o demostrarlo;</li>
                <li>el crecimiento está trayendo errores, pérdidas, duplicación o desorden.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="que-hacemos" className="audit-scene audit-scene--light section-anchor">
          <div className="shell audit-scene__content">
            <SectionHeading
              kicker="Qué hacemos"
              title="Tres entradas claras para leer y transformar la operación"
              description="La web debe explicar rápido dónde entra Metamorfosis. Primero leemos la operación, luego ordenamos lo crítico y recién entonces definimos el cambio justo."
            />
            <div className="audit-pillar-showcase" aria-label="Ámbitos de transformación de Metamorfosis Lab">
              {transformationPillars.map((item, index) => (
                <article key={item.title} className="audit-pillar-showcase__card">
                  <div className="audit-pillar-showcase__media">
                    <img src={pillarIllustrations[index]} alt={`Ilustración de ${item.title}`} loading="lazy" />
                  </div>
                  <div className="audit-pillar-showcase__copy">
                    <span className="audit-pill"><Icon name={item.icon} /> {item.accent}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="audit-entry-strip audit-entry-strip--v50" aria-label="Problemas donde Metamorfosis puede entrar">
              {activeOfferUseCases.map((item) => (
                <article key={item.title}>
                  <span className="audit-entry-strip__icon"><Icon name={item.icon || 'arrow_forward'} /></span>
                  <div><strong>{item.title}</strong><span>{item.text}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="audit-scene audit-scene--dark audit-method section-anchor" style={{ '--section-image': `url(${mapImage})` }}>
          <div className="audit-scene__shade" aria-hidden="true" />
          <div className="shell audit-scene__content">
            <SectionHeading
              kicker="Método"
              title="Un proceso breve para entender, priorizar, intervenir y transferir"
              description="La lógica de trabajo debe poder leerse en segundos. Cada etapa agrega criterio, reduce improvisación y ayuda a que la solución quede utilizable por la organización."
            />
            <div className="audit-roadmap audit-roadmap--showcase" aria-label="Etapas del método Metamorfosis">
              {processRoadmap.map((item, index) => (
                <article key={item.title} className="audit-roadmap__card">
                  <div className="audit-roadmap__media">
                    <img src={methodIllustrations[index]} alt={`Etapa ${index + 1}: ${item.title}`} loading="lazy" />
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="audit-roadmap__copy">
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="audit-principles audit-principles--v50">
              {methodPrinciples.map((item) => (
                <article key={item.title}><Icon name={item.icon} /><div><strong>{item.title}</strong><p>{item.text}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section id="equipo" className="audit-scene audit-scene--light audit-team section-anchor">
          <div className="shell audit-scene__content">
            <SectionHeading
              kicker="Equipo"
              title="Responsabilidades visibles y especialidades cuando hacen falta"
              description="Metamorfosis combina lectura operacional, investigación, diseño de intervención y documentación. Las especialidades externas se incorporan solo cuando el problema realmente las exige."
            />
            <TeamSection />
            <p className="audit-team-note"><Icon name="verified_user" /> El alcance, las responsabilidades y los límites de cada intervención se acuerdan antes de ejecutar.</p>
          </div>
        </section>

        <section id="contacto" className="audit-scene audit-scene--dark audit-contact section-anchor" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="audit-scene__shade" aria-hidden="true" />
          <div className="shell audit-contact__grid">
            <div className="audit-contact__intro">
              <span className="kicker">Conversemos</span>
              <h2>Cuéntanos el problema antes de elegir una solución</h2>
              <p>Con una descripción breve podemos decirte si vemos encaje y cuál sería el siguiente paso más pequeño que tenga sentido.</p>
              <div className="audit-contact__facts">
                <span><Icon name="schedule" /><strong>30 min</strong><small>primera conversación</small></span>
                <span><Icon name="payments" /><strong>Sin costo</strong><small>para evaluar encaje</small></span>
                <span><Icon name="mail" /><strong>Correo formal</strong><small>{contact.email}</small></span>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <footer className="site-footer audit-footer">
        <div className="shell audit-footer__grid">
          <div className="site-footer__brand"><Brand /><p>Transformación organizacional con eficiencia operacional, condiciones humanas y responsabilidad con los sistemas vivos.</p></div>
          <div><span className="footer-title">Navegación</span><SectionLink id="que-hacemos">Qué hacemos</SectionLink><SectionLink id="metodo">Método</SectionLink><SectionLink id="equipo">Equipo</SectionLink><SectionLink id="contacto">Conversemos</SectionLink></div>
          <div><span className="footer-title">Acceso</span><a className="footer-icon-link" href={OS_SITE_URL}><Icon name="lock" /><span>Acceso OS</span></a><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Biobío · Chile</span></div>
      </footer>
    </div>
  );
}

export default PublicSite;
