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
  const headerHeight = Math.ceil(header?.getBoundingClientRect().height || 0);
  // Calcular sobre la geometría real del header, no sobre un valor CSS fijo.
  // El pequeño margen evita que el primer renglón quede tapado en zoom.
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 2;
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
        <small>Investigación e innovación aplicada</small>
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
              <h3>{person.name}</h3>
              <strong>{person.role}</strong>
            </div>
          </div>
          <p>{person.text}</p>
          <div className="v54-team-card__meta">
            <span><Icon name="briefcase" /> {person.profession}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

// La escena principal utiliza un mapa compacto. Los detalles son opcionales:
// la primera vista ofrece una explicación completa sin depender de un clic.
function IntegratedProposalMap() {
  const [selected, setSelected] = useState(null);
  const active = transformationPillars.find((item) => item.id === selected);
  return (
    <div className="v535-map" aria-label="Dimensiones que investigamos antes de intervenir">
      <span className="v535-map__eyebrow">La mirada Metamorfosis</span>
      <div className="v535-map__orbit">
        <svg className="v535-map__connections" viewBox="0 0 600 430" preserveAspectRatio="none" aria-hidden="true">
          <path d="M300 215 L126 100 M300 215 L474 100 M300 215 L126 330 M300 215 L474 330" />
        </svg>
        <div className="v535-map__center">
          <img src="/logo-metamorfosis-transparente.png" alt="" aria-hidden="true" />
          <strong>Metamorfosis</strong>
          <small>Investigación aplicada</small>
        </div>
        {transformationPillars.map((item, i) => (
          <button type="button" key={item.id} className={`v535-map__node v535-map__node--${i+1} ${selected === item.id ? 'is-active' : ''}`}
            onClick={() => setSelected((prev) => prev === item.id ? null : item.id)}
            aria-pressed={selected === item.id} aria-label={`Profundizar en ${item.title}`}>
            <span className="v535-map__icon"><Icon name={item.icon} /></span>
            <span><strong>{item.title}</strong><small>{item.short}</small></span>
          </button>
        ))}
      </div>
      <div className={`v535-map__detail ${active ? 'is-open' : ''}`} aria-live="polite">
        {active ? <><strong>{active.title}</strong><span>{active.text}</span></> : <span>Conectamos información, procesos, personas y contexto antes de intervenir.</span>}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PROPUESTA · Primera vista autosuficiente y ampliación de rigor bajo demanda.
// La sección evita duplicar el criterio expresado en el hero y no requiere
// ninguna interacción para entender las dos formas de crear valor y el método.
// -----------------------------------------------------------------------------
function ProposalSection() {
  return (
    <section
      id="propuesta"
      className="v537-proposal section-anchor"
      aria-labelledby="v537-title"
    >
      <div className="shell v537-proposal__layout">
       
        <div className="v537-method" aria-labelledby="v537-method-title">
          <div className="v537-method__story">
            <span className="v54-eyebrow">Cómo trabajamos</span>
            <h3 id="v537-method-title">Investigación que orienta decisiones</h3>
            <p>Combinamos información disponible, mapeo, entrevistas y análisis técnico para comprender cómo se relacionan la operación, las personas, el entorno y las condiciones de cada situación. Con esa evidencia delimitamos una respuesta, la probamos, evaluamos sus resultados y transferimos lo aprendido.</p>
          </div>
          <ol className="v537-method__sequence" aria-label="Cinco etapas del método">
            {processRoadmap.map((item, index) => (
              <li className="v537-method__step" key={item.title}>
                <span>0{index + 1}</span>
                <div><strong>{item.title}</strong><small>{item.eyebrow}</small></div>
              </li>
            ))}
          </ol>
        </div>
        <header className="v537-proposal__intro" >
                  <span className="v54-kicker">Nuestra propuesta</span>
               <h2 id="v537-title">Del conocimiento a soluciones aplicables</h2>
          <p>Desarrollamos respuestas a problemas concretos y fortalecemos capacidades que necesitan una nueva forma de operar o crecer.</p>  
                </header>
         <div className="v537-offers" aria-label="Qué hacemos">
                          
          <article className="v537-offer">
            <span className="v537-offer__index">01 / CREAMOS</span>
            <h3>Soluciones propias</h3>
            <p>Investigamos necesidades aún no resueltas y diseñamos herramientas, protocolos o prototipos que puedan ponerse a prueba en contexto.</p>
            <p className="v537-offer__outcome"><strong>Resultado posible</strong> · Una solución documentada, evaluable y con condiciones claras de aplicación.</p>
          </article>
          <article className="v537-offer">
            <span className="v537-offer__index">02 / FORTALECEMOS</span>
            <h3>Incubación de impacto</h3>
            <p>Acompañamos organizaciones e iniciativas con capacidades valiosas para estructurar su operación y hacer viable su continuidad o crecimiento.</p>
            <p className="v537-offer__outcome"><strong>Resultado posible</strong> · Una propuesta fortalecida y una hoja de ruta accionable.</p>
          </article>
        </div>

        <div className="v537-proposal__closing">
          <p>Una buena intervención no termina con la entrega: deja criterios, herramientas y capacidades para continuar.</p>
          <SectionLink id="contacto" className="button button--small">Conversemos <Icon name="arrow_forward" /></SectionLink>
        </div>

        <details className="v537-details">
          <summary>Profundizar en nuestro trabajo <Icon name="expand_more" /></summary>
          <div className="v537-details__content">
            <div>
              <h3>Las cuatro dimensiones que investigamos</h3>
              {transformationPillars.map((item) => (
                <p key={item.id}><strong>{item.title}</strong> — {item.text}</p>
              ))}
            </div>
            <div>
              <h3>Ámbitos en los que podemos aportar</h3>
              {cultivationAreas.map((item) => (
                <p key={item.title}><strong>{item.title}</strong> — {item.text}</p>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
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
    <div className="v516-engines v524-engines v532-engines" aria-labelledby="v516-engines-title">
      <div className="v516-engines__layout v524-engines__layout">
        <header className="v516-section-head v524-engines__head">
          <span className="v54-kicker">Qué hacemos</span>
          <h2 id="v516-engines-title">Dos formas de crear valor</h2>
          <p>Según la situación, desarrollamos una respuesta nueva o fortalecemos una iniciativa que ya existe. Cada camino tiene un propósito y un resultado diferente.</p>
        </header>
        <div className="v524-offer-grid">
          {innovationEngines.map((item, index) => (
            <article key={item.id} className={`v524-offer v524-offer--${item.id}`}>
              <div className="v524-offer__top">
                <div className="v524-offer__icon" aria-hidden="true"><Icon name={item.icon} /></div>
                <div className="v524-offer__identity"><small>{item.eyebrow}</small><h3>{item.title}</h3></div>
                <span className="v524-offer__index" aria-hidden="true">0{index+1}</span>
              </div>
              <p className="v524-offer__summary">{item.summary}</p>
              <div className="v524-offer__facts">
                <div><span>Cuándo aporta</span><p>{item.when}</p></div>
                <div><span>Qué desarrollamos</span><p>{item.work}</p></div>
              </div>
              <div className="v524-offer__output">
                <Icon name="check_circle" />
                <div><small>Resultado posible</small><p>{item.output}</p></div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 04B.2 · QUÉ CULTIVAMOS · Evidencia de trabajo propio, sin catálogo
// -----------------------------------------------------------------------------
function GardenKnowledgeSection() {
  const [openArea, setOpenArea] = useState(null);
  const [openPrinciple, setOpenPrinciple] = useState(null);

  return (
    <div className="v516-garden-knowledge v523-garden-board" aria-label="Líneas de innovación y criterios de trabajo">
      <div className="v516-garden-column v523-garden-board__main">
        <header className="v516-garden-column__head">
          <span className="v54-eyebrow">01 / Qué cultivamos</span>
          <h3>Líneas que estamos haciendo crecer</h3>
          <p>Cuatro ámbitos donde transformamos preguntas y capacidades existentes en oportunidades de innovación aplicada.</p>
        </header>
        <div className="v530-garden-choices" aria-label="Explorar líneas de innovación">
          {cultivationAreas.map((item, index) => {
            const isOpen = openArea === index;
            return (
              <button
                key={item.title}
                type="button"
                className={`v530-garden-choice ${isOpen ? 'is-active' : ''}`}
                aria-expanded={isOpen}
                aria-controls="garden-area-detail"
                onClick={() => setOpenArea((current) => current === index ? null : index)}
              >
                <span className="v530-garden-choice__icon"><Icon name={item.icon} /></span>
                <span className="v530-garden-choice__content"><small>0{index + 1}</small><strong>{item.title}</strong></span>
                <span className="v530-garden-choice__arrow" aria-hidden="true"><Icon name={isOpen ? 'expand_less' : 'north_east'} /></span>
              </button>
            );
          })}
        </div>
        <div id="garden-area-detail" className="v530-garden-detail" role="region" aria-label="Detalle de la línea seleccionada" hidden={openArea === null}>
          {openArea !== null && <>
            <span className="v530-garden-detail__label">Explorando · 0{openArea + 1}</span>
            <h4>{cultivationAreas[openArea].title}</h4>
            <p>{cultivationAreas[openArea].text}</p>
          </>}
        </div>
      </div>
      <aside className="v516-garden-column v523-garden-board__aside" aria-label="Criterios que orientan las intervenciones">
        <header className="v516-garden-column__head">
          <span className="v54-eyebrow">02 / Nuestro criterio</span>
          <h3>Cómo cuidamos una intervención</h3>
          <p>No es un catálogo de servicios: estos principios orientan qué vale la pena hacer y hasta dónde intervenir.</p>
        </header>
        <div className="v516-garden-column__buttons v523-garden-principles">
          {laboratoryPrinciples.map((item, index) => {
            const key = `principle-${index}`;
            const isOpen = openPrinciple === index;
            return (
              <article key={item.title} className={`v516-garden-button v523-garden-principle ${isOpen ? 'is-open' : ''}`}>
                <button type="button" onClick={() => setOpenPrinciple((current) => current === index ? null : index)} aria-expanded={isOpen} aria-controls={key}>
                  <span className="v516-garden-button__icon"><Icon name={item.icon} /></span>
                  <strong>{item.title}</strong>
                  <Icon name={isOpen ? 'expand_less' : 'expand_more'} />
                </button>
                <div id={key} className="v516-garden-button__panel" hidden={!isOpen}><p>{item.text}</p></div>
              </article>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 04C · CÓMO TRABAJA METAMORFOSIS · DOS CAPAS, DOS LÓGICAS
//      1) Qué observamos  2) Cómo trabajamos
//      Cada concepto despliega su propia explicación debajo del título.
// -----------------------------------------------------------------------------
function IntegratedMethodSection() {
  const [openDimensions, setOpenDimensions] = useState(() => new Set());
  const [openStep, setOpenStep] = useState(null);

  const toggleInSet = (setter, key) => setter((current) => {
    const next = new Set(current);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  return (
    <div id="metodo" className="v516-work v532-method" aria-labelledby="v516-work-title">
      <div className="v516-work__shell">
        <div className="v520-method-layout v524-method-composition v525-method-composition">
          <header className="v516-work__head v525-method-heading">
            <span className="v54-kicker">Cómo trabaja Metamorfosis</span>
            <h2 id="v516-work-title">Cómo convertimos evidencia en acción</h2>
            <p>Cuatro dimensiones que se relacionan; cinco etapas para entender, delimitar, probar, medir y transferir. Selecciona cada elemento para profundizar.</p>
          </header>
          <div className="v516-map v529-system-map" aria-label="Sistema de relaciones de Metamorfosis">
          <svg className="v529-system-links" viewBox="0 0 1000 390" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className="v529-system-links__track" d="M215 95 C340 95 352 157 500 192 C648 157 660 95 785 95 M215 295 C340 295 352 230 500 192 C648 230 660 295 785 295" />
            <path className="v529-system-links__energy" d="M215 95 C340 95 352 157 500 192 C648 157 660 95 785 95 M215 295 C340 295 352 230 500 192 C648 230 660 295 785 295" />
          </svg>
          {transformationPillars.map((item, index) => {
            const isOpen = openDimensions.has(item.id);
            const positions = ['operation','people','environment','conditions'];
            return (
              <article key={item.id} className={`v516-lens v516-lens--${positions[index]} ${isOpen ? 'is-open' : ''}`}>
                <button type="button" className="v516-lens__trigger" onClick={() => toggleInSet(setOpenDimensions, item.id)} aria-expanded={isOpen} aria-controls={`lens-${item.id}`}>
                  <span className="v516-lens__icon"><Icon name={item.icon} /></span>
                  <span className="v532-lens-label"><strong>{item.title}</strong><small>{item.short}</small></span>
                  <Icon name={isOpen ? 'expand_less' : 'expand_more'} />
                </button>
                <div id={`lens-${item.id}`} className="v516-lens__panel" hidden={!isOpen}>
                  <small>{item.signal}</small><p>{item.text}</p>
                </div>
              </article>
            );
          })}
          <div className="v516-core v529-core">
            <span className="v529-core__orbit" aria-hidden="true" />
            <span className="v529-core__orbit v529-core__orbit--outer" aria-hidden="true" />
            <img src="/logo-metamorfosis-transparente.png" alt="" aria-hidden="true" />
            <strong>Metamorfosis</strong>
            <small>Investigación · innovación aplicada</small>
            <span className="v529-core__signal" aria-hidden="true"><i/><i/><i/></span>
          </div>
          </div>

          <div className="v516-method">
            <div className="v516-method__head"><span className="v54-eyebrow">Del análisis a la acción</span><h3>Cinco etapas</h3><p>Una secuencia flexible para convertir lo observado en decisiones y aprendizajes.</p></div>
          <div className="v516-method__grid">
            {processRoadmap.map((item, index) => {
              const key = `step-${index}`;
              const isOpen = openStep === key;
              return (
                <article key={item.title} className={`v516-step ${isOpen ? 'is-open' : ''}`}>
                  <button type="button" className="v516-step__trigger" onClick={() => setOpenStep((current) => current === key ? null : key)} aria-expanded={isOpen} aria-controls={key}>
                    <span className="v516-step__number">0{index + 1}</span>
                    <span className="v516-step__icon"><Icon name={item.icon} /></span>
                    <span className="v532-step-label"><strong>{item.title}</strong><small>{item.eyebrow}</small></span>
                    <Icon name={isOpen ? 'expand_less' : 'expand_more'} />
                  </button>
                  <div id={key} className="v516-step__panel" hidden={!isOpen}><small>{item.eyebrow}</small><p>{item.text}</p></div>
                </article>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
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
function PrinciplesSection() { return null; }

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
    <div className="public-site public-site--v532 public-site--lab public-site--audit public-site--v49 public-site--v50 public-site--v54 public-site--v56 public-site--v58 public-site--v59 public-site--v510 public-site--v511 public-site--v512 public-site--v513 public-site--v514 public-site--v515 public-site--v516 public-site--v517 public-site--v518 public-site--v519 public-site--v520 public-site--v521 public-site--v522 public-site--v523 public-site--v524 public-site--v525 public-site--v526 public-site--v527 public-site--v528 public-site--v529 public-site--v530 public-site--v531 public-site--v534 public-site--v535 public-site--v536 public-site--v537 public-site--v539 public-site--v540 public-site--v541 public-site--v542 public-site--v543 public-site--v544">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PublicHeader />
      <main id="contenido">
        {/* 05.1 · INICIO / HERO · Promesa + definición breve del jardín de innovación */}
        <section id="inicio" className="v54-hero section-anchor" style={{ '--section-image': `url(${heroImage})` }} onPointerMove={handleHeroMove}>
          <div className="v54-hero__shade" aria-hidden="true" />
          <div className="v54-hero__glow" aria-hidden="true" />
          <div className="shell v515-hero">
            <header className="v515-hero__headline">
              <span className="v54-kicker">METAMORFOSIS LAB</span>
              <h1>Investigación e innovación aplicada</h1>
              <p className="v531-hero__origin">Desde la Región del Biobío</p>
            </header>
            <div className="v532-hero-content">
              <div className="v532-hero-note">
                <span className="v54-eyebrow">Nuestro punto de partida</span>
                <p>Investigamos organizaciones, actividades productivas y territorios desde sus condiciones reales. Combinamos evidencia, mapeo, entrevistas y conocimiento técnico para comprender sus relaciones, reconocer capacidades y desarrollar soluciones aplicables, evaluables y responsables con las personas y los sistemas vivos.</p>
                <strong>Primero comprendemos. Después diseñamos, probamos y medimos.</strong>
              </div>
              <div className="hero__actions">
                <SectionLink className="button audit-primary-cta" id="contacto">Conversemos</SectionLink>
                <SectionLink className="button button--ghost-light" id="propuesta">Explorar la propuesta</SectionLink>
              </div>
            </div>
          </div>
        </section>

        {/* Una escena editorial: información esencial visible; profundidad opcional. */}
        <ProposalSection />

        {/* La complementariedad técnica se explica antes de mostrar los dos perfiles. */}
        <section id="equipo" className="v59-team v534-team section-anchor">
          <div className="shell v534-team__layout">
            <div className="v534-team__intro">
              <span className="v54-kicker">Equipo</span>
              <h2>Ingeniería y derecho en diálogo</h2>
              <p>La ingeniería permite estudiar procesos, información y condiciones reales de operación; el derecho aporta una lectura de responsabilidades, exigencias y relaciones institucionales. Trabajar ambas perspectivas en conjunto nos ayuda a identificar decisiones técnicamente viables, responsables y ajustadas a cada contexto.</p>
            </div>
            <div className="v534-team__profiles"><TeamSection /></div>
          </div>
        </section>

        {/* 05.9 · CONTACTO · Apertura de conversación */}
        <section id="contacto" className="audit-scene audit-scene--dark audit-contact section-anchor v54-contact" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="audit-scene__shade" aria-hidden="true" />
          <div className="shell audit-contact__grid">
            <div className="audit-contact__intro">
              <span className="kicker">Conversemos</span>
              <h2>Cuéntanos tu desafío</h2>
              <p>Podemos comenzar con una necesidad concreta, una pregunta abierta o una oportunidad por explorar.</p>
              <div className="audit-contact__facts" aria-label="Modalidades de contacto">
                <span><Icon name="schedule" /><span className="v525-contact-fact__copy"><strong>30 minutos</strong><small>Primera conversación</small></span></span>
                <span><Icon name="mail" /><span className="v525-contact-fact__copy"><strong>Correo formal</strong><small>{contact.email}</small></span></span>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      {/* 05.10 · FOOTER · Cierre institucional */}
      <footer className="site-footer audit-footer v54-footer">
        <div className="shell audit-footer__grid">
          <div className="site-footer__brand"><Brand /><p>Investigación e innovación aplicada. Concepción · Región del Biobío.</p></div>
          <div><span className="footer-title">Navegación</span><SectionLink id="inicio">Inicio</SectionLink><SectionLink id="propuesta">Propuesta</SectionLink><SectionLink id="equipo">Equipo</SectionLink><SectionLink id="contacto">Contacto</SectionLink></div>
          <div><span className="footer-title">Contacto</span><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a><a className="footer-icon-link" href={OS_SITE_URL}><Icon name="lock" /><span>Acceso OS</span></a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis</span><span>Concepción · Región del Biobío · Chile</span></div>
      </footer>
    </div>
  );
}

export default PublicSite;
