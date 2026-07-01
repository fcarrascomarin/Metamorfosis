import React, { useMemo, useState } from "react";
import { defaultWeeklyTasks, osPlatforms, osProjects } from "../data/metamorfosisOs.js";

const STORAGE_KEY = "metamorfosis-os-v1";
const ACCESS_KEY = "metamorfosis";

function loadTasks() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultWeeklyTasks;
    return JSON.parse(saved);
  } catch {
    return defaultWeeklyTasks;
  }
}

function saveTasks(tasks) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export default function MetamorfosisOS() {
  const [access, setAccess] = useState(() => window.localStorage.getItem("metamorfosis-os-access") === "ok");
  const [accessValue, setAccessValue] = useState("");
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeProjectId, setActiveProjectId] = useState(osProjects[0].id);
  const [tasks, setTasks] = useState(loadTasks);
  const [newTask, setNewTask] = useState("");
  const [copied, setCopied] = useState(false);

  const activeProject = osProjects.find((project) => project.id === activeProjectId) || osProjects[0];
  const activeProjectTasks = tasks.filter((task) => task.projectId === activeProject.id);

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
    saveTasks(nextTasks);
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

  const briefing = useMemo(() => {
    const selectedTasks = tasks.filter((task) => task.status !== "Cerrada");
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
    ].join("\n");
  }, [activeProject, tasks]);

  const copyBriefing = async () => {
    await navigator.clipboard.writeText(briefing);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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
          <span>5</span>
          <p>vistas operativas</p>
        </article>
        <article>
          <span>1</span>
          <p>briefing para ChatGPT</p>
        </article>
      </section>

      <section className="os-layout">
        <aside className="os-sidebar">
          <h2>Plataformas</h2>
          <button
            type="button"
            className={activePlatform === "all" ? "os-filter is-active" : "os-filter"}
            onClick={() => setActivePlatform("all")}
          >
            <span>Todas</span>
            <strong>{osProjects.length}</strong>
          </button>
          {projectCounts.map((platform) => (
            <button
              key={platform.id}
              type="button"
              className={activePlatform === platform.id ? "os-filter is-active" : "os-filter"}
              onClick={() => setActivePlatform(platform.id)}
            >
              <span>{platform.name}</span>
              <strong>{platform.count}</strong>
            </button>
          ))}

          <div className="os-sidebar-note">
            <strong>Regla del panel</strong>
            <p>Primero plataforma, luego proyecto, despues entregables, riesgos y proximo paso.</p>
          </div>
        </aside>

        <section className="os-main-panel">
          <div className="os-project-grid">
            {visibleProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={project.id === activeProject.id ? "os-project-card is-active" : "os-project-card"}
                onClick={() => setActiveProjectId(project.id)}
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

      <section className="os-detail-grid">
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

        <article className="os-detail-card os-briefing-card">
          <div className="os-card-heading">
            <p className="os-eyebrow">ChatGPT</p>
            <h2>Briefing exportable</h2>
          </div>
          <textarea readOnly value={briefing} />
          <button type="button" onClick={copyBriefing}>
            {copied ? "Copiado" : "Copiar briefing"}
          </button>
        </article>
      </section>
    </main>
  );
}
