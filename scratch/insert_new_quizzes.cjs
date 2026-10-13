const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const supabase = createClient(url, key);

const quizzesToInsert = [
  {
    title: 'Concrete Finisher & Curb Systems Assessment',
    category: 'Operaciones & Oficios Técnicos',
    description: 'Technical evaluation covering FDOT curb types (Type RA, Type D, Type F, Type A), ADA sidewalk cross slopes, ramp standards, expansion joint spacing, and concrete slump.',
    timeLimitMinutes: 25,
    questions: [
      {
        text: 'Name type of curb is this? ![Curb Type RA](/images/quizzes/image1.png)',
        categoryTag: 'Curb Profiles & Standards',
        explanation: 'FDOT Standard Plan 520-001 defines Type RA as a Roundabout Curb featuring a 9" top sloped face, 3/4" and 1-3/4" radii, and 1\'-6" total depth.',
        options: [
          { id: 'opt-cf-1a', text: 'Type D' },
          { id: 'opt-cf-1b', text: 'Type F' },
          { id: 'opt-cf-1c', text: 'Type B' },
          { id: 'opt-cf-1d', text: 'Type RA' }
        ],
        correctOptionIds: ['opt-cf-1d']
      },
      {
        text: 'How do you cut a straight joint?',
        categoryTag: 'Finishing & Jointing',
        explanation: 'Straight joints are properly formed using a straightedge board or snapped chalk line as a rigid guide while running a hand groover, walking jointer, or concrete saw.',
        options: [
          { id: 'opt-cf-2a', text: 'Use a straightedge or snapped chalk line as a guide with a groover or saw' },
          { id: 'opt-cf-2b', text: 'Freehand using a wooden hand float without any straight guide' },
          { id: 'opt-cf-2c', text: 'By pulling a bull float diagonally across the wet slab' },
          { id: 'opt-cf-2d', text: 'Cutting with a spade shovel before initial setting' }
        ],
        correctOptionIds: ['opt-cf-2a']
      },
      {
        text: 'What should you check before pouring the concrete?',
        categoryTag: 'Pre-Pour Inspection',
        explanation: 'Prior to pouring, verify subgrade compaction and moisture, form alignment, elevations/grades, expansion joint placements, and correct rebar or wire mesh clearance.',
        options: [
          { id: 'opt-cf-3a', text: 'Subgrade compaction, moisture, form alignment, elevations, and rebar/mesh placement' },
          { id: 'opt-cf-3b', text: 'Only the ambient temperature and cloud cover forecast' },
          { id: 'opt-cf-3c', text: 'Just that the concrete ready-mix truck driver has arrived on site' },
          { id: 'opt-cf-3d', text: 'Paint color of adjacent existing structures' }
        ],
        correctOptionIds: ['opt-cf-3a']
      },
      {
        text: "What's the maximum cross slope for sidewalk per ADA requirements?",
        categoryTag: 'ADA Standards',
        explanation: 'ADA accessibility guidelines (Section 403.3) mandate that pedestrian sidewalk cross slope shall not exceed 1:50, which equals 2.00%.',
        options: [
          { id: 'opt-cf-4a', text: '10%' },
          { id: 'opt-cf-4b', text: '5%' },
          { id: 'opt-cf-4c', text: '2%' },
          { id: 'opt-cf-4d', text: '4%' }
        ],
        correctOptionIds: ['opt-cf-4c']
      },
      {
        text: "What's the maximum slope for a handicap ramp?",
        categoryTag: 'ADA Standards',
        explanation: 'Under ADA guidelines (Section 405.2), the maximum running slope of a handicap ramp is 1:12, which equals 8.33%.',
        options: [
          { id: 'opt-cf-5a', text: '6.88%' },
          { id: 'opt-cf-5b', text: '5.55%' },
          { id: 'opt-cf-5c', text: '6.87%' },
          { id: 'opt-cf-5d', text: '8.33%' }
        ],
        correctOptionIds: ['opt-cf-5d']
      },
      {
        text: "What's the maximum distance you can pour sidewalk before needing expansion material?",
        categoryTag: 'Specifications & Standards',
        explanation: 'Standard DOT and municipal specifications (such as FDOT Section 522) mandate transverse expansion joints at intervals not exceeding 120 linear feet.',
        options: [
          { id: 'opt-cf-6a', text: '120 lf' },
          { id: 'opt-cf-6b', text: '130 lf' },
          { id: 'opt-cf-6c', text: '180 lf' },
          { id: 'opt-cf-6d', text: '110 lf' }
        ],
        correctOptionIds: ['opt-cf-6a']
      },
      {
        text: 'What slump is needed to pour curb so that it will stand up?',
        categoryTag: 'Mix Design & Slump',
        explanation: 'Curb extrusion (slipform) or hand-formed curb requires a stiff, low-slump mix between 1" and 2" (or 2-3" for hand work) so the profile retains its vertical face without slumping.',
        options: [
          { id: 'opt-cf-7a', text: '2-3"' },
          { id: 'opt-cf-7b', text: '4-3"' },
          { id: 'opt-cf-7c', text: '5-4"' },
          { id: 'opt-cf-7d', text: '1-2"' }
        ],
        correctOptionIds: ['opt-cf-7d']
      },
      {
        text: 'What type of curb is this? ![Curb Type D](/images/quizzes/image2.png)',
        categoryTag: 'Curb Profiles & Standards',
        explanation: 'FDOT Standard Plan 520-001 defines Type D as an 8" base width barrier curb with a 6" top width, 6" vertical reveal, 2" radius corner, and 1\'-6" total depth.',
        options: [
          { id: 'opt-cf-8a', text: 'Type D' },
          { id: 'opt-cf-8b', text: 'Type F' },
          { id: 'opt-cf-8c', text: 'Type E' },
          { id: 'opt-cf-8d', text: 'Type RA' }
        ],
        correctOptionIds: ['opt-cf-8a']
      },
      {
        text: 'What type of curb is shown in the drawing below? ![Curb Type A & Type RA](/images/quizzes/image3.png) ![Detail](/images/quizzes/image4.png)',
        categoryTag: 'Curb Profiles & Standards',
        explanation: 'The standard drawings depict Type A (standard sloped median curb with 7" slope) and Type RA (roundabout truck apron curb with 9" slope).',
        options: [
          { id: 'opt-cf-9a', text: 'Type A & Type RA' },
          { id: 'opt-cf-9b', text: 'Type E & Type F' },
          { id: 'opt-cf-9c', text: 'Type C & Type D' },
          { id: 'opt-cf-9d', text: 'Type A & Type B' }
        ],
        correctOptionIds: ['opt-cf-9a']
      },
      {
        text: 'What type of Curb is this? ![Curb Type F](/images/quizzes/image5.png)',
        categoryTag: 'Curb Profiles & Standards',
        explanation: 'FDOT Standard Plan 520-001 classifies the 2\'-0" wide curb and gutter with a 1\'-6" gutter pan, 6" curb width, and 6" reveal as Type F Curb and Gutter.',
        options: [
          { id: 'opt-cf-10a', text: 'Type C' },
          { id: 'opt-cf-10b', text: 'Type B' },
          { id: 'opt-cf-10c', text: 'Type D' },
          { id: 'opt-cf-10d', text: 'Type F' }
        ],
        correctOptionIds: ['opt-cf-10d']
      },
      {
        text: 'Which structure would have a joint depth or radius of 12 mm (1/2 in.)?',
        categoryTag: 'Finishing & Jointing',
        explanation: 'Standard sidewalk edge groovers and edging tools are typically manufactured with a 1/2 in. (12 mm) radius to prevent chipping along pedestrian walkways.',
        options: [
          { id: 'opt-cf-11a', text: 'Sidewalk edge.' },
          { id: 'opt-cf-11b', text: 'Industrial concrete floor.' },
          { id: 'opt-cf-11c', text: 'Molded curb.' },
          { id: 'opt-cf-11d', text: 'Catch basin' }
        ],
        correctOptionIds: ['opt-cf-11a']
      }
    ]
  },
  {
    title: 'Cemex Assessments - Heavy Equipment & Truck Mechanic',
    category: 'Operaciones & Oficios Técnicos',
    description: 'Technical mechanical evaluation covering industrial gearbox components, planetary reduction, ready-mix concrete mixer systems, and hydraulic actuators.',
    timeLimitMinutes: 20,
    questions: [
      {
        text: 'What are the main components of a gearbox?',
        categoryTag: 'Power Transmission & Gearing',
        explanation: 'A mechanical gearbox consists of drive/driven gears, input/output/intermediate shafts, bearings (ball/roller/tapered), rigid housing/casing, oil seals, and lubricant.',
        options: [
          { id: 'opt-cx-1a', text: 'Gears (input/output/intermediate), shafts, bearings, casing/housing, and seals/lubricant' },
          { id: 'opt-cx-1b', text: 'Rotor, stator, commutator, carbon brushes, and alternator diode pack' },
          { id: 'opt-cx-1c', text: 'Brake master cylinder, caliper pistons, brake pads, and hydraulic booster' },
          { id: 'opt-cx-1d', text: 'Engine piston, connecting rod, crankshaft, and intake valves' }
        ],
        correctOptionIds: ['opt-cx-1a']
      },
      {
        text: 'How many primary types of industrial gearboxes are commonly used in heavy machinery?',
        categoryTag: 'Power Transmission & Gearing',
        explanation: 'The primary mechanical gearbox designs utilized across industrial mobile equipment are Helical, Planetary (Epicyclic), Bevel, and Worm drive gearboxes.',
        options: [
          { id: 'opt-cx-2a', text: 'Helical, Planetary, Bevel, and Worm gearboxes' },
          { id: 'opt-cx-2b', text: 'Hydraulic, Pneumatic, Steam, and Electric only' },
          { id: 'opt-cx-2c', text: 'Centrifugal and Reciprocating gearboxes only' },
          { id: 'opt-cx-2d', text: 'Sprocket drive and Pulley friction gearboxes only' }
        ],
        correctOptionIds: ['opt-cx-2a']
      },
      {
        text: 'What is the primary function of a planetary (epicyclic) gearbox in heavy construction equipment?',
        categoryTag: 'Power Transmission & Gearing',
        explanation: 'Planetary gearboxes distribute torque across multiple planet gears, delivering exceptional reduction ratios and massive torque capacity in a compact, inline cylindrical envelope.',
        options: [
          { id: 'opt-cx-3a', text: 'Achieve high torque multiplication and compact reduction in heavy wheel ends and swing drives' },
          { id: 'opt-cx-3b', text: 'Convert alternating electrical current into mechanical reciprocating movement' },
          { id: 'opt-cx-3c', text: 'Filter particulate impurities from pressurized hydraulic oil' },
          { id: 'opt-cx-3d', text: 'Control diesel engine exhaust emissions in Tier 4 engines' }
        ],
        correctOptionIds: ['opt-cx-3a']
      },
      {
        text: 'What are the core components of a Concrete Mixer Truck?',
        categoryTag: 'Concrete Equipment & Fleet',
        explanation: 'A concrete ready-mix truck features a rotating mixing drum with internal spiral blades, drive motor/planetary gearbox, water supply pump & tank, discharge chutes, and auxiliary engine or truck PTO.',
        options: [
          { id: 'opt-cx-4a', text: 'Mixing drum, hydraulic drive motor/gearbox, water supply system, discharge chute, and PTO' },
          { id: 'opt-cx-4b', text: 'Excavator boom, bucket cylinder, track rollers, and upper house turntable' },
          { id: 'opt-cx-4c', text: 'Compaction drum, vibratory eccentric weight, and pneumatic scraper bars' },
          { id: 'opt-cx-4d', text: 'Asphalt paver screed, slat conveyor chain, augers, and propane heaters' }
        ],
        correctOptionIds: ['opt-cx-4a']
      },
      {
        text: 'What is this part called? ![Hydraulic Cylinder](/images/quizzes/image6.jpeg)',
        categoryTag: 'Hydraulic Systems',
        explanation: 'The 3D CAD illustration shows a double-acting Hydraulic Cylinder (linear actuator), with barrel, chrome-plated piston rod, internal piston seals, and clevis mounting eyelets.',
        options: [
          { id: 'opt-cx-5a', text: 'Hydraulic Cylinder (Linear Actuator)' },
          { id: 'opt-cx-5b', text: 'Hydraulic Gear Pump' },
          { id: 'opt-cx-5c', text: 'Pneumatic Air Spring' },
          { id: 'opt-cx-5d', text: 'Steering Tie Rod End' }
        ],
        correctOptionIds: ['opt-cx-5a']
      }
    ]
  },
  {
    title: 'Construction Equipment Mechanic - Diagnostic & Systems Assessment',
    category: 'Operaciones & Oficios Técnicos',
    description: 'In-depth assessment of heavy equipment maintenance: preventative procedures, hydraulic troubleshooting, ECU diagnostics, CAN bus networks, 24V circuits, and cooling/HVAC systems.',
    timeLimitMinutes: 30,
    questions: [
      {
        text: 'What is the primary purpose of performing preventative maintenance on heavy equipment?',
        categoryTag: 'Preventative Maintenance',
        explanation: 'Preventative maintenance identifies wear before catastrophic failure occurs, dramatically reducing unplanned downtime, operating costs, and workplace safety hazards.',
        options: [
          { id: 'opt-cem-1a', text: 'Prevent premature component failure, reduce costly downtime, and ensure safe operation' },
          { id: 'opt-cem-1b', text: 'Increase diesel fuel consumption and operational exhaust temperatures' },
          { id: 'opt-cem-1c', text: 'Fulfill cosmetic vehicle appearance standards only' },
          { id: 'opt-cem-1d', text: 'Void OEM factory warranties in early hours' }
        ],
        correctOptionIds: ['opt-cem-1a']
      },
      {
        text: 'What are the common maintenance items for both road and off-road equipment in preventative maintenance?',
        categoryTag: 'Preventative Maintenance',
        explanation: 'Standard PM across road and heavy off-road machinery includes engine oil & filter changes, air/fuel filtration service, checking tire/track pressures, testing fluid levels, and greasing high-wear chassis bushings.',
        options: [
          { id: 'opt-cem-2a', text: 'Changing oil and filters, checking tire pressure/tracks, fluid levels, and lubricating grease points' },
          { id: 'opt-cem-2b', text: 'Replacing cab windshield glass at every shift change' },
          { id: 'opt-cem-2c', text: 'Disassembling transmission clutch packs every month' },
          { id: 'opt-cem-2d', text: 'Repainting counterweight panels weekly' }
        ],
        correctOptionIds: ['opt-cem-2a']
      },
      {
        text: 'What is the first thing you should do before beginning repair work on heavy equipment?',
        categoryTag: 'Shop Safety & LOTO',
        explanation: 'Always de-energize the machine: implement Lockout/Tagout (LOTO), relieve stored hydraulic/pneumatic pressure, lower all implements to the ground, and chock tires/tracks.',
        options: [
          { id: 'opt-cem-3a', text: 'Perform Lockout/Tagout (LOTO), release stored hydraulic/air pressure, and chock wheels' },
          { id: 'opt-cem-3b', text: 'Immediately disconnect hydraulic lines with the engine running' },
          { id: 'opt-cem-3c', text: 'Drain all fluids onto the ground' },
          { id: 'opt-cem-3d', text: 'Disconnect alternator wires with ignition switch ON' }
        ],
        correctOptionIds: ['opt-cem-3a']
      },
      {
        text: 'How often does the Federal DOT conduct DOT safety inspections?',
        categoryTag: 'DOT Compliance',
        explanation: '49 CFR § 396.17 establishes that all commercial motor vehicles must undergo a mandatory periodic DOT safety inspection at least once every 12 months (every year).',
        options: [
          { id: 'opt-cem-4a', text: 'Every year' },
          { id: 'opt-cem-4b', text: 'Quarterly' },
          { id: 'opt-cem-4c', text: 'Weekly' },
          { id: 'opt-cem-4d', text: 'Every 2 years' }
        ],
        correctOptionIds: ['opt-cem-4a']
      },
      {
        text: 'If you worked on the equipment, what should be checked before concluding that the electronic control unit (ECU) has failed?',
        categoryTag: 'Electrical & Electronics',
        explanation: 'Never condemn an ECU without verifying power supply (clean B+ voltage), solid ground continuity under load, intact fuses, corrosion-free pins, harness integrity, and CAN bus traffic.',
        options: [
          { id: 'opt-cem-5a', text: 'Power supply voltage, ground circuits, blown fuses, harness continuity, sensor inputs, and CAN signals' },
          { id: 'opt-cem-5b', text: 'Only the exterior aluminum case and part number label' },
          { id: 'opt-cem-5c', text: 'Tire inflation and final drive grease levels' },
          { id: 'opt-cem-5d', text: 'Hydraulic cylinder packing seals' }
        ],
        correctOptionIds: ['opt-cem-5a']
      },
      {
        text: 'What is the first step in diagnosing a hydraulic system failure in a bulldozer?',
        categoryTag: 'Hydraulic Diagnostics',
        explanation: 'Always start with visual and baseline checks: check hydraulic fluid level, inspect suction strainers and return filters, look for foaming (aeration), and check for external hose/fitting leaks.',
        options: [
          { id: 'opt-cem-6a', text: 'Check hydraulic fluid level, oil condition, and inspect for external leaks or foaming' },
          { id: 'opt-cem-6b', text: 'Immediately replace the variable displacement piston pump' },
          { id: 'opt-cem-6c', text: 'Dismantle main control valve spools without gauge readings' },
          { id: 'opt-cem-6d', text: 'Adjust primary relief valves beyond manufacturer specifications' }
        ],
        correctOptionIds: ['opt-cem-6a']
      },
      {
        text: 'Why is an engine cooling system pressurized?',
        categoryTag: 'Engine Systems',
        explanation: 'Pressurizing a closed cooling system (typically 10-15 psi) raises the boiling point of the coolant by approximately 3°F per psi, preventing boiling and destructive water pump cavitation under extreme duty cycles.',
        options: [
          { id: 'opt-cem-7a', text: 'To raise the boiling point of the coolant and prevent water pump cavitation' },
          { id: 'opt-cem-7b', text: 'To lower the boiling point of the coolant' },
          { id: 'opt-cem-7c', text: 'To warm up the intercooler radiator faster' },
          { id: 'opt-cem-7d', text: 'To inject coolant directly into the diesel cylinders' }
        ],
        correctOptionIds: ['opt-cem-7a']
      },
      {
        text: 'What does "1/4-20 x 1 inch" mean in bolt and nut specifications?',
        categoryTag: 'Fasteners & Torquing',
        explanation: 'In unified standard fasteners: 1/4" indicates nominal shank diameter, 20 indicates 20 threads per inch (UNC coarse thread pitch), and 1 inch is the length measured from under the head to the tip.',
        options: [
          { id: 'opt-cem-8a', text: '1/4" nominal diameter, 20 threads per inch (UNC coarse), and 1 inch bolt length' },
          { id: 'opt-cx-8b', text: '1/4 lb weight, 20 mm pitch, and 1 foot length' },
          { id: 'opt-cem-8c', text: 'Grade 20 tensile strength, 1/4" thread height, and 1" nut width' },
          { id: 'opt-cem-8d', text: '20 mm diameter, 1/4 pitch, and 1 inch socket size' }
        ],
        correctOptionIds: ['opt-cem-8a']
      },
      {
        text: 'What is the function of a multimeter in vehicle maintenance?',
        categoryTag: 'Electrical Diagnostics',
        explanation: 'A digital multimeter measures voltage (DC/AC), circuit continuity, electrical resistance (ohms), and amperage, enabling pinpoint electrical fault isolation.',
        options: [
          { id: 'opt-cem-9a', text: 'Checking battery voltage, circuit continuity, resistance, and sensor signals' },
          { id: 'opt-cem-9b', text: 'Measuring tire tread depth' },
          { id: 'opt-cem-9c', text: 'Diagnosing hydraulic fluid viscosity' },
          { id: 'opt-cem-9d', text: 'Lubricating engine parts' }
        ],
        correctOptionIds: ['opt-cem-9a']
      },
      {
        text: 'How would you hook up 2 batteries to make a 24-volt system?',
        categoryTag: 'Electrical & Batteries',
        explanation: 'To double voltage while maintaining equal amp-hour capacity (Series connection): wire the positive terminal of Battery 1 to the negative terminal of Battery 2, utilizing the remaining terminals for the 24V load.',
        options: [
          { id: 'opt-cem-10a', text: 'Connect in Series: Positive of Battery 1 to Negative of Battery 2' },
          { id: 'opt-cem-10b', text: 'Connect in Parallel: Positive to Positive, Negative to Negative' },
          { id: 'opt-cem-10c', text: 'Ground both positive terminals directly to frame' },
          { id: 'opt-cem-10d', text: 'Connect all terminals together with a single jumper wire' }
        ],
        correctOptionIds: ['opt-cem-10a']
      },
      {
        text: 'Which of the following represents three essential PPE items for heavy equipment mechanics?',
        categoryTag: 'Safety & PPE',
        explanation: 'Mandatory PPE for mobile equipment mechanics includes steel-toe safety footwear, impact-rated safety glasses with side shields, and heavy-duty mechanical work gloves.',
        options: [
          { id: 'opt-cem-11a', text: 'Steel-toe boots, safety glasses with side shields, and heavy-duty work gloves' },
          { id: 'opt-cem-11b', text: 'Athletic sneakers, sunglasses, and baseball cap' },
          { id: 'opt-cem-11c', text: 'Lab coat, sandals, and wristband' },
          { id: 'opt-cem-11d', text: 'Dust mask only with loose casual clothing' }
        ],
        correctOptionIds: ['opt-cem-11a']
      },
      {
        text: 'If you have a 120-ohm terminator on each end of a CAN communication line, what is the total resistance of the CAN line?',
        categoryTag: 'CAN Bus & Diagnostics',
        explanation: 'In standard J1939/CAN bus networks, two 120-ohm termination resistors are wired in parallel across CAN-H and CAN-L. Total equivalent resistance is: (120 x 120) / (120 + 120) = 60 ohms.',
        options: [
          { id: 'opt-cem-12a', text: '60 ohms' },
          { id: 'opt-cem-12b', text: '120 ohms' },
          { id: 'opt-cem-12c', text: '240 ohms' },
          { id: 'opt-cem-12d', text: '0 ohms' }
        ],
        correctOptionIds: ['opt-cem-12a']
      },
      {
        text: 'If you had high pressure on the high side and vacuum on the low side, what would the most likely problem be in an A/C system?',
        categoryTag: 'HVAC & Climate Control',
        explanation: 'When the compressor pulls the low side into a vacuum while discharge pressure builds excessive head pressure, it indicates a severe metering restriction—most commonly a clogged or stuck-closed Expansion Valve (TXV) or orifice tube.',
        options: [
          { id: 'opt-cem-13a', text: 'Blocked or stuck-closed expansion valve (TXV) or orifice tube' },
          { id: 'opt-cem-13b', text: 'Completely empty refrigerant charge due to large leak' },
          { id: 'opt-cem-13c', text: 'Faulty compressor clutch slipping' },
          { id: 'opt-cem-13d', text: 'Overcharged cooling system with defective condenser fan' }
        ],
        correctOptionIds: ['opt-cem-13a']
      }
    ]
  },
  {
    title: 'Roadway Superintendent - Construction Operations & Safety',
    category: 'Operaciones & Oficios Técnicos',
    description: 'Assessment for Roadway Superintendents covering daily field operations, FDOT and client stakeholder relations, proactive issue resolution, software tools, and jobsite safety.',
    timeLimitMinutes: 25,
    questions: [
      {
        text: 'Which of the following best describes the primary responsibilities of a Project Superintendent in roadway construction?',
        categoryTag: 'Superintendent Responsibilities',
        explanation: 'The Project Superintendent directly manages on-site daily operations, crew scheduling, subcontractor coordination, material delivery, and equipment allocation.',
        options: [
          { id: 'opt-rs-1a', text: 'A) Designing roadways and bridges.' },
          { id: 'opt-rs-1b', text: 'B) Overseeing daily operations on the construction site, scheduling, and resource allocation.' },
          { id: 'opt-rs-1c', text: 'C) Handling financial audits and tax filings for the construction company.' },
          { id: 'opt-rs-1d', text: 'D) Marketing and advertising construction services.' }
        ],
        correctOptionIds: ['opt-rs-1b']
      },
      {
        text: 'What is the primary role of the Project Superintendent regarding project stakeholders?',
        categoryTag: 'Stakeholder Relations',
        explanation: 'The Superintendent serves as the vital field liaison communicating with project owners, DOT representatives, inspectors, utility companies, and the public.',
        options: [
          { id: 'opt-rs-2a', text: 'A) To manage the financial transactions between stakeholders.' },
          { id: 'opt-rs-2b', text: 'B) To serve as the primary point of contact for clients, FDOT representatives, and community members.' },
          { id: 'opt-rs-2c', text: 'C) To design and implement marketing strategies.' },
          { id: 'opt-rs-2d', text: 'D) To prepare architectural plans and designs.' }
        ],
        correctOptionIds: ['opt-rs-2b']
      },
      {
        text: 'What action should a Project Superintendent take if they identify potential issues or challenges in a project?',
        categoryTag: 'Field Problem Solving',
        explanation: 'Superintendents must identify variances early, assess site impacts, and engineer proactive solutions with project engineers to mitigate delays and cost overruns.',
        options: [
          { id: 'opt-rs-3a', text: 'A) Ignore the issues and proceed as planned.' },
          { id: 'opt-rs-3b', text: 'B) Report the issues to local law enforcement.' },
          { id: 'opt-rs-3c', text: 'C) Develop proactive solutions to address the issues effectively.' },
          { id: 'opt-rs-3d', text: 'D) Wait for the issues to resolve themselves.' }
        ],
        correctOptionIds: ['opt-rs-3c']
      },
      {
        text: 'Which of the following skills is essential for a Project Superintendent in roadway construction?',
        categoryTag: 'Superintendent Competencies',
        explanation: 'Superintendents rely heavily on construction management, scheduling, and field reporting software (such as Procore, HeavyJob, Primavera, or AutoCAD Civil viewers).',
        options: [
          { id: 'opt-rs-4a', text: 'A) Advanced graphic design skills.' },
          { id: 'opt-rs-4b', text: 'B) Knowledge of marine biology.' },
          { id: 'opt-rs-4c', text: 'C) Proficiency in construction management software and tools.' },
          { id: 'opt-rs-4d', text: 'D) Experience in culinary arts.' }
        ],
        correctOptionIds: ['opt-rs-4c']
      },
      {
        text: 'Identify three key safety measures that should be implemented at a roadway construction site.',
        categoryTag: 'Roadway Safety & MOT',
        explanation: 'Roadway work zones require concrete/crash barriers, high-visibility Class 3 safety apparel, and comprehensive MOT warning signage.',
        options: [
          { id: 'opt-rs-5a', text: 'A) Installation of safety barriers, use of high-visibility clothing, and proper signage.' },
          { id: 'opt-rs-5b', text: 'B) Allowing unrestricted access to the site, wearing casual clothing, and minimal signage.' },
          { id: 'opt-rs-5c', text: 'C) Providing refreshments, organizing entertainment activities, and minimizing safety equipment.' },
          { id: 'opt-rs-5d', text: 'D) Encouraging public access, using decorative signs, and providing minimal protective gear.' }
        ],
        correctOptionIds: ['opt-rs-5a']
      }
    ]
  },
  {
    title: 'Universal Heavy Equipment Operator - Field Competencies',
    category: 'Operaciones & Oficios Técnicos',
    description: 'Field skills assessment for universal operators covering dozers, motor graders, excavators, skid steer safety, and grade interpretation from plans.',
    timeLimitMinutes: 20,
    questions: [
      {
        text: 'You are operating a dozer to level a site. What is the primary purpose of using a dozer in this scenario?',
        categoryTag: 'Earthmoving Operations',
        explanation: 'Bulldozers utilize their heavy front blade to push bulk earth, cut high spots, and spread material across rough and finish grading applications.',
        options: [
          { id: 'opt-heo-1a', text: 'A) Digging deep trenches' },
          { id: 'opt-heo-1b', text: 'B) Hauling materials' },
          { id: 'opt-heo-1c', text: 'C) Pushing and leveling soil' },
          { id: 'opt-heo-1d', text: 'D) Lifting heavy objects' }
        ],
        correctOptionIds: ['opt-heo-1c']
      },
      {
        text: 'What is the function of a motor grader in road construction?',
        categoryTag: 'Earthmoving Operations',
        explanation: 'Motor graders feature a moldboard blade designed specifically for precision grading, fine leveling, crowning, and spreading base material to tight tolerances.',
        options: [
          { id: 'opt-heo-2a', text: 'A) Compacting soil' },
          { id: 'opt-heo-2b', text: 'B) Spreading asphalt' },
          { id: 'opt-heo-2c', text: 'C) Grading and leveling surfaces' },
          { id: 'opt-heo-2d', text: 'D) Digging foundations' }
        ],
        correctOptionIds: ['opt-heo-2c']
      },
      {
        text: 'Which of the following equipment is best suited for excavating deep holes or trenches?',
        categoryTag: 'Excavation & Trenching',
        explanation: 'Hydraulic excavators with articulated booms and bucket attachments are engineered specifically for deep trenching, footing excavation, and deep hole digging.',
        options: [
          { id: 'opt-heo-3a', text: 'A) Skid steer' },
          { id: 'opt-heo-3b', text: 'B) Motor grader' },
          { id: 'opt-heo-3c', text: 'C) Excavator' },
          { id: 'opt-heo-3d', text: 'D) Loader' }
        ],
        correctOptionIds: ['opt-heo-3c']
      },
      {
        text: 'While using a skid steer, you notice the machine is not moving smoothly. What should you do first?',
        categoryTag: 'Equipment Safety & Inspection',
        explanation: 'When abnormal travel or mechanical resistance occurs, immediately bring the machine to a safe stop, lower attachments, shut down, and inspect tracks/tires/drivetrain.',
        options: [
          { id: 'opt-heo-4a', text: 'A) Continue working and report it later' },
          { id: 'opt-heo-4b', text: 'B) Stop immediately and inspect for any issues' },
          { id: 'opt-heo-4c', text: 'C) Ignore it if the work can still be completed' },
          { id: 'opt-heo-4d', text: 'D) Increase the speed to overcome the issue' }
        ],
        correctOptionIds: ['opt-heo-4b']
      },
      {
        text: 'Which document should you consult to understand the specific grade levels required on a construction site?',
        categoryTag: 'Plans & Blueprints',
        explanation: 'Construction plans and civil engineering blueprints detail benchmarks, cut/fill contour stakes, finished elevations, and slope ratios for the project.',
        options: [
          { id: 'opt-heo-5a', text: 'A) Equipment manual' },
          { id: 'opt-heo-5b', text: 'B) Safety policy document' },
          { id: 'opt-heo-5c', text: 'C) Construction plans and blueprints' },
          { id: 'opt-heo-5d', text: 'D) Operator\'s daily log' }
        ],
        correctOptionIds: ['opt-heo-5c']
      }
    ]
  }
];

