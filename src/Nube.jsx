import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Info, Layers, Download, Table2, Network, X, Printer } from "lucide-react";

/**
 * Mapa mental interactivo para explicar IaaS, PaaS, SaaS y CaaS.
 * - Vista Mapa: nodo central + nodos alrededor, con panel de detalles.
 * - Vista Comparativa: tabla con responsabilidades, ventajas, desventajas y ejemplos.
 * - Búsqueda: resalta términos.
 * - Imprimir: abre el diálogo de impresión del navegador.
 *
 * Requisitos del canvas:
 *  - TailwindCSS disponible (el entorno de canvas lo incluye).
 *  - framer-motion y lucide-react disponibles.
 */

const DATA = {
  center: {
    id: "xaas",
    title: "Servicios en la nube",
    subtitle: "Modelos XaaS (IaaS · PaaS · SaaS · CaaS)",
    note:
      "Diferencias clave: nivel de control y responsabilidad que asumes vs. lo que gestiona el proveedor.",
  },
  nodes: [
    {
      id: "iaas",
      title: "IaaS",
      label: "Infraestructura como Servicio",
      color: "from-blue-500 to-blue-700",
      angle: -30,
      summary:
        "Recursos de infraestructura bajo demanda: cómputo, red, almacenamiento, virtualización. Tú gestionas SO, middleware y aplicaciones.",
      analogy:
        "Contratas una constructora que te entrega la casa (infraestructura), pero tú decides y gestionas todo dentro.",
      examples: ["AWS EC2", "Azure VMs", "Google Compute Engine"],
      responsibilities: {
        user: ["Sistema Operativo", "Middleware/Runtime", "Datos", "Aplicaciones", "Seguridad a nivel SO"],
        provider: ["Hardware", "Red", "Almacenamiento", "Virtualización", "Datacenter"],
      },
      pros: [
        "Máximo control sobre la infraestructura",
        "Escalabilidad bajo demanda (pago por uso)",
        "Menos inversiones iniciales y aprovisionamiento más ágil",
      ],
      cons: [
        "Gestión propia de seguridad/backup de datos",
        "Mayor complejidad operativa (parches, configuración)",
        "Migrar apps legadas puede ser retador",
      ],
    },
    {
      id: "caas",
      title: "CaaS",
      label: "Contenedores como Servicio",
      color: "from-emerald-500 to-emerald-700",
      angle: 30,
      summary:
        "Entrega y orquestación de contenedores: ejecuta, escala y opera apps en contenedores sin construir la plataforma subyacente.",
      analogy:
        "Alquilas una casa lista para habitar, tú traes los muebles (tu app en contenedores) y configuras el espacio.",
      examples: ["GKE", "EKS", "AKS", "Cloud Run (container)", "OpenShift"],
      responsibilities: {
        user: ["Imágenes y código", "Datos", "Configuración de despliegue", "Políticas a nivel app"],
        provider: ["Cluster/orquestador", "Escalado autoservicio", "Networking de pods/servicios", "Registro y monitoreo base"],
      },
      pros: [
        "Ideal para microservicios y despliegues portables",
        "Time‑to‑market ágil y pipelines estandarizados",
        "Control fino de red y componentes",
      ],
      cons: [
        "Requiere buenas prácticas de seguridad de contenedores",
        "Compatibilidad y límites varían por proveedor",
      ],
    },
    {
      id: "paas",
      title: "PaaS",
      label: "Plataforma como Servicio",
      color: "from-purple-500 to-purple-700",
      angle: 150,
      summary:
        "Plataforma gestionada para desarrollar y desplegar: escribes código y datos; el proveedor gestiona servidores, runtime y escalado.",
      analogy:
        "Alquilas una casa amueblada: traes tus pertenencias (código) y te olvidas del mantenimiento.",
      examples: ["App Engine", "Azure App Service", "Heroku", "Cloud Run (managed)"],
      responsibilities: {
        user: ["Código", "Datos", "Configuración de la app"],
        provider: ["SO/Runtime", "Servidores", "Escalado", "Seguridad y parches base", "Observabilidad base"],
      },
      pros: [
        "Productividad alta (menos DevOps)",
        "Escalabilidad automática",
        "Menos superficie de mantenimiento",
      ],
      cons: [
        "Menos control y personalización",
        "Dependencia del proveedor (lock‑in)",
        "Pila tecnológica acotada",
      ],
    },
    {
      id: "saas",
      title: "SaaS",
      label: "Software como Servicio",
      color: "from-orange-500 to-orange-700",
      angle: -150,
      summary:
        "Aplicación completa lista para usar vía web. El proveedor gestiona toda la pila; tú administras tus usuarios y datos.",
      analogy:
        "Te mudas a una casa terminada con servicios incluidos; solo la usas y pagas la cuota.",
      examples: ["Google Workspace", "Microsoft 365", "Salesforce", "Slack"],
      responsibilities: {
        user: ["Datos y configuración funcional", "Gestión de usuarios y permisos"],
        provider: ["Aplicación", "Plataforma", "Infraestructura", "Actualizaciones y parches"],
      },
      pros: [
        "Tiempo de arranque mínimo",
        "Sin instalación local; acceso desde cualquier dispositivo",
        "Operado y mantenido por el proveedor",
      ],
      cons: [
        "Pocas opciones de personalización profunda",
        "Integraciones pueden requerir trabajo",
        "Dependencia del roadmap del proveedor",
      ],
    },
  ],
  context: [
    {
      id: "onprem",
      title: "On‑premise",
      summary:
        "Todo en tu datacenter: compras hardware, instalas y operas de extremo a extremo.",
    },
    {
      id: "faas",
      title: "FaaS",
      summary:
        "Función como Servicio: despliegas funciones/eventos sin gestionar servidores; escalado por invocación.",
      examples: ["Cloud Functions", "AWS Lambda", "Azure Functions"],
    },
  ],
};

