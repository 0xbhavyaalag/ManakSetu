import { StandardRecommendation, SamplePrompt, ProcurementAnalysis } from '../types/standards';

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'sample-transformers',
    title: 'Outdoor Distribution Transformers (500 kVA, 11/0.433 kV)',
    department: 'Central Public Works Department (CPWD) - Electrical Division',
    tenderRef: 'NIT/CPWD/EE-ED-I/2026/842',
    category: 'Electrical Engineering & Distribution',
    text: `Procurement of 500 kVA, 11/0.433 kV, 3-Phase, 50 Hz, outdoor type oil-immersed naturally cooled (ONAN) distribution transformers. 
The transformers must have copper windings, core made of CRGO electrical steel sheets, and energy efficiency performance conforming to Level 2 losses. 
Fitted with standard conservator, silica gel breather, oil level gauge, pressure relief valve, bi-metallic connectors, and off-circuit tap changer (+2.5% to -5% in steps of 2.5%). 
Insulating mineral oil must be uninhibited virgin oil tested for breakdown voltage and dielectric dissipation factor. 
All units must undergo routine and type tests including temperature rise and lightning impulse withstand tests. 
Mandatory compliance with active Ministry of Power Quality Control Orders (QCO) and BIS certification marks.`,
    documentName: 'CPWD_Technical_Schedule_500kVA_Transformer.pdf'
  },
  {
    id: 'sample-hdpe-pipes',
    title: 'HDPE Pipes for Potable Water Distribution Network (PE-100, PN-10)',
    department: 'Ministry of Jal Shakti - National Jal Jeevan Mission (JJMS)',
    tenderRef: 'JJM/DWSD/PHED/2026/WTR-409',
    category: 'Water Supply & Civil Infrastructure',
    text: `Supply and laying of High Density Polyethylene (HDPE) pipes of diameter 110mm, 160mm, and 200mm for rural drinking water distribution grid. 
Pipes must be manufactured from virgin PE-100 grade material, pressure rating PN-10, with black color and co-extruded blue longitudinal stripes. 
Material must comply with standards for conveyance of potable water without imparting taste or odor. 
Pipes must undergo carbon black content and dispersion test, hydrostatic pressure test at 80°C for 165 hours and 1000 hours, melt flow rate (MFR) test, and longitudinal reversion test. 
Butt-fusion and electrofusion fittings to be provided. Mandatory ISI mark under Department for Promotion of Industry and Internal Trade (DPIIT) QCO.`,
    documentName: 'Jal_Jeevan_Mission_Tender_HDPE_Pipes_2026.docx'
  },
  {
    id: 'sample-tmt-rebars',
    title: 'High Strength TMT Reinforcement Steel Bars (Fe 550D)',
    department: 'National Highways Authority of India (NHAI) - Bridge Works',
    tenderRef: 'NHAI/TECH/RO-DEL/BRG-EXP/2026/112',
    category: 'Civil & Structural Engineering',
    text: `Procurement of thermo-mechanically treated (TMT) high strength deformed steel re-bars of grade Fe 550D, sizes ranging from 12mm to 32mm diameter for elevated viaduct and bridge pier construction. 
Steel must possess minimum yield strength of 550 MPa, tensile to yield ratio >= 1.10, and total elongation at maximum force (Agt) not less than 5%. 
Combined sulfur and phosphorus levels must not exceed 0.075% for enhanced earthquake ductility. 
Must undergo bend and rebend tests, chemical ladle analysis, and fatigue testing. 
Mandatory compliance with Ministry of Steel Quality Control Order requiring standard ISI certification on every bundle with bar code traceability.`,
    documentName: 'NHAI_Structural_Steel_Tender_Spec_Fe550D.pdf'
  },
  {
    id: 'sample-solar-pv',
    title: 'Grid-Interactive Solar PV Modules (Mono-PERC 540Wp+)',
    department: 'Solar Energy Corporation of India (SECI) / Indian Railways',
    tenderRef: 'SECI/RE-ROOFTOP/IR-STN/2026/04',
    category: 'Renewable Energy & Photovoltaics',
    text: `Supply of monocrystalline PERC solar photovoltaic modules with minimum rated peak power 540 Wp and module efficiency exceeding 21.2% for station rooftop solar projects. 
Modules must withstand maximum system voltage 1500 V DC, snow load up to 5400 Pa, and wind load 2400 Pa. 
IP68 rated junction box with bypass diodes and MC4 compatible connectors. PID resistant, salt mist corrosion resistant for coastal regions. 
Modules must be enlisted in the Approved List of Models and Manufacturers (ALMM) and carry mandatory BIS Compulsory Registration Scheme (CRS) certification under MNRE Solar QCO.`,
    documentName: 'SECI_Rooftop_Solar_Module_Procurement.pdf'
  },
  {
    id: 'sample-packaged-water',
    title: 'Packaged Drinking Water for Institutional Catering & Hospitals',
    department: 'All India Institute of Medical Sciences (AIIMS) - Central Store',
    tenderRef: 'AIIMS/PROC/HOSP-SUP/2026/DW-55',
    category: 'Food, Beverage & Hygiene',
    text: `Supply of packaged drinking water in 500ml, 1 Litre, and 20 Litre food-grade PET containers for inpatient wards and cafeteria consumption. 
Water must undergo multi-stage purification including reverse osmosis (RO), ultraviolet (UV) disinfection, and ozonation. 
Physico-chemical limits: Total Dissolved Solids (TDS) between 75 to 500 mg/L, pH 6.5 to 8.5, turbidity < 1 NTU. 
Strict zero tolerance for pathogenic organisms (E. coli, coliform bacteria, fecal streptococci, Pseudomonas aeruginosa). 
Containers must be tamper-evident, labeled with date of manufacture, batch number, and mandatory BIS standard ISI mark under FSSAI regulations.`,
    documentName: 'AIIMS_Packaged_Water_Specification_2026.docx'
  },
  {
    id: 'sample-fire-doors',
    title: 'Fire Resistant Metal Doors (120 Minutes Rating)',
    department: 'Airport Authority of India (AAI) - Terminal Expansion',
    tenderRef: 'AAI/ENGG-CIVIL/TERM-FIRE/2026/089',
    category: 'Fire Safety & Building Fittings',
    text: `Supply and installation of 120-minute (2 hours) fire rated steel doors for emergency egress stairwells and electrical substation enclosures in airport terminal. 
Doors must feature insulated hollow metal construction with galvanized steel sheet (minimum 1.2mm skin thickness), mineral wool / ceramic blanket core, intumescent fire seals, self-closing devices, and panic exit hardware. 
Doors and frames must be tested and certified as an assembly in accordance with National Building Code (NBC) 2016 and Indian Standards fire resistance testing protocols. 
BIS certification marking and third-party NABL accredited laboratory fire test report required.`,
    documentName: 'AAI_Terminal_Fire_Safety_Doors_Spec.pdf'
  }
];