async function insertAll() {
  console.log('Inserting', quizzesToInsert.length, 'quizzes into Supabase...');

  for (const qData of quizzesToInsert) {
    // 1. Check if quiz already exists
    const { data: existingQuiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('title', qData.title)
      .maybeSingle();

    let quizId;
    if (existingQuiz) {
      console.log('Updating existing quiz:', qData.title);
      quizId = existingQuiz.id;
      await supabase
        .from('quizzes')
        .update({
          category: qData.category,
          description: qData.description,
          time_limit_minutes: qData.timeLimitMinutes,
        })
        .eq('id', quizId);

      // delete old questions to reinsert cleanly
      await supabase.from('questions').delete().eq('quiz_id', quizId);
    } else {
      console.log('Inserting new quiz:', qData.title);
      const { data: newQuiz, error: insertQuizErr } = await supabase
        .from('quizzes')
        .insert({
          title: qData.title,
          category: qData.category,
          description: qData.description,
          time_limit_minutes: qData.timeLimitMinutes,
        })
        .select()
        .single();

      if (insertQuizErr) {
        console.error('Error inserting quiz:', insertQuizErr);
        continue;
      }
      quizId = newQuiz.id;
    }

    // 2. Insert questions
    const questionsRows = qData.questions.map(q => ({
      quiz_id: quizId,
      text: q.text,
      category_tag: q.categoryTag || '',
      explanation: q.explanation || '',
      options: q.options,
      correct_option_ids: q.correctOptionIds,
    }));

    const { error: questErr } = await supabase.from('questions').insert(questionsRows);
    if (questErr) {
      console.error('Error inserting questions for', qData.title, questErr);
    } else {
      console.log('Successfully inserted', questionsRows.length, 'questions for', qData.title);
    }
  }

  console.log('All quizzes processed successfully!');
}

insertAll();
