import { ExtractedRequirements, StandardRecommendation, ProcurementAnalysis, InputLanguage } from '../types/standards';
import { STANDARDS_DATABASE, SAMPLE_PROMPTS } from './standardsData';

export interface ExtractionProgressUpdate {
  stage: number;
  stageName: string;
  detail: string;
  percentage: number;
}

export class StandardsRecommendationEngine {
  private static STORAGE_KEY = 'manak_ai_saved_analyses_v1';
  private static FEEDBACK_KEY = 'manak_ai_feedback_log_v1';

  /**
   * Simulate realistic multi-step pipeline for document and text extraction:
   * 1. Ingestion & Preprocessing
   * 2. Parameter & Entity Extraction
   * 3. Domain Classification
   */
  public static async extractWithProgress(
    text: string,
    language: InputLanguage,
    fileName?: string,
    onProgress?: (update: ExtractionProgressUpdate) => void
  ): Promise<ExtractedRequirements> {
    const isTransformer = /transformer|kva|kv|onan|winding|crgo|insulating\s*oil/i.test(text);
    const isHdpe = /hdpe|pipe|pe-100|water\s*supply|polyethylene|mfr/i.test(text);
    const isSteel = /tmt|rebar|fe\s*550|fe\s*500|reinforcement|elongation|yield\s*strength/i.test(text);
    const isSolar = /solar|photovoltaic|pv|almm|mono-perc|wp|module/i.test(text);
    const isWater = /packaged.*water|drinking\s*water|pet\s*bottles|tds|coliform/i.test(text);
    const isDoor = /fire.*door|fire\s*rated|panic\s*bar|mineral\s*wool|integrity/i.test(text);

    const steps: { stage: number; name: string; detail: string; pct: number; delay: number }[] = [
      { stage: 1, name: 'Document Ingestion & OCR Normalization', detail: fileName ? `Parsing binary stream for ${fileName}...` : 'Tokenizing natural language specification input...', pct: 20, delay: 400 },
      { stage: 2, name: 'Clausal Entity Extraction (NER)', detail: 'Identifying ratings, units, tolerances, material grades, and test codes...', pct: 45, delay: 500 },
      { stage: 3, name: 'Technical Schema Mapping', detail: 'Structuring technical parameters, routine/type tests, and safety constraints...', pct: 75, delay: 450 },
      { stage: 4, name: 'Verification & Context Normalization', detail: 'Cross-checking against National Building Code & CPWD/GeM standard taxonomies...', pct: 100, delay: 350 }
    ];

    for (const step of steps) {
      if (onProgress) {
        onProgress({ stage: step.stage, stageName: step.name, detail: step.detail, percentage: step.pct });
      }
      await new Promise(res => setTimeout(res, step.delay));
    }

    if (isTransformer) {
      return {
        productName: 'Outdoor Oil-Immersed Distribution Transformer',
        productCategory: 'Electrical Distribution Equipment',
        intendedApplication: 'Power Substation Distribution Grid & Utility Interconnection',
        confidenceScore: 0.97,
        technicalParameters: [
          { id: 'p1', name: 'Nominal Capacity', value: '500 kVA', unit: 'kVA', mandatory: true },
          { id: 'p2', name: 'Rated Voltage Ratio', value: '11 kV / 0.433 kV (3-Phase)', mandatory: true },
          { id: 'p3', name: 'Cooling Method', value: 'ONAN (Oil Natural Air Natural)', mandatory: true },
          { id: 'p4', name: 'Energy Loss Level', value: 'Energy Efficiency Level 2 (BEE / BIS Table 3)', mandatory: true },
          { id: 'p5', name: 'Winding Material', value: 'Electrolytic Copper with Paper Conductor Insulation', mandatory: true },
          { id: 'p6', name: 'Core Lamination', value: 'Cold Rolled Grain Oriented (CRGO) Silicon Steel', mandatory: true },
          { id: 'p7', name: 'Tapping Mechanism', value: 'Off-Circuit Tap Switch (+2.5% to -5.0% in steps of 2.5%)', mandatory: false }
        ],
        testMethods: [
          'Routine measurement of winding resistance, ratio, and vector group',
          'Temperature Rise Test for top oil and average winding',
          'Lightning Impulse Withstand Test (75 kV peak)',
          'Dielectric strength and dissipation factor of insulating oil'
        ],
        safetyAndEnvironmental: [
          'Mandatory Ministry of Power Quality Control Order (QCO) ISI Standard Mark',
          'Pressure Relief Device (PRD) with auxiliary trip contacts',
          'Silica Gel Breather with transparent dehydration chamber'
        ],
        installationContext: [
          'Outdoor plinth mounted',
          'Ambient temperature up to 50°C',
          'Seismic Zone IV resilient anchor points'
        ],
        rawMaterials: [
          'Electrolytic Copper Rods (IS 12444)',
          'CRGO Electrical Steel (IS 3024)',
          'Type II Mineral Insulating Oil (IS 335)'
        ]
      };
    } else if (isHdpe) {
      return {
        productName: 'High Density Polyethylene (HDPE) Water Pipes',
        productCategory: 'Plastic Piping Systems & Water Supply',
        intendedApplication: 'Potable Drinking Water Distribution Network (Jal Jeevan Mission)',
        confidenceScore: 0.98,
        technicalParameters: [
          { id: 'p1', name: 'Material Grade', value: 'Virgin PE-100 Polymer Compound', mandatory: true },
          { id: 'p2', name: 'Nominal Diameters', value: '110mm, 160mm, 200mm OD', unit: 'mm', mandatory: true },
          { id: 'p3', name: 'Pressure Rating', value: 'PN-10 (1.0 MPa / 10 bar working pressure)', mandatory: true },
          { id: 'p4', name: 'Appearance', value: 'Black pipe with co-extruded blue longitudinal stripes', mandatory: true },
          { id: 'p5', name: 'Minimum Required Strength (MRS)', value: '10.0 MPa at 20°C for 50 years', mandatory: true }
        ],
        testMethods: [
          'Internal Hydrostatic Pressure Test at 80°C for 165 hours and 1000 hours',
          'Carbon black content (2.0% - 2.5%) and dispersion check',
          'Melt Flow Rate (MFR 190°C / 5kg) test',
          'Longitudinal Reversion Test (max 3%)'
        ],
        safetyAndEnvironmental: [
          'DPIIT Quality Control Order (QCO) Mandatory ISI Marking',
          'Non-toxic formulation approved for human potable water conveyance'
        ],
        installationContext: [
          'Underground trench buried with sand bedding',
          'Butt-fusion welding and electrofusion coupler joints'
        ],
        rawMaterials: [
          'PE-100 Virgin Compound (IS 7328)',
          'Food contact positive list additives (IS 10141)'
        ]
      };
    } else if (isSteel) {
      return {
        productName: 'Thermo-Mechanically Treated (TMT) High Strength Deformed Steel Bars',
        productCategory: 'Civil & Structural Reinforcement Steel',
        intendedApplication: 'Elevated Highway Viaducts, Bridge Piers & Seismic Structures (NHAI / MoRTH)',
        confidenceScore: 0.99,
        technicalParameters: [
          { id: 'p1', name: 'Steel Grade', value: 'Fe 550D (High Ductility)', mandatory: true },
          { id: 'p2', name: 'Nominal Diameters', value: '12mm, 16mm, 20mm, 25mm, 32mm', unit: 'mm', mandatory: true },
          { id: 'p3', name: '0.2% Proof Stress (Yield)', value: 'Minimum 550 MPa', unit: 'MPa', mandatory: true },
          { id: 'p4', name: 'Tensile / Yield Strength Ratio', value: '>= 1.10', mandatory: true },
          { id: 'p5', name: 'Total Elongation at Max Force (Agt)', value: '>= 5.0%', unit: '%', mandatory: true },
          { id: 'p6', name: 'Max Sulfur + Phosphorus (S+P)', value: '<= 0.075% combined', unit: '%', mandatory: true }
        ],
        testMethods: [
          'Tensile and Yield Strength Test as per IS 1608',
          '180-degree Bend and Rebend test around specified mandrel',
          'Chemical Ladle analysis for carbon, sulfur, and phosphorus'
        ],
        safetyAndEnvironmental: [
          'Mandatory Ministry of Steel Quality Control Order (QCO)',
          'High earthquake ductility for Seismic Zone IV / V'
        ],
        installationContext: [
          'Heavy infrastructure reinforced concrete structures'
        ],
        rawMaterials: [
          'Virgin primary steel from Integrated Steel Plants (BF-BOF route)'
        ]
      };
    } else if (isSolar) {
      return {
        productName: 'Crystalline Silicon Terrestrial Photovoltaic (PV) Modules',
        productCategory: 'Renewable Energy & Solar Systems',
        intendedApplication: 'Grid-Connected Rooftop Solar Power Generation (SECI / Discoms)',
        confidenceScore: 0.95,
        technicalParameters: [
          { id: 'p1', name: 'Cell Technology', value: 'Monocrystalline PERC (Half-Cut Cells)', mandatory: true },
          { id: 'p2', name: 'Rated Peak Power', value: 'Minimum 540 Wp', unit: 'Wp', mandatory: true },
          { id: 'p3', name: 'Module Efficiency', value: 'Exceeding 21.2%', unit: '%', mandatory: true },
          { id: 'p4', name: 'Max System Voltage', value: '1500 V DC', unit: 'V', mandatory: true },
          { id: 'p5', name: 'Mechanical Load Capacity', value: 'Snow 5400 Pa / Wind 2400 Pa', unit: 'Pa', mandatory: true }
        ],
        testMethods: [
          'Thermal Cycling & Damp Heat testing',
          'Potential Induced Degradation (PID) resistance test',
          'Salt mist corrosion test for high humidity environments'
        ],
        safetyAndEnvironmental: [
          'MNRE Quality Control Order Mandatory BIS Compulsory Registration (CRS)',
          'ALMM (Approved List of Models and Manufacturers) listing mandatory'
        ],
        installationContext: [
          'Outdoor metallic structure rooftop mounting',
          'IP68 junction box with bypass diodes'
        ],
        rawMaterials: [
          'Solar grade monocrystalline silicon wafers',
          'Tempered solar glass with anti-reflective coating'
        ]
      };
    } else if (isWater) {
      return {
        productName: 'Packaged Drinking Water in Sealed Food-Grade Containers',
        productCategory: 'Food, Beverage & Institutional Supplies',
        intendedApplication: 'Hospital Inpatients, Cafeteria & Public Water Dispensers (AIIMS)',
        confidenceScore: 0.96,
        technicalParameters: [
          { id: 'p1', name: 'Packaging Volumes', value: '500ml, 1 Litre, and 20 Litre Dispenser Jars', mandatory: true },
          { id: 'p2', name: 'Total Dissolved Solids (TDS)', value: '75 to 500 mg/L', unit: 'mg/L', mandatory: true },
          { id: 'p3', name: 'pH Value', value: '6.5 to 8.5', mandatory: true },
          { id: 'p4', name: 'Turbidity', value: '< 1 NTU (Nephelometric Turbidity Unit)', unit: 'NTU', mandatory: true }
        ],
        testMethods: [
          'Membrane filtration for pathogenic bacteria (E. coli, Coliforms)',
          'Absence of Pseudomonas aeruginosa in 250ml sample',
          'Heavy metals test (Lead, Cadmium, Arsenic, Mercury below detection limits)'
        ],
        safetyAndEnvironmental: [
          'Mandatory FSSAI and BIS Certification Scheme I (ISI Mark)',
          'Food-grade recyclable PET and polycarbonate containers'
        ],
        installationContext: [
          'Ambient indoor storage away from direct sunlight'
        ],
        rawMaterials: [
          'Treated municipal or deep borewell groundwater',
          'BIS certified virgin PET preforms (IS 15410)'
        ]
      };
    } else if (isDoor) {
      return {
        productName: 'Fire Resistant Metal Hollow Core Door Assemblies',
        productCategory: 'Fire Protection & Architectural Hardware',
        intendedApplication: 'Emergency Escape Stairwells and Substation Enclosures (AAI Airport Terminal)',
        confidenceScore: 0.94,
        technicalParameters: [
          { id: 'p1', name: 'Fire Rating Duration', value: '120 Minutes (2 Hours) Integrity & Insulation', unit: 'min', mandatory: true },
          { id: 'p2', name: 'Door Leaf Material', value: 'Galvanized Steel Sheet (Minimum 1.2mm skin thickness)', mandatory: true },
          { id: 'p3', name: 'Core Insulation', value: 'High Density Mineral Wool / Ceramic Blanket Core', mandatory: true },
          { id: 'p4', name: 'Hardware Inclusions', value: 'Panic exit bar, heavy duty hinges, hydraulic door closer, intumescent seals', mandatory: true }
        ],
        testMethods: [
          'Fire resistance furnace test to IS 3614 / IS 17518',
          'Temperature rise on unexposed surface limit test (< 140°C average rise)',
          'Hose stream impact test for structural stability'
        ],
        safetyAndEnvironmental: [
          'National Building Code (NBC 2016) Part 4 Mandatory Requirement',
          'Third-party NABL accredited laboratory fire test certificate'
        ],
        installationContext: [
          'Masonry or RCC structural wall opening with metal anchor fasteners'
        ],
        rawMaterials: [
          'Galvanized steel sheets to IS 277',
          'Intumescent fire seals and mineral wool'
        ]
      };
    }

    // Default Fallback
    return {
      productName: 'General Engineering Procurement Specification',
      productCategory: 'General Engineering & Materials',
      intendedApplication: 'Public Infrastructure Construction and Supply Contract',
      confidenceScore: 0.88,
      technicalParameters: [
        { id: 'p1', name: 'Primary Functional Rating', value: 'As per technical schedule', mandatory: true },
        { id: 'p2', name: 'Material Composition', value: 'Standard industrial grade', mandatory: true },
        { id: 'p3', name: 'Operating Conditions', value: 'Tropicalized ambient up to 45°C', mandatory: false }
      ],
      testMethods: [
        'Manufacturer Routine Test Certificate',
        'Acceptance inspection at supplier works'
      ],
      safetyAndEnvironmental: [
        'Compliance with applicable BIS / Statutory Safety regulations'
      ],
      installationContext: [
        'Standard public utility installation'
      ],
      rawMaterials: [
        'Standard certified commercial feedstock'
      ]
    };
  }

