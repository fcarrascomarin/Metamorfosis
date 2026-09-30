import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.png';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import { contact } from './data.js';
import {
  activeOfferUseCases,
  cultivationAreas,
  innovationEngines,
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
// 04B.1 · DOS MOTORES · Qué produce Metamorfosis
// -----------------------------------------------------------------------------
function InnovationEnginesSection() {
  return (
    <section id="hacemos" className="v514-engines section-anchor" aria-labelledby="v514-engines-title">
      <div className="shell v514-engines__layout">
        <header className="v514-section-head v514-engines__head">
          <span className="v54-kicker">Qué hacemos</span>
          <h2 id="v514-engines-title">Dos formas de crear valor</h2>
          <p>Metamorfosis puede crear una respuesta nueva o ayudar a que una capacidad existente encuentre una forma más útil de crecer.</p>
        </header>
        <div className="v514-engines__grid">
          {innovationEngines.map((item) => (
            <article key={item.id} className="v514-engine-card">
              <span className="v514-engine-card__icon"><Icon name={item.icon} /></span>
              <span className="v54-eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <SectionLink id="contacto" className="v514-text-link">Conversemos <Icon name="arrow_forward" /></SectionLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 04B.2 · QUÉ CULTIVAMOS · Evidencia de trabajo propio, sin catálogo
// -----------------------------------------------------------------------------
function CultivationSection() {
  const [openArea, setOpenArea] = useState(null);
  return (
    <section id="exploramos" className="v514-cultivation section-anchor" aria-labelledby="v514-cultivation-title">
      <div className="shell v514-cultivation__layout">
        <header className="v514-section-head v514-cultivation__head">
          <span className="v54-kicker">Qué cultivamos</span>
          <h2 id="v514-cultivation-title">Preguntas que cultivamos</h2>
          <p>El jardín sigue activo incluso antes de un encargo. Observamos líneas donde una buena pregunta puede convertirse en una solución, un proyecto o una nueva capacidad.</p>
        </header>
        <div className="v514-cultivation__grid">
          {cultivationAreas.map((item, index) => {
            const isOpen = openArea === index;
            return (
              <article key={item.title} className={`v514-cultivation-card ${isOpen ? 'is-open' : ''}`}>
                <button type="button" className="v514-cultivation-card__trigger" onClick={() => setOpenArea((current) => current === index ? null : index)} aria-expanded={isOpen} aria-controls={`cultivation-${index}`}>
                  <span className="v514-cultivation-card__icon"><Icon name={item.icon} /></span>
                  <strong>{item.title}</strong>
                  <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v514-cultivation-card__arrow" />
                </button>
                <div id={`cultivation-${index}`} className="v514-cultivation-card__panel" hidden={!isOpen}>
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
// 04C · CÓMO TRABAJA METAMORFOSIS · DOS CAPAS, DOS LÓGICAS
//      1) Qué observamos  2) Cómo trabajamos
//      Cada concepto despliega su propia explicación debajo del título.
// -----------------------------------------------------------------------------
function IntegratedMethodSection() {
  const [openDimension, setOpenDimension] = useState(null);
  const [openStep, setOpenStep] = useState(null);

  const toggleDimension = (id) => setOpenDimension((current) => current === id ? null : id);
  const toggleStep = (index) => setOpenStep((current) => current === index ? null : index);

  return (
    <section id="metodo" className="v513-work section-anchor" aria-labelledby="v513-work-title">
      <span id="como-miramos" className="section-anchor v57-hidden-anchor" aria-hidden="true" />
      <div className="shell v513-work__shell">
        {/* 04C.1 · ENCABEZADO · Una sola idea principal */}
        <header className="v513-work__head">
          <span className="v54-kicker">Cómo trabaja Metamorfosis</span>
          <h2 id="v513-work-title">Observar antes de intervenir</h2>
          <p>Leemos una situación desde las dimensiones que importan y después aplicamos un método para convertir comprensión en capacidad.</p>
        </header>

        {/* 04C.2 · QUÉ OBSERVAMOS · Metamorfosis al centro, cuatro lentes alrededor */}
        <div className="v513-observation">
          <div className="v513-observation__label">
            <span className="v513-index">01</span>
            <div><span className="v54-eyebrow">Qué observamos</span><h3>Cuatro lentes para leer una situación</h3></div>
          </div>
          <div className="v513-observation__map">
            {transformationPillars.map((item, index) => {
              const isOpen = openDimension === item.id;
              const positions = ['operation','people','environment','conditions'];
              return (
                <article key={item.id} className={`v513-lens v513-lens--${positions[index]} ${isOpen ? 'is-open' : ''}`}>
                  <button type="button" className="v513-lens__trigger" onClick={() => toggleDimension(item.id)} aria-expanded={isOpen} aria-controls={`dimension-${item.id}`}>
                    <span className="v513-lens__icon"><Icon name={item.icon} /></span>
                    <strong>{item.title}</strong>
                    <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v513-lens__arrow" />
                  </button>
                  <div id={`dimension-${item.id}`} className="v513-lens__panel" hidden={!isOpen}>
                    <small>{item.signal}</small><p>{item.text}</p>
                  </div>
                </article>
              );
            })}
            <div className="v513-core" aria-label="Metamorfosis, jardín de innovación">
              <span className="v513-core__halo" aria-hidden="true" />
              <img src="/logo-metamorfosis-transparente.png" alt="" aria-hidden="true" />
              <strong>Metamorfosis</strong>
              <small>Jardín de innovación · Concepción</small>
            </div>
          </div>
        </div>

        {/* 04C.3 · CÓMO TRABAJAMOS · Cinco etapas, cada una abre su explicación */}
        <div className="v513-method">
          <div className="v513-method__label">
            <span className="v513-index">02</span>
            <div><span className="v54-eyebrow">Cómo trabajamos</span><h3>Cinco etapas para transformar comprensión en capacidad</h3></div>
          </div>
          <div className="v513-method__grid">
            {processRoadmap.map((item, index) => {
              const isOpen = openStep === index;
              return (
                <article key={item.title} className={`v513-step ${isOpen ? 'is-open' : ''}`}>
                  <button type="button" className="v513-step__trigger" onClick={() => toggleStep(index)} aria-expanded={isOpen} aria-controls={`step-${index}`}>
                    <span className="v513-step__number">0{index + 1}</span>
                    <span className="v513-step__icon"><Icon name={item.icon} /></span>
                    <strong>{item.title}</strong>
                    <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v513-step__arrow" />
                  </button>
                  <div id={`step-${index}`} className="v513-step__panel" hidden={!isOpen}>
                    <small>{item.eyebrow}</small><p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="v513-work__close">
          <strong>Información dispersa</strong><span aria-hidden="true">→</span><strong>decisiones más claras</strong><span aria-hidden="true">→</span><strong>capacidad que permanece</strong>
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
          <span className="v54-kicker">Investigación aplicada</span>
          <h2 id="v58-research-title">Preguntas que cultivamos</h2>
          <p>Seguimos preguntas que pueden convertirse en proyectos, aprendizajes o nuevas formas de intervención.</p>
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
// 04E · PRINCIPIOS · Criterios que sostienen una intervención
//      Se mantienen separados de las situaciones de entrada para no mezclar
//      “cuándo conversar” con “cómo cuidamos el trabajo”.
// -----------------------------------------------------------------------------
function PrinciplesSection() {
  const [openPrinciple, setOpenPrinciple] = useState(null);

  return (
    <section id="principios" className="v511-principles section-anchor" aria-labelledby="v511-principles-title">
      <div className="shell v511-principles__layout">
        <header className="v511-principles__head">
          <span className="v54-kicker">Criterios de trabajo</span>
          <h2 id="v511-principles-title">Criterios que ordenan el trabajo</h2>
          <p>Cuatro criterios sostienen la forma en que delimitamos, probamos y aprendemos de una intervención.</p>
        </header>
        <div className="v511-principles__grid">
          {laboratoryPrinciples.map((item, index) => {
            const isOpen = openPrinciple === index;
            return (
              <article key={item.title} className={`v511-principle ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="v511-principle__trigger"
                  onClick={() => setOpenPrinciple((current) => current === index ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`principle-${index}`}
                >
                  <span className="v511-principle__icon"><Icon name={item.icon} /></span>
                  <strong>{item.title}</strong>
                  <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v511-principle__arrow" />
                </button>
                <div id={`principle-${index}`} className="v511-principle__panel" hidden={!isOpen}>
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
// 04F · CUÁNDO INTERVENIR · Situaciones de entrada dentro del Jardín
//      Esta capa pertenece a la identidad del Jardín: primero observamos si una
//      situación necesita más comprensión antes de elegir una solución.
// -----------------------------------------------------------------------------
function GardenEntrySituations() {
  const [openSituation, setOpenSituation] = useState(null);

  return (
    <div className="v511-garden-entry v513-garden-entry" aria-labelledby="v511-entry-title">
      <div className="v511-garden-entry__intro v513-garden-entry__intro">
        <span className="v54-eyebrow">Cuándo conversar</span>
        <h3 id="v511-entry-title">Señales de entrada</h3>
        <p>Si alguna se parece a tu situación, podemos empezar por comprenderla antes de diseñar una respuesta.</p>
      </div>
      <div className="v511-garden-entry__grid v513-garden-entry__grid">
        {activeOfferUseCases.map((item, index) => {
          const isOpen = openSituation === index;
          return (
            <article key={item.title} className={`v511-entry-card v513-entry-card ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="v511-entry-card__trigger v513-entry-card__trigger"
                onClick={() => setOpenSituation((current) => current === index ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`entry-${index}`}
              >
                <span className="v511-entry-card__icon"><Icon name={item.icon} /></span>
                <strong>{item.title}</strong>
                <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="v511-entry-card__arrow" />
              </button>
              <div id={`entry-${index}`} className="v511-entry-card__panel v513-entry-card__panel" hidden={!isOpen}>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="v511-garden-entry__cta v513-garden-entry__cta">
        <span>¿Todavía no sabes cómo nombrar el problema? Esa también puede ser una buena razón para conversar.</span>
        <SectionLink id="contacto" className="button button--small">Conversemos</SectionLink>
      </div>
    </div>
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
    <div className="public-site public-site--lab public-site--audit public-site--v49 public-site--v50 public-site--v54 public-site--v56 public-site--v58 public-site--v59 public-site--v510 public-site--v511 public-site--v512 public-site--v513 public-site--v514 public-site--v515">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PublicHeader />
      <main id="contenido">
        {/* 05.1 · INICIO / HERO · Promesa + definición breve del jardín de innovación */}
        <section id="inicio" className="v54-hero section-anchor" style={{ '--section-image': `url(${heroImage})` }} onPointerMove={handleHeroMove}>
          <div className="v54-hero__shade" aria-hidden="true" />
          <div className="v54-hero__glow" aria-hidden="true" />
          <div className="shell v515-hero">
            <header className="v515-hero__headline">
              <span className="v54-kicker">Jardín de innovación · Concepción</span>
              <h1>Convertimos problemas en soluciones que crecen</h1>
            </header>
            <div className="v515-hero__body">
              <div className="v54-hero__copy">
                <p className="v54-hero__lead">Conectamos conocimiento, capacidades y condiciones de operación para crear respuestas nuevas o hacer crecer iniciativas que ya tienen valor.</p>
                <div className="hero__actions">
                  <SectionLink className="button audit-primary-cta" id="contacto">Conversemos</SectionLink>
                  <SectionLink className="button button--ghost-light" id="hacemos">Qué hacemos</SectionLink>
                </div>
                <div className="v54-hero__location"><Icon name="location_on" /> Con base en Concepción, trabajamos principalmente en la Región del Biobío.</div>
              </div>
              <aside className="v54-hero__manifesto" aria-label="Forma de trabajo de Metamorfosis">
                <span className="v54-eyebrow">Qué nos mueve</span>
                <blockquote>Una buena solución no siempre existe de antemano</blockquote>
                <p>Observamos, conectamos capacidades y probamos respuestas antes de decidir qué vale la pena sostener, ajustar o escalar.</p>
              </aside>
            </div>
          </div>
        </section>

        {/* 05.2 · JARDÍN DE INNOVACIÓN · Identidad y lógica de crecimiento */}
        <section id="jardin" className="v514-garden section-anchor">
          <div className="shell v514-garden__layout">
            <div className="v514-garden__statement">
              <span className="v54-kicker">Jardín de innovación</span>
              <h2>Sembramos preguntas, cultivamos soluciones</h2>
            </div>
            <div className="v514-garden__copy">
              <p>Trabajamos sobre problemas donde conocimiento, información, recursos o capacidades todavía no consiguen producir una respuesta suficientemente útil.</p>
              <p>El jardín no obliga a que todo crezca. Primero observa, después prueba y solo entonces decide qué merece más espacio.</p>
              <div className="v514-garden__principle">
                <span>Concepción</span><strong>→</strong><span>Biobío como campo principal de aprendizaje aplicado</span>
              </div>
            </div>
          </div>
        </section>

        {/* 05.3 · QUÉ HACEMOS · Dos motores de Metamorfosis */}
        <InnovationEnginesSection />

        {/* 05.3 + 05.4 · CÓMO TRABAJA METAMORFOSIS · Mapa + método integrados */}
        <IntegratedMethodSection />

        {/* 05.5 · QUÉ CULTIVAMOS · Trabajo propio y líneas abiertas */}
        <CultivationSection />

        {/* 05.6 · PRINCIPIOS · Criterios que ordenan una intervención */}
        <PrinciplesSection />

        {/* 05.8 · EQUIPO · Diferenciación conjunta + perfiles en columna */}
        <section id="equipo" className="v59-team section-anchor">
          <div className="shell v59-team__layout">
            <div className="v59-team__value">
              <span className="v54-kicker">Equipo</span>
              <h2>Capacidades que se complementan</h2>
              <p>Ingeniería y derecho se combinan para comprender cómo funciona una situación, quién puede actuar, bajo qué reglas y qué relaciones pueden cambiar el resultado.</p>
              <div className="v59-team__strengths">
                <span><Icon name="schema" /><strong>Procesos y capacidades</strong><small>Cómo funciona realmente el trabajo</small></span>
                <span><Icon name="rule" /><strong>Reglas y responsabilidades</strong><small>Bajo qué condiciones puede actuar cada actor</small></span>
                <span><Icon name="account_tree" /><strong>Relaciones y entorno</strong><small>Qué conexiones afectan el resultado</small></span>
              </div>
              <div className="v59-team__synthesis"><Icon name="handshake" /><span>La diferencia no está en sumar profesiones, sino en conectar capacidades técnicas para formular mejores preguntas y diseñar intervenciones proporcionales.</span></div>
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
              <h2>Conversemos</h2>
              <p>Una necesidad concreta, una pregunta abierta o una oportunidad pueden ser suficientes para comenzar.</p>
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
          <div><span className="footer-title">Navegación</span><SectionLink id="jardin">Jardín</SectionLink><SectionLink id="hacemos">Qué hacemos</SectionLink><SectionLink id="metodo">Cómo trabajamos</SectionLink><SectionLink id="exploramos">Qué cultivamos</SectionLink><SectionLink id="equipo">Equipo</SectionLink></div>
          <div><span className="footer-title">Contacto</span><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a><a className="footer-icon-link" href={OS_SITE_URL}><Icon name="lock" /><span>Acceso OS</span></a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis</span><span>Concepción · Región del Biobío · Chile</span></div>
      </footer>
    </div>
  );
}

export default PublicSite;
