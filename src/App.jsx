import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/hero-proyectos.webp';
import systemImage from './assets/images/sistema-digital.webp';
import methodImage from './assets/images/trabajo-metodo.webp';
import { contact, services, methodSteps, initialProjects, documents } from './data.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="/" aria-label="Metamorfosis Lab, ir al inicio">
      <span className="brand-mark" aria-hidden="true">
        <span>M</span>
      </span>
      <span className="brand-copy">
        <strong>Metamorfosis</strong>
        <small>LAB</small>
      </span>
    </a>
  );
}

function IconButton({ label, icon, onClick, className = '', type = 'button' }) {
  return (
    <button type={type} className={`icon-button ${className}`} onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} />
    </button>
  );
}

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    ['servicios', 'Qué hacemos'],
    ['trayectoria', 'Trayectoria'],
    ['mapa', 'El Mapa'],
    ['metodo', 'Cómo trabajamos'],
    ['contacto', 'Contacto']
  ];

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Brand />
        <nav className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          {links.map(([id, label]) => (
            <button type="button" key={id} onClick={() => goTo(id)}>{label}</button>
          ))}
          <a className="button button--small" href="#contacto" onClick={() => setOpen(false)}>Conversar</a>
        </nav>
        <IconButton
          className="menu-button"
          label={open ? 'Cerrar menú' : 'Abrir menú'}
          icon={open ? 'close' : 'menu'}
          onClick={() => setOpen((value) => !value)}
        />
      </div>
    </header>
  );
}

function WhatsappFloating() {
  const message = encodeURIComponent('Hola, conocí Metamorfosis Lab a través de su página. Tengo un proyecto o pyme que necesito ordenar y quisiera solicitar una conversación inicial.');
  return (
    <a
      className="whatsapp-floating"
      href={`${waBase}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Conversar con Metamorfosis Lab por WhatsApp al ${contact.phoneDisplay}`}
    >
      <img src="/assets/icons/whatsapp.svg" alt="" width="28" height="28" />
      <span>WhatsApp</span>
    </a>
  );
}

