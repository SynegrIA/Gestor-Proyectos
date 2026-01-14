
/**
 * Helper para gestionar las vinculaciones entre Soluciones y Activos en LocalStorage (V1)
 */

const STORAGE_KEY = 'solution_asset_links_v1';

const DEFAULT_LINKS = [
    { solution_id: "54", asset_id: "1" }, // Plantilla Medición de tiempo
    { solution_id: "54", asset_id: "2" }, // Script Entrevista CEO
    { solution_id: "54", asset_id: "4" }, // Checklist Datos Mínimos
    { solution_id: "54", asset_id: "5" }, // Ficha de Iniciativa
    { solution_id: "54", asset_id: "6" }, // Calculadora de Impacto ROI
    { solution_id: "54", asset_id: "7" }, // Formulario Inicial Pre-KickOff
    { solution_id: "54", asset_id: "8" }, // Guion Entrevista Universal
    { solution_id: "54", asset_id: "9" }  // Tabla Inventario / Matriz de Procesos
];

export const getAssetLinks = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return { links: DEFAULT_LINKS, updated_at: new Date().toISOString() };
    }
    try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure core links exist
        const links = [...parsed.links];
        DEFAULT_LINKS.forEach(def => {
            if (!links.some(l => l.solution_id === def.solution_id && l.asset_id === def.asset_id)) {
                links.push(def);
            }
        });
        return { ...parsed, links };
    } catch (e) {
        console.error("Error parsing asset links", e);
        return { links: DEFAULT_LINKS, updated_at: new Date().toISOString() };
    }
};

export const saveAssetLinks = (links) => {
    const data = {
        links,
        updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Vincula un activo a una solución
 */
export const linkAssetToSolution = (solutionId, assetId) => {
    const { links } = getAssetLinks();
    // Evitar duplicados
    const exists = links.find(l => l.solution_id === solutionId.toString() && l.asset_id === assetId.toString());
    if (exists) return links;

    const newLinks = [...links, { solution_id: solutionId.toString(), asset_id: assetId.toString() }];
    saveAssetLinks(newLinks);
    return newLinks;
};

/**
 * Desvincula un activo de una solución
 */
export const unlinkAssetFromSolution = (solutionId, assetId) => {
    const { links } = getAssetLinks();
    const newLinks = links.filter(l => !(l.solution_id === solutionId.toString() && l.asset_id === assetId.toString()));
    saveAssetLinks(newLinks);
    return newLinks;
};

/**
 * Obtiene los activos vinculados a una solución
 */
export const getAssetsForSolution = (solutionId) => {
    const { links } = getAssetLinks();
    return links
        .filter(l => l.solution_id === solutionId.toString())
        .map(l => l.asset_id);
};

/**
 * Obtiene las soluciones vinculadas a un activo
 */
export const getSolutionsForAsset = (assetId) => {
    const { links } = getAssetLinks();
    return links
        .filter(l => l.asset_id === assetId.toString())
        .map(l => l.solution_id);
};

/**
 * Actualiza los links de una solución masivamente (para multi-select)
 */
export const updateSolutionLinks = (solutionId, assetIds) => {
    const { links } = getAssetLinks();
    // Quitar todos los links de esta solución
    const otherLinks = links.filter(l => l.solution_id !== solutionId.toString());
    // Añadir los nuevos
    const newLinks = [
        ...otherLinks,
        ...assetIds.map(assetId => ({ solution_id: solutionId.toString(), asset_id: assetId.toString() }))
    ];
    saveAssetLinks(newLinks);
    return newLinks;
};

/**
 * Actualiza los links de un activo masivamente (para multi-select)
 */
export const updateAssetLinks = (assetId, solutionIds) => {
    const { links } = getAssetLinks();
    // Quitar todos los links de este activo
    const otherLinks = links.filter(l => l.asset_id !== assetId.toString());
    // Añadir los nuevos
    const newLinks = [
        ...otherLinks,
        ...solutionIds.map(solutionId => ({ solution_id: solutionId.toString(), asset_id: assetId.toString() }))
    ];
    saveAssetLinks(newLinks);
    return newLinks;
};
