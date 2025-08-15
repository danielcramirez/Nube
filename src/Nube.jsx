import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Info, Layers, Download, Table2, Network, X, Printer, Cloud, Building2, Zap, Award, Globe, DollarSign, Users, CheckCircle, AlertTriangle } from "lucide-react";

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

const CLOUD_PROVIDERS = {
  aws: {
    id: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    logo: "🟠",
    founded: "2006",
    marketShare: "32%",
    regions: "31+ regiones",
    headquarters: "Seattle, EE.UU.",
    strengths: [
      "Ecosistema más amplio de servicios (200+)",
      "Pionero en cloud computing",
      "Mayor red global de infraestructura",
      "Comunidad y documentación extensa"
    ],
    weaknesses: [
      "Curva de aprendizaje empinada",
      "Costos pueden crecer rápidamente",
      "Interfaz puede ser compleja"
    ],
    services: {
      iaas: {
        compute: "EC2 (Elastic Compute Cloud)",
        storage: "S3, EBS, EFS",
        network: "VPC, CloudFront, Route 53",
        specialty: "Instancias especializadas (GPU, ARM, etc.)"
      },
      paas: {
        compute: "Elastic Beanstalk",
        serverless: "Lambda",
        containers: "ECS, Fargate",
        specialty: "AWS App Runner"
      },
      saas: {
        productivity: "WorkSpaces, Chime",
        analytics: "QuickSight",
        security: "GuardDuty, Inspector",
        specialty: "Amazon Connect (contact center)"
      },
      caas: {
        orchestration: "EKS (Kubernetes)",
        containers: "ECS, Fargate",
        registry: "ECR",
        specialty: "AWS Copilot"
      }
    },
    pricing: "Pay-as-you-go, Reserved Instances, Spot Instances",
    bestFor: ["Startups escalables", "Empresas que necesitan flexibilidad", "Desarrollo ágil"],
    certifications: ["Cloud Practitioner", "Solutions Architect", "Developer", "SysOps Administrator"]
  },
  azure: {
    id: "azure",
    name: "Microsoft Azure",
    shortName: "Azure",
    logo: "🔵",
    founded: "2010",
    marketShare: "23%",
    regions: "60+ regiones",
    headquarters: "Redmond, EE.UU.",
    strengths: [
      "Integración perfecta con ecosistema Microsoft",
      "Soluciones híbridas líderes",
      "Active Directory empresarial",
      "Fuerte en IA y Machine Learning"
    ],
    weaknesses: [
      "Menor variedad de servicios que AWS",
      "Documentación a veces inconsistente",
      "Algunos servicios menos maduros"
    ],
    services: {
      iaas: {
        compute: "Virtual Machines",
        storage: "Blob Storage, Disk Storage",
        network: "Virtual Network, CDN, DNS",
        specialty: "Azure Stack (híbrido)"
      },
      paas: {
        compute: "App Service",
        serverless: "Azure Functions",
        containers: "Container Instances",
        specialty: "Azure Spring Apps"
      },
      saas: {
        productivity: "Microsoft 365, Teams",
        analytics: "Power BI",
        security: "Azure Sentinel",
        specialty: "Dynamics 365"
      },
      caas: {
        orchestration: "AKS (Azure Kubernetes Service)",
        containers: "Container Instances",
        registry: "Container Registry",
        specialty: "Azure Container Apps"
      }
    },
    pricing: "Pay-as-you-go, Reserved VM Instances, Azure Hybrid Benefit",
    bestFor: ["Empresas con Microsoft Stack", "Soluciones híbridas", "Transformación digital"],
    certifications: ["Azure Fundamentals", "Azure Administrator", "Azure Developer", "Azure Architect"]
  },
  gcp: {
    id: "gcp",
    name: "Google Cloud Platform",
    shortName: "GCP",
    logo: "🔴",
    founded: "2008",
    marketShare: "10%",
    regions: "35+ regiones",
    headquarters: "Mountain View, EE.UU.",
    strengths: [
      "Líderes en IA/ML y Big Data",
      "Kubernetes nativo (creado por Google)",
      "Red global de alta velocidad",
      "Precios competitivos y transparentes"
    ],
    weaknesses: [
      "Menor ecosistema de terceros",
      "Menos servicios enterprise tradicionales",
      "Soporte al cliente menos robusto"
    ],
    services: {
      iaas: {
        compute: "Compute Engine",
        storage: "Cloud Storage, Persistent Disk",
        network: "VPC, Cloud CDN, Cloud DNS",
        specialty: "Preemptible VMs (económicas)"
      },
      paas: {
        compute: "App Engine",
        serverless: "Cloud Functions",
        containers: "Cloud Run",
        specialty: "Firebase (móvil)"
      },
      saas: {
        productivity: "Google Workspace",
        analytics: "Looker, Data Studio",
        security: "Chronicle",
        specialty: "Google Maps Platform"
      },
      caas: {
        orchestration: "GKE (Google Kubernetes Engine)",
        containers: "Cloud Run",
        registry: "Container Registry",
        specialty: "Anthos (multi-cloud)"
      }
    },
    pricing: "Pay-as-you-go, Committed Use Discounts, Sustained Use Discounts",
    bestFor: ["Análisis de datos y IA", "Aplicaciones cloud-native", "Startups tech"],
    certifications: ["Cloud Digital Leader", "Associate Cloud Engineer", "Professional Architect"]
  },
  oracle: {
    id: "oracle",
    name: "Oracle Cloud Infrastructure",
    shortName: "OCI",
    logo: "🔶",
    founded: "2016",
    marketShare: "2%",
    regions: "44+ regiones",
    headquarters: "Austin, EE.UU.",
    strengths: [
      "Rendimiento superior en bases de datos",
      "Precios muy competitivos",
      "Autonomous Database (auto-gestionada)",
      "Fuerte en workloads enterprise"
    ],
    weaknesses: [
      "Ecosistema más pequeño",
      "Menos adopción en startups",
      "Documentación limitada en español"
    ],
    services: {
      iaas: {
        compute: "Compute Instances",
        storage: "Object Storage, Block Volume",
        network: "Virtual Cloud Network",
        specialty: "Bare Metal Servers"
      },
      paas: {
        compute: "Container Engine",
        serverless: "Functions",
        containers: "Container Instances",
        specialty: "Autonomous Database"
      },
      saas: {
        productivity: "Oracle Fusion Applications",
        analytics: "Analytics Cloud",
        security: "Cloud Guard",
        specialty: "NetSuite ERP"
      },
      caas: {
        orchestration: "Container Engine for Kubernetes",
        containers: "Container Instances",
        registry: "Container Registry",
        specialty: "Oracle Functions"
      }
    },
    pricing: "Pay-as-you-go, Universal Credits, Bring Your Own License",
    bestFor: ["Empresas con Oracle Database", "Workloads de alto rendimiento", "Migración de Oracle on-premise"],
    certifications: ["Cloud Infrastructure Foundations", "Architect Associate", "Developer Associate"]
  }
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

function ProviderCard({ provider, onSelect, isSelected }) {
  return (
    <motion.div
      className={`card h-100 cursor-pointer border-2 ${isSelected ? 'border-primary' : 'border-light'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(provider.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body text-center">
        <div className="display-1 mb-3">{provider.logo}</div>
        <h5 className="card-title fw-bold">{provider.shortName}</h5>
        <h6 className="card-subtitle text-muted mb-3">{provider.name}</h6>
        
        <div className="row text-center mb-3">
          <div className="col-6">
            <small className="text-muted">Cuota de mercado</small>
            <div className="fw-bold text-primary">{provider.marketShare}</div>
          </div>
          <div className="col-6">
            <small className="text-muted">Fundado</small>
            <div className="fw-bold text-success">{provider.founded}</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <Globe size={16} className="text-info"/>
            <small className="text-muted">{provider.regions}</small>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <Building2 size={16} className="text-secondary"/>
            <small className="text-muted">{provider.headquarters}</small>
          </div>
        </div>

        <div className="mt-auto">
          <small className="text-muted">Ideal para:</small>
          <div className="mt-1">
            {provider.bestFor.slice(0, 2).map((use, i) => (
              <span key={i} className="badge bg-light text-dark me-1 mb-1" style={{fontSize: '0.7rem'}}>
                {use}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProviderDetail({ provider, onClose }) {
  if (!provider) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 420, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="position-fixed end-0 top-0 h-100 bg-white shadow-lg border-start"
        style={{ width: '450px', zIndex: 1050 }}
      >
        <div className="card h-100 border-0">
          <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            <div className="d-flex align-items-center gap-3">
              <span className="display-6">{provider.logo}</span>
              <div>
                <h5 className="card-title mb-0 fw-bold">{provider.shortName}</h5>
                <small className="opacity-75">{provider.name}</small>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-sm btn-outline-light rounded-circle p-2">
              <X size={16} />
            </button>
          </div>
          
          <div className="card-body overflow-auto">
            {/* Estadísticas clave */}
            <div className="row mb-4">
              <div className="col-6">
                <div className="text-center p-3 bg-light rounded">
                  <DollarSign className="text-success mb-2"/>
                  <div className="fw-bold">{provider.marketShare}</div>
                  <small className="text-muted">Cuota mercado</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-3 bg-light rounded">
                  <Globe className="text-info mb-2"/>
                  <div className="fw-bold">{provider.regions}</div>
                  <small className="text-muted">Regiones</small>
                </div>
              </div>
            </div>

            {/* Fortalezas */}
            <div className="mb-4">
              <h6 className="text-success fw-bold mb-2 d-flex align-items-center gap-2">
                <CheckCircle size={16}/> Fortalezas
              </h6>
              <ul className="list-unstyled">
                {provider.strengths.map((strength, i) => (
                  <li key={i} className="mb-2 small d-flex align-items-start gap-2">
                    <CheckCircle size={14} className="text-success mt-1 flex-shrink-0"/>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Debilidades */}
            <div className="mb-4">
              <h6 className="text-warning fw-bold mb-2 d-flex align-items-center gap-2">
                <AlertTriangle size={16}/> Consideraciones
              </h6>
              <ul className="list-unstyled">
                {provider.weaknesses.map((weakness, i) => (
                  <li key={i} className="mb-2 small d-flex align-items-start gap-2">
                    <AlertTriangle size={14} className="text-warning mt-1 flex-shrink-0"/>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios por categoría */}
            <div className="mb-4">
              <h6 className="text-primary fw-bold mb-3">Servicios Principales</h6>
              
              {Object.entries(provider.services).map(([category, services]) => (
                <div key={category} className="mb-3">
                  <div className="fw-bold text-capitalize mb-2 text-primary">
                    {category === 'iaas' ? 'IaaS' : 
                     category === 'paas' ? 'PaaS' : 
                     category === 'saas' ? 'SaaS' : 'CaaS'}
                  </div>
                  <div className="ps-3">
                    {Object.entries(services).map(([type, service]) => (
                      <div key={type} className="mb-1">
                        <small className="text-muted text-capitalize">{type}:</small>
                        <div className="small fw-medium">{service}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Precios */}
            <div className="mb-4">
              <h6 className="text-info fw-bold mb-2 d-flex align-items-center gap-2">
                <DollarSign size={16}/> Modelo de Precios
              </h6>
              <p className="small text-muted">{provider.pricing}</p>
            </div>

            {/* Certificaciones */}
            <div className="mb-4">
              <h6 className="text-purple fw-bold mb-2 d-flex align-items-center gap-2">
                <Award size={16}/> Certificaciones
              </h6>
              <div className="d-flex flex-wrap gap-1">
                {provider.certifications.map((cert, i) => (
                  <span key={i} className="badge bg-secondary" style={{fontSize: '0.7rem'}}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Ideal para */}
            <div className="alert alert-info">
              <h6 className="alert-heading d-flex align-items-center gap-2">
                <Users size={16}/> Ideal para:
              </h6>
              <ul className="list-unstyled mb-0">
                {provider.bestFor.map((use, i) => (
                  <li key={i} className="small">• {use}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function ProvidersView({ query, onProviderSelect, selectedProvider }) {
  const providers = Object.values(CLOUD_PROVIDERS);
  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(query.toLowerCase()) ||
    provider.shortName.toLowerCase().includes(query.toLowerCase()) ||
    provider.strengths.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body text-white text-center py-5">
              <Cloud size={48} className="mb-3"/>
              <h2 className="card-title fw-bold mb-3">Proveedores de Nube</h2>
              <p className="lead mb-0">Compara las principales plataformas cloud del mercado</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredProviders.map(provider => (
          <div key={provider.id} className="col-md-6 col-xl-3">
            <ProviderCard 
              provider={provider} 
              onSelect={onProviderSelect}
              isSelected={selectedProvider === provider.id}
            />
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-5">
          <Cloud size={48} className="text-muted mb-3"/>
          <h5 className="text-muted">No se encontraron proveedores</h5>
          <p className="text-muted">Intenta con otros términos de búsqueda</p>
        </div>
      )}
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
  const [mode, setMode] = useState("map"); // map | table | providers
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const positions = usePolarPositions();

  const current = useMemo(() => DATA.nodes.find((n) => n.id === openId) || null, [openId]);
  const currentProvider = useMemo(() => selectedProvider ? CLOUD_PROVIDERS[selectedProvider] : null, [selectedProvider]);

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
              <div className="btn-group" role="group">
                <button 
                  onClick={() => setMode("map")} 
                  className={`btn ${mode === "map" ? "btn-primary" : "btn-light"} shadow-sm d-flex align-items-center gap-2`}
                >
                  <Network size={16}/> Mapa
                </button>
                <button 
                  onClick={() => setMode("table")} 
                  className={`btn ${mode === "table" ? "btn-primary" : "btn-light"} shadow-sm d-flex align-items-center gap-2`}
                >
                  <Table2 size={16}/> Comparativa
                </button>
                <button 
                  onClick={() => setMode("providers")} 
                  className={`btn ${mode === "providers" ? "btn-primary" : "btn-light"} shadow-sm d-flex align-items-center gap-2`}
                >
                  <Cloud size={16}/> Proveedores
                </button>
              </div>
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
            ) : mode === "table" ? (
              <div className="card shadow border-0">
                <div className="card-body p-0">
                  <ComparisonTable query={query} />
                </div>
              </div>
            ) : (
              <ProvidersView 
                query={query} 
                onProviderSelect={setSelectedProvider}
                selectedProvider={selectedProvider}
              />
            )}
          </div>
        </div>
      </div>

      <DetailPanel open={!!openId} onClose={() => setOpenId(null)} item={current} query={query} />
      <ProviderDetail provider={currentProvider} onClose={() => setSelectedProvider(null)} />

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
