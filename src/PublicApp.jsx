import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.png';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import { contact } from './data.js';
import {
  activeOfferUseCases,
  laboratoryPrinciples,
  processRoadmap,
  publicNavigation,
  researchQuestions,
  team,
  transformationPillars
} from './publicContent.js';

// =============================================================================
// WEB PÚBLICA · METAMORFOSIS LAB
// Orden de edición rápida
// 01. Configuración y analítica
// 02. Navegación y marca
// 03. Formulario de conversación
// 04. Componentes visuales (equipo + mapa de sistemas)
// 05. Secciones públicas, en el orden real de lectura
//     Inicio → Jardín → Cómo miramos → Método → Situaciones →
//     Investigación aplicada → Principios → Equipo → Contacto → Footer
//
// Los textos repetibles (método, preguntas, equipo, etc.) se editan en
// src/publicContent.js. Los textos narrativos de cada sección viven aquí.
// =============================================================================

// -----------------------------------------------------------------------------
// 01 · CONFIGURACIÓN Y ANALÍTICA
// -----------------------------------------------------------------------------
const OS_SITE_URL = 'https://os.metamorfosislab.cl';
const apiBase = String(import.meta.env.DEV ? (import.meta.env.VITE_API_BASE || 'http://localhost:4173') : OS_SITE_URL).replace(/\/$/, '');
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

function warmPrivateApi() {
  try {
    fetch(`${apiBase}/api/health`, { method: 'GET', mode: 'cors', cache: 'no-store' }).catch(() => {});
  } catch {
    // La precarga es silenciosa: nunca bloquea la web pública.
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
      aria-label="Metamorfosis, ir al inicio"
      onClick={(event) => {
        event.preventDefault();
        scrollToPublicSection('inicio');
      }}
    >
      <img className="brand-logo" src="/logo-metamorfosis-transparente.png" alt="Isotipo de Metamorfosis" width="44" height="44" />
      <span className="brand-copy">
        <strong>METAMORFOSIS LAB</strong>
        <small>jardín de innovación · Concepción</small>
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

// -----------------------------------------------------------------------------
// 02 · NAVEGACIÓN Y MARCA
// -----------------------------------------------------------------------------
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
    if (id === 'contacto') warmPrivateApi();
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
            <a className="site-nav__os" href={OS_SITE_URL} onClick={openOs} onMouseEnter={warmPrivateApi} onFocus={warmPrivateApi} aria-label="Acceso al sistema interno de Metamorfosis">
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
  const subject = `Solicitud formal Metamorfosis · ${form.company || form.contactName || 'Nueva organización'}`;
  const body = [
    'Hola Metamorfosis,',
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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 75000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const payloadResponse = await response.json().catch(() => ({}));
    if (!response.ok && !payloadResponse.saved) {
      throw new Error(payloadResponse.message || 'No fue posible registrar la solicitud.');
    }
    return { ...payloadResponse, httpOk: response.ok };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('El servidor tardó demasiado en responder. La solicitud puede haberse registrado; revisa Oportunidades en el OS antes de reenviarla.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

// -----------------------------------------------------------------------------
// 03 · FORMULARIO DE CONVERSACIÓN
// -----------------------------------------------------------------------------
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
    if (!isValid || status.type === 'loading' || status.type === 'success' || status.saved) return;
    trackPublicEvent('formal_request_prepared', { label: form.serviceType, serviceTitle: form.serviceType, section: 'contacto' });
    setStatus({ type: 'loading', message: 'Registrando la solicitud y preparando el correo…' });
    const slowNotice = window.setTimeout(() => {
      setStatus((current) => current.type === 'loading'
        ? { type: 'loading', message: 'El canal seguro está terminando de activarse. Mantén esta ventana abierta; no necesitas volver a enviar.' }
        : current);
    }, 9000);
    try {
      const response = await postQuoteToApi(form);
      if (response.saved) saveQuoteLocally(form, response.id);
      if (response.saved && response.emailSent) {
        setStatus({ type: 'success', message: 'Solicitud enviada por correo y registrada en Metamorfosis OS. Te responderemos al correo indicado.' });
        trackPublicEvent('formal_request_sent', { label: form.serviceType, serviceTitle: form.serviceType, section: 'contacto' });
        return;
      }
      if (response.saved && !response.emailSent) {
        setStatus({ type: 'warning', saved: true, message: response.message || 'La solicitud quedó registrada en Metamorfosis OS, pero el correo institucional no pudo confirmarse. Puedes usar el envío manual sin volver a completar el formulario.' });
        trackPublicEvent('formal_request_saved_email_pending', { label: form.serviceType, serviceTitle: form.serviceType, section: 'contacto' });
        return;
      }
      throw new Error(response.message || 'No fue posible confirmar el registro ni el envío del correo.');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'No fue posible completar la solicitud automáticamente. Puedes usar el enlace de correo alternativo.' });
    } finally {
      window.clearTimeout(slowNotice);
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
          <span className="quote-step-title"><Icon name="target" /> ¿Qué situación quieres conversar?</span>
          <div className="choice-grid choice-grid--compact">
            {['Crecimiento o cambio organizacional', 'Procesos, información o trazabilidad', 'Nuevas exigencias o regulación', 'Proveedores, territorio o colaboración', 'Otro / aún no está claro'].map((option) => (
              <button type="button" key={option} className={form.serviceType === option ? 'is-selected' : ''} onClick={() => chooseService(option)}>{option}</button>
            ))}
          </div>
          <label className="field-label field-label--full"><span><Icon name="edit" /> Qué necesitas resolver</span>
            <textarea name="details" value={form.details} onChange={update} placeholder="Describe brevemente qué está ocurriendo, qué cambió o qué pregunta necesitas comprender mejor." required aria-describedby="details-help" />
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
          <label className="check-line tpr-check"><input type="checkbox" name="consent" checked={form.consent} onChange={update} /> <span>Acepto ser contactado por Metamorfosis para responder esta solicitud.</span></label>
          <div className="quote-step-actions">
            <button type="button" className="button button--ghost-light" onClick={() => setStep(2)}><Icon name="arrow_back" /> Volver</button>
            <button className="button form-submit" type="submit" disabled={!isValid || status.type === 'loading' || status.type === 'success' || status.saved}>
              <Icon name="mail" /> {status.type === 'loading' ? 'Enviando…' : status.type === 'success' ? 'Solicitud enviada' : stepThreeReady ? 'Enviar solicitud formal' : 'Completa los datos'}
            </button>
          </div>
          {status.message && <p className={`form-helper form-helper--${status.type}`} role="status"><Icon name={(status.type === 'error' || status.type === 'warning') ? 'warning' : 'check_circle'} /> {status.message}</p>}
          {(status.type === 'error' || status.type === 'warning') && <a className="form-mail-fallback" href={emailUrl}><Icon name="mail" /> Enviar por correo manual</a>}
        </div>
      )}
    </form>
  );
}