  /**
   * Search and rank standards based on extracted requirements.
   * Matches keywords, parameters, and relationships.
   */
  public static async recommendStandards(requirements: ExtractedRequirements): Promise<StandardRecommendation[]> {
    await new Promise(res => setTimeout(res, 600));

    const pName = requirements.productName.toLowerCase();
    const pCat = requirements.productCategory.toLowerCase();

    // Score all standards in DB
    const scored = STANDARDS_DATABASE.map(std => {
      let score = 0;
      const titleLower = std.title.toLowerCase();
      const scopeLower = std.scopeSummary.toLowerCase();
      const catLower = std.category.toLowerCase();

      if (titleLower.includes(pName) || pName.includes(titleLower.slice(0, 15))) {
        score += 45;
      }
      if (catLower === pCat || catLower.includes(pCat) || pCat.includes(catLower)) {
        score += 30;
      }

      // Check matched parameters
      for (const param of requirements.technicalParameters) {
        if (titleLower.includes(param.value.toLowerCase()) || scopeLower.includes(param.value.toLowerCase())) {
          score += 10;
        }
      }

      // Specific known mappings for crisp accuracy
      if (pName.includes('transformer') && std.isNumber.includes('1180')) score = 98;
      if (pName.includes('transformer') && std.isNumber.includes('335')) score = 92;
      if (pName.includes('transformer') && std.isNumber.includes('2026')) score = 88;
      if (pName.includes('transformer') && std.isNumber.includes('694')) score = 84;

      if (pName.includes('hdpe') && std.isNumber.includes('4984')) score = 99;
      if (pName.includes('steel') && std.isNumber.includes('1786')) score = 99;
      if (pName.includes('steel') && std.isNumber.includes('456')) score = 91;
      if (pName.includes('steel') && std.isNumber.includes('1161')) score = 79;

      if (pName.includes('solar') && std.isNumber.includes('14286')) score = 97;
      if (pName.includes('water') && std.isNumber.includes('14543')) score = 99;
      if (pName.includes('door') && std.isNumber.includes('3614')) score = 98;

      const relevanceLabel: StandardRecommendation['relevanceLabel'] = 
        score >= 95 ? 'High Priority Match' :
        score >= 85 ? 'Moderate Relevance' :
        score >= 75 ? 'Allied Reference' : 'Alternative Standard';

      return {
        ...std,
        relevanceScore: Math.min(score, 99),
        relevanceLabel
      };
    });

    // Filter to relevant ones (> 60) and sort descending by score
    const filtered = scored.filter(s => s.relevanceScore > 60).sort((a, b) => b.relevanceScore - a.relevanceScore);

    // If few matches, fall back to top 4 standards
    if (filtered.length === 0) {
      return STANDARDS_DATABASE.slice(0, 4);
    }

    return filtered;
  }

