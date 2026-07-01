import React, { useMemo, useState } from "react";
import {
  defaultDeliverables,
  defaultLogEntries,
  defaultSourceDocs,
  defaultWeeklyTasks,
  osPlatforms,
  osProjects,
} from "../data/metamorfosisOs.js";

const STORAGE_KEYS = {
  tasks: "metamorfosis-os-tasks-v1",
  logs: "metamorfosis-os-logs-v1",
  sources: "metamorfosis-os-sources-v1",
  deliverables: "metamorfosis-os-deliverables-v1",
};
const ACCESS_KEY = "metamorfosis";
const PROJECT_COLORS = {
  "consultoria-cm": "#35c7d8",
  "sistema-cm": "#62d6a5",
  "cm-experiencias": "#f2b35d",
  "dona-senoraza": "#d78adf",
  "juana-arco": "#f6d36b",
  "red-oriente": "#89a7ff",
  estandarizacion: "#41d9b5",
  sustentabilidad: "#7ed27a",
  "concriterio-minimo": "#5ba7ff",
  "magister-uba": "#b592ff",
  "tesis-uba": "#cf9cff",
  "seminario-paz": "#8fd0ff",
  catloop: "#6fd4c4",
  aji: "#ff8a63",
};
const OS_TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "tareas", label: "Tareas" },
  { id: "bitacora", label: "Bitacora" },
  { id: "fuentes", label: "Fuentes" },
  { id: "entregables", label: "Entregables" },
  { id: "chatgpt", label: "ChatGPT" },
];

