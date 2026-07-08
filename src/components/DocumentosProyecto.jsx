import React, { useEffect, useMemo, useState } from "react";

const DOCUMENT_STORAGE_KEY = "metamorfosis-os-project-documents-v1";

const DOCUMENT_STATUS = ["Borrador", "En revisión", "Validado", "Archivado"];
const CONFIDENTIALITY_LEVELS = ["Interno", "Reservado", "Confidencial", "Uso externo autorizado"];
const METHOD_STAGES = [
  "Oportunidad",
  "Investigación preliminar",
  "Conversación inicial",
  "Diagnóstico",
  "Mapa de Transformación",
  "Propuesta y alcance",
  "Ejecución",
  "Medición",
  "Cierre",
  "Aprendizaje interno",
];

const DOCUMENT_TEMPLATES = [
  {
    id: "ficha-oportunidad",
    name: "Ficha de oportunidad",
    code: "FO",
    type: "Captación",
    stage: "Oportunidad",
    description: "Primer registro para decidir si una oportunidad debe pasar a conversación o diagnóstico.",
    fields: [
      ["origen", "Origen de la oportunidad"],
      ["problema", "Problema o necesidad observada"],
      ["valor", "Valor potencial para el cliente"],
      ["riesgos", "Riesgos, límites o alertas"],
      ["siguientePaso", "Siguiente paso recomendado"],
    ],
  },
  {
    id: "perfil-preliminar-empresa",
    name: "Perfil preliminar de empresa",
    code: "PPE",
    type: "Investigación",
    stage: "Investigación preliminar",
    description: "Ficha previa a la conversación inicial para llegar preparados y demostrar comprensión del negocio.",
    fields: [
      ["empresa", "Qué sabemos de la empresa"],
      ["rubro", "Rubro, oferta y clientes"],
      ["presencia", "Presencia digital y canales visibles"],
      ["hipotesis", "Hipótesis de brechas u oportunidades"],
      ["preguntas", "Preguntas inteligentes para la conversación"],
    ],
  },
  {
    id: "pauta-conversacion-inicial",
    name: "Pauta de conversación inicial",
    code: "PCI",
    type: "Reunión",
    stage: "Conversación inicial",
    description: "Guía para ordenar la primera conversación sin improvisar ni perder información relevante.",
    fields: [
      ["objetivo", "Objetivo de la conversación"],
      ["preguntas", "Preguntas principales"],
      ["senales", "Señales que debemos observar"],
      ["informacion", "Información que debemos solicitar"],
      ["cierre", "Cierre y compromiso esperado"],
    ],
  },
  {
    id: "formulario-base-proyecto",
    name: "Formulario base del proyecto",
    code: "FBP",
    type: "Levantamiento",
    stage: "Diagnóstico",
    description: "Base mínima para ordenar un proyecto antes de proponer alcance, etapas y entregables.",
    fields: [
      ["antecedentes", "Antecedentes generales"],
      ["objetivos", "Objetivos declarados"],
      ["restricciones", "Restricciones, recursos y plazos"],
      ["actores", "Actores involucrados"],
      ["datos", "Información y documentos disponibles"],
    ],
  },
  {
    id: "mapa-transformacion-activos",
    name: "Mapa de Transformación y Activos",
    code: "MTA",
    type: "Diagnóstico estratégico",
    stage: "Mapa de Transformación",
    description: "Documento central para ordenar identidad, operación, brechas, activos y ruta de transformación.",
    fields: [
      ["situacionActual", "Situación actual"],
      ["brechas", "Brechas detectadas"],
      ["activos", "Activos visibles e invisibles"],
      ["oportunidades", "Oportunidades de transformación"],
      ["ruta", "Ruta propuesta"],
    ],
  },
  {
    id: "ficha-activos-intangibles",
    name: "Ficha de activos intangibles",
    code: "FAI",
    type: "Propiedad intelectual",
    stage: "Mapa de Transformación",
    description: "Registro para identificar, ordenar y proteger activos intangibles creados o detectados.",
    fields: [
      ["activo", "Activo identificado"],
      ["uso", "Uso actual o potencial"],
      ["titularidad", "Titularidad o control"],
      ["riesgo", "Riesgo de pérdida, copia o confusión"],
      ["proteccion", "Medida de protección sugerida"],
    ],
  },
  {
    id: "ficha-propuesta-alcance",
    name: "Ficha de propuesta y alcance",
    code: "FPA",
    type: "Propuesta",
    stage: "Propuesta y alcance",
    description: "Documento para delimitar qué se hará, qué no se hará, entregables, responsables y condiciones.",
    fields: [
      ["problema", "Problema que abordará la propuesta"],
      ["alcance", "Alcance incluido"],
      ["exclusiones", "Exclusiones y límites"],
      ["entregables", "Entregables comprometidos"],
      ["condiciones", "Condiciones de avance y pago"],
    ],
  },
  {
    id: "registro-hito-decision",
    name: "Registro de hito y decisión",
    code: "RHD",
    type: "Bitácora formal",
    stage: "Ejecución",
    description: "Registro trazable de decisiones relevantes, cambios de criterio o hitos del proyecto.",
    fields: [
      ["hito", "Hito o decisión"],
      ["contexto", "Contexto que explica la decisión"],
      ["acuerdo", "Acuerdo adoptado"],
      ["impacto", "Impacto en plazo, alcance o entregables"],
      ["responsables", "Responsables y próximos pasos"],
    ],
  },
  {
    id: "linea-base-indicadores",
    name: "Línea base e indicadores",
    code: "LBI",
    type: "Medición",
    stage: "Medición",
    description: "Documento para fijar estado inicial, indicadores, metas y evidencia antes/después.",
    fields: [
      ["lineaBase", "Línea base"],
      ["indicadores", "Indicadores definidos"],
      ["fuente", "Fuente de datos o evidencia"],
      ["meta", "Meta o cambio esperado"],
      ["seguimiento", "Frecuencia y responsable de seguimiento"],
    ],
  },
  {
    id: "acta-cierre",
    name: "Acta de cierre",
    code: "AC",
    type: "Cierre",
    stage: "Cierre",
    description: "Cierre formal del proyecto o etapa, con entregables, pendientes, conformidad y aprendizajes.",
    fields: [
      ["entregados", "Entregables realizados"],
      ["pendientes", "Pendientes o condiciones posteriores"],
      ["resultados", "Resultados observados"],
      ["conformidad", "Conformidad o validación"],
      ["continuidad", "Recomendación de continuidad"],
    ],
  },
  {
    id: "ficha-aprendizaje-interno",
    name: "Ficha de aprendizaje interno",
    code: "FAI2",
    type: "Aprendizaje",
    stage: "Aprendizaje interno",
    description: "Registro interno para convertir experiencia en metodología, mejora de servicio o plantilla reutilizable.",
    fields: [
      ["aprendizaje", "Aprendizaje principal"],
      ["error", "Error, dificultad o riesgo detectado"],
      ["mejora", "Mejora para próximos proyectos"],
      ["plantilla", "Plantilla o activo reutilizable"],
      ["accion", "Acción interna recomendada"],
    ],
  },
  {
    id: "minuta-interna",
    name: "Minuta interna",
    code: "MI",
    type: "Gestión interna",
    stage: "Ejecución",
    description: "Minuta simple para ordenar reuniones, pendientes, responsables y acuerdos internos.",
    fields: [
      ["temas", "Temas tratados"],
      ["acuerdos", "Acuerdos"],
      ["pendientes", "Pendientes"],
      ["responsables", "Responsables"],
      ["proximaRevision", "Próxima revisión"],
    ],
  },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadDocuments() {
  try {
    const saved = window.localStorage.getItem(DOCUMENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persistDocuments(next) {
  window.localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(next));
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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paragraphize(value = "") {
  const safe = escapeHtml(value.trim() || "Sin contenido registrado.");
  return safe
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br />")}</p>`)
    .join("");
}

function projectPrefix(project) {
  return (project?.id || "proyecto")
    .split("-")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function buildCode(project, template, count) {
  const dateCode = today().replaceAll("-", "");
  return `ML-${projectPrefix(project)}-${template.code}-${dateCode}-${String(count + 1).padStart(3, "0")}`;
}

function createSections(template) {
  return Object.fromEntries(template.fields.map(([key]) => [key, ""]));
}

function createDraft(project, template, count = 0) {
  return {
    id: null,
    projectId: project.id,
    projectTitle: project.title,
    templateId: template.id,
    templateName: template.name,
    type: template.type,
    code: buildCode(project, template, count),
    title: template.name,
    date: today(),
    version: "v1.0",
    status: "Borrador",
    responsible: "Francisca / Benjamín",
    stage: template.stage,
    confidentiality: "Interno",
    summary: template.description,
    sections: createSections(template),
    updatedAt: new Date().toISOString(),
  };
}

function getTemplate(templateId) {
  return DOCUMENT_TEMPLATES.find((template) => template.id === templateId) || DOCUMENT_TEMPLATES[0];
}

function renderDocumentHtml(doc, project) {
  const template = getTemplate(doc.templateId);
  const projectName = project?.title || doc.projectTitle;
  const logoUrl = `${window.location.origin}/logo-1.png`;

  return `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(doc.code)} - ${escapeHtml(doc.title)}</title>
      <style>
        @page { size: A4; margin: 18mm; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #162033; font-family: Arial, sans-serif; background: #fff; }
        .doc { width: 100%; }
        header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-bottom: 18px; border-bottom: 3px solid #15a9cf; }
        header img { width: 92px; height: auto; object-fit: contain; }
        .brand { text-align: right; font-size: 11px; color: #5e6c7d; line-height: 1.5; }
        h1 { margin: 28px 0 8px; color: #08172b; font-size: 25px; line-height: 1.16; }
        .subtitle { margin: 0 0 18px; color: #486177; font-size: 13px; }
        .meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 18px; padding: 14px; border: 1px solid #c7d6e4; border-radius: 12px; background: #f4f8fb; margin-bottom: 24px; }
        .meta div { font-size: 11px; color: #5a6b7d; }
        .meta strong { display: block; margin-bottom: 3px; color: #10233a; font-size: 12px; }
        section { break-inside: avoid; margin: 18px 0; }
        h2 { margin: 0 0 8px; color: #0b243b; font-size: 15px; border-left: 4px solid #15a9cf; padding-left: 10px; }
        p { margin: 0 0 8px; font-size: 12.5px; line-height: 1.62; color: #26384e; }
        footer { position: fixed; left: 0; right: 0; bottom: 0; border-top: 1px solid #c7d6e4; padding-top: 8px; display: flex; justify-content: space-between; color: #6c7a8c; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="doc">
        <header>
          <img src="${logoUrl}" alt="Metamorfosis" />
          <div class="brand">
            <strong>METAMORFOSIS LAB</strong><br />
            Documento interno generado desde Metamorfosis OS<br />
            metamorfosislab.cl
          </div>
        </header>
        <h1>${escapeHtml(doc.title)}</h1>
        <p class="subtitle">${escapeHtml(doc.summary)}</p>
        <div class="meta">
          <div><strong>Código</strong>${escapeHtml(doc.code)}</div>
          <div><strong>Proyecto</strong>${escapeHtml(projectName)}</div>
          <div><strong>Tipo</strong>${escapeHtml(doc.type)}</div>
          <div><strong>Etapa</strong>${escapeHtml(doc.stage)}</div>
          <div><strong>Fecha</strong>${escapeHtml(doc.date)}</div>
          <div><strong>Versión</strong>${escapeHtml(doc.version)}</div>
          <div><strong>Estado</strong>${escapeHtml(doc.status)}</div>
          <div><strong>Responsable</strong>${escapeHtml(doc.responsible)}</div>
          <div><strong>Confidencialidad</strong>${escapeHtml(doc.confidentiality)}</div>
          <div><strong>Plantilla</strong>${escapeHtml(doc.templateName)}</div>
        </div>
        ${template.fields
          .map(([key, label]) => `<section><h2>${escapeHtml(label)}</h2>${paragraphize(doc.sections?.[key] || "")}</section>`)
          .join("")}
        <footer>
          <span>${escapeHtml(doc.code)} · ${escapeHtml(doc.confidentiality)}</span>
          <span>Metamorfosis Lab · Documento interno</span>
        </footer>
      </div>
      <script>window.onload = () => setTimeout(() => window.print(), 250);</script>
    </body>
  </html>`;
}

function printDocument(doc, projects) {
  const project = projects.find((item) => item.id === doc.projectId);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para descargar el PDF.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(renderDocumentHtml(doc, project));
  printWindow.document.close();
}

export default function DocumentosProyecto({ projects, activeProject, activeColor }) {
  const [documents, setDocuments] = useState(loadDocuments);
  const [selectedProjectId, setSelectedProjectId] = useState(activeProject?.id || projects[0]?.id);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || activeProject || projects[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(DOCUMENT_TEMPLATES[0].id);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(() => createDraft(selectedProject, DOCUMENT_TEMPLATES[0], 0));
  const [filters, setFilters] = useState({ search: "", project: "all", type: "all", stage: "all", status: "all", dateFrom: "", dateTo: "" });

  useEffect(() => {
    if (activeProject?.id) {
      setSelectedProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  useEffect(() => {
    persistDocuments(documents);
  }, [documents]);

  const selectedTemplate = getTemplate(selectedTemplateId);
  const projectCounts = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        count: documents.filter((doc) => doc.projectId === project.id).length,
      })),
    [documents, projects],
  );

  const filteredDocuments = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return documents.filter((doc) => {
      const haystack = `${doc.code} ${doc.title} ${doc.templateName} ${doc.projectTitle} ${doc.responsible}`.toLowerCase();
      if (search && !haystack.includes(search)) return false;
      if (filters.project !== "all" && doc.projectId !== filters.project) return false;
      if (filters.type !== "all" && doc.type !== filters.type) return false;
      if (filters.stage !== "all" && doc.stage !== filters.stage) return false;
      if (filters.status !== "all" && doc.status !== filters.status) return false;
      if (filters.dateFrom && doc.date < filters.dateFrom) return false;
      if (filters.dateTo && doc.date > filters.dateTo) return false;
      return true;
    });
  }, [documents, filters]);

  const saveDraft = (event) => {
    event.preventDefault();
    const payload = {
      ...draft,
      id: editingId || `doc-${Date.now()}`,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      type: selectedTemplate.type,
      updatedAt: new Date().toISOString(),
    };

    setDocuments((current) => {
      if (editingId) return current.map((doc) => (doc.id === editingId ? payload : doc));
      return [payload, ...current];
    });
    setEditingId(payload.id);
  };

  const startNewDocument = () => {
    const count = documents.filter((doc) => doc.projectId === selectedProject.id && doc.templateId === selectedTemplate.id).length;
    setEditingId(null);
    setDraft(createDraft(selectedProject, selectedTemplate, count));
  };

  const changeTemplate = (templateId) => {
    const template = getTemplate(templateId);
    setSelectedTemplateId(templateId);
    if (!editingId) {
      const count = documents.filter((doc) => doc.projectId === selectedProject.id && doc.templateId === template.id).length;
      setDraft(createDraft(selectedProject, template, count));
    } else {
      setDraft((current) => ({
        ...current,
        templateId: template.id,
        templateName: template.name,
        type: template.type,
        stage: template.stage,
        summary: template.description,
        sections: { ...createSections(template), ...current.sections },
      }));
    }
  };

  const changeProject = (projectId) => {
    const project = projects.find((item) => item.id === projectId) || selectedProject;
    setSelectedProjectId(projectId);
    if (!editingId) {
      const count = documents.filter((doc) => doc.projectId === project.id && doc.templateId === selectedTemplate.id).length;
      setDraft(createDraft(project, selectedTemplate, count));
    } else {
      setDraft((current) => ({ ...current, projectId: project.id, projectTitle: project.title }));
    }
  };

  const editDocument = (doc) => {
    setEditingId(doc.id);
    setSelectedProjectId(doc.projectId);
    setSelectedTemplateId(doc.templateId);
    setDraft(doc);
  };

  const removeDocument = (id) => {
    setDocuments((current) => current.filter((doc) => doc.id !== id));
    if (editingId === id) startNewDocument();
  };

  return (
    <article className="os-detail-card os-wide-card project-docs-module" style={{ "--project-color": activeColor }}>
      <div className="os-card-heading project-docs-heading">
        <div>
          <p className="os-eyebrow">Documentos por Proyecto</p>
          <h2>Centro documental interno</h2>
          <p>
            Crea documentos institucionales desde plantillas, asócialos a un proyecto, guarda versiones y descarga una vista imprimible en PDF.
          </p>
        </div>
        <div className="project-docs-actions">
          <button type="button" onClick={startNewDocument}>Crear documento</button>
          <button type="button" onClick={() => downloadJson(`metamorfosis-documentos-${today()}.json`, { exportedAt: new Date().toISOString(), documents })}>
            Exportar respaldo JSON
          </button>
        </div>
      </div>

      <section className="project-docs-overview" aria-label="Vista general de proyectos">
        {projectCounts.map((project) => (
          <button
            key={project.id}
            type="button"
            className={project.id === selectedProject.id ? "project-doc-project is-active" : "project-doc-project"}
            onClick={() => changeProject(project.id)}
          >
            <span>{project.count}</span>
            <strong>{project.title}</strong>
            <small>{project.status}</small>
          </button>
        ))}
      </section>

      <section className="project-docs-layout">
        <aside className="project-docs-center">
          <div className="project-docs-filter-card">
            <h3>Centro documental por proyecto</h3>
            <p>Proyecto activo: <b>{selectedProject.title}</b></p>
            <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Buscar por código, título, responsable..." />
            <div className="project-docs-filter-grid">
              <select value={filters.project} onChange={(event) => setFilters({ ...filters, project: event.target.value })}>
                <option value="all">Todos los proyectos</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
              </select>
              <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
                <option value="all">Todos los tipos</option>
                {[...new Set(DOCUMENT_TEMPLATES.map((template) => template.type))].map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <select value={filters.stage} onChange={(event) => setFilters({ ...filters, stage: event.target.value })}>
                <option value="all">Todas las etapas</option>
                {METHOD_STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
              <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
                <option value="all">Todos los estados</option>
                {DOCUMENT_STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <input type="date" value={filters.dateFrom} onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })} />
              <input type="date" value={filters.dateTo} onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })} />
            </div>
          </div>

          <div className="project-docs-list">
            {filteredDocuments.length === 0 ? (
              <p className="project-docs-empty">Todavía no hay documentos guardados con estos filtros.</p>
            ) : (
              filteredDocuments.map((doc) => (
                <article key={doc.id} className={doc.id === editingId ? "project-doc-row is-active" : "project-doc-row"}>
                  <span>{doc.code}</span>
                  <strong>{doc.title}</strong>
                  <p>{doc.projectTitle} · {doc.type} · {doc.stage}</p>
                  <small>{doc.status} · {doc.date} · {doc.version}</small>
                  <div>
                    <button type="button" onClick={() => editDocument(doc)}>Editar</button>
                    <button type="button" onClick={() => printDocument(doc, projects)}>Descargar PDF</button>
                    <button type="button" onClick={() => downloadJson(`${doc.code}.json`, doc)}>JSON</button>
                    <button type="button" onClick={() => removeDocument(doc.id)}>Eliminar</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>

        <section className="project-docs-editor">
          <form onSubmit={saveDraft} className="project-docs-form">
            <div className="project-docs-meta-grid">
              <label>
                Proyecto
                <select value={selectedProject.id} onChange={(event) => changeProject(event.target.value)}>
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                </select>
              </label>
              <label>
                Plantilla
                <select value={selectedTemplateId} onChange={(event) => changeTemplate(event.target.value)}>
                  {DOCUMENT_TEMPLATES.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                </select>
              </label>
              <label>
                Código automático
                <input value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} />
              </label>
              <label>
                Fecha
                <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
              </label>
              <label>
                Versión
                <input value={draft.version} onChange={(event) => setDraft({ ...draft, version: event.target.value })} />
              </label>
              <label>
                Estado
                <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                  {DOCUMENT_STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label>
                Responsable
                <input value={draft.responsible} onChange={(event) => setDraft({ ...draft, responsible: event.target.value })} />
              </label>
              <label>
                Etapa del método
                <select value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value })}>
                  {METHOD_STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
              </label>
              <label>
                Confidencialidad
                <select value={draft.confidentiality} onChange={(event) => setDraft({ ...draft, confidentiality: event.target.value })}>
                  {CONFIDENTIALITY_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
              </label>
            </div>

            <label>
              Título del documento
              <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            </label>

            <label>
              Resumen interno
              <textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
            </label>

            <div className="project-docs-sections">
              {selectedTemplate.fields.map(([key, label]) => (
                <label key={key}>
                  {label}
                  <textarea
                    value={draft.sections?.[key] || ""}
                    onChange={(event) => setDraft({ ...draft, sections: { ...draft.sections, [key]: event.target.value } })}
                    placeholder={`Completar: ${label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>

            <div className="project-docs-actions-bottom">
              <button type="submit">Guardar documento</button>
              <button type="button" onClick={() => printDocument(draft, projects)}>Previsualizar / Descargar PDF</button>
              <button type="button" onClick={() => downloadJson(`${draft.code || "documento"}.json`, draft)}>Exportar este JSON</button>
            </div>
          </form>

          <div className="project-doc-preview" aria-label="Vista previa institucional">
            <header>
              <img src="/logo-1.png" alt="Metamorfosis" />
              <div>
                <strong>METAMORFOSIS LAB</strong>
                <span>Documento interno · {draft.confidentiality}</span>
              </div>
            </header>
            <h3>{draft.title}</h3>
            <p>{draft.summary}</p>
            <dl>
              <div><dt>Código</dt><dd>{draft.code}</dd></div>
              <div><dt>Proyecto</dt><dd>{selectedProject.title}</dd></div>
              <div><dt>Tipo</dt><dd>{selectedTemplate.type}</dd></div>
              <div><dt>Etapa</dt><dd>{draft.stage}</dd></div>
              <div><dt>Fecha</dt><dd>{draft.date}</dd></div>
              <div><dt>Versión</dt><dd>{draft.version}</dd></div>
              <div><dt>Estado</dt><dd>{draft.status}</dd></div>
              <div><dt>Responsable</dt><dd>{draft.responsible}</dd></div>
            </dl>
            {selectedTemplate.fields.map(([key, label]) => (
              <section key={key}>
                <h4>{label}</h4>
                <p>{draft.sections?.[key] || "Sin contenido registrado."}</p>
              </section>
            ))}
            <footer>Metamorfosis OS · {draft.code}</footer>
          </div>
        </section>
      </section>
    </article>
  );
}