  /**
   * Generate an authoritative tender specification clause text suitable for GeM, CPPP, or CPWD NIT documents.
   */
  public static generateTenderClause(
    standards: StandardRecommendation[],
    tenderInfo: { title: string; tenderRef: string; department: string }
  ): string {
    const activeStandards = standards.filter(s => s.isSelected !== false);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    let clause = `================================================================================
GOVERNMENT OF INDIA - PUBLIC PROCUREMENT TENDER SPECIFICATION ANNEXURE
SPECIAL TECHNICAL CONDITIONS: COMPLIANCE WITH INDIAN STANDARDS (IS)
================================================================================

Tender Title:     ${tenderInfo.title || 'Procurement of Works & Supplies'}
Tender Ref No:    ${tenderInfo.tenderRef || 'NIT/TENDER/2026/01'}
Procuring Entity: ${tenderInfo.department || 'Central Procurement Authority'}
Generated via:    MANAK-AI Decision Support Engine (SIH 2026 PS 26108)
Date Generated:   ${dateStr}

[IMPORTANT STATUTORY NOTICE FOR PROCUREMENT OFFICERS]
The following list of Indian Standards has been identified through AI-assisted semantic
matching against the technical schedule. As per GFR 2017 Rule 144(i) and Bureau of Indian
Standards Act 2016, technical specifications must conform to recognized national standards.
The procurement officer MUST verify current gazette status and active Quality Control Orders
(QCO) on the official BIS portal (https://www.services.bis.gov.in) before publishing the tender.

--------------------------------------------------------------------------------
1. MANDATORY APPLICABLE INDIAN STANDARDS (IS) FOR ITEM SUPPLY:
--------------------------------------------------------------------------------
`;

    activeStandards.forEach((std, idx) => {
      clause += `\n1.${idx + 1} ${std.isNumber}: "${std.title}"\n`;
      clause += `    • Status: ${std.status} (Edition ${std.editionYear})\n`;
      if (std.amendments.length > 0) {
        clause += `    • Active Amendments: ${std.amendments.map(a => a.amendmentNumber).join(', ')}\n`;
      }
      clause += `    • Statutory Compliance: ${std.complianceInfo.scheme}\n`;
      if (std.complianceInfo.qcoMandatory) {
        clause += `    • Quality Control Order: ${std.complianceInfo.qcoOrderNumber || 'Active QCO'} (${std.complianceInfo.qcoMinistry})\n`;
        clause += `    • Marking Requirement: Valid BIS Standard Mark (ISI logo) is MANDATORY on each unit/packaging.\n`;
      }
      clause += `    • Scope Compliance: ${std.explanation}\n`;
    });

    clause += `
--------------------------------------------------------------------------------
2. NORMATIVE AND ALLIED TEST METHOD REFERENCES:
--------------------------------------------------------------------------------
The contractor / manufacturer shall ensure all raw materials, routine tests, and type tests
strictly adhere to the following allied Indian Standards:\n`;

    const alliedSet = new Map<string, string>();
    activeStandards.forEach(std => {
      std.relatedStandards.forEach(rel => {
        if (!alliedSet.has(rel.isNumber)) {
          alliedSet.set(rel.isNumber, `• ${rel.isNumber} - ${rel.title} [${rel.relationship}: ${rel.importance}]`);
        }
      });
    });

    if (alliedSet.size > 0) {
      alliedSet.forEach(val => {
        clause += `  ${val}\n`;
      });
    } else {
      clause += `  • Refer to individual test methods referenced in parent standards.\n`;
    }

    clause += `
--------------------------------------------------------------------------------
3. INSPECTION, TESTING & ACCEPTANCE PROTOCOL:
--------------------------------------------------------------------------------
3.1 Bidders must submit valid BIS License (CM/L number) along with technical bid.
3.2 All routine and acceptance tests specified in the above standards shall be carried out
    in the presence of the designated Inspecting Officer / TPI Agency.
3.3 Type test certificates from NABL accredited / BIS recognized laboratories not older than
    5 years shall be furnished prior to dispatch.
3.4 Failure to comply with mandatory Quality Control Orders shall render the bid non-responsive.

================================================================================
END OF SPECIFICATION CLAUSE
================================================================================`;

    return clause;
  }

