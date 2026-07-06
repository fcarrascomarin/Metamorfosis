import React, { useMemo, useRef, useState } from "react";
import {
  defaultAssets,
  defaultDocuments,
  defaultLogEntries,
  defaultMeasures,
  osPlatforms,
  osProjects,
} from "../data/metamorfosisOs.js";

const ACCESS_KEY = "metamorfosis";

const STORAGE_KEYS = {
  measures: "metamorfosis-os-measures-v2",
  documents: "metamorfosis-os-documents-v2",
  assets: "metamorfosis-os-assets-v2",
  logs: "metamorfosis-os-logs-v2",
};

const PROJECT_COLORS = {
  "metamorfosis-lab": "#35c7d8",
  "mapa-transformacion": "#62d6a5",
  "consultoria-cm": "#5ba7ff",
  "cm-experiencias": "#f2b35d",
  "panel-interno": "#b592ff",
  poiesis: "#d78adf",
  catloop: "#6fd4c4",
};

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "medidas", label: "Medidas" },
  { id: "documentos", label: "Documentos" },
  { id: "activos", label: "Activos" },
  { id: "bitacora", label: "Bitácora" },
  { id: "respaldo", label: "Respaldo" },
];

const emptyMeasure = {
  title: "",
  dimension: "Operación",
  unit: "",
  baseline: "",
  current: "",
  target: "",
  direction: "up",
  notes: "",
};

const emptyDocument = {
  title: "",
  category: "Documento",
  status: "Activo",
  location: "",
  notes: "",
};

const emptyAsset = {
  title: "",
  type: "Activo intangible",
  status: "Por evaluar",
  owner: "Metamorfosis Lab",
  notes: "",
};