function SectionHeading({ kicker, title, description, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function QuoteWizard() {
  const empty = {
    serviceType: '',
    projectStage: '',
    desiredDate: '',
    teamSize: '',
    details: '',
    contactName: '',
    company: '',
    city: '',
    email: '',
    phone: '',
    preferredContact: 'WhatsApp'
  };
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: 'idle', message: '', waUrl: '' });

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const stepValid = useMemo(() => {
    if (step === 1) return Boolean(form.serviceType);
    if (step === 2) return Boolean(form.details.trim());
    return Boolean(form.contactName.trim() && form.phone.trim());
  }, [form, step]);

  const whatsappMessage = useMemo(() => {
    const lines = [
      'Hola, quiero conversar con Metamorfosis Lab.',
      '',
      `Tipo de apoyo: ${form.serviceType || 'Por definir'}`,
      `Etapa del proyecto: ${form.projectStage || 'No indicada'}`,
      `Plazo esperado: ${form.desiredDate || 'Por conversar'}`,
      `Equipo: ${form.teamSize || 'No indicado'}`,
      `Proyecto o empresa: ${form.company || 'No indicado'}`,
      `Ciudad: ${form.city || 'No indicada'}`,
      `Necesidad principal: ${form.details || 'Por explicar'}`,
      '',
      `Contacto: ${form.contactName}`,
      `Teléfono: ${form.phone}`,
      `Correo: ${form.email || 'No indicado'}`
    ];
    return encodeURIComponent(lines.join('\n'));
  }, [form]);

  const submit = async (event) => {
    event.preventDefault();
    if (!stepValid) return;
    setStatus({ type: 'loading', message: 'Preparando tu solicitud…', waUrl: '' });
    let saved = false;
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      saved = response.ok && payload.saved !== false;
    } catch {
      saved = false;
    }
    const waUrl = `${waBase}?text=${whatsappMessage}`;
    setStatus({
      type: 'success',
      message: saved
        ? 'La solicitud quedó registrada. Completa el contacto enviando el mensaje por WhatsApp.'
        : 'La solicitud quedó preparada. Envía el mensaje por WhatsApp para completar el contacto.',
      waUrl
    });
  };

  if (status.type === 'success') {
    return (
      <div className="quote-confirmation" role="status" aria-live="polite">
        <span className="confirmation-icon"><Icon name="check_circle" /></span>
        <h3>Solicitud preparada</h3>
        <p>{status.message}</p>
        <a className="button" href={status.waUrl} target="_blank" rel="noreferrer">
          <img src="/assets/icons/whatsapp.svg" alt="" width="20" height="20" />
          Abrir WhatsApp
        </a>
        <button
          type="button"
          className="text-button"
          onClick={() => { setStatus({ type: 'idle', message: '', waUrl: '' }); setStep(1); setForm(empty); }}
        >
          Ingresar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form className="quote-wizard" onSubmit={submit} noValidate>
      <div className="wizard-progress" aria-label={`Paso ${step} de 3`}>
        {[1, 2, 3].map((number) => (
          <span key={number} className={number <= step ? 'is-active' : ''}>
            <b>{number}</b>
            <small>{number === 1 ? 'Necesidad' : number === 2 ? 'Contexto' : 'Contacto'}</small>
          </span>
        ))}
      </div>

      {step === 1 && (
        <fieldset className="wizard-step">
          <legend>¿Qué necesitas ordenar o transformar?</legend>
          <div className="choice-grid">
            {[
              ['Mapa de Transformación y Activos', 'Comprender el estado actual y priorizar una ruta.'],
              ['Proyecto Base', 'Ordenar procesos, roles, documentos y registros.'],
              ['Proyecto Forma', 'Trabajar identidad, web, comunicación o experiencia.'],
              ['Proyecto Activo', 'Reconocer activos, productos derivados o nuevas unidades.'],
              ['Aún no lo sé', 'Necesito explicar el problema antes de elegir una ruta.']
            ].map(([title, text]) => (
              <label key={title} className={`choice-card ${form.serviceType === title ? 'is-selected' : ''}`}>
                <input type="radio" name="serviceType" value={title} checked={form.serviceType === title} onChange={update} />
                <span className="choice-indicator" aria-hidden="true" />
                <strong>{title}</strong>
                <small>{text}</small>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="wizard-step">
          <legend>Cuéntanos el contexto esencial</legend>
          <div className="form-grid form-grid--two">
            <label>
              Etapa del proyecto
              <select name="projectStage" value={form.projectStage} onChange={update}>
                <option value="">Seleccionar</option>
                <option>Idea en definición</option>
                <option>Proyecto iniciando</option>
                <option>Negocio funcionando</option>
                <option>Proceso de crecimiento</option>
                <option>Necesita reorganización</option>
              </select>
            </label>
            <label>
              Plazo o fecha esperada
              <input type="text" name="desiredDate" value={form.desiredDate} onChange={update} placeholder="Ej.: durante agosto" />
            </label>
            <label>
              Personas involucradas
              <select name="teamSize" value={form.teamSize} onChange={update}>
                <option value="">Seleccionar</option>
                <option>Trabajo individual</option>
                <option>2 a 5 personas</option>
                <option>6 a 15 personas</option>
                <option>Más de 15 personas</option>
              </select>
            </label>
            <label className="form-field--wide">
              ¿Qué está ocurriendo y qué necesitas resolver?
              <textarea name="details" value={form.details} onChange={update} rows="5" required maxLength="1800" placeholder="Describe brevemente el desorden, oportunidad o decisión que necesitas abordar." />
            </label>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="wizard-step">
          <legend>Datos para continuar la conversación</legend>
          <div className="form-grid form-grid--two">
            <label>
              Nombre
              <input type="text" name="contactName" value={form.contactName} onChange={update} required autoComplete="name" />
            </label>
            <label>
              Empresa o proyecto
              <input type="text" name="company" value={form.company} onChange={update} autoComplete="organization" />
            </label>
            <label>
              Ciudad o comuna
              <input type="text" name="city" value={form.city} onChange={update} autoComplete="address-level2" />
            </label>
            <label>
              WhatsApp o teléfono
              <input type="tel" name="phone" value={form.phone} onChange={update} required autoComplete="tel" placeholder="+56 9…" />
            </label>
            <label>
              Correo
              <input type="email" name="email" value={form.email} onChange={update} autoComplete="email" />
            </label>
            <label>
              Medio preferido
              <select name="preferredContact" value={form.preferredContact} onChange={update}>
                <option>WhatsApp</option>
                <option>Correo</option>
                <option>Llamada</option>
              </select>
            </label>
          </div>
          <p className="form-note">Usaremos estos datos únicamente para responder esta solicitud y dar seguimiento al proceso comercial.</p>
        </fieldset>
      )}

      <div className="wizard-actions">
        {step > 1 && <button type="button" className="button button--ghost" onClick={() => setStep((value) => value - 1)}>Atrás</button>}
        {step < 3 ? (
          <button type="button" className="button" disabled={!stepValid} onClick={() => setStep((value) => value + 1)}>
            Continuar <Icon name="arrow_forward" />
          </button>
        ) : (
          <button type="submit" className="button" disabled={!stepValid || status.type === 'loading'}>
            {status.type === 'loading' ? 'Preparando…' : 'Preparar solicitud'}
            <Icon name="send" />
          </button>
        )}
      </div>
    </form>
  );
}

function PublicSite() {
  return (
    <div className="public-site">
      <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="hero section-anchor">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <span className="kicker">Laboratorio de transformación aplicada · Biobío</span>
              <h1>Hacemos que lo valioso sobreviva a la improvisación.</h1>
              <p>Ayudamos a proyectos y pymes con valor real a convertir conocimiento disperso en sistemas, activos y decisiones que puedan sostenerse.</p>
              <div className="hero__actions">
                <a className="button" href="#contacto">Solicitar conversación inicial</a>
                <a className="button button--ghost" href="#mapa">Conocer el Mapa</a>
              </div>
              <div className="hero__proof" aria-label="Principales resultados del proceso">
                <span><Icon name="description" /> Documentación útil</span>
                <span><Icon name="schema" /> Procesos claros</span>
                <span><Icon name="query_stats" /> Decisiones con evidencia</span>
              </div>
            </div>
            <figure className="hero__media">
              <img
                src={heroImage}
                alt="Equipo de trabajo revisando planos y documentos alrededor de una mesa"
                width="1280"
                height="800"
                fetchPriority="high"
              />
              <figcaption>
                <span>De la intuición a la forma</span>
                <strong>Observar · ordenar · sistematizar</strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="servicios" className="section section-screen section-anchor">
          <div className="shell">
            <SectionHeading
              kicker="Qué hacemos"
              title="No vendemos piezas aisladas. Construimos una transición completa."
              description="Una web, un documento o una automatización pueden ser parte de la solución, pero siempre deben responder a un problema real del proyecto."
            />
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <span className="service-card__icon"><Icon name={service.icon} /></span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trayectoria" className="section section-screen section-anchor section--tint">
          <div className="shell split-layout">
            <div className="split-layout__media">
              <img src={systemImage} alt="Profesionales trabajando con computadores y revisando información de un proyecto" width="1280" height="853" loading="lazy" />
            </div>
            <div className="split-layout__copy">
              <SectionHeading
                kicker="Trayectoria en construcción"
                title="Metamorfosis nace desde operaciones reales, no desde una promesa abstracta."
              />
              <p>El laboratorio integra experiencia en control de gestión, planificación, operación, documentación técnica, diseño de sistemas y desarrollo digital aplicado a pymes.</p>
              <div className="timeline-mini">
                <div><b>01</b><span><strong>Experiencia operacional</strong>Control, procesos, indicadores y mejora.</span></div>
                <div><b>02</b><span><strong>Primer caso vivo</strong>Consolidación de CM Banquetería como prueba aplicada.</span></div>
                <div><b>03</b><span><strong>Método propio</strong>Herramientas replicables para comprender, ejecutar y medir.</span></div>
              </div>
              <p className="callout">CM se comunica como un caso en construcción: muestra el recorrido y las herramientas creadas, sin inflar resultados todavía no medidos.</p>
            </div>
          </div>
        </section>

        <section id="mapa" className="section section-screen section-anchor section--dark">
          <div className="shell map-layout">
            <div>
              <SectionHeading
                kicker="Puerta de entrada"
                title="Mapa de Transformación y Activos"
                description="Un diagnóstico accionable para entender qué existe, qué está en riesgo, qué valor permanece oculto y qué conviene hacer primero."
              />
              <a className="button button--light" href="#contacto">Evaluar mi proyecto</a>
            </div>
            <div className="map-board" aria-label="Dimensiones del Mapa de Transformación y Activos">
              {[
                ['storefront', 'Proyecto e identidad'],
                ['settings', 'Operación y roles'],
                ['payments', 'Economía y caja'],
                ['database', 'Datos y tecnología útil'],
                ['recycling', 'Recursos y circularidad'],
                ['copyright', 'Activos intangibles'],
                ['warning', 'Riesgos y dependencias'],
                ['route', 'Ruta de transformación']
              ].map(([icon, label], index) => (
                <div key={label} style={{ '--delay': `${index * 35}ms` }}>
                  <Icon name={icon} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="section section-screen section-anchor">
          <div className="shell method-layout">
            <div className="method-layout__copy">
              <SectionHeading
                kicker="Cómo trabajamos"
                title="Un método visible, trazable y adaptable."
                description="Cada etapa debe dejar una decisión, una herramienta, una evidencia o una capacidad instalada."
              />
              <div className="method-steps">
                {methodSteps.map(([icon, title, text], index) => (
                  <article key={title}>
                    <span className="method-number">{String(index + 1).padStart(2, '0')}</span>
                    <Icon name={icon} />
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </article>
                ))}
              </div>
            </div>
            <figure className="method-layout__media">
              <img src={methodImage} alt="Personas tomando notas y revisando documentos durante una sesión de trabajo" width="1280" height="857" loading="lazy" />
              <figcaption>Comprensión antes que tecnología. Criterio antes que automatización.</figcaption>
            </figure>
          </div>
        </section>

        <section id="contacto" className="section section-anchor contact-section">
          <div className="shell contact-layout">
            <div className="contact-intro">
              <SectionHeading
                kicker="Conversación inicial"
                title="Cuéntanos qué valor existe y qué necesita forma."
                description="La primera conversación busca comprender el problema, evaluar encaje y definir si corresponde comenzar por un Mapa o por una intervención acotada."
              />
              <div className="contact-links">
                <a href={`${waBase}?text=${encodeURIComponent('Hola, quisiera solicitar una conversación inicial con Metamorfosis Lab.')}`} target="_blank" rel="noreferrer">
                  <img src="/assets/icons/whatsapp.svg" alt="" width="22" height="22" />
                  <span><small>WhatsApp</small><strong>{contact.phoneDisplay}</strong></span>
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Icon name="mail" />
                  <span><small>Correo</small><strong>{contact.email}</strong></span>
                </a>
                <div>
                  <Icon name="location_on" />
                  <span><small>Territorio</small><strong>{contact.coverage}</strong></span>
                </div>
              </div>
            </div>
            <QuoteWizard />
          </div>
        </section>

        <section id="ubicacion" className="location-strip section-anchor">
          <div className="shell location-strip__inner">
            <div>
              <span className="kicker">Cómo trabajamos territorialmente</span>
              <h2>Desde Biobío, con atención presencial coordinada y trabajo remoto.</h2>
            </div>
            <div className="location-details">
              <span><Icon name="public" /> {contact.location}</span>
              <span><Icon name="schedule" /> Reuniones con coordinación previa</span>
              <span><Icon name="videocam" /> Atención remota disponible</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div><Brand /><p>Dar forma y proyección a proyectos con sentido.</p></div>
          <div><span className="footer-title">Contacto</span><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`${waBase}`}>{contact.phoneDisplay}</a></div>
          <div><span className="footer-title">Ubicación</span><p>Región del Biobío · Chile</p><p>Atención presencial y remota.</p></div>
          <div><span className="footer-title">Interno</span><a href="/admin">Acceso Metamorfosis OS</a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Transformación aplicada con criterio humano.</span></div>
      </footer>
      <WhatsappFloating />
    </div>
  );
}

const adminMenu = [
  {
    group: 'Panel diario',
    items: [
      ['dashboard', 'Inicio', 'dashboard'],
      ['today', 'Operación diaria', 'daily']
    ]
  },
  {
    group: 'Comercial',
    items: [
      ['handshake', 'Oportunidades', 'quotes'],
      ['request_quote', 'Cotizaciones', 'commercial']
    ]
  },
  {
    group: 'Compras y recursos',
    items: [
      ['payments', 'Gastos', 'expenses'],
      ['inventory_2', 'Insumos / stock', 'stock'],
      ['local_shipping', 'Proveedores', 'suppliers']
    ]
  },
  {
    group: 'Gestión interna',
    items: [
      ['account_tree', 'Proyectos', 'projects'],
      ['copyright', 'Activos', 'assets'],
      ['query_stats', 'Medidas e indicadores', 'metrics']
    ]
  },
  {
    group: 'Documentos',
    items: [
      ['folder_open', 'Repositorio', 'documents'],
      ['library_books', 'Biblioteca metodológica', 'library']
    ]
  },
  {
    group: 'Proceso temporal',
    items: [
      ['conversion_path', 'Consultoría / consolidación', 'consulting']
    ]
  }
];

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'No fue posible iniciar sesión.');
      onLogin(payload);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <a className="skip-link" href="#login-form">Saltar al formulario de acceso</a>
      <div className="admin-login__card">
        <Brand />
        <div className="admin-login__heading">
          <span className="kicker">Metamorfosis OS</span>
          <h1>Acceso interno</h1>
          <p>Panel de proyectos, oportunidades, documentos, medidas y activos.</p>
        </div>
        <form id="login-form" onSubmit={submit}>
          <label>Correo institucional<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="username" /></label>
          <label>Contraseña<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required autoComplete="current-password" /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button--full" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar'} <Icon name="login" /></button>
        </form>
        <a className="admin-login__back" href="/"><Icon name="arrow_back" /> Volver al sitio público</a>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, note, tone = '' }) {
  return (
    <article className={`metric-card ${tone ? `metric-card--${tone}` : ''}`}>
      <span className="metric-card__icon"><Icon name={icon} /></span>
      <div><small>{label}</small><strong>{value}</strong><span>{note}</span></div>
    </article>
  );
}

function DashboardView({ quoteCount }) {
  return (
    <div className="admin-view">
      <div className="admin-view__heading"><div><span className="kicker">Panel diario</span><h1>Inicio</h1><p>Lo que necesita atención hoy, sin mezclarlo con procesos de largo plazo.</p></div><button className="button button--small"><Icon name="add" /> Nueva acción</button></div>
      <div className="metrics-grid">
        <MetricCard icon="request_quote" label="Cotizaciones pendientes" value={quoteCount || 3} note="2 requieren respuesta" tone="accent" />
        <MetricCard icon="payments" label="Gastos del mes" value="$286.400" note="Dentro del presupuesto" />
        <MetricCard icon="inventory_2" label="Stock crítico" value="2" note="Impresos y materiales" tone="warning" />
        <MetricCard icon="feedback" label="Observaciones abiertas" value="5" note="1 de prioridad alta" />
        <MetricCard icon="videocam" label="Videos activos" value="1" note="Caso CM en edición" />
        <MetricCard icon="event_busy" label="Documentos por vencer" value="2" note="Durante los próximos 15 días" tone="danger" />
      </div>
      <div className="dashboard-grid">
        <section className="panel-card panel-card--wide">
          <div className="panel-card__heading"><div><span className="kicker">Prioridades</span><h2>Próximas acciones</h2></div><button className="text-button">Ver agenda</button></div>
          <div className="task-list">
            {[
              ['Hoy', 'Cerrar matriz de medidas de CM', 'Consultoría CM', 'Alta'],
              ['Mañana', 'Revisar ficha de investigación previa', 'Método', 'Media'],
              ['18 jul', 'Enviar propuesta de Mapa inicial', 'Comercial', 'Alta'],
              ['20 jul', 'Ordenar documentos del proyecto', 'Metamorfosis OS', 'Normal']
            ].map(([date, task, project, priority]) => (
              <div key={task}><span className="task-date">{date}</span><div><strong>{task}</strong><small>{project}</small></div><span className={`status-badge status-badge--${priority.toLowerCase()}`}>{priority}</span><IconButton label={`Ver ${task}`} icon="chevron_right" /></div>
            ))}
          </div>
        </section>
        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Alertas</span><h2>Requiere decisión</h2></div></div>
          <div className="alert-list">
            <div><Icon name="warning" /><span><strong>Propiedad de activo</strong><small>Definir titularidad de molde y diseño.</small></span></div>
            <div><Icon name="schedule" /><span><strong>Seguimiento comercial</strong><small>Oportunidad sin contacto hace 5 días.</small></span></div>
            <div><Icon name="description" /><span><strong>Documento incompleto</strong><small>Falta evidencia de validación del cliente.</small></span></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DailyView() {
  return (
    <div className="admin-view">
      <div className="admin-view__heading"><div><span className="kicker">Operación diaria</span><h1>Agenda y ejecución</h1><p>Acciones concretas ordenadas por fecha, proyecto y prioridad.</p></div><button className="button button--small"><Icon name="add_task" /> Registrar tarea</button></div>
      <section className="panel-card">
        <div className="filter-row"><button className="filter-chip is-active">Hoy</button><button className="filter-chip">Esta semana</button><button className="filter-chip">Pendientes</button><div className="filter-spacer" /><label className="search-field"><Icon name="search" /><input aria-label="Buscar tareas" placeholder="Buscar tarea o proyecto" /></label></div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Fecha</th><th>Acción</th><th>Proyecto</th><th>Responsable</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
            <tbody>
              {[
                ['16 jul', 'Revisar matriz sanitaria', 'CM', 'Francisca', 'En curso'],
                ['16 jul', 'Preparar investigación previa', 'Método', 'Benjamín', 'Pendiente'],
                ['17 jul', 'Validar formulario web', 'Metamorfosis', 'Francisca', 'Pendiente'],
                ['18 jul', 'Enviar propuesta comercial', 'Prospecto', 'Francisca', 'Programada']
              ].map((row) => <tr key={row[1]}>{row.map((cell, index) => <td key={cell}>{index === 4 ? <span className="status-badge">{cell}</span> : cell}</td>)}<td className="table-actions"><IconButton label="Ver" icon="visibility" /><IconButton label="Editar" icon="edit" /><IconButton label="Borrar" icon="delete" /></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function QuotesView({ quotes, loading }) {
  const rows = quotes.length ? quotes : [
    { id: 'demo-1', created_at: '2026-07-16', contact_name: 'Empresa de ejemplo', company: 'Proyecto territorial', service_type: 'Mapa de Transformación y Activos', city: 'Biobío', phone: '+56 9 0000 0000', status: 'nueva' },
    { id: 'demo-2', created_at: '2026-07-15', contact_name: 'Emprendimiento local', company: 'Marca de alimentos', service_type: 'Proyecto Base', city: 'Los Ángeles', phone: '+56 9 0000 0000', status: 'evaluacion' }
  ];
  return (
    <div className="admin-view">
      <div className="admin-view__heading"><div><span className="kicker">Comercial</span><h1>Oportunidades y cotizaciones</h1><p>Consultas públicas convertidas en registros con próxima acción y estado.</p></div><button className="button button--small"><Icon name="person_add" /> Nueva oportunidad</button></div>
      <section className="panel-card">
        <div className="filter-row"><button className="filter-chip is-active">Todas</button><button className="filter-chip">Nuevas</button><button className="filter-chip">En evaluación</button><button className="filter-chip">Propuesta</button><div className="filter-spacer" /><span className="data-note">{loading ? 'Cargando…' : `${rows.length} registros visibles`}</span></div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Ingreso</th><th>Contacto</th><th>Necesidad</th><th>Ciudad</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
            <tbody>
              {rows.map((quote) => (
                <tr key={quote.id}>
                  <td>{new Date(quote.created_at).toLocaleDateString('es-CL')}</td>
                  <td><strong>{quote.contact_name}</strong><small>{quote.company || quote.phone}</small></td>
                  <td>{quote.service_type}</td>
                  <td>{quote.city || 'Sin indicar'}</td>
                  <td><span className="status-badge">{quote.status || 'nueva'}</span></td>
                  <td className="table-actions"><a className="icon-button" aria-label={`Contactar a ${quote.contact_name} por WhatsApp`} title="WhatsApp" href={`https://wa.me/${String(quote.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><img src="/assets/icons/whatsapp.svg" alt="" width="18" height="18" /></a><IconButton label="Ver oportunidad" icon="visibility" /><IconButton label="Editar oportunidad" icon="edit" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ProjectsView() {
  return (
    <div className="admin-view">
      <div className="admin-view__heading"><div><span className="kicker">Gestión interna</span><h1>Proyectos</h1><p>Etapas, hitos, entregables y evidencia en una lectura compacta.</p></div><button className="button button--small"><Icon name="add" /> Nuevo proyecto</button></div>
      <div className="project-grid">
        {initialProjects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className="project-card__top"><span className="status-badge">{project.status}</span><div className="table-actions"><IconButton label={`Ver ${project.name}`} icon="visibility" /><IconButton label={`Editar ${project.name}`} icon="edit" /></div></div>
            <span className="kicker">{project.client}</span>
            <h2>{project.name}</h2>
            <p>{project.stage}</p>
            <div className="progress-row"><span>Avance documentado</span><strong>{project.progress}%</strong></div>
            <div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div>
            <div className="next-action"><Icon name="arrow_forward" /><span><small>Próxima acción</small><strong>{project.next}</strong></span></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="admin-view">
      <div className="admin-view__heading"><div><span className="kicker">Documentos</span><h1>Repositorio por origen</h1><p>Separación visible entre operación, administración, método y procesos consultivos.</p></div><button className="button button--small"><Icon name="note_add" /> Generar documento</button></div>
      <div className="document-columns">
        {Object.entries(documents).map(([category, items]) => (
          <section className="document-category" key={category}>
            <div className="document-category__heading"><Icon name={category.includes('Consultoría') ? 'conversion_path' : category === 'Metodológicos' ? 'science' : category === 'Administrativos' ? 'business_center' : 'folder'} /><div><h2>{category}</h2><small>{items.length} documentos base</small></div></div>
            <div className="document-list">
              {items.map((item) => <div key={item}><span><Icon name="description" /><strong>{item}</strong></span><div><IconButton label={`Ver ${item}`} icon="visibility" /><IconButton label={`Descargar ${item}`} icon="download" /><IconButton label={`Editar ${item}`} icon="edit" /></div></div>)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function GenericView({ active }) {
  const content = {
    commercial: ['Cotizaciones', 'Propuestas, valores, entregables, hitos y seguimiento comercial.'],
    expenses: ['Gastos', 'Registro de compras, reembolsos, costos por proyecto y comprobantes.'],
    stock: ['Insumos y stock', 'Materiales de impresión, prototipos, equipos y recursos críticos.'],
    suppliers: ['Proveedores', 'Contactos, categorías, condiciones, documentos y evaluación.'],
    assets: ['Activos intangibles', 'Marcas, métodos, diseños, experiencias, software y know-how.'],
    metrics: ['Medidas e indicadores', 'Línea base, meta, fórmula, fuente, frecuencia y resultado.'],
    library: ['Biblioteca metodológica', 'Herramientas oficiales, versiones, instrucciones y aprendizajes.'],
    consulting: ['Consultoría y consolidación', 'Proceso temporal al final del menú, separado de la operación permanente.']
  }[active] || ['Módulo', 'Vista interna en preparación.'];
  return (
    <div className="admin-view">
      <div className="admin-view__heading"><div><span className="kicker">Metamorfosis OS</span><h1>{content[0]}</h1><p>{content[1]}</p></div><button className="button button--small"><Icon name="add" /> Nuevo registro</button></div>
      <section className="panel-card empty-state"><span><Icon name="construction" /></span><h2>Estructura lista para conectar datos reales</h2><p>Este módulo conserva la jerarquía, acciones e interfaz definidas. La persistencia final debe conectarse a la base de datos del proyecto.</p><button className="button button--ghost">Ver especificación</button></section>
    </div>
  );
}

function AdminShell({ session, onLogout }) {
  const [active, setActive] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  useEffect(() => {
    if (!session) return;
    setLoadingQuotes(true);
    fetch('/api/quotes')
      .then((response) => response.json())
      .then((payload) => setQuotes(Array.isArray(payload.quotes) ? payload.quotes : []))
      .catch(() => setQuotes([]))
      .finally(() => setLoadingQuotes(false));
  }, [session]);

  const select = (key) => { setActive(key); setMenuOpen(false); };
  const currentLabel = adminMenu.flatMap((group) => group.items).find((item) => item[2] === active)?.[1] || 'Inicio';

  const view = active === 'dashboard' ? <DashboardView quoteCount={quotes.length} />
    : active === 'daily' ? <DailyView />
      : active === 'quotes' ? <QuotesView quotes={quotes} loading={loadingQuotes} />
        : active === 'projects' ? <ProjectsView />
          : active === 'documents' ? <DocumentsView />
            : <GenericView active={active} />;

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">Saltar al contenido del panel</a>
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Menú interno">
        <div className="admin-sidebar__brand"><Brand compact /><IconButton className="sidebar-close" label="Cerrar menú" icon="close" onClick={() => setMenuOpen(false)} /></div>
        <nav>
          {adminMenu.map((group) => (
            <div className="admin-nav-group" key={group.group}>
              <span>{group.group}</span>
              {group.items.map(([icon, label, key]) => (
                <button type="button" key={key} className={active === key ? 'is-active' : ''} onClick={() => select(key)} aria-current={active === key ? 'page' : undefined}>
                  <Icon name={icon} /><span>{label}</span>{active === key && <i aria-hidden="true" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__footer"><a href="/"><Icon name="home" /> Ir al sitio público</a><button type="button" onClick={onLogout}><Icon name="logout" /> Cerrar sesión</button></div>
      </aside>
      {menuOpen && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <IconButton className="admin-menu-button" label="Abrir menú" icon="menu" onClick={() => setMenuOpen(true)} />
          <div><span className="topbar-path">Metamorfosis OS</span><strong>{currentLabel}</strong></div>
          <div className="admin-topbar__actions">
            <IconButton label="Buscar" icon="search" />
            <IconButton label="Notificaciones" icon="notifications" />
            <button className="admin-user" type="button" aria-label="Abrir menú de usuario"><span>FC</span><div><strong>Francisca</strong><small>Dirección</small></div><Icon name="expand_more" /></button>
          </div>
        </header>
        <main id="admin-main" className="admin-main">{view}</main>
      </div>
    </div>
  );
}

function AdminApp() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/session')
      .then((response) => response.json())
      .then((payload) => setSession(payload.authenticated ? payload : null))
      .catch(() => setSession(null))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    try { await fetch('/api/logout', { method: 'POST' }); } catch { /* no-op */ }
    setSession(null);
  };

  if (checking) return <div className="app-loading"><Brand /><span>Cargando panel…</span></div>;
  if (!session) return <AdminLogin onLogin={(payload) => setSession(payload)} />;
  return <AdminShell session={session} onLogout={logout} />;
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  return isAdmin ? <AdminApp /> : <PublicSite />;
}