const LAYERS = [
  "Datos",
  "Aplicación",
  "Runtime/Middleware",
  "Sistema Operativo",
  "Virtualización",
  "Red/Almacenamiento/Hardware",
  "Datacenter",
];

function usePolarPositions(radius = 300) {
  // Calcula posiciones mejoradas para los nodos principales con mejor distribución
  return useMemo(() => {
    const positions = [
      { id: "iaas", x: 350, y: -200 },    // Arriba derecha
      { id: "caas", x: 350, y: 200 },     // Abajo derecha  
      { id: "paas", x: -350, y: -200 },   // Arriba izquierda
      { id: "saas", x: -350, y: 200 },    // Abajo izquierda
    ];
    return positions;
  }, [radius]);
}

function Highlight({ text, query }) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "i"));
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className={p.toLowerCase() === query.toLowerCase() ? "bg-yellow-200 rounded px-0.5" : ""}>
          {p}
        </span>
      ))}
    </>
  );
}

function Chip({ children }) {
  return (
    <span className="text-xs rounded-full px-2 py-0.5 bg-slate-100 border border-slate-200">
      {children}
    </span>
  );
}

function ResponsibilityStack({ item }) {
  const belongsTo = (layer) => {
    const l = layer.toLowerCase();
    const u = (item.responsibilities?.user || []).join(" ").toLowerCase();
    const p = (item.responsibilities?.provider || []).join(" ").toLowerCase();
    return u.includes(l) ? "user" : p.includes(l) ? "provider" : null;
  };

  return (
    <div className="d-grid gap-1">
      {LAYERS.map((layer) => {
        const owner = belongsTo(layer);
        const bgClass = 
          owner === "user" ? "bg-primary bg-opacity-10 border-primary" :
          owner === "provider" ? "bg-success bg-opacity-10 border-success" :
          "bg-light border-secondary opacity-75";
        
        return (
          <div key={layer} className={`d-flex justify-content-between align-items-center p-2 rounded border ${bgClass}`}>
            <small className="fw-medium">{layer}</small>
            <span className="badge bg-secondary bg-opacity-50" style={{fontSize: '0.65rem'}}>
              {owner === "user" ? "Cliente" : owner === "provider" ? "Proveedor" : "Mixto"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DetailPanel({ open, onClose, item, query }) {
  return (
    <AnimatePresence>
      {open && item && (
        <motion.aside
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="position-fixed end-0 top-0 h-100 bg-white shadow-lg border-start"
          style={{ width: '400px', zIndex: 1050 }}
        >
          <div className="card h-100 border-0">
            <div className="card-header d-flex justify-content-between align-items-center bg-light">
              <div>
                <small className="text-muted text-uppercase fw-bold">Detalle</small>
                <h5 className="card-title mb-0 fw-bold">
                  {item.title} <small className="text-muted">{item.label || ""}</small>
                </h5>
              </div>
              <button onClick={onClose} className="btn btn-sm btn-outline-secondary rounded-circle p-2">
                <X size={16} />
              </button>
            </div>
            
            <div className="card-body overflow-auto">
              <p className="text-muted mb-3">
                <Highlight text={item.summary} query={query} />
              </p>
              
              {item.analogy && (
                <div className="alert alert-warning mb-3">
                  <h6 className="alert-heading d-flex align-items-center gap-2">
                    <i className="bi bi-lightbulb-fill"></i> Analogía
                  </h6>
                  <p className="mb-0 small">
                    <Highlight text={item.analogy} query={query} />
                  </p>
                </div>
              )}

              {item.examples?.length ? (
                <div className="mb-3">
                  <h6 className="text-primary fw-bold mb-2">Ejemplos</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {item.examples.map((e) => (
                      <span key={e} className="badge bg-light text-dark border">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {item.responsibilities && (
                <div className="mb-4">
                  <h6 className="text-primary fw-bold mb-2 d-flex align-items-center gap-2">
                    <Layers size={16}/> Responsabilidades por capa
                  </h6>
                  <ResponsibilityStack item={item} />
                  <small className="text-muted mt-2 d-block">
                    <span className="badge bg-primary me-1"></span>Cliente |
                    <span className="badge bg-success mx-1"></span>Proveedor |
                    <span className="badge bg-secondary ms-1"></span>Mixto
                  </small>
                </div>
              )}

              {item.pros?.length ? (
                <div className="mb-3">
                  <h6 className="text-success fw-bold mb-2">✓ Ventajas</h6>
                  <ul className="list-unstyled">
                    {item.pros.map((p, i) => (
                      <li key={i} className="mb-2 small">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <Highlight text={p} query={query} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {item.cons?.length ? (
                <div className="mb-3">
                  <h6 className="text-warning fw-bold mb-2">⚠ Inconvenientes</h6>
                  <ul className="list-unstyled">
                    {item.cons.map((c, i) => (
                      <li key={i} className="mb-2 small">
                        <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                        <Highlight text={c} query={query} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="alert alert-info mt-4">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  Usa este panel para guiar la discusión y compara con otros modelos desde la pestaña "Comparativa".
                </small>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Legend() {
  return (
    <div className="d-flex align-items-center gap-2 small text-muted">
      <span className="badge bg-primary" style={{width: '12px', height: '12px'}}></span> Cliente
      <span className="badge bg-success" style={{width: '12px', height: '12px'}}></span> Proveedor  
      <span className="badge bg-secondary" style={{width: '12px', height: '12px'}}></span> Mixto
    </div>
  );
}

function ComparisonTable({ query }) {
  const items = DATA.nodes;
  const highlight = (t) => <Highlight text={t} query={query} />;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col" className="fw-bold text-primary">Modelo</th>
            <th scope="col" className="fw-bold text-primary">¿Qué es?</th>
            <th scope="col" className="fw-bold text-primary">Responsabilidades</th>
            <th scope="col" className="fw-bold text-primary">Ventajas</th>
            <th scope="col" className="fw-bold text-primary">Inconvenientes</th>
            <th scope="col" className="fw-bold text-primary">Ejemplos</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td className="fw-bold text-dark">{it.title}</td>
              <td className="small">{highlight(it.summary)}</td>
              <td className="small">
                <div className="mb-2">
                  <strong className="text-primary">Cliente:</strong><br/>
                  <small className="text-muted">{it.responsibilities?.user?.join(", ")}</small>
                </div>
                <div>
                  <strong className="text-success">Proveedor:</strong><br/>
                  <small className="text-muted">{it.responsibilities?.provider?.join(", ")}</small>
                </div>
              </td>
              <td className="small">
                <ul className="list-unstyled mb-0">
                  {it.pros?.map((p, i) => (
                    <li key={i} className="mb-1">
                      <i className="bi bi-check-circle-fill text-success me-1"></i>
                      {highlight(p)}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="small">
                <ul className="list-unstyled mb-0">
                  {it.cons?.map((c, i) => (
                    <li key={i} className="mb-1">
                      <i className="bi bi-x-circle-fill text-warning me-1"></i>
                      {highlight(c)}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <div className="d-flex flex-wrap gap-1">
                  {it.examples?.map((e) => (
                    <span key={e} className="badge bg-light text-dark border">
                      {e}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function XaaSMindMap() {
  const [mode, setMode] = useState("map"); // map | table
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const positions = usePolarPositions();

  const current = useMemo(() => DATA.nodes.find((n) => n.id === openId) || null, [openId]);

  const onPrint = () => window.print();

  return (
    <div className="map-container min-h-screen text-dark p-3">
      {/* Header con Bootstrap */}
      <div className="container-fluid mb-4">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-8">
            <h1 className="display-6 fw-bold text-white d-flex align-items-center gap-2">
              <Network className="text-warning"/> Mapa mental: IaaS · PaaS · SaaS · CaaS
            </h1>
            <p className="lead text-white-50">Diferencias por nivel de control, responsabilidades, ventajas y ejemplos.</p>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-2 justify-content-end">
              <div className="input-group">
                <span className="input-group-text bg-white border-0">
                  <Search size={16} className="text-muted"/>
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar término…"
                  className="form-control border-0 shadow-sm"
                />
              </div>
              <button 
                onClick={() => setMode(mode === "map" ? "table" : "map")} 
                className="btn btn-light shadow-sm d-flex align-items-center gap-2"
              >
                {mode === "map" ? <><Table2 size={16}/> Comparativa</> : <><Network size={16}/> Mapa</>}
              </button>
              <button 
                onClick={onPrint} 
                className="btn btn-outline-light shadow-sm d-flex align-items-center gap-2"
              >
                <Printer size={16}/> Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar con Bootstrap */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0 sticky-top" style={{top: '20px'}}>
              <div className="card-body">
                <h6 className="card-title d-flex align-items-center gap-2 mb-3">
                  <Info size={16} className="text-primary"/> Pistas para la clase
                </h6>
                <ul className="list-unstyled small">
                  <li className="mb-2">• Enfatiza <strong>quién gestiona qué</strong> en cada modelo.</li>
                  <li className="mb-2">• Usa las <strong>analogías de la casa</strong> para fijar conceptos.</li>
                  <li className="mb-2">• Muestra la <strong>tabla comparativa</strong> para examinar pros y contras.</li>
                </ul>
                <div className="mt-3">
                  <Legend/>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-lg-9">
            {mode === "map" ? (
              <div className="card shadow border-0" style={{height: '700px', position: 'relative', overflow: 'hidden'}}>
                <div className="card-body p-0 position-relative h-100">
                  {/* Centro mejorado */}
                  <div 
                    className="position-absolute start-50 top-50 translate-middle"
                    style={{width: '350px', zIndex: 10}}
                  >
                    <motion.div
                      layout
                      className="card border-3 border-warning shadow-lg service-card"
                      style={{backgroundColor: 'rgba(255,255,255,0.95)'}}
                    >
                      <div className="card-body text-center">
                        <small className="text-muted text-uppercase fw-bold">{DATA.center.subtitle}</small>
                        <h4 className="card-title fw-bold text-primary mt-2">{DATA.center.title}</h4>
                        <p className="card-text small text-muted">{DATA.center.note}</p>
                        <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                          {DATA.context.map((c) => (
                            <span key={c.id} className="badge bg-light text-dark border">
                              {c.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Conexiones SVG */}
                  <svg className="position-absolute w-100 h-100" style={{pointerEvents: 'none', zIndex: 1}}>
                    {positions.map((pos) => {
                      const centerX = 350; // Centro aproximado del contenedor
                      const centerY = 350;
                      const nodeX = centerX + pos.x;
                      const nodeY = centerY + pos.y;
                      return (
                        <line
                          key={pos.id}
                          x1={centerX}
                          y1={centerY}
                          x2={nodeX}
                          y2={nodeY}
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth={3}
                          strokeDasharray="5,5"
                        />
                      );
                    })}
                  </svg>

                  {/* Nodos mejorados */}
                  {DATA.nodes.map((node) => {
                    const pos = positions.find((p) => p.id === node.id);
                    const left = `calc(50% + ${pos?.x || 0}px - 175px)`;
                    const top = `calc(50% + ${pos?.y || 0}px - 100px)`;
                    const q = query.trim().toLowerCase();
                    const matches = q && (
                      node.title.toLowerCase().includes(q) ||
                      node.summary.toLowerCase().includes(q) ||
                      node.analogy?.toLowerCase().includes(q)
                    );

                    // Colores Bootstrap para cada servicio
                    const getBootstrapColor = (id) => {
                      const colors = {
                        iaas: 'primary',
                        paas: 'success', 
                        saas: 'warning',
                        caas: 'info'
                      };
                      return colors[id] || 'secondary';
                    };

                    return (
                      <motion.div
                        key={node.id}
                        className="position-absolute"
                        style={{ left, top, width: '350px', zIndex: 5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div 
                          className={`card border-0 shadow service-card cursor-pointer bg-${getBootstrapColor(node.id)} text-white h-100`}
                          onClick={() => setOpenId(node.id)}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="card-body">
                            <small className="text-uppercase opacity-75 fw-bold">{node.label}</small>
                            <h5 className="card-title fw-bold mt-1">{node.title}</h5>
                            <p className="card-text small opacity-90" style={{fontSize: '0.85rem'}}>
                              <Highlight text={node.summary} query={query} />
                            </p>
                            <div className="d-flex flex-wrap gap-1 mt-2">
                              {node.examples.slice(0, 3).map((e) => (
                                <span key={e} className="badge bg-light bg-opacity-25 text-white border border-light border-opacity-50" style={{fontSize: '0.7rem'}}>
                                  {e}
                                </span>
                              ))}
                            </div>
                            {matches && (
                              <div className="mt-2">
                                <span className="badge bg-warning text-dark">
                                  Coincidencia: "{query}"
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card shadow border-0">
                <div className="card-body p-0">
                  <ComparisonTable query={query} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailPanel open={!!openId} onClose={() => setOpenId(null)} item={current} query={query} />

      {/* Footer */}
      <div className="container-fluid mt-4">
        <div className="text-center">
          <small className="text-white-50">
            Sugerencia didáctica: inicia en SaaS (consumo), sube a PaaS/CaaS (construcción) y termina en IaaS (control). Añade FaaS para eventos.
          </small>
        </div>
      </div>
    </div>
  );
}