export const STANDARDS_DATABASE: StandardRecommendation[] = [
  // 1. IS 1180 Part 1
  {
    id: 'IS-1180-1-2014',
    isNumber: 'IS 1180 (Part 1) : 2014',
    title: 'Outdoor Type Oil Immersed Distribution Transformers Up To And Including 2500 kVA, 33 kV - Specification',
    category: 'Electrical Engineering & Distribution',
    relevanceScore: 98,
    relevanceLabel: 'High Priority Match',
    explanation: 'Directly specifies standard requirements, energy loss levels, fittings, and testing procedures for 500 kVA 11/0.433 kV outdoor oil-immersed distribution transformers.',
    scopeSummary: 'Covers requirements and tests for outdoor type three-phase and single-phase oil-immersed distribution transformers up to and including 2500 kVA with nominal system voltage up to 33 kV.',
    scopeExcerptAuthoritative: 'Clause 1.1: This standard covers the requirements and tests for outdoor type oil-immersed distribution transformers up to and including 2500 kVA, 33 kV suitable for use in distribution systems. Standard ratings are 16, 25, 63, 100, 160, 200, 250, 315, 400, 500, 630, 1000, 1250, 1600, 2000 and 2500 kVA.',
    status: 'Active - Incorporating Amendments',
    editionYear: 2014,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'March 2016', summary: 'Revision of maximum total loss tables for energy efficiency Level 1, 2, and 3.' },
      { amendmentNumber: 'Amendment No. 2', date: 'November 2018', summary: 'Addition of requirements for corrugated tank construction and terminal bushings.' },
      { amendmentNumber: 'Amendment No. 3', date: 'August 2021', summary: 'Updated dielectric dissipation factor limits for insulating oil and temperature rise parameters.' },
      { amendmentNumber: 'Amendment No. 4', date: 'January 2024', summary: 'Clarification on short-circuit test withstand requirements and digital QR code labeling.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-1180-1-2014',
      bisSectionalCommittee: 'Electrotechnical Division Council - ETD 16 (Transformers)',
      gazetteNotification: 'S.O. 182(E) dated 27 January 2014 (Ministry of Power)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Distribution Transformers (Quality Control) Order, 2014',
      qcoMinistry: 'Ministry of Power, Government of India',
      effectiveDate: '2014-08-01',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Manufacturing or offering for sale without valid BIS Standard Mark is prohibited under Section 16 of the BIS Act, 2016.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 4.1 & 4.2',
        title: 'Standard Ratings & Voltage Ratios',
        requirementMatch: 'Matches specified 500 kVA capacity and 11/0.433 kV ratio.',
        standardExcerpt: 'Standard rating of 500 kVA is recognized under Table 1 with nominal primary voltage 11 kV and secondary 433 V.',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 7.2',
        title: 'Energy Efficiency Maximum Allowable Losses (Level 2)',
        requirementMatch: 'Tender specifies energy efficiency performance conforming to Level 2.',
        standardExcerpt: 'Table 3 sets maximum allowable total losses at 50% load and 100% load for 500 kVA Level 2 transformers at 75°C.',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 9.1',
        title: 'Winding Material & Insulation',
        requirementMatch: 'Matches copper winding requirement with electrolytic grade conductor.',
        standardExcerpt: 'Windings shall be of copper conductor conforming to IS 12444 or IS 13730.',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 21.0',
        title: 'Routine, Type, and Special Tests',
        requirementMatch: 'Covers temperature rise and lightning impulse withstand tests mandated in specification.',
        standardExcerpt: 'All distribution transformers shall be subjected to routine tests as per 21.2 and type tests as per 21.3 including temperature rise test as per IS 2026 (Part 2).',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 335 : 2018',
        title: 'Type II Mineral Insulating Oils for Transformers and Switchgear - Specification',
        relationship: 'Normative Reference',
        importance: 'Mandatory for compliance',
        notes: 'Mandatory standard for insulating liquid filled in the transformer tank.'
      },
      {
        isNumber: 'IS 2026 (Part 1) : 2011',
        title: 'Power Transformers - Part 1: General',
        relationship: 'Normative Reference',
        importance: 'Mandatory for compliance',
        notes: 'Provides foundational definitions and tolerance limits.'
      },
      {
        isNumber: 'IS 2026 (Part 2) : 2010',
        title: 'Power Transformers - Part 2: Temperature Rise',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance',
        notes: 'Prescribes temperature rise test protocol and limits for oil and windings.'
      },
      {
        isNumber: 'IS 12444 : 2020',
        title: 'Continuously Cast and Rolled Electrolytic Copper Wire Rods for Electrical Purposes',
        relationship: 'Raw Material',
        importance: 'Mandatory for compliance',
        notes: 'Specifies purity and conductivity of copper used in winding fabrication.'
      },
      {
        isNumber: 'IS 3024 : 2015',
        title: 'Grain Oriented Electrical Steel Sheet and Strip - Specification',
        relationship: 'Raw Material',
        importance: 'Mandatory for compliance',
        notes: 'Mandatory raw material standard for CRGO magnetic core laminations.'
      }
    ]
  },

  // 2. IS 335
  {
    id: 'IS-335-2018',
    isNumber: 'IS 335 : 2018',
    title: 'Type II Mineral Insulating Oils for Transformers and Switchgear - Specification',
    category: 'Electrochemical & Petroleum Products',
    relevanceScore: 92,
    relevanceLabel: 'Allied Reference',
    explanation: 'Mandatory normative standard for virgin uninhibited mineral insulating oil required in distribution transformer tanks.',
    scopeSummary: 'Specifies requirements and test methods for unused mineral insulating oils as delivered, for use in transformers, switchgear and similar electrical equipment.',
    scopeExcerptAuthoritative: 'Clause 1: This standard covers specifications and test methods for unused mineral insulating oils supplied for transformers and switchgear in which oil is required as an insulant and heat transfer medium.',
    status: 'Current & Active',
    editionYear: 2018,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'October 2020', summary: 'Revision of dielectric dissipation factor test temperature and corrosive sulfur detection protocol.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-335-2018',
      bisSectionalCommittee: 'Electrotechnical Division Council - ETD 03 (Fluids for Electrotechnical Applications)',
      gazetteNotification: 'S.O. 4272(E) dated 12 October 2023',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Mineral Insulating Oil (Quality Control) Order, 2023',
      qcoMinistry: 'Ministry of Heavy Industries & Public Enterprises',
      effectiveDate: '2024-04-12',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Under active QCO; all virgin mineral insulating oil must bear the standard ISI mark.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 5.1',
        title: 'Breakdown Voltage & Dielectric Dissipation Factor',
        requirementMatch: 'Matches requirement for breakdown voltage and dielectric dissipation testing.',
        standardExcerpt: 'Breakdown voltage shall not be less than 30 kV (as delivered) and 70 kV (after treatment). Tan delta at 90°C shall not exceed 0.005.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 6792 : 2017',
        title: 'Method for determination of the electrical strength of insulating liquids',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 3. IS 2026 Part 1
  {
    id: 'IS-2026-1-2011',
    isNumber: 'IS 2026 (Part 1) : 2011',
    title: 'Power Transformers - Part 1: General',
    category: 'Electrical Engineering & Distribution',
    relevanceScore: 88,
    relevanceLabel: 'Allied Reference',
    explanation: 'Foundation standard referenced by IS 1180 for core rating definitions, tapping tolerances, temperature conditions, and rating plate data.',
    scopeSummary: 'Applies to three-phase and single-phase power transformers (including auto-transformers) with the exception of certain categories of small and special transformers.',
    scopeExcerptAuthoritative: 'Clause 1: This part of IS 2026 applies to power transformers, defining operational conditions, rating plates, temperature rise limits, and routine testing protocols.',
    status: 'Current & Active',
    editionYear: 2011,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'July 2017', summary: 'Harmonization with IEC 60076-1 ed 3.0.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-2026-1-2011',
      bisSectionalCommittee: 'ETD 16 (Transformers)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: false,
      scheme: 'Voluntary BIS Certification',
      verificationStatus: 'Voluntary',
      verificationNotes: 'Used normatively in conjunction with IS 1180 which is under mandatory QCO.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 6.0',
        title: 'Rating Plate Information',
        requirementMatch: 'Prescribes mandatory labeling, serial number, impedance voltage, and vector group marking.',
        standardExcerpt: 'Rating plate shall contain rated power, voltage, frequencies, vector group Dyn11, and measured loss parameters.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 2026 (Part 3) : 2009',
        title: 'Power Transformers - Part 3: Insulation levels, dielectric tests and external clearances in air',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 4. IS 4984 (HDPE Pipes)
  {
    id: 'IS-4984-2016',
    isNumber: 'IS 4984 : 2016',
    title: 'High Density Polyethylene (HDPE) Pipes for Water Supply - Specification',
    category: 'Water Supply & Civil Infrastructure',
    relevanceScore: 99,
    relevanceLabel: 'High Priority Match',
    explanation: 'Authoritative national standard for HDPE pipes for drinking water conveyance, covering PE-100 material grade, PN ratings, carbon black, and hydrostatic testing.',
    scopeSummary: 'Lays down requirements for high density polyethylene pipes from 16 mm to 1000 mm nominal outside diameter, for use in buried and above-ground potable water supply systems.',
    scopeExcerptAuthoritative: 'Clause 1.1: This standard covers the requirements of high density polyethylene (HDPE) pipes of nominal diameters 16 mm to 1000 mm for use in water supply systems, conveying potable water at pressures up to 1.6 MPa (16 bar).',
    status: 'Active - Incorporating Amendments',
    editionYear: 2016,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'September 2018', summary: 'Inclusion of requirements for co-extruded blue stripes and minimum wall thickness tolerances.' },
      { amendmentNumber: 'Amendment No. 2', date: 'December 2021', summary: 'Updated hydrostatic testing duration and oxidation induction time (OIT) threshold.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-4984-2016',
      bisSectionalCommittee: 'Civil Engineering Division Council - CED 50 (Plastic Piping Systems)',
      gazetteNotification: 'S.O. 4268(E) dated 23 October 2020 (DPIIT)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Pipes and Fittings (Quality Control) Order, 2020',
      qcoMinistry: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
      effectiveDate: '2021-04-23',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Under DPIIT QCO; mandatory ISI marking required for all public water distribution tenders.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 5.1 & 5.2',
        title: 'Material & PE-100 Designation',
        requirementMatch: 'Matches PE-100 virgin grade requirement for drinking water.',
        standardExcerpt: 'Raw material shall be virgin polyethylene compound PE 100 conforming to IS 7328 with designated MRS value of 10.0 MPa.',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 8.1',
        title: 'Hydrostatic Strength at 80°C',
        requirementMatch: 'Specifies 165-hour and 1000-hour hydrostatic test required by tender.',
        standardExcerpt: 'Pipes shall not fail or weep when subjected to internal hydrostatic pressure at 80°C for 165 h and 1000 h as given in Table 4.',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 9.3',
        title: 'Colour and Marking Stripes',
        requirementMatch: 'Matches black pipe with co-extruded blue stripes specification.',
        standardExcerpt: 'Pipes for water supply shall be black with co-extruded blue longitudinal stripes or entirely blue.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 7328 : 2020',
        title: 'Polyethylene Material for Its Moulding and Extrusion',
        relationship: 'Raw Material',
        importance: 'Mandatory for compliance'
      },
      {
        isNumber: 'IS 7634 (Part 2) : 2012',
        title: 'Code of practice for plastics pipe work - Laying and jointing of polyethylene pipes',
        relationship: 'Safety & Environmental',
        importance: 'Recommended test practice'
      },
      {
        isNumber: 'IS 10141 : 2019',
        title: 'Positive list of constituents of polyethylene in contact with foodstuffs, pharmaceuticals and drinking water',
        relationship: 'Normative Reference',
        importance: 'Mandatory for compliance',
        notes: 'Certifies non-toxicity and food grade suitability for potable water.'
      }
    ]
  },

  // 5. IS 1786 (TMT Steel Rebars)
  {
    id: 'IS-1786-2008',
    isNumber: 'IS 1786 : 2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification',
    category: 'Civil & Structural Engineering',
    relevanceScore: 99,
    relevanceLabel: 'High Priority Match',
    explanation: 'The definitive Indian standard for Fe 550D TMT rebars, specifying yield strength, Agt elongation, chemical limits (S+P), and ductility for seismic design.',
    scopeSummary: 'Covers requirements of deformed steel bars and wires for use as reinforcement in concrete in grades Fe 415, Fe 415D, Fe 500, Fe 500D, Fe 550, Fe 550D, and Fe 600.',
    scopeExcerptAuthoritative: 'Clause 1.1: This standard covers the requirements of deformed steel bars and wires for use as reinforcement in concrete. Grade Fe 550D denotes high ductility bar with minimum yield strength 550 MPa and enhanced elongation for seismic zones.',
    status: 'Active - Incorporating Amendments',
    editionYear: 2008,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'November 2012', summary: 'Addition of grade Fe 550D and Fe 600 with mandatory Agt elongation requirements.' },
      { amendmentNumber: 'Amendment No. 2', date: 'March 2017', summary: 'Stringent sulfur and phosphorus limits (0.040% max each; 0.075% combined) for D grades.' },
      { amendmentNumber: 'Amendment No. 3', date: 'July 2021', summary: 'Standardized bar coding and rolling mark identification requirements on each bar.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-1786-2008',
      bisSectionalCommittee: 'CED 54 (Concrete Reinforcement)',
      gazetteNotification: 'Steel and Steel Products (Quality Control) Order, 2020 (Ministry of Steel)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Steel and Steel Products (Quality Control) Order, 2020',
      qcoMinistry: 'Ministry of Steel, Government of India',
      effectiveDate: '2020-12-22',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Strictly prohibited from manufacture, storage, sale, or import without BIS certification mark.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 4.2 & Table 1',
        title: 'Chemical Composition for Fe 550D',
        requirementMatch: 'Matches maximum sulfur + phosphorus limits of 0.075% for high ductility.',
        standardExcerpt: 'For Fe 550D grade: Carbon max 0.25%, Sulfur max 0.040%, Phosphorus max 0.040%, and S+P combined max 0.075%.',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 8.1 & Table 3',
        title: 'Mechanical Properties & Agt Elongation',
        requirementMatch: 'Matches 550 MPa proof stress, TS/YS >= 1.10, and Agt >= 5.0%.',
        standardExcerpt: '0.2 percent proof stress min 550 MPa; Tensile strength min 1.10 times proof stress; Elongation min 14.5%; Total elongation at max force (Agt) min 5.0%.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 456 : 2000',
        title: 'Plain and Reinforced Concrete - Code of Practice',
        relationship: 'Normative Reference',
        importance: 'Mandatory for compliance'
      },
      {
        isNumber: 'IS 1608 (Part 1) : 2018',
        title: 'Metallic Materials - Tensile Testing - Method of Test at Room Temperature',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance'
      },
      {
        isNumber: 'IS 13920 : 2016',
        title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces - Code of Practice',
        relationship: 'Safety & Environmental',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 6. IS 14286 / IEC 61215 (Solar PV)
  {
    id: 'IS-14286-2021',
    isNumber: 'IS 14286 : 2021 / IEC 61215 : 2021',
    title: 'Terrestrial Photovoltaic (PV) Modules - Design Qualification and Type Approval',
    category: 'Renewable Energy & Photovoltaics',
    relevanceScore: 97,
    relevanceLabel: 'High Priority Match',
    explanation: 'Core BIS standard governing design qualification, thermal cycling, PID resistance, and mechanical load testing for crystalline silicon terrestrial PV modules.',
    scopeSummary: 'Lays down requirements for the design qualification and type approval of terrestrial photovoltaic modules suitable for long-term operation in open-air climates.',
    scopeExcerptAuthoritative: 'Clause 1: This standard lays down requirements for the design qualification and type approval of terrestrial photovoltaic modules suitable for long-term operation in general open-air climates.',
    status: 'Current & Active',
    editionYear: 2021,
    amendments: [],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-14286-2021',
      bisSectionalCommittee: 'Electrotechnical Division Council - ETD 28 (Solar Photovoltaic Energy Systems)',
      gazetteNotification: 'Solar Photovoltaics, Systems, Devices and Components Goods (Requirements for Compulsory Registration) Order, 2017 (MNRE)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'MNRE Solar Photovoltaics Quality Control Order, 2017 / 2023',
      qcoMinistry: 'Ministry of New and Renewable Energy (MNRE)',
      effectiveDate: '2018-09-05',
      scheme: 'Scheme II (CRS - Compulsory Registration)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Under MNRE Compulsory Registration Scheme (CRS). In addition, modules must be listed in ALMM List-I.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 10.16',
        title: 'Static Mechanical Load Test (5400 Pa Snow / 2400 Pa Wind)',
        requirementMatch: 'Directly validates structural withstand requirements specified in tender.',
        standardExcerpt: 'Module shall withstand 2400 Pa front/rear load and 5400 Pa heavy snow load without electrical degradation or cell micro-cracks.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS/IEC 61730 (Part 1 & 2) : 2016',
        title: 'Photovoltaic (PV) Module Safety Qualification - Requirements for Construction & Testing',
        relationship: 'Safety & Environmental',
        importance: 'Mandatory for compliance'
      },
      {
        isNumber: 'IS/IEC 62804-1 : 2015',
        title: 'Photovoltaic (PV) modules - Test methods for the detection of potential-induced degradation (PID)',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 7. IS 14543 (Packaged Drinking Water)
  {
    id: 'IS-14543-2016',
    isNumber: 'IS 14543 : 2016',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water) - Specification',
    category: 'Food, Beverage & Hygiene',
    relevanceScore: 99,
    relevanceLabel: 'High Priority Match',
    explanation: 'Mandatory standard governing treatment, microbiological criteria, physico-chemical limits, and packaging for purified drinking water.',
    scopeSummary: 'Prescribes the requirements and methods of sampling and test for packaged drinking water other than packaged natural mineral water.',
    scopeExcerptAuthoritative: 'Clause 1.1: This standard prescribes the requirements and methods of sampling and test for packaged drinking water (other than packaged natural mineral water) offered for consumption in sealed containers.',
    status: 'Active - Incorporating Amendments',
    editionYear: 2016,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'March 2018', summary: 'Limits on bromate and perchlorate residues.' },
      { amendmentNumber: 'Amendment No. 2', date: 'July 2021', summary: 'Updated microbiological testing protocols for Pseudomonas aeruginosa.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-14543-2016',
      bisSectionalCommittee: 'Food and Agriculture Division - FAD 14 (Drinks and Drinking Water)',
      gazetteNotification: 'Food Safety and Standards (Prohibition and Restrictions on Sales) Regulations, 2011 & BIS Act 2016',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'FSSAI & BIS Mandatory Certification Order for Packaged Drinking Water',
      qcoMinistry: 'Ministry of Health & Family Welfare / BIS',
      effectiveDate: '2001-03-29',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Under FSSAI Section 2.3.14, no person shall manufacture, sell or exhibit for sale packaged drinking water except under BIS Certification Mark.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 3.2 & Table 1',
        title: 'Physico-chemical Requirements (TDS, pH, Turbidity)',
        requirementMatch: 'Matches TDS 75-500 mg/L, pH 6.5-8.5, and turbidity < 1 NTU.',
        standardExcerpt: 'TDS max 500 mg/l; pH between 6.5 and 8.5; Turbidity max 2 NTU (guideline 1 NTU).',
        matchDegree: 'Exact Match'
      },
      {
        clauseNumber: 'Clause 4.1 & Table 3',
        title: 'Microbiological Requirements',
        requirementMatch: 'Enforces zero tolerance for E. coli, coliforms, and Pseudomonas aeruginosa.',
        standardExcerpt: 'Escherichia coli, Coliform bacteria, Faecal streptococci, and Pseudomonas aeruginosa shall be ABSENT in 250 ml.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 13428 : 2005',
        title: 'Packaged Natural Mineral Water - Specification',
        relationship: 'Normative Reference',
        importance: 'Guidance',
        notes: 'Alternative standard if natural mineral spring source is utilized.'
      },
      {
        isNumber: 'IS 15410 : 2003',
        title: 'Containers for packaging of natural mineral water and packaged drinking water',
        relationship: 'Packaging & Marking',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 8. IS 3614 (Fire Doors)
  {
    id: 'IS-3614-2021',
    isNumber: 'IS 3614 : 2021',
    title: 'Fire Doors and Other Opening Protectives - Specification',
    category: 'Fire Safety & Building Fittings',
    relevanceScore: 98,
    relevanceLabel: 'High Priority Match',
    explanation: 'Defines manufacturing, hardware, fire integrity rating, and insulation criteria for metal fire doors protecting escape routes and electrical rooms.',
    scopeSummary: 'Specifies requirements for design, construction, testing and performance of fire doors and other opening protectives intended to provide fire resistance.',
    scopeExcerptAuthoritative: 'Clause 1.1: This standard covers fire doors, fire windows, fire shutters and dampers intended for use in building openings to prevent the spread of fire and smoke. Ratings: 30, 60, 90, 120, 180 and 240 minutes.',
    status: 'Current & Active',
    editionYear: 2021,
    amendments: [],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-3614-2021',
      bisSectionalCommittee: 'Civil Engineering Division Council - CED 22 (Fire Safety)',
      gazetteNotification: 'National Building Code of India (NBC 2016) Part 4 Mandatory Reference',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: false,
      qcoMinistry: 'Ministry of Housing and Urban Affairs (via NBC)',
      scheme: 'Voluntary BIS Certification',
      verificationStatus: 'Verification Needed',
      verificationNotes: 'Mandated under NBC 2016 Part 4 for building plan approval; BIS product certification is voluntary but third-party NABL test report to IS 3614 is mandatory in tender.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 4.1 & Table 1',
        title: 'Fire Resistance Rating Classification (120 Minutes)',
        requirementMatch: 'Matches 120-minute integrity and insulation rating requested.',
        standardExcerpt: 'Class 120 denotes stability and integrity retention for at least 120 minutes with temperature rise on unexposed face not exceeding 140°C.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 17518 (Part 1) : 2020',
        title: 'Fire Resistance Tests - Elements of Building Construction - Part 1: General Requirements',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance'
      },
      {
        isNumber: 'IS 3809 : 1979',
        title: 'Fire resistance test of structures',
        relationship: 'Test Method',
        importance: 'Recommended test practice'
      }
    ]
  },

  // 9. IS 694 (PVC Cables)
  {
    id: 'IS-694-2010',
    isNumber: 'IS 694 : 2010',
    title: 'Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords with Rigid and Flexible Conductor for Rated Voltages Up To and Including 450/750 V - Specification',
    category: 'Electrical Engineering & Distribution',
    relevanceScore: 84,
    relevanceLabel: 'Allied Reference',
    explanation: 'Standard for auxiliary low-voltage cabling, wiring of transformer control boxes, marshalling boxes, and substation lighting.',
    scopeSummary: 'Covers requirements for single and multicore PVC insulated cables for electric power and lighting.',
    scopeExcerptAuthoritative: 'Clause 1: This standard covers the requirements and tests for PVC insulated unsheathed and sheathed cables for working voltages up to 450/750 V.',
    status: 'Active - Incorporating Amendments',
    editionYear: 2010,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'May 2014', summary: 'Addition of halogen-free and flame retardant low smoke (FRLS) compounds.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-694-2010',
      bisSectionalCommittee: 'ETD 09 (Power Cables)',
      gazetteNotification: 'Electrical Wires and Cables (Quality Control) Order, 2023 (DPIIT)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Electrical Cables and Wires (Quality Control) Order, 2023',
      qcoMinistry: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
      effectiveDate: '2024-01-01',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Mandatory ISI mark under DPIIT QCO.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 5.2',
        title: 'Conductor Resistance & Voltage Grade',
        requirementMatch: 'Suitable for auxiliary power wiring of 415/240V substation controls.',
        standardExcerpt: 'Conductors shall be plain electrolytic copper with max electrical resistance as per IS 8130.',
        matchDegree: 'Derived Reference'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 8130 : 2013',
        title: 'Conductors for Insulated Electric Cables and Flexible Cords',
        relationship: 'Raw Material',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 10. IS 456 (Concrete)
  {
    id: 'IS-456-2000',
    isNumber: 'IS 456 : 2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    category: 'Civil & Structural Engineering',
    relevanceScore: 91,
    relevanceLabel: 'Allied Reference',
    explanation: 'Fundamental national code governing concrete mix design, cover to reinforcement, bond development length, and durability requirements.',
    scopeSummary: 'Deals with the general structural use of plain and reinforced concrete in buildings and civil engineering structures.',
    scopeExcerptAuthoritative: 'Clause 1.1: This code deals with the general structural use of plain and reinforced concrete. It does not cover special types of structures such as bridges and chimneys which have specific IRC or IS codes.',
    status: 'Active - Incorporating Amendments',
    editionYear: 2000,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'May 2001', summary: 'Editorial corrections to Table 5.' },
      { amendmentNumber: 'Amendment No. 2', date: 'August 2005', summary: 'Revisions to minimum cement content and water-cement ratios.' },
      { amendmentNumber: 'Amendment No. 3', date: 'August 2007', summary: 'Addition of self-compacting concrete guidelines.' },
      { amendmentNumber: 'Amendment No. 4', date: 'May 2013', summary: 'Updated modulus of elasticity equation and testing protocols.' },
      { amendmentNumber: 'Amendment No. 5', date: 'July 2019', summary: 'Modifications to design shear strength tables and durability criteria.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-456-2000',
      bisSectionalCommittee: 'CED 02 (Cement and Concrete)',
      gazetteNotification: 'Mandated by CPWD Specifications 2019 and NBC 2016',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: false,
      scheme: 'Voluntary BIS Certification',
      verificationStatus: 'Voluntary',
      verificationNotes: 'Code of practice; statutory compliance mandated in public works contracts.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 26.2',
        title: 'Development Length and Anchorage of Rebars',
        requirementMatch: 'Provides bond stress values required for Fe 550D reinforcement detailing.',
        standardExcerpt: 'Development length Ld = (phi * sigma_s) / (4 * tau_bd). For deformed bars conforming to IS 1786, design bond stress values shall be increased by 60%.',
        matchDegree: 'Exact Match'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 1786 : 2008',
        title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
        relationship: 'Normative Reference',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 11. IS 1489 Part 1 (PPC Cement)
  {
    id: 'IS-1489-1-2015',
    isNumber: 'IS 1489 (Part 1) : 2015',
    title: 'Portland Pozzolana Cement - Specification - Part 1: Fly Ash Based',
    category: 'Civil & Structural Engineering',
    relevanceScore: 82,
    relevanceLabel: 'Allied Reference',
    explanation: 'Specifies chemical, physical, and compressive strength criteria for fly ash based Portland Pozzolana Cement widely used in foundation civil works.',
    scopeSummary: 'Prescribes the manufacture, chemical and physical requirements of fly ash based Portland pozzolana cement.',
    scopeExcerptAuthoritative: 'Clause 1: This standard covers the manufacture and chemical and physical requirements of fly ash based Portland pozzolana cement.',
    status: 'Active - Incorporating Amendments',
    editionYear: 2015,
    amendments: [
      { amendmentNumber: 'Amendment No. 1', date: 'October 2018', summary: 'Permissible fly ash addition range updated to 15% - 35%.' }
    ],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-1489-1-2015',
      bisSectionalCommittee: 'CED 02 (Cement and Concrete)',
      gazetteNotification: 'Cement (Quality Control) Order, 2003 (DPIIT)',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Cement (Quality Control) Order, 2003',
      qcoMinistry: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
      effectiveDate: '2004-02-17',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Under DPIIT QCO; mandatory ISI mark required for all bags.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 6.1',
        title: 'Compressive Strength Requirements',
        requirementMatch: 'Foundation concrete specification requiring 33 MPa minimum 28-day strength.',
        standardExcerpt: 'Compressive strength shall not be less than 16 MPa at 72 h, 22 MPa at 168 h, and 33 MPa at 672 h (28 days).',
        matchDegree: 'Compatible'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 4031 (Parts 1-15)',
        title: 'Methods of Physical Tests for Hydraulic Cement',
        relationship: 'Test Method',
        importance: 'Mandatory for compliance'
      }
    ]
  },

  // 12. IS 1161 (Structural Steel Tubes)
  {
    id: 'IS-1161-2014',
    isNumber: 'IS 1161 : 2014',
    title: 'Steel Tubes for Structural Purposes - Specification',
    category: 'Civil & Structural Engineering',
    relevanceScore: 78,
    relevanceLabel: 'Alternative Standard',
    explanation: 'Standard for hot-finished and electric resistance welded (ERW) circular hollow sections used in roof trusses and portal frames.',
    scopeSummary: 'Covers requirements for hot finished and cold formed electric resistance welded (ERW) and seamless carbon steel tubes for structural purposes.',
    scopeExcerptAuthoritative: 'Clause 1.1: This standard covers the requirements for hot-finished seamless, hot-finished welded and cold formed ERW steel tubes for structural applications.',
    status: 'Current & Active',
    editionYear: 2014,
    amendments: [],
    lastCheckedDate: '2026-02-15',
    sourceProvenance: {
      authority: 'Bureau of Indian Standards (BIS)',
      portalUrl: 'https://standardsbis.bsbedge.com/Home/Details?is_id=IS-1161-2014',
      bisSectionalCommittee: 'Metallurgical Engineering - MTD 19 (Steel Tubes)',
      gazetteNotification: 'Steel Tubes (Quality Control) Order, 2024',
      lastSynced: '2026-02-15T09:30:00Z'
    },
    complianceInfo: {
      qcoMandatory: true,
      qcoOrderNumber: 'Steel Tubes (Quality Control) Order, 2024',
      qcoMinistry: 'Ministry of Steel',
      effectiveDate: '2024-06-01',
      scheme: 'Scheme I (ISI Mark - Mandatory QCO)',
      verificationStatus: 'BIS Verified',
      verificationNotes: 'Mandatory QCO certification on all structural hollow sections.'
    },
    matchedClauses: [
      {
        clauseNumber: 'Clause 7.1',
        title: 'Tensile Strength and Flattening Test',
        requirementMatch: 'Covers structural grade YSt 210, YSt 240, and YSt 310.',
        standardExcerpt: 'Tubes shall pass tensile, flattening and cold bend test without showing cracks or flaws.',
        matchDegree: 'Derived Reference'
      }
    ],
    relatedStandards: [
      {
        isNumber: 'IS 4923 : 2017',
        title: 'Hollow Steel Sections for Structural Use - Specification (RHS/SHS)',
        relationship: 'Normative Reference',
        importance: 'Guidance'
      }
    ]
  }
];