// -----------------------------------------------------------------------------
// 04A · COMPONENTE EQUIPO
// -----------------------------------------------------------------------------
function TeamSection() {
  return (
    <div className="v54-team-grid">
      {team.map((person) => (
        <article key={person.name} className="v54-team-card">
          <div className="v54-team-card__head">
            <span className="v54-team-card__initials" aria-hidden="true">{person.initials}</span>
            <div>
              <span className="v54-eyebrow">Equipo Metamorfosis</span>
              <h3>{person.name}</h3>
              <strong>{person.role}</strong>
            </div>
          </div>
          <p>{person.text}</p>
          <div className="v54-team-card__meta">
            <span><Icon name="briefcase" /> {person.profession}</span>
            <span><Icon name="menu_book" /> {person.institution}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 04B · MAPA INTERACTIVO · CÓMO MIRAMOS
// -----------------------------------------------------------------------------
function SystemsMap() {
  const [activeId, setActiveId] = useState('operacion');
  const active = transformationPillars.find((item) => item.id === activeId) || transformationPillars[0];

  return (
    <div className="v54-system" aria-label="Mapa interactivo de observación de Metamorfosis">
      <div className="v54-system__canvas">
        <svg className="v54-system__lines" viewBox="0 0 1000 620" role="presentation" aria-hidden="true">
          <path className={activeId === 'operacion' ? 'is-active' : ''} d="M500 315 C390 245 305 188 205 155" />
          <path className={activeId === 'personas' ? 'is-active' : ''} d="M500 315 C610 245 695 188 795 155" />
          <path className={activeId === 'entorno' ? 'is-active' : ''} d="M500 315 C390 385 305 442 205 475" />
          <path className={activeId === 'condiciones' ? 'is-active' : ''} d="M500 315 C610 385 695 442 795 475" />
        </svg>

        <div className="v54-system__core" aria-live="polite">
          <span className="v54-system__core-label">Situación concreta</span>
          <strong>Metamorfosis</strong>
          <p>{active.short}</p>
          <small>{active.signal}</small>
        </div>

        {transformationPillars.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={`v54-system__node v54-system__node--${index + 1} ${activeId === item.id ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveId(item.id)}
            onFocus={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
            aria-pressed={activeId === item.id}
          >
            <span className="v54-system__node-icon"><Icon name={item.icon} /></span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.short}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="v54-system__explanation">
        <span className="v54-eyebrow">{active.title}</span>
        <h3>{active.short}</h3>
        <p>{active.text}</p>
        <div className="v54-system__criterion"><Icon name="filter_alt" /> No todas las situaciones requieren observar todas las dimensiones. Parte del trabajo es distinguir cuáles importan y cuáles no.</div>
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// 04C · CÓMO TRABAJA METAMORFOSIS · DOS CAPAS, DOS LÓGICAS
//      1) Qué observamos  2) Cómo trabajamos
//      Cada concepto despliega su propia explicación debajo del título.
// -----------------------------------------------------------------------------
function IntegratedMethodSection() {
  const [openDimension, setOpenDimension] = useState('operacion');
  const [openStep, setOpenStep] = useState(0);

  const toggleDimension = (id) => {
    setOpenDimension((current) => current === id ? null : id);
  };

  const toggleStep = (index) => {
    setOpenStep((current) => current === index ? null : index);
  };

  return (
    <section id="metodo" className="v58-work section-anchor" aria-labelledby="v58-work-title">
      <span id="como-miramos" className="section-anchor v57-hidden-anchor" aria-hidden="true" />
      <div className="shell v58-work__shell">
        {/* 04C.1 · ENCABEZADO · Una sola idea principal */}
        <header className="v58-work__head">
          <span className="v54-kicker">Cómo trabaja Metamorfosis</span>
          <h2 id="v58-work-title">Observar mejor para intervenir mejor</h2>
          <p>Primero distinguimos qué dimensiones explican una situación. Después aplicamos un método para convertir esa comprensión en una intervención verificable.</p>
        </header>

        {/* 04C.2 · QUÉ OBSERVAMOS · Cada dimensión abre su propio contenido */}
        <section className="v58-layer v58-layer--dimensions" aria-labelledby="v58-dimensions-title">
          <div className="v58-layer__heading">
            <span className="v58-layer__number">01</span>
            <div>
              <span className="v54-eyebrow">Qué observamos</span>
              <h3 id="v58-dimensions-title">Cuatro lentes para leer una situación</h3>
            </div>
          </div>

          <div className="v58-dimensions">
            <div className="v58-garden-core" aria-label="Metamorfosis Jardín de innovación">
              <img src="/logo-metamorfosis-transparente.png" alt="" aria-hidden="true" />
              <strong>Metamorfosis</strong>
              <small>Jardín de innovación · Concepción</small>
            </div>

            <div className="v58-dimension-grid">
              {transformationPillars.map((item, index) => {
                const isOpen = openDimension === item.id;
                return (
                  <article key={item.id} className={`v58-accordion-card v58-dimension-card ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="v58-accordion-trigger"
                      onClick={() => toggleDimension(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`dimension-${item.id}`}
                    >
                      <span className="v58-accordion-icon"><Icon name={item.icon} /></span>
                      <span className="v58-accordion-title">
                        <strong>{item.title}</strong>
                        <small>{item.signal}</small>
                      </span>
                      <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v58-accordion-arrow" />
                    </button>
                    <div id={`dimension-${item.id}`} className="v58-accordion-panel" hidden={!isOpen}>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 04C.3 · CÓMO TRABAJAMOS · El método no se mezcla con las dimensiones */}
        <section className="v58-layer v58-layer--method" aria-labelledby="v58-method-title">
          <div className="v58-layer__heading">
            <span className="v58-layer__number">02</span>
            <div>
              <span className="v54-eyebrow">Cómo trabajamos</span>
              <h3 id="v58-method-title">Cinco etapas para convertir comprensión en capacidad</h3>
            </div>
          </div>

          <div className="v58-steps">
            {processRoadmap.map((item, index) => {
              const isOpen = openStep === index;
              return (
                <article key={item.title} className={`v58-step-card ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="v58-step-trigger"
                    onClick={() => toggleStep(index)}
                    aria-expanded={isOpen}
                    aria-controls={`step-${index}`}
                  >
                    <span className="v58-step-number">0{index + 1}</span>
                    <span className="v58-step-icon"><Icon name={item.icon} /></span>
                    <span className="v58-step-title">
                      <strong>{item.title}</strong>
                      <small>{item.eyebrow}</small>
                    </span>
                    <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v58-step-arrow" />
                  </button>
                  <div id={`step-${index}`} className="v58-step-panel" hidden={!isOpen}>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 04C.4 · CIERRE · La promesa del método, sin agregar una tercera explicación */}
        <div className="v58-work__close">
          <strong>Transformamos información dispersa</strong>
          <span>en decisiones, capacidades y mejoras sostenibles</span>
          <small>La intervención termina · La capacidad queda</small>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 04D · PREGUNTAS QUE CULTIVAMOS · Investigación aplicada compacta
//      Ya no ocupa una pantalla completa: funciona como evidencia intelectual.
// -----------------------------------------------------------------------------
function ResearchGardenSection() {
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <section id="exploramos" className="v58-research section-anchor" aria-labelledby="v58-research-title">
      <div className="shell v58-research__shell">
        <div className="v58-research__head">
          <span className="v54-kicker">Preguntas que cultivamos</span>
          <h2 id="v58-research-title">Investigar también es parte de nuestro trabajo</h2>
          <p>Algunas preguntas nacen de proyectos y otras los preceden. Las seguimos, las contrastamos y buscamos situaciones reales donde puedan producir aprendizaje útil.</p>
        </div>
        <div className="v58-research__grid">
          {researchQuestions.map((item, index) => {
            const isOpen = openQuestion === index;
            return (
              <article key={item.index} className={`v58-research-card ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="v58-research-trigger"
                  onClick={() => setOpenQuestion((current) => current === index ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`research-${index}`}
                >
                  <span className="v58-research-index">{item.index}</span>
                  <span className="v58-research-title"><small>{item.tag}</small><strong>{item.question}</strong></span>
                  <Icon name={isOpen ? 'expand_less' : 'expand_more'} />
                </button>
                <div id={`research-${index}`} className="v58-research-panel" hidden={!isOpen}>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}



// -----------------------------------------------------------------------------
// 04D · APORTE + PRINCIPIOS · DOS CAPAS EN UNA SOLA ESCENA
// -----------------------------------------------------------------------------
function ContributionAndPrinciplesSection() {
  const [openKey, setOpenKey] = useState('use-0');

  const toggle = (key) => setOpenKey((current) => current === key ? '' : key);

  return (
    <section id="situaciones" className="v59-decision section-anchor" aria-labelledby="v59-decision-title">
      <div className="shell v59-decision__shell">
        <header className="v59-decision__head">
          <span className="v54-kicker">Dónde puede aportar</span>
          <h2 id="v59-decision-title">Cuándo conversar y cómo cuidamos el trabajo</h2>
          <p>Dos preguntas bastan para orientarse: si una situación merece ser comprendida mejor y bajo qué criterios tendría sentido intervenir.</p>
        </header>

        <div className="v59-decision__columns">
          <section className="v59-decision__group" aria-labelledby="v59-use-title">
            <div className="v59-decision__group-head">
              <span className="v59-decision__number">01</span>
              <div>
                <span className="v54-eyebrow">Cuándo puede ser útil conversar</span>
                <h3 id="v59-use-title">Situaciones de entrada</h3>
              </div>
            </div>
            <div className="v59-decision__list">
              {activeOfferUseCases.map((item, index) => {
                const key = `use-${index}`;
                const isOpen = openKey === key;
                return (
                  <article key={item.title} className={`v59-decision-card ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="v59-decision-trigger"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      aria-controls={`v59-use-${index}`}
                    >
                      <span className="v59-decision-icon"><Icon name={item.icon} /></span>
                      <strong>{item.title}</strong>
                      <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v59-decision-arrow" />
                    </button>
                    <div id={`v59-use-${index}`} className="v59-decision-panel" hidden={!isOpen}>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="v59-decision__group" aria-labelledby="v59-principles-title">
            <div className="v59-decision__group-head">
              <span className="v59-decision__number">02</span>
              <div>
                <span className="v54-eyebrow">Cómo cuidamos el trabajo</span>
                <h3 id="v59-principles-title">Principios que ordenan la intervención</h3>
              </div>
            </div>
            <div className="v59-decision__list">
              {laboratoryPrinciples.map((item, index) => {
                const key = `principle-${index}`;
                const isOpen = openKey === key;
                return (
                  <article key={item.title} className={`v59-decision-card ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="v59-decision-trigger"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      aria-controls={`v59-principle-${index}`}
                    >
                      <span className="v59-decision-icon"><Icon name={item.icon} /></span>
                      <strong>{item.title}</strong>
                      <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v59-decision-arrow" />
                    </button>
                    <div id={`v59-principle-${index}`} className="v59-decision-panel" hidden={!isOpen}>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <div className="v59-decision__close">
          <p>Si una situación merece ser entendida antes de elegir una solución, puede valer la pena conversar.</p>
          <SectionLink id="contacto" className="button button--small">Conversemos</SectionLink>
        </div>
      </div>
    </section>
  );
}
// -----------------------------------------------------------------------------
// 05 · COMPOSICIÓN DE LA WEB PÚBLICA · ORDEN REAL DE LECTURA
// -----------------------------------------------------------------------------
function PublicSite() {
  useEffect(() => {
    warmPrivateApi();
  }, []);

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <div className="public-site public-site--lab public-site--audit public-site--v49 public-site--v50 public-site--v54 public-site--v56 public-site--v58 public-site--v59">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PublicHeader />
      <main id="contenido">
        {/* 05.1 · INICIO / HERO · Promesa + definición breve del jardín de innovación */}
        <section id="inicio" className="v54-hero section-anchor" style={{ '--section-image': `url(${heroImage})` }} onPointerMove={handleHeroMove}>
          <div className="v54-hero__shade" aria-hidden="true" />
          <div className="v54-hero__glow" aria-hidden="true" />
          <div className="shell v54-hero__grid">
            <div className="v54-hero__copy">
              <span className="v54-kicker">Jardín de innovación · Concepción</span>
              <h1>Crecer con claridad<br /><em>Operar con precisión</em></h1>
              <p className="v54-hero__lead">Estudiamos cómo funcionan organizaciones, actividades productivas y sus entornos para transformar información dispersa en mejores decisiones, capacidades y mejoras que puedan sostenerse.</p>
              <div className="hero__actions">
                <SectionLink className="button audit-primary-cta" id="contacto">Conversemos</SectionLink>
                <SectionLink className="button button--ghost-light" id="jardin">Conocer el jardín</SectionLink>
              </div>
              <div className="v54-hero__location"><Icon name="location_on" /> Desde Concepción, con la Región del Biobío como principal espacio de observación y trabajo aplicado.</div>
            </div>
            <aside className="v54-hero__manifesto" aria-label="Forma de trabajo de Metamorfosis">
              <span className="v54-eyebrow">Una forma de trabajar</span>
              <blockquote>“No partimos desde una solución predeterminada.”</blockquote>
              <p>Observamos la situación, delimitamos lo relevante, probamos con proporcionalidad y usamos la evidencia para decidir qué sostener, ajustar o ampliar.</p>
              <div className="v54-signal-row">
                <span>investigación aplicada</span>
                <span>experimentación</span>
                <span>transferencia</span>
              </div>
            </aside>
          </div>
        </section>

        {/* 05.2 · JARDÍN DE INNOVACIÓN · Identidad y lógica de crecimiento */}
        <section id="jardin" className="v54-section v54-section--paper section-anchor">
          <div className="shell">
            <div className="v54-intro-grid">
              <div>
                <span className="v54-kicker">Metamorfosis</span>
                <h2>Un jardín para sembrar preguntas y hacer crecer soluciones</h2>
              </div>
              <div className="v54-intro-copy">
                <p>Trabajamos sobre situaciones reales donde operación, personas, información, regulación y entorno pueden estar interactuando. No forzamos una receta: observamos qué relaciones importan, qué conviene cultivar y qué intervención tiene sentido.</p>
                <p>La Región del Biobío es hoy nuestro principal campo de aprendizaje aplicado. Desde Concepción desarrollamos proyectos con vocación de utilidad concreta, sin convertir un territorio, industria o tipo de organización en una plantilla universal.</p>
              </div>
            </div>

            <div className="v54-lab-definition">
              <span className="v54-lab-definition__number">JARDÍN</span>
              <div>
                <span className="v54-eyebrow">¿Por qué jardín?</span>
                <p>Porque una buena intervención no aparece terminada. Se siembra como pregunta, se observa en contexto, se prueba con cuidado y crece solo cuando la evidencia muestra que vale la pena sostenerla.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 05.3 + 05.4 · CÓMO TRABAJA METAMORFOSIS · Mapa + método integrados */}
        <IntegratedMethodSection />

        {/* 05.5 + 05.7 · APORTE + PRINCIPIOS · Dos capas en una sola escena */}
        <ContributionAndPrinciplesSection />

        {/* 05.6 · PREGUNTAS QUE CULTIVAMOS · Investigación aplicada compacta */}
        <ResearchGardenSection />

        {/* 05.8 · EQUIPO · Diferenciación conjunta + perfiles en columna */}
        <section id="equipo" className="v59-team section-anchor">
          <div className="shell v59-team__layout">
            <div className="v59-team__value">
              <span className="v54-kicker">Equipo</span>
              <h2>Dos capacidades técnicas que trabajan como una sola</h2>
              <p>Metamorfosis combina ingeniería y derecho no para sumar miradas en paralelo, sino para leer una misma situación desde su operación, sus decisiones, sus reglas y sus relaciones externas.</p>
              <div className="v59-team__strengths">
                <span><Icon name="schema" /><strong>Procesos y capacidades</strong><small>Cómo funciona realmente el trabajo</small></span>
                <span><Icon name="rule" /><strong>Reglas y responsabilidades</strong><small>Bajo qué condiciones puede actuar cada actor</small></span>
                <span><Icon name="account_tree" /><strong>Relaciones y entorno</strong><small>Qué conexiones afectan el resultado</small></span>
              </div>
              <div className="v59-team__synthesis"><Icon name="handshake" /><span>La diferencia no está en tener dos profesiones. Está en formular mejores preguntas y diseñar intervenciones más completas sin agregar complejidad innecesaria.</span></div>
            </div>
            <div className="v59-team__profiles">
              <TeamSection />
            </div>
          </div>
        </section>

        {/* 05.9 · CONTACTO · Apertura de conversación */}
        <section id="contacto" className="audit-scene audit-scene--dark audit-contact section-anchor v54-contact" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="audit-scene__shade" aria-hidden="true" />
          <div className="shell audit-contact__grid">
            <div className="audit-contact__intro">
              <span className="kicker">Conversemos</span>
              <h2>Una buena conversación puede ser el mejor punto de partida</h2>
              <p>Podemos conversar a partir de una necesidad concreta, una pregunta todavía abierta, una oportunidad de colaboración o una hipótesis que valga la pena poner a prueba.</p>
              <div className="audit-contact__facts">
                <span><Icon name="schedule" /><strong>30 min</strong><small>primera conversación</small></span>
                <span><Icon name="location_on" /><strong>Concepción</strong><small>Región del Biobío</small></span>
                <span><Icon name="mail" /><strong>Correo formal</strong><small>{contact.email}</small></span>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      {/* 05.10 · FOOTER · Cierre institucional */}
      <footer className="site-footer audit-footer v54-footer">
        <div className="shell audit-footer__grid">
          <div className="site-footer__brand"><Brand /><p>Jardín de innovación con base en Concepción. Transformamos la manera en que las organizaciones generan valor, integrando eficiencia operacional, condiciones humanas y una relación responsable con los sistemas vivos.</p></div>
          <div><span className="footer-title">Navegación</span><SectionLink id="jardin">Jardín</SectionLink><SectionLink id="metodo">Cómo trabajamos</SectionLink><SectionLink id="exploramos">Qué exploramos</SectionLink><SectionLink id="equipo">Equipo</SectionLink></div>
          <div><span className="footer-title">Contacto</span><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a><a className="footer-icon-link" href={OS_SITE_URL}><Icon name="lock" /><span>Acceso OS</span></a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis</span><span>Concepción · Región del Biobío · Chile</span></div>
      </footer>
    </div>
  );
}

export default PublicSite;