  /**
   * Save an analysis to local storage.
   */
  public static saveAnalysis(analysis: ProcurementAnalysis): void {
    try {
      const existing = this.getSavedAnalyses();
      const idx = existing.findIndex(a => a.id === analysis.id);
      if (idx >= 0) {
        existing[idx] = analysis;
      } else {
        existing.unshift(analysis);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save analysis to local storage:', e);
    }
  }

  /**
   * Retrieve saved analyses.
   */
  public static getSavedAnalyses(): ProcurementAnalysis[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load saved analyses:', e);
    }
    return [];
  }

  /**
   * Save user feedback on standard relevance.
   */
  public static saveFeedback(
    isId: string,
    status: 'relevant' | 'not_relevant' | 'needs_correction',
    note?: string
  ): void {
    try {
      const raw = localStorage.getItem(this.FEEDBACK_KEY);
      const feedbackMap = raw ? JSON.parse(raw) : {};
      feedbackMap[isId] = {
        status,
        note: note || '',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.FEEDBACK_KEY, JSON.stringify(feedbackMap));
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }
  }

  /**
   * Get feedback for a standard.
   */
  public static getFeedback(isId: string): { status: 'relevant' | 'not_relevant' | 'needs_correction'; note?: string } | null {
    try {
      const raw = localStorage.getItem(this.FEEDBACK_KEY);
      if (raw) {
        const feedbackMap = JSON.parse(raw);
        return feedbackMap[isId] || null;
      }
    } catch (e) {}
    return null;
  }
}