const emptyLog = {
  title: "",
  note: "",
  author: "Francisca / Benjamín",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadCollection(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveCollection(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isImproved(measure) {
  const baseline = toNumber(measure.baseline);
  const current = toNumber(measure.current);
  if (measure.direction === "down") return current < baseline;
  return current > baseline;
}

function progressToTarget(measure) {
  const baseline = toNumber(measure.baseline);
  const current = toNumber(measure.current);
  const target = toNumber(measure.target);
  if (target === baseline) return 0;
  const ratio =
    measure.direction === "down"
      ? (baseline - current) / (baseline - target)
      : (current - baseline) / (target - baseline);
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function MetamorfosisOS() {
  const [access, setAccess] = useState(() => window.localStorage.getItem("metamorfosis-os-access") === "ok");
  const [accessValue, setAccessValue] = useState("");
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeProjectId, setActiveProjectId] = useState("metamorfosis-lab");
  const [activeTab, setActiveTab] = useState("resumen");
  const [measures, setMeasures] = useState(() => loadCollection(STORAGE_KEYS.measures, defaultMeasures));
  const [documents, setDocuments] = useState(() => loadCollection(STORAGE_KEYS.documents, defaultDocuments));
  const [assets, setAssets] = useState(() => loadCollection(STORAGE_KEYS.assets, defaultAssets));
  const [logs, setLogs] = useState(() => loadCollection(STORAGE_KEYS.logs, defaultLogEntries));
  const [measureForm, setMeasureForm] = useState(emptyMeasure);
  const [documentForm, setDocumentForm] = useState(emptyDocument);
  const [assetForm, setAssetForm] = useState(emptyAsset);
  const [logForm, setLogForm] = useState(emptyLog);
  const [importMessage, setImportMessage] = useState("");
  const importRef = useRef(null);

  const activeProject = osProjects.find((project) => project.id === activeProjectId) || osProjects[0];
  const activeColor = PROJECT_COLORS[activeProject.id] || "#35c7d8";

  const visibleProjects = useMemo(() => {
    if (activePlatform === "all") return osProjects;
    return osProjects.filter((project) => project.platform === activePlatform);
  }, [activePlatform]);

  const projectMeasures = measures.filter((item) => item.projectId === activeProject.id);
  const projectDocuments = documents.filter((item) => item.projectId === activeProject.id);
  const projectAssets = assets.filter((item) => item.projectId === activeProject.id);
  const projectLogs = logs.filter((item) => item.projectId === activeProject.id);

  const stats = useMemo(() => {
    const improved = measures.filter(isImproved).length;
    const average =
      measures.length === 0
        ? 0
        : Math.round(measures.reduce((sum, measure) => sum + progressToTarget(measure), 0) / measures.length);
    return {
      projects: osProjects.length,
      measures: measures.length,
      improved,
      documents: documents.length,
      assets: assets.length,
      logs: logs.length,
      average,
    };
  }, [assets.length, documents.length, logs.length, measures]);

  const platformCounts = osPlatforms.map((platform) => ({
    ...platform,
    count: osProjects.filter((project) => project.platform === platform.id).length,
  }));

  const persistMeasures = (next) => {
    setMeasures(next);
    saveCollection(STORAGE_KEYS.measures, next);
  };

  const persistDocuments = (next) => {
    setDocuments(next);
    saveCollection(STORAGE_KEYS.documents, next);
  };

  const persistAssets = (next) => {
    setAssets(next);
    saveCollection(STORAGE_KEYS.assets, next);
  };

  const persistLogs = (next) => {
    setLogs(next);
    saveCollection(STORAGE_KEYS.logs, next);
  };

  const handleAccess = (event) => {
    event.preventDefault();
    if (accessValue.trim().toLowerCase() === ACCESS_KEY) {
      window.localStorage.setItem("metamorfosis-os-access", "ok");
      setAccess(true);
    }
  };

  const addMeasure = (event) => {
    event.preventDefault();
    if (!measureForm.title.trim()) return;
    persistMeasures([
      {
        ...measureForm,
        id: `measure-${Date.now()}`,
        projectId: activeProject.id,
        baseline: toNumber(measureForm.baseline),
        current: toNumber(measureForm.current),
        target: toNumber(measureForm.target),
        date: today(),
      },
      ...measures,
    ]);
    setMeasureForm(emptyMeasure);
  };

  const updateMeasureCurrent = (id, value) => {
    persistMeasures(measures.map((item) => (item.id === id ? { ...item, current: toNumber(value), date: today() } : item)));
  };

  const addDocument = (event) => {
    event.preventDefault();
    if (!documentForm.title.trim() && !documentForm.location.trim()) return;
    persistDocuments([
      { ...documentForm, id: `doc-${Date.now()}`, projectId: activeProject.id, date: today() },
      ...documents,
    ]);
    setDocumentForm(emptyDocument);
  };

  const addAsset = (event) => {
    event.preventDefault();
    if (!assetForm.title.trim()) return;
    persistAssets([{ ...assetForm, id: `asset-${Date.now()}`, projectId: activeProject.id }, ...assets]);
    setAssetForm(emptyAsset);
  };

  const addLog = (event) => {
    event.preventDefault();
    if (!logForm.title.trim() && !logForm.note.trim()) return;
    persistLogs([
      {
        id: `log-${Date.now()}`,
        projectId: activeProject.id,
        date: today(),
        title: logForm.title.trim() || "Registro sin título",
        note: logForm.note.trim(),
        author: logForm.author.trim() || "Metamorfosis",
      },
      ...logs,
    ]);
    setLogForm(emptyLog);
  };

  const exportData = () => {
    downloadJson(`metamorfosis-os-${today()}.json`, {
      version: 2,
      exportedAt: new Date().toISOString(),
      projects: osProjects,
      measures,
      documents,
      assets,
      logs,
    });
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.measures)) persistMeasures(parsed.measures);
        if (Array.isArray(parsed.documents)) persistDocuments(parsed.documents);
        if (Array.isArray(parsed.assets)) persistAssets(parsed.assets);
        if (Array.isArray(parsed.logs)) persistLogs(parsed.logs);
        setImportMessage("Datos importados correctamente.");
      } catch {
        setImportMessage("No se pudo importar el archivo.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const resetBaseData = () => {
    persistMeasures(defaultMeasures);
    persistDocuments(defaultDocuments);
    persistAssets(defaultAssets);
    persistLogs(defaultLogEntries);
  };

  const briefing = [
    "Briefing Metamorfosis OS",
    "",
    `Proyecto activo: ${activeProject.title}`,
    `Estado: ${activeProject.status}`,
    `Prioridad: ${activeProject.priority}`,
    `Próximo paso: ${activeProject.nextStep}`,
    `Riesgo: ${activeProject.risk}`,
    "",
    "Medidas:",
    ...projectMeasures.map(
      (item) =>
        `- ${item.title}: base ${item.baseline} / actual ${item.current} / meta ${item.target} ${item.unit} (${progressToTarget(item)}%)`,
    ),
    "",
    "Documentos:",
    ...projectDocuments.map((item) => `- ${item.title}: ${item.status} / ${item.location}`),
    "",
    "Activos:",
    ...projectAssets.map((item) => `- ${item.title}: ${item.type} / ${item.status} / ${item.owner}`),
    "",
    "Bitácora:",
    ...projectLogs.slice(0, 8).map((item) => `- ${item.date}: ${item.title} - ${item.note}`),
  ].join("\n");

  if (!access) {
    return (
      <main className="os-shell os-access">
        <section className="os-login-panel">
          <p className="os-eyebrow">Metamorfosis OS</p>
          <h1>Panel interno de transformación</h1>
          <p>
            Espacio privado para registrar medidas, documentos, activos, decisiones y evidencia de Metamorfosis.
          </p>
          <form onSubmit={handleAccess} className="os-login-form">
            <label htmlFor="os-key">Clave de acceso</label>
            <input
              id="os-key"
              type="password"
              value={accessValue}
              onChange={(event) => setAccessValue(event.target.value)}
              placeholder="Clave inicial"
            />
            <button type="submit">Entrar al panel</button>
          </form>
          <small>Clave inicial del MVP: metamorfosis</small>
        </section>
      </main>
    );
  }

  return (
    <main className="os-shell">
      <header className="os-header">
        <div>
          <p className="os-eyebrow">Metamorfosis OS</p>
          <h1>Panel maestro interno</h1>
          <p>
            Sistema de trabajo para que Metamorfosis registre su método, mida avances, concentre documentos y no dependa de memoria, chats o carpetas dispersas.
          </p>
        </div>
        <a href="#inicio" className="os-back-link">
          Volver a la web
        </a>
      </header>

      <section className="os-kpis" aria-label="Resumen del sistema">
        <article>
          <span>{stats.projects}</span>
          <p>fichas estratégicas</p>
        </article>
        <article>
          <span>{stats.measures}</span>
          <p>medidas registradas</p>
        </article>
        <article>
          <span>{stats.improved}</span>
          <p>medidas con avance</p>
        </article>
        <article>
          <span>{stats.average}%</span>
          <p>avance promedio a meta</p>
        </article>
      </section>

      <section className="os-layout">
        <aside className="os-sidebar">
          <h2>Arquitectura</h2>
          <button
            type="button"
            className={activePlatform === "all" ? "os-filter is-active" : "os-filter"}
            onClick={() => setActivePlatform("all")}
          >
            <span>Todas</span>
            <strong>{osProjects.length}</strong>
          </button>
          {platformCounts.map((platform) => (
            <button
              type="button"
              key={platform.id}
              className={activePlatform === platform.id ? "os-filter is-active" : "os-filter"}
              onClick={() => {
                const first = osProjects.find((project) => project.platform === platform.id);
                setActivePlatform(platform.id);
                if (first) setActiveProjectId(first.id);
              }}
            >
              <span>{platform.name}</span>
              <strong>{platform.count}</strong>
            </button>
          ))}

          <div className="os-sidebar-note">
            <strong>Regla interna</strong>
            <p>Todo valor importante debe quedar como medida, documento, activo o decisión registrada.</p>
            <button type="button" onClick={resetBaseData}>
              Recargar base
            </button>
          </div>
        </aside>

        <section className="os-main-panel">
          <div className="os-project-grid">
            {visibleProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={project.id === activeProject.id ? "os-project-card is-active" : "os-project-card"}
                style={{ "--project-color": PROJECT_COLORS[project.id] || "#35c7d8" }}
                onClick={() => {
                  setActiveProjectId(project.id);
                  setActiveTab("resumen");
                }}
              >
                <span>{project.priority}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <strong>{project.type}</strong>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="os-active-context" style={{ "--project-color": activeColor }}>
        <div>
          <p className="os-eyebrow">Ficha activa</p>
          <h2>{activeProject.title}</h2>
          <p>{activeProject.summary}</p>
        </div>
        <dl>
          <div>
            <dt>Estado</dt>
            <dd>{activeProject.status}</dd>
          </div>
          <div>
            <dt>Prioridad</dt>
            <dd>{activeProject.priority}</dd>
          </div>
          <div>
            <dt>Plazo</dt>
            <dd>{activeProject.due}</dd>
          </div>
        </dl>
      </section>

      <section className="os-workspace" style={{ "--project-color": activeColor }}>
        <nav className="os-tabs" aria-label="Secciones del panel interno">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "is-active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "resumen" && (
          <article className="os-detail-card os-project-detail">
            <div className="os-card-heading">
              <p className="os-eyebrow">Resumen operativo</p>
              <h2>{activeProject.title}</h2>
            </div>
            <dl className="os-facts">
              <div>
                <dt>Responsabilidad</dt>
                <dd>{activeProject.owner}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{activeProject.type}</dd>
              </div>
              <div>
                <dt>Medidas</dt>
                <dd>{projectMeasures.length}</dd>
              </div>
              <div>
                <dt>Documentos</dt>
                <dd>{projectDocuments.length}</dd>
              </div>
            </dl>
            <div className="os-decision-block">
              <h3>Próximo paso</h3>
              <p>{activeProject.nextStep}</p>
            </div>
            <div className="os-decision-block warning">
              <h3>Riesgo principal</h3>
              <p>{activeProject.risk}</p>
            </div>
            <div className="os-decision-block">
              <h3>Entregable esperado</h3>
              <p>{activeProject.deliverable}</p>
            </div>
          </article>
        )}

        {activeTab === "medidas" && (
          <article className="os-detail-card os-wide-card">
            <div className="os-card-heading">
              <p className="os-eyebrow">Medidas iniciales y subsiguientes</p>
              <h2>Indicadores del proyecto</h2>
            </div>
            <form className="os-stack-form os-measure-form" onSubmit={addMeasure}>
              <input
                value={measureForm.title}
                onChange={(event) => setMeasureForm({ ...measureForm, title: event.target.value })}
                placeholder="Indicador: tiempo de reservas, documentos creados, ventas, errores..."
              />
              <div className="os-inline-fields">
                <input
                  value={measureForm.dimension}
                  onChange={(event) => setMeasureForm({ ...measureForm, dimension: event.target.value })}
                  placeholder="Dimensión"
                />
                <input
                  value={measureForm.unit}
                  onChange={(event) => setMeasureForm({ ...measureForm, unit: event.target.value })}
                  placeholder="Unidad"
                />
                <select
                  value={measureForm.direction}
                  onChange={(event) => setMeasureForm({ ...measureForm, direction: event.target.value })}
                >
                  <option value="up">Mejora si sube</option>
                  <option value="down">Mejora si baja</option>
                </select>
              </div>
              <div className="os-inline-fields">
                <input
                  type="number"
                  value={measureForm.baseline}
                  onChange={(event) => setMeasureForm({ ...measureForm, baseline: event.target.value })}
                  placeholder="Medida inicial"
                />
                <input
                  type="number"
                  value={measureForm.current}
                  onChange={(event) => setMeasureForm({ ...measureForm, current: event.target.value })}
                  placeholder="Medida actual"
                />
                <input
                  type="number"
                  value={measureForm.target}
                  onChange={(event) => setMeasureForm({ ...measureForm, target: event.target.value })}
                  placeholder="Meta"
                />
              </div>
              <textarea
                value={measureForm.notes}
                onChange={(event) => setMeasureForm({ ...measureForm, notes: event.target.value })}
                placeholder="Notas, fuente de la medición o criterio usado"
              />
              <button type="submit">Agregar medida</button>
            </form>
            <div className="os-list os-measure-list">
              {projectMeasures.length === 0 ? (
                <p className="os-empty">Aún no hay medidas para esta ficha.</p>
              ) : (
                projectMeasures.map((item) => (
                  <article key={item.id} className="os-list-item os-measure-item">
                    <span>{item.dimension} - {item.date}</span>
                    <strong>{item.title}</strong>
                    <div className="os-measure-values">
                      <p>Inicial: <b>{item.baseline}</b> {item.unit}</p>
                      <p>Actual: <input type="number" value={item.current} onChange={(event) => updateMeasureCurrent(item.id, event.target.value)} /> {item.unit}</p>
                      <p>Meta: <b>{item.target}</b> {item.unit}</p>
                      <p>Avance: <b>{progressToTarget(item)}%</b></p>
                    </div>
                    <p>{item.notes}</p>
                    <button type="button" onClick={() => persistMeasures(measures.filter((measure) => measure.id !== item.id))}>
                      Quitar
                    </button>
                  </article>
                ))
              )}
            </div>
          </article>
        )}

        {activeTab === "documentos" && (
          <article className="os-detail-card os-wide-card">
            <div className="os-card-heading">
              <p className="os-eyebrow">Documentación</p>
              <h2>Repositorio de referencia</h2>
            </div>
            <form className="os-stack-form" onSubmit={addDocument}>
              <input
                value={documentForm.title}
                onChange={(event) => setDocumentForm({ ...documentForm, title: event.target.value })}
                placeholder="Nombre del documento"
              />
              <div className="os-inline-fields">
                <input value={documentForm.category} onChange={(event) => setDocumentForm({ ...documentForm, category: event.target.value })} placeholder="Categoría" />
                <input value={documentForm.status} onChange={(event) => setDocumentForm({ ...documentForm, status: event.target.value })} placeholder="Estado" />
                <input value={documentForm.location} onChange={(event) => setDocumentForm({ ...documentForm, location: event.target.value })} placeholder="Ruta, link o ubicación" />
              </div>
              <textarea value={documentForm.notes} onChange={(event) => setDocumentForm({ ...documentForm, notes: event.target.value })} placeholder="Qué contiene y por qué importa" />
              <button type="submit">Registrar documento</button>
            </form>
            <div className="os-list">
              {projectDocuments.map((item) => (
                <article key={item.id} className="os-list-item">
                  <span>{item.category} - {item.status} - {item.date}</span>
                  <strong>{item.title}</strong>
                  <p>{item.location}</p>
                  <p>{item.notes}</p>
                  <button type="button" onClick={() => persistDocuments(documents.filter((doc) => doc.id !== item.id))}>Quitar</button>
                </article>
              ))}
            </div>
          </article>
        )}

        {activeTab === "activos" && (
          <article className="os-detail-card os-wide-card">
            <div className="os-card-heading">
              <p className="os-eyebrow">Activos intangibles</p>
              <h2>Reconocer, asignar y proteger</h2>
            </div>
            <form className="os-stack-form" onSubmit={addAsset}>
              <input value={assetForm.title} onChange={(event) => setAssetForm({ ...assetForm, title: event.target.value })} placeholder="Nombre del activo" />
              <div className="os-inline-fields">
                <input value={assetForm.type} onChange={(event) => setAssetForm({ ...assetForm, type: event.target.value })} placeholder="Tipo" />
                <input value={assetForm.status} onChange={(event) => setAssetForm({ ...assetForm, status: event.target.value })} placeholder="Estado" />
                <input value={assetForm.owner} onChange={(event) => setAssetForm({ ...assetForm, owner: event.target.value })} placeholder="Titular o unidad" />
              </div>
              <textarea value={assetForm.notes} onChange={(event) => setAssetForm({ ...assetForm, notes: event.target.value })} placeholder="Uso, riesgo, protección o explotación posible" />
              <button type="submit">Registrar activo</button>
            </form>
            <div className="os-list">
              {projectAssets.map((item) => (
                <article key={item.id} className="os-list-item">
                  <span>{item.type} - {item.status}</span>
                  <strong>{item.title}</strong>
                  <p><b>Titularidad:</b> {item.owner}</p>
                  <p>{item.notes}</p>
                  <button type="button" onClick={() => persistAssets(assets.filter((asset) => asset.id !== item.id))}>Quitar</button>
                </article>
              ))}
            </div>
          </article>
        )}

        {activeTab === "bitacora" && (
          <article className="os-detail-card os-wide-card">
            <div className="os-card-heading">
              <p className="os-eyebrow">Bitácora</p>
              <h2>Decisiones y evidencia narrativa</h2>
            </div>
            <form className="os-stack-form" onSubmit={addLog}>
              <input value={logForm.title} onChange={(event) => setLogForm({ ...logForm, title: event.target.value })} placeholder="Título del registro" />
              <textarea value={logForm.note} onChange={(event) => setLogForm({ ...logForm, note: event.target.value })} placeholder="Decisión, avance, aprendizaje o acuerdo" />
              <input value={logForm.author} onChange={(event) => setLogForm({ ...logForm, author: event.target.value })} placeholder="Responsable" />
              <button type="submit">Registrar bitácora</button>
            </form>
            <div className="os-list">
              {projectLogs.map((item) => (
                <article key={item.id} className="os-list-item">
                  <span>{item.date} - {item.author}</span>
                  <strong>{item.title}</strong>
                  <p>{item.note}</p>
                  <button type="button" onClick={() => persistLogs(logs.filter((log) => log.id !== item.id))}>Quitar</button>
                </article>
              ))}
            </div>
          </article>
        )}

        {activeTab === "respaldo" && (
          <article className="os-detail-card os-wide-card os-briefing-card">
            <div className="os-card-heading">
              <p className="os-eyebrow">Respaldo y continuidad</p>
              <h2>Exportar, importar y usar briefing</h2>
            </div>
            <div className="os-decision-block">
              <h3>Fuente de verdad del MVP</h3>
              <p>
                Esta versión guarda datos en el navegador. Exporta JSON periódicamente para respaldar.
                La siguiente etapa natural es conectar esta estructura a una base de datos.
              </p>
            </div>
            <div className="os-row-actions os-backup-actions">
              <button type="button" onClick={exportData}>Exportar JSON</button>
              <button type="button" onClick={() => importRef.current?.click()}>Importar JSON</button>
              <input ref={importRef} type="file" accept="application/json" onChange={importData} hidden />
            </div>
            {importMessage ? <p className="form-status">{importMessage}</p> : null}
            <textarea readOnly value={briefing} />
          </article>
        )}
      </section>
    </main>
  );
}