export const INITIAL_ANALYSES_HISTORY: ProcurementAnalysis[] = [
  {
    id: 'ANALYSIS-2026-001',
    title: 'Outdoor Distribution Transformers 500 kVA (CPWD Substation)',
    department: 'Central Public Works Department (CPWD) - Electrical Division',
    tenderReference: 'NIT/CPWD/EE-ED-I/2026/842',
    inputText: SAMPLE_PROMPTS[0].text,
    inputLanguage: 'en',
    uploadedDocument: {
      name: 'CPWD_Technical_Schedule_500kVA_Transformer.pdf',
      size: '2.4 MB',
      pageCount: 14,
      uploadDate: '2026-02-28 14:15'
    },
    extractedRequirements: {
      productName: 'Outdoor Oil-Immersed Distribution Transformer',
      productCategory: 'Electrical Engineering & Distribution Equipment',
      intendedApplication: 'Secondary Substation Distribution Network (CPWD Public Infrastructure)',
      confidenceScore: 0.96,
      technicalParameters: [
        { id: 'p1', name: 'Power Rating', value: '500 kVA', unit: 'kVA', mandatory: true, clauseRef: 'NIT Clause 3.1' },
        { id: 'p2', name: 'Primary Voltage Rating', value: '11 kV', unit: 'kV', mandatory: true, clauseRef: 'NIT Clause 3.2' },
        { id: 'p3', name: 'Secondary Voltage Rating', value: '0.433 kV (433 V)', unit: 'kV', mandatory: true, clauseRef: 'NIT Clause 3.2' },
        { id: 'p4', name: 'Cooling Method', value: 'ONAN (Oil Natural Air Natural)', mandatory: true, clauseRef: 'NIT Clause 3.4' },
        { id: 'p5', name: 'Energy Loss Level', value: 'BEE Level 2 / BIS IS 1180 Table 3', mandatory: true, clauseRef: 'NIT Clause 4.2' },
        { id: 'p6', name: 'Winding Conductor', value: 'Electrolytic Copper with Paper Insulation', mandatory: true, clauseRef: 'NIT Clause 5.1' },
        { id: 'p7', name: 'Core Material', value: 'Cold Rolled Grain Oriented (CRGO) Silicon Steel', mandatory: true, clauseRef: 'NIT Clause 5.3' },
        { id: 'p8', name: 'Tapping Range', value: '+2.5% to -5.0% in 2.5% steps (Off-circuit)', mandatory: false, clauseRef: 'NIT Clause 6.1' }
      ],
      testMethods: [
        'Routine Tests (Winding resistance, voltage ratio, short circuit impedance)',
        'Temperature Rise Test for Top Oil and Windings',
        'Lightning Impulse Voltage Withstand Test (75 kV peak)',
        'Dielectric Breakdown Strength of Insulating Mineral Oil'
      ],
      safetyAndEnvironmental: [
        'Mandatory Ministry of Power Quality Control Order (QCO) ISI Standard Mark',
        'Pressure Relief Valve (PRV) with trip contact',
        'Silica Gel Breather with oil seal',
        'Bi-metallic terminal connectors for overhead conductor interface'
      ],
      installationContext: [
        'Outdoor ground-mounted plinth',
        'Ambient temperature up to 50°C',
        'Seismic Zone IV design considerations'
      ],
      rawMaterials: [
        'Electrolytic Copper Rods (IS 12444)',
        'CRGO Steel Sheets (IS 3024)',
        'Type II Mineral Insulating Oil (IS 335)'
      ]
    },
    recommendations: [
      STANDARDS_DATABASE[0], // IS 1180 (Part 1)
      STANDARDS_DATABASE[1], // IS 335
      STANDARDS_DATABASE[2], // IS 2026 (Part 1)
      STANDARDS_DATABASE[8]  // IS 694
    ],
    selectedStandardIds: ['IS-1180-1-2014', 'IS-335-2018', 'IS-2026-1-2011'],
    status: 'completed',
    createdAt: '2026-02-28 14:18',
    lastModifiedAt: '2026-02-28 14:32'
  },
  {
    id: 'ANALYSIS-2026-002',
    title: 'High Strength TMT Steel Rebars Fe 550D (Bridge Piers)',
    department: 'National Highways Authority of India (NHAI)',
    tenderReference: 'NHAI/TECH/RO-DEL/BRG-EXP/2026/112',
    inputText: SAMPLE_PROMPTS[2].text,
    inputLanguage: 'en',
    uploadedDocument: {
      name: 'NHAI_Structural_Steel_Tender_Spec_Fe550D.pdf',
      size: '1.8 MB',
      pageCount: 8,
      uploadDate: '2026-02-27 10:04'
    },
    extractedRequirements: {
      productName: 'Thermo-Mechanically Treated (TMT) High Strength Deformed Steel Bars',
      productCategory: 'Civil & Structural Engineering Materials',
      intendedApplication: 'Elevated Highway Viaducts and Seismic Bridge Piers',
      confidenceScore: 0.98,
      technicalParameters: [
        { id: 'p1', name: 'Steel Grade', value: 'Fe 550D (High Ductility)', mandatory: true },
        { id: 'p2', name: 'Nominal Diameters', value: '12mm, 16mm, 20mm, 25mm, 32mm', mandatory: true },
        { id: 'p3', name: 'Minimum 0.2% Proof Stress', value: '550 MPa', unit: 'MPa', mandatory: true },
        { id: 'p4', name: 'Tensile/Yield Ratio (TS/YS)', value: '>= 1.10', mandatory: true },
        { id: 'p5', name: 'Total Elongation at Max Force (Agt)', value: '>= 5.0%', unit: '%', mandatory: true },
        { id: 'p6', name: 'Max Sulfur + Phosphorus Content', value: '<= 0.075%', unit: '%', mandatory: true }
      ],
      testMethods: [
        'Tensile and Yield Strength Test to IS 1608',
        'Bend and Rebend Test around specified mandrel diameter',
        'Chemical Ladle Analysis for Carbon, Sulfur, Phosphorus',
        'Bar code and heat number trace verification'
      ],
      safetyAndEnvironmental: [
        'Mandatory Ministry of Steel Quality Control Order (QCO)',
        'High seismic ductility requirement for Zone IV / V'
      ],
      installationContext: [
        'Structural reinforced concrete in high-vibration highway bridges'
      ],
      rawMaterials: [
        'Primary Steel from Integrated Steel Plants (BF-BOF or DRI-EAF route)'
      ]
    },
    recommendations: [
      STANDARDS_DATABASE[4], // IS 1786
      STANDARDS_DATABASE[9], // IS 456
      STANDARDS_DATABASE[11] // IS 1161
    ],
    selectedStandardIds: ['IS-1786-2008', 'IS-456-2000'],
    status: 'completed',
    createdAt: '2026-02-27 10:12',
    lastModifiedAt: '2026-02-27 10:45'
  }
];