function loadCollection(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function saveCollection(key, items) {
  window.localStorage.setItem(key, JSON.stringify(items));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function MetamorfosisOS() {
  const [access, setAccess] = useState(() => window.localStorage.getItem("metamorfosis-os-access") === "ok");
  const [accessValue, setAccessValue] = useState("");
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeProjectId, setActiveProjectId] = useState(osProjects[0].id);
  const [activeTab, setActiveTab] = useState("resumen");
  const [tasks, setTasks] = useState(() => loadCollection(STORAGE_KEYS.tasks, defaultWeeklyTasks));
  const [logs, setLogs] = useState(() => loadCollection(STORAGE_KEYS.logs, defaultLogEntries));
  const [sources, setSources] = useState(() => loadCollection(STORAGE_KEYS.sources, defaultSourceDocs));
  const [deliverables, setDeliverables] = useState(() =>
    loadCollection(STORAGE_KEYS.deliverables, defaultDeliverables),
  );
  const [newTask, setNewTask] = useState("");
  const [newLog, setNewLog] = useState({ title: "", note: "", author: "Francisca / Benjamin" });
  const [newSource, setNewSource] = useState({ title: "", type: "Documento", location: "", status: "Fuente activa" });
  const [newDeliverable, setNewDeliverable] = useState({
    title: "",
    type: "Documento",
    version: "v0.1",
    status: "Borrador",
    location: "",
    content: "",
  });
  const [copied, setCopied] = useState(false);

  const activeProject = osProjects.find((project) => project.id === activeProjectId) || osProjects[0];
  const activeProjectColor = PROJECT_COLORS[activeProject.id] || "#16a6cf";
  const activeProjectTasks = tasks.filter((task) => task.projectId === activeProject.id);
  const activeProjectLogs = logs.filter((entry) => entry.projectId === activeProject.id);
  const activeProjectSources = sources.filter((source) => source.projectId === activeProject.id);
  const activeProjectDeliverables = deliverables.filter((deliverable) => deliverable.projectId === activeProject.id);

  const visibleProjects = useMemo(() => {
    if (activePlatform === "all") return osProjects;
    return osProjects.filter((project) => project.platform === activePlatform);
  }, [activePlatform]);

  const weeklyTasks = tasks.filter((task) => task.status === "Esta semana");
  const projectCounts = osPlatforms.map((platform) => ({
    ...platform,
    count: osProjects.filter((project) => project.platform === platform.id).length,
  }));

  const updateTasks = (nextTasks) => {
    setTasks(nextTasks);
    saveCollection(STORAGE_KEYS.tasks, nextTasks);
  };

  const updateLogs = (nextLogs) => {
    setLogs(nextLogs);
    saveCollection(STORAGE_KEYS.logs, nextLogs);
  };

  const updateSources = (nextSources) => {
    setSources(nextSources);
    saveCollection(STORAGE_KEYS.sources, nextSources);
  };

  const updateDeliverables = (nextDeliverables) => {
    setDeliverables(nextDeliverables);
    saveCollection(STORAGE_KEYS.deliverables, nextDeliverables);
  };

  const handleAccess = (event) => {
    event.preventDefault();
    if (accessValue.trim().toLowerCase() === ACCESS_KEY) {
      window.localStorage.setItem("metamorfosis-os-access", "ok");
      setAccess(true);
    }
  };

  const addTask = (event) => {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    updateTasks([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        projectId: activeProject.id,
        title,
        owner: activeProject.owner.split("/")[0].trim(),
        status: "Esta semana",
      },
    ]);
    setNewTask("");
  };

  const toggleTaskStatus = (taskId) => {
    updateTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "Cerrada" ? "Esta semana" : "Cerrada" }
          : task,
      ),
    );
  };

  const removeTask = (taskId) => {
    updateTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addLog = (event) => {
    event.preventDefault();
    if (!newLog.title.trim() && !newLog.note.trim()) return;
    updateLogs([
      {
        id: `log-${Date.now()}`,
        projectId: activeProject.id,
        date: today(),
        title: newLog.title.trim() || "Registro sin titulo",
        note: newLog.note.trim(),
        author: newLog.author.trim() || "Metamorfosis",
      },
      ...logs,
    ]);
    setNewLog({ title: "", note: "", author: "Francisca / Benjamin" });
  };

  const addSource = (event) => {
    event.preventDefault();
    if (!newSource.title.trim() && !newSource.location.trim()) return;
    updateSources([
      {
        id: `source-${Date.now()}`,
        projectId: activeProject.id,
        title: newSource.title.trim() || "Fuente sin titulo",
        type: newSource.type.trim() || "Documento",
        location: newSource.location.trim(),
        status: newSource.status.trim() || "Fuente activa",
      },
      ...sources,
    ]);
    setNewSource({ title: "", type: "Documento", location: "", status: "Fuente activa" });
  };

  const addDeliverable = (event) => {
    event.preventDefault();
    if (!newDeliverable.title.trim() && !newDeliverable.content.trim()) return;
    updateDeliverables([
      {
        id: `deliverable-${Date.now()}`,
        projectId: activeProject.id,
        title: newDeliverable.title.trim() || "Entregable sin titulo",
        type: newDeliverable.type.trim() || "Documento",
        version: newDeliverable.version.trim() || "v0.1",
        status: newDeliverable.status.trim() || "Borrador",
        location: newDeliverable.location.trim(),
        content: newDeliverable.content.trim(),
      },
      ...deliverables,
    ]);
    setNewDeliverable({
      title: "",
      type: "Documento",
      version: "v0.1",
      status: "Borrador",
      location: "",
      content: "",
    });
  };

  const downloadDeliverable = (deliverable) => {
    const text = [
      deliverable.title,
      `Proyecto: ${activeProject.title}`,
      `Tipo: ${deliverable.type}`,
      `Version: ${deliverable.version}`,
      `Estado: ${deliverable.status}`,
      "",
      deliverable.content || deliverable.location || "Entregable registrado sin contenido interno.",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${deliverable.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "entregable"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const briefing = useMemo(() => {
    const selectedTasks = tasks.filter((task) => task.status !== "Cerrada");
    const selectedLogs = activeProjectLogs.slice(0, 5);
    const selectedSources = activeProjectSources.slice(0, 5);
    const selectedDeliverables = activeProjectDeliverables.slice(0, 5);
    return [
      "Briefing Metamorfosis OS",
      "",
      `Proyecto activo: ${activeProject.title}`,
      `Plataforma: ${osPlatforms.find((platform) => platform.id === activeProject.platform)?.name}`,
      `Responsable / reparto: ${activeProject.owner}`,
      `Prioridad: ${activeProject.priority}`,
      `Estado: ${activeProject.status}`,
      `Proximo paso: ${activeProject.nextStep}`,
      `Riesgo principal: ${activeProject.risk}`,
      `Entregable esperado: ${activeProject.deliverable}`,
      `Uso de ChatGPT: ${activeProject.aiUse}`,
      "",
      "Tareas abiertas:",
      ...selectedTasks.map((task) => `- [${task.status}] ${task.title} (${task.owner})`),
      "",
      "Bitacora del proyecto activo:",
      ...selectedLogs.map((entry) => `- ${entry.date}: ${entry.title} - ${entry.note}`),
      "",
      "Fuentes del proyecto activo:",
      ...selectedSources.map((source) => `- ${source.title} (${source.type}): ${source.location}`),
      "",
      "Entregables del proyecto activo:",
      ...selectedDeliverables.map(
        (deliverable) => `- ${deliverable.title} (${deliverable.type}, ${deliverable.version}, ${deliverable.status})`,
      ),
    ].join("\n");
  }, [activeProject, activeProjectDeliverables, activeProjectLogs, activeProjectSources, tasks]);

  const copyBriefing = async () => {
    await navigator.clipboard.writeText(briefing);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const resetBaseData = () => {
    updateTasks(defaultWeeklyTasks);
    updateLogs(defaultLogEntries);
    updateSources(defaultSourceDocs);
    updateDeliverables(defaultDeliverables);
  };

  if (!access) {
    return (
      <main className="os-shell os-access">
        <section className="os-login-panel">
          <p className="os-eyebrow">Metamorfosis OS</p>
          <h1>Panel interno de proyectos</h1>
          <p>
            Acceso de trabajo para ordenar proyectos, prioridades, riesgos y entregables del laboratorio.
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
          <h1>Panel maestro de proyectos</h1>
          <p>
            Sistema operativo interno para ordenar Metamorfosis, ConCriterio, CM Experiencias,
            Juana de Arco, academia e incubadora.
          </p>
        </div>
        <a href="#inicio" className="os-back-link">
          Volver a la web
        </a>
      </header>

      <section className="os-kpis" aria-label="Resumen de plataformas">
        <article>
          <span>{osProjects.length}</span>
          <p>proyectos y lineas</p>
        </article>
        <article>
          <span>{weeklyTasks.length}</span>
          <p>tareas esta semana</p>
        </article>
        <article>
          <span>{deliverables.length}</span>
          <p>entregables registrados</p>
        </article>
        <article>
          <span>{logs.length}</span>
          <p>registros de bitacora</p>
        </article>
      </section>

      <section className="os-layout">
        <aside className="os-sidebar">
          <h2>Plataformas</h2>
          <button
            type="button"
            className={activePlatform === "all" ? "os-filter is-active" : "os-filter"}
            onClick={() => {
              setActivePlatform("all");
              setActiveTab("resumen");
            }}
          >
            <span>Todas</span>
            <strong>{osProjects.length}</strong>
          </button>
          {projectCounts.map((platform) => (
            <button
              key={platform.id}
              type="button"
              className={activePlatform === platform.id ? "os-filter is-active" : "os-filter"}
              onClick={() => {
                const firstProject = osProjects.find((project) => project.platform === platform.id);
                setActivePlatform(platform.id);
                if (firstProject) setActiveProjectId(firstProject.id);
                setActiveTab("resumen");
              }}
            >
              <span>{platform.name}</span>
              <strong>{platform.count}</strong>
            </button>
          ))}

          <div className="os-sidebar-note">
            <strong>Regla del panel</strong>
            <p>Primero plataforma, luego proyecto, despues entregables, riesgos y proximo paso.</p>
            <button type="button" onClick={resetBaseData}>
              Recargar datos base
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
                style={{ "--project-color": PROJECT_COLORS[project.id] || "#16a6cf" }}
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

      <section className="os-active-context" style={{ "--project-color": activeProjectColor }}>
        <div>
          <p className="os-eyebrow">Proyecto activo</p>
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
            <dt>Fecha</dt>
            <dd>{activeProject.due}</dd>
          </div>
        </dl>
      </section>

      <section className="os-workspace" style={{ "--project-color": activeProjectColor }}>
        <nav className="os-tabs" aria-label="Informacion y edicion del proyecto activo">
          {OS_TABS.map((tab) => (
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
            <p className="os-eyebrow">Ficha activa</p>
            <h2>{activeProject.title}</h2>
          </div>
          <dl className="os-facts">
            <div>
              <dt>Plataforma</dt>
              <dd>{osPlatforms.find((platform) => platform.id === activeProject.platform)?.name}</dd>
            </div>
            <div>
              <dt>Dueno / reparto</dt>
              <dd>{activeProject.owner}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{activeProject.type}</dd>
            </div>
            <div>
              <dt>Fecha critica</dt>
              <dd>{activeProject.due}</dd>
            </div>
          </dl>
          <div className="os-decision-block">
            <h3>Proximo paso</h3>
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

        {activeTab === "tareas" && (
          <article className="os-detail-card">
          <div className="os-card-heading">
            <p className="os-eyebrow">Semana</p>
            <h2>Tareas abiertas</h2>
          </div>
          <form className="os-task-form" onSubmit={addTask}>
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder={`Agregar tarea para ${activeProject.title}`}
            />
            <button type="submit">Agregar</button>
          </form>
          <div className="os-task-list">
            {activeProjectTasks.length === 0 ? (
              <p className="os-empty">Aun no hay tareas para esta ficha.</p>
            ) : (
              activeProjectTasks.map((task) => (
                <div key={task.id} className={task.status === "Cerrada" ? "os-task is-done" : "os-task"}>
                  <button type="button" onClick={() => toggleTaskStatus(task.id)}>
                    {task.status === "Cerrada" ? "Reabrir" : "Cerrar"}
                  </button>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.owner} - {task.status}</span>
                  </div>
                  <button type="button" className="os-remove" onClick={() => removeTask(task.id)}>
                    Quitar
                  </button>
                </div>
              ))
            )}
          </div>
        </article>
        )}

        {activeTab === "bitacora" && (
          <article className="os-detail-card">
          <div className="os-card-heading">
            <p className="os-eyebrow">Bitacora</p>
            <h2>Decisiones y avances</h2>
          </div>
          <form className="os-stack-form" onSubmit={addLog}>
            <input
              value={newLog.title}
              onChange={(event) => setNewLog({ ...newLog, title: event.target.value })}
              placeholder="Titulo del registro"
            />
            <textarea
              value={newLog.note}
              onChange={(event) => setNewLog({ ...newLog, note: event.target.value })}
              placeholder="Decision, avance, cambio o acuerdo"
            />
            <input
              value={newLog.author}
              onChange={(event) => setNewLog({ ...newLog, author: event.target.value })}
              placeholder="Responsable"
            />
            <button type="submit">Registrar bitacora</button>
          </form>
          <div className="os-list">
            {activeProjectLogs.length === 0 ? (
              <p className="os-empty">Sin registros para este proyecto.</p>
            ) : (
              activeProjectLogs.map((entry) => (
                <article key={entry.id} className="os-list-item">
                  <span>{entry.date} - {entry.author}</span>
                  <strong>{entry.title}</strong>
                  <p>{entry.note}</p>
                  <button type="button" onClick={() => updateLogs(logs.filter((item) => item.id !== entry.id))}>
                    Quitar
                  </button>
                </article>
              ))
            )}
          </div>
        </article>
        )}

        {activeTab === "fuentes" && (
          <article className="os-detail-card">
          <div className="os-card-heading">
            <p className="os-eyebrow">Fuentes</p>
            <h2>Documentos base</h2>
          </div>
          <form className="os-stack-form" onSubmit={addSource}>
            <input
              value={newSource.title}
              onChange={(event) => setNewSource({ ...newSource, title: event.target.value })}
              placeholder="Nombre de la fuente"
            />
            <input
              value={newSource.type}
              onChange={(event) => setNewSource({ ...newSource, type: event.target.value })}
              placeholder="Tipo: PDF, repo, imagen, minuta..."
            />
            <input
              value={newSource.location}
              onChange={(event) => setNewSource({ ...newSource, location: event.target.value })}
              placeholder="Link, ruta, ubicacion o referencia"
            />
            <input
              value={newSource.status}
              onChange={(event) => setNewSource({ ...newSource, status: event.target.value })}
              placeholder="Estado"
            />
            <button type="submit">Registrar fuente</button>
          </form>
          <div className="os-list">
            {activeProjectSources.length === 0 ? (
              <p className="os-empty">Sin fuentes para este proyecto.</p>
            ) : (
              activeProjectSources.map((source) => (
                <article key={source.id} className="os-list-item">
                  <span>{source.type} - {source.status}</span>
                  <strong>{source.title}</strong>
                  <p>{source.location}</p>
                  <button type="button" onClick={() => updateSources(sources.filter((item) => item.id !== source.id))}>
                    Quitar
                  </button>
                </article>
              ))
            )}
          </div>
        </article>
        )}

        {activeTab === "entregables" && (
          <article className="os-detail-card os-wide-card">
          <div className="os-card-heading">
            <p className="os-eyebrow">Entregables</p>
            <h2>Versiones descargables</h2>
          </div>
          <form className="os-stack-form os-deliverable-form" onSubmit={addDeliverable}>
            <input
              value={newDeliverable.title}
              onChange={(event) => setNewDeliverable({ ...newDeliverable, title: event.target.value })}
              placeholder="Nombre del entregable"
            />
            <div className="os-inline-fields">
              <input
                value={newDeliverable.type}
                onChange={(event) => setNewDeliverable({ ...newDeliverable, type: event.target.value })}
                placeholder="Tipo"
              />
              <input
                value={newDeliverable.version}
                onChange={(event) => setNewDeliverable({ ...newDeliverable, version: event.target.value })}
                placeholder="Version"
              />
              <input
                value={newDeliverable.status}
                onChange={(event) => setNewDeliverable({ ...newDeliverable, status: event.target.value })}
                placeholder="Estado"
              />
            </div>
            <input
              value={newDeliverable.location}
              onChange={(event) => setNewDeliverable({ ...newDeliverable, location: event.target.value })}
              placeholder="Link o ruta opcional"
            />
            <textarea
              value={newDeliverable.content}
              onChange={(event) => setNewDeliverable({ ...newDeliverable, content: event.target.value })}
              placeholder="Contenido, resumen o version textual descargable"
            />
            <button type="submit">Registrar entregable</button>
          </form>
          <div className="os-list os-deliverable-list">
            {activeProjectDeliverables.length === 0 ? (
              <p className="os-empty">Sin entregables para este proyecto.</p>
            ) : (
              activeProjectDeliverables.map((deliverable) => (
                <article key={deliverable.id} className="os-list-item">
                  <span>{deliverable.type} - {deliverable.version} - {deliverable.status}</span>
                  <strong>{deliverable.title}</strong>
                  <p>{deliverable.content || deliverable.location || "Entregable registrado."}</p>
                  <div className="os-row-actions">
                    <button type="button" onClick={() => downloadDeliverable(deliverable)}>
                      Descargar TXT
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDeliverables(deliverables.filter((item) => item.id !== deliverable.id))}
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
        )}

        {activeTab === "chatgpt" && (
          <article className="os-detail-card os-briefing-card">
            <div className="os-card-heading">
              <p className="os-eyebrow">ChatGPT</p>
              <h2>Briefing exportable</h2>
            </div>
            <div className="os-decision-block">
              <h3>Automatizacion asistida</h3>
              <p>
                Este briefing no reemplaza la revision humana. Sirve para traer contexto a ChatGPT,
                trabajar el entregable y luego registrar manualmente la version validada en el panel.
              </p>
            </div>
            <textarea readOnly value={briefing} />
            <button type="button" onClick={copyBriefing}>
              {copied ? "Copiado" : "Copiar briefing"}
            </button>
          </article>
        )}
      </section>
    </main>
  );
}
