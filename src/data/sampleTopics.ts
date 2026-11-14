import { StudyKit } from '../types';

export const SAMPLE_STUDY_KITS: Record<string, StudyKit> = {
  'photosynthesis': {
    topic: 'Photosynthesis & Plant Solar Power',
    mode: 'eli5',
    spokenExplanation: `Imagine plants are running tiny solar-powered bakeries inside their leaves called chloroplasts! Their recipe is super simple: they take sunlight from the sky, carbon dioxide gas from the air, and drink water from their roots. Inside the chloroplasts, a green pigment named chlorophyll acts like a solar panel. It captures light energy to turn water and carbon dioxide into sweet glucose sugar—which is delicious plant food—and as a wonderful bonus for all of us, it breathes out fresh oxygen into the air!`,
    quickNotes: {
      title: 'Photosynthesis: How Plants Convert Light into Life',
      summary: 'The biological engine where autotrophs transform solar radiant energy into chemical energy stored in glucose bonds.',
      keyPoints: [
        'Occurs primarily inside chloroplast organelle thylakoid membranes and stroma.',
        'Inputs: 6 molecules of CO2 (Carbon Dioxide) + 6 molecules of H2O (Water) + Photons (Sunlight).',
        'Outputs: 1 molecule of C6H12O6 (Glucose) + 6 molecules of O2 (Oxygen).',
        'Phase 1: Light-Dependent Reactions (splits water, creates ATP & NADPH, releases O2).',
        'Phase 2: Light-Independent Calvin Cycle (fixes CO2 into glucose sugars).'
      ],
      formulasOrRules: [
        'Chemical Equation: 6CO2 + 6H2O + Sunlight ➔ C6H12O6 + 6O2',
        'Chlorophyll absorbs blue and red wavelengths, reflecting green light.'
      ],
      commonMisconceptions: [
        'Misconception: Plants only do photosynthesis and not cellular respiration. Fact: Plants perform cellular respiration day and night to break down glucose for ATP!',
        'Misconception: The Calvin cycle only happens in the dark. Fact: It does not require photons directly, but relies on ATP/NADPH generated during light hours.'
      ],
      proTip: 'Remember the acronym OIL RIG or "Water in, Oxygen out; Carbon in, Sugar out!"'
    },
    flashcards: [
      {
        id: 1,
        question: 'What are the three primary ingredients plants need to bake glucose?',
        answer: 'Sunlight (photons), Water (H2O through roots), and Carbon Dioxide (CO2 through leaf stomata).',
        memoryHook: 'Think: Sun, Sip, and Sniff!'
      },
      {
        id: 2,
        question: 'Why do most plant leaves appear vibrant green to our eyes?',
        answer: 'Chlorophyll pigments absorb blue and red light spectrums, but bounce back (reflect) green wavelengths into our eyes.',
        memoryHook: 'Green is rejected, not absorbed!'
      },
      {
        id: 3,
        question: 'Where do the light-dependent reactions take place inside a plant cell?',
        answer: 'Inside the thylakoid membranes of chloroplasts, organized in stacks called grana.',
        memoryHook: 'Thylakoids are like green solar pancake stacks.'
      }
    ],
    conceptMindmap: {
      title: 'The Solar Pathway: From Sunlight to Glucose',
      diagramSummary: 'Step-by-step visual cascade showing solar photons splitting water into oxygen, powering ATP creation, and fueling the Calvin Cycle.',
      steps: [
        {
          stepNumber: 1,
          label: 'Sunlight & Water Absorption',
          detail: 'Roots pull H2O from soil while leaf chlorophyll catches incoming solar photons.',
          iconType: 'start'
        },
        {
          stepNumber: 2,
          label: 'Photolysis & Light Reaction',
          detail: 'Water molecules are split in thylakoids; Oxygen (O2) is released as a vital byproduct.',
          iconType: 'process'
        },
        {
          stepNumber: 3,
          label: 'Energy Storage (ATP & NADPH)',
          detail: 'Excited electrons charge up cellular battery packs (ATP and NADPH carriers).',
          iconType: 'decision'
        },
        {
          stepNumber: 4,
          label: 'Calvin Cycle & Glucose Output',
          detail: 'In the stroma, stored ATP fixes CO2 into high-energy Glucose (C6H12O6) sugar for nourishment.',
          iconType: 'outcome'
        }
      ],
      accessibleDescription: 'A 4-stage horizontal flowchart: Stage 1 absorbs sunlight and water. Stage 2 splits water in thylakoid membranes releasing oxygen gas. Stage 3 charges up ATP and NADPH batteries. Stage 4 combines those batteries with carbon dioxide in the Calvin Cycle to manufacture glucose sugar.'
    },
    adaptiveQuiz: [
      {
        id: 1,
        question: 'What gas is released into the atmosphere as a byproduct when water is split during the light-dependent reactions?',
        options: ['Carbon Dioxide (CO2)', 'Oxygen (O2)', 'Nitrogen (N2)', 'Methane (CH4)'],
        correctIndex: 1,
        conceptTag: 'Water Splitting & Oxygen Byproduct',
        explanation: 'During photolysis in Photosystem II, water molecules (H2O) are split to supply electrons, releasing breathable Oxygen (O2).',
        optionExplanations: [
          'CO2 is an INPUT, not a released byproduct.',
          'Correct! Splitting H2O yields protons, electrons, and breathable O2.',
          'Nitrogen is in the atmosphere but not produced in photosynthesis.',
          'Methane is produced by anaerobic methanogens, not photosynthesis.'
        ]
      },
      {
        id: 2,
        question: 'In which specific microscopic organelle does photosynthesis occur in eukaryotic plant cells?',
        options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Endoplasmic Reticulum'],
        correctIndex: 1,
        conceptTag: 'Chloroplast Anatomy',
        explanation: 'Chloroplasts contain chlorophyll pigments and thylakoid membranes specialized for capturing solar photons.',
        optionExplanations: [
          'Mitochondria handle cellular respiration (energy release), not photon capture.',
          'Correct! Chloroplasts are the solar factories containing thylakoids and stroma.',
          'Ribosomes assemble proteins from mRNA.',
          'The ER processes and transports proteins and lipids.'
        ]
      },
      {
        id: 3,
        question: 'What role does Carbon Dioxide (CO2) play in the overall photosynthetic equation?',
        options: [
          'It captures light photons directly.',
          'It provides the carbon backbone needed to build Glucose (C6H12O6).',
          'It splits water molecules through friction.',
          'It turns leaves yellow in autumn.'
        ],
        correctIndex: 1,
        conceptTag: 'Calvin Cycle Carbon Fixation',
        explanation: 'During the Calvin cycle, the enzyme RuBisCO fixes carbon from CO2 into 3-carbon sugars that eventually form glucose.',
        optionExplanations: [
          'Chlorophyll pigments capture photons, not CO2 gas.',
          'Correct! CO2 supplies the crucial carbon atoms that make up glucose (C6H12O6).',
          'Enzymes and photon energy split water, not CO2.',
          'Autumn colors are caused by chlorophyll breakdown revealing carotenoids.'
        ]
      }
    ]
  },
  'newton-laws': {
    topic: "Newton's 3 Laws of Motion",
    mode: 'socratic',
    spokenExplanation: `Have you ever wondered why you lurch forward when a bus suddenly hits the brakes? That is Sir Isaac Newton's First Law in action! Your body simply wants to keep moving at the same speed because of inertia. Newton discovered three fundamental rules that govern everything moving in our universe: things stay put unless shoved, the harder you push something heavy the faster it accelerates, and whenever you push on the world, the world pushes right back on you with equal strength!`,
    quickNotes: {
      title: "Newton's Three Laws: The Mechanics of Motion",
      summary: 'The universal physical principles defining forces, mass, inertia, and interactive reaction pairs.',
      keyPoints: [
        '1st Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by a net external force.',
        '2nd Law (Force & Acceleration): Force equals mass times acceleration (F = m · a). Heavier objects require more force to accelerate.',
        '3rd Law (Action & Reaction): For every action force, there is an equal in magnitude and opposite in direction reaction force acting on different bodies.'
      ],
      formulasOrRules: [
        'Net Force Equation: F_net = m × a (measured in Newtons, N = kg·m/s²)',
        'Momentum Conservation: p = m × v'
      ],
      commonMisconceptions: [
        'Misconception: Action and reaction forces cancel each other out to zero. Fact: They NEVER cancel because they act on TWO DIFFERENT objects (e.g. your foot kicks ball; ball pushes back on foot).',
        'Misconception: Motion requires a continuous force. Fact: Friction stops moving objects; in vacuum space, objects travel forever with zero force!'
      ],
      proTip: 'Always draw a Free Body Diagram (FBD) to identify external vs internal force vectors.'
    },
    flashcards: [
      {
        id: 1,
        question: 'What is "Inertia" and how does mass affect it?',
        answer: 'Inertia is an object\'s resistance to any change in its velocity. The greater the mass, the greater the inertia.',
        memoryHook: 'More mass = harder to push, harder to stop!'
      },
      {
        id: 2,
        question: 'If you double the force on a shopping cart while its mass stays constant, what happens to acceleration?',
        answer: 'Acceleration doubles! According to F = ma, force and acceleration are directly proportional.',
        memoryHook: 'Double the push = double the sprint!'
      },
      {
        id: 3,
        question: 'When a rocket blasts hot gas downwards, why does the rocket accelerate upwards?',
        answer: "By Newton's 3rd Law, the rocket exerts a downward force on exhaust gas, and the gas exerts an equal upward thrust force on the rocket.",
        memoryHook: 'Push down on gas, gas kicks rocket to space!'
      }
    ],
    conceptMindmap: {
      title: "Newtonian Motion Cascade",
      diagramSummary: 'Visual breakdown showing how resting states, applied net forces, and mutual force pairs dictate speed and direction.',
      steps: [
        {
          stepNumber: 1,
          label: 'Inertial Equilibrium',
          detail: 'When net force equals zero, velocity remains completely constant (at rest or gliding).',
          iconType: 'start'
        },
        {
          stepNumber: 2,
          label: 'Applied External Force',
          detail: 'An unbalanced shove or pull disturbs equilibrium, creating a net force vector.',
          iconType: 'process'
        },
        {
          stepNumber: 3,
          label: 'F = m · a Acceleration',
          detail: 'Velocity changes proportional to force and inversely proportional to object mass.',
          iconType: 'decision'
        },
        {
          stepNumber: 4,
          label: 'Equal Opposite Reaction',
          detail: 'The target object exerts an identical magnitude force backward against the pusher.',
          iconType: 'outcome'
        }
      ],
      accessibleDescription: 'A 4-part diagram: Step 1 shows an object in inertia with zero net force. Step 2 shows an external force applied. Step 3 demonstrates acceleration calculated via F = m a. Step 4 highlights the simultaneous opposite reaction force.'
    },
    adaptiveQuiz: [
      {
        id: 1,
        question: "A spacecraft in deep interstellar space cuts off its thrusters. What will happen to its motion if no gravitational bodies or friction exist?",
        options: [
          'It will immediately stop dead in its tracks.',
          'It will gradually slow down and stop over a few days.',
          'It will continue moving at the exact same speed and direction forever.',
          'It will begin spinning in circles.'
        ],
        correctIndex: 2,
        conceptTag: "Newton's 1st Law (Inertia)",
        explanation: "Newton's First Law dictates that without friction or external forces, an object in motion maintains constant velocity indefinitely.",
        optionExplanations: [
          'Objects only stop if an opposing force acts on them.',
          'In outer space there is no friction or air drag to cause slowdown.',
          'Correct! Inertia preserves velocity forever in zero-friction space.',
          'Spinning requires an applied rotational torque.'
        ]
      },
      {
        id: 2,
        question: "If a 5 kg bowling ball is accelerated at 4 m/s², what net force was applied?",
        options: ['1.25 N', '9 N', '20 N', '40 N'],
        correctIndex: 2,
        conceptTag: "F = ma Calculations",
        explanation: 'F = m × a = 5 kg × 4 m/s² = 20 Newtons.',
        optionExplanations: [
          '1.25 is 5 divided by 4, not multiplied.',
          '9 is 5 plus 4, not multiplied.',
          'Correct! 5 kg multiplied by 4 m/s² gives 20 N.',
          '40 N would require an acceleration of 8 m/s².'
        ]
      },
      {
        id: 3,
        question: "Why do action-reaction force pairs NOT cancel each other out to produce zero motion?",
        options: [
          'Because one force is always slightly stronger than the other.',
          'Because they act on two completely different objects.',
          'Because gravity cancels one of them out.',
          'Because they happen at different times.'
        ],
        correctIndex: 1,
        conceptTag: "Newton's 3rd Law Interaction Pairs",
        explanation: "Action-reaction pairs act on separate bodies (e.g. Earth pulls moon, moon pulls Earth). Forces only cancel when acting on the SAME body.",
        optionExplanations: [
          'Action and reaction are always mathematically identical in magnitude.',
          'Correct! Because they act on different entities, neither body has internal cancellation.',
          'Gravity is an example of an action-reaction pair itself.',
          'They occur simultaneously, not sequentially.'
        ]
      }
    ]
  },
  'internet-dns': {
    topic: 'How the Internet Works: DNS & Packet Routing',
    mode: 'exam',
    spokenExplanation: `When you type a website address like google.com into your browser, you are actually embarking on a global millisecond relay race! First, computers do not understand word names; they only speak numbers called IP addresses. So your browser asks the Domain Name System—the Internet's phonebook—to translate google.com into an IP address. Once obtained, your request is sliced into tiny numbered envelopes called data packets, routed through fiber-optic cables and routers across continents, and reassembled on the other end in under a tenth of a second!`,
    quickNotes: {
      title: 'Internet Architecture: DNS, IP, and Packet Switching',
      summary: 'The decentralized protocols enabling global digital packet exchange across distributed networks.',
      keyPoints: [
        'DNS (Domain Name System): Hierarchical phonebook mapping human-readable domain names (sensei.ai) to machine IP addresses (142.250.190.46).',
        'Hierarchy: Root Nameserver ➔ TLD Nameserver (.com) ➔ Authoritative Nameserver.',
        'Packet Switching: Large data is split into small packets (headers + payload + checksum) traveling independent routes.',
        'TCP (Transmission Control Protocol): Ensures reliability via 3-way handshake (SYN, SYN-ACK, ACK) and retransmits lost packets.',
        'IP (Internet Protocol): Handles addressing and packet routing across intermediate hops.'
      ],
      formulasOrRules: [
        'IPv4: 32-bit address (e.g. 192.168.1.1, ~4.3 billion addresses)',
        'IPv6: 128-bit address (e.g. 2001:0db8::8a2e:0370:7334, virtually infinite addresses)'
      ],
      commonMisconceptions: [
        'Misconception: Packets always travel the same identical physical path. Fact: Dynamic BGP routing sends packets along different paths depending on real-time traffic congestion.',
        'Misconception: DNS queries hit the root server every single time. Fact: Multiple caching layers (browser cache, OS cache, ISP resolver cache) satisfy >90% of lookups instantly.'
      ],
      proTip: 'Remember the TCP 3-way handshake: "Hello?", "Hello, hear you!", "Great, let\'s talk!"'
    },
    flashcards: [
      {
        id: 1,
        question: 'What is the core function of a DNS Recursive Resolver?',
        answer: 'It acts as the browser\'s detective, chasing down records across Root, TLD, and Authoritative servers on behalf of the client.',
        memoryHook: 'The resolver is your digital courier.'
      },
      {
        id: 2,
        question: 'What happens if one packet out of a hundred is dropped or corrupted in TCP?',
        answer: 'TCP detects the missing sequence acknowledgment and automatically requests retransmission of that specific packet.',
        memoryHook: 'TCP guarantees zero missing puzzle pieces.'
      },
      {
        id: 3,
        question: 'What information is contained inside a typical IP packet header?',
        answer: 'Source IP, Destination IP, Packet Length, Time-To-Live (TTL hop count), and Protocol type.',
        memoryHook: 'The envelope address and postal stamp.'
      }
    ],
    conceptMindmap: {
      title: 'From URL Keystroke to Rendered Webpage',
      diagramSummary: 'Step-by-step pipeline from URL typing to DNS resolution, TCP handshake, HTTP fetching, and packet reassembly.',
      steps: [
        {
          stepNumber: 1,
          label: 'Browser URL Input',
          detail: 'User enters domain; browser first inspects local DNS cache.',
          iconType: 'start'
        },
        {
          stepNumber: 2,
          label: 'DNS Resolution Chain',
          detail: 'Resolver queries Root ➔ TLD (.com) ➔ Authoritative server to retrieve target IP.',
          iconType: 'process'
        },
        {
          stepNumber: 3,
          label: 'TCP 3-Way Handshake',
          detail: 'Client and server exchange SYN, SYN-ACK, ACK packets to establish secure session.',
          iconType: 'decision'
        },
        {
          stepNumber: 4,
          label: 'Packet Routing & Rendering',
          detail: 'Webpage data packets traverse BGP router hops and are reassembled in the DOM.',
          iconType: 'outcome'
        }
      ],
      accessibleDescription: 'A 4-step pipeline: Step 1 enters URL. Step 2 resolves domain name to IP address through DNS hierarchy. Step 3 establishes TCP connection with 3-way handshake. Step 4 streams routed data packets for final DOM rendering.'
    },
    adaptiveQuiz: [
      {
        id: 1,
        question: 'Which server in the DNS lookup hierarchy holds the final, official IP record for a specific registered domain?',
        options: [
          'Root Nameserver',
          'TLD (Top-Level Domain) Server',
          'Authoritative Nameserver',
          'Local Wi-Fi Router'
        ],
        correctIndex: 2,
        conceptTag: 'DNS Resolution Hierarchy',
        explanation: 'The Authoritative Nameserver holds the definitive DNS records (A, AAAA, CNAME) configured by the domain owner.',
        optionExplanations: [
          'Root servers direct to the correct TLD server, but do not store individual IP records.',
          'TLD servers handle top-level extensions like .com or .org and point to authoritative servers.',
          'Correct! The Authoritative nameserver stores the definitive A record.',
          'Local routers merely cache or forward requests to an ISP resolver.'
        ]
      },
      {
        id: 2,
        question: 'What mechanism in TCP ensures that network packets arriving out of order are reassembled correctly?',
        options: [
          'Packet Sequence Numbers in headers',
          'Alphabetical sorting of domain letters',
          'Wi-Fi signal amplification',
          'DNS Caching TTL values'
        ],
        correctIndex: 0,
        conceptTag: 'TCP Packet Sequencing & Reliability',
        explanation: 'Each TCP packet includes a Sequence Number so the receiver can place bytes in the exact intended sequence regardless of transit arrival order.',
        optionExplanations: [
          'Correct! Sequence numbers allow the receiving OS to reconstruct data in order.',
          'Domains have no relation to packet order reconstruction.',
          'Wi-Fi signal strength affects transmission rate, not packet ordering.',
          'TTL relates to cache expiration and hop limits, not packet sequencing.'
        ]
      },
      {
        id: 3,
        question: 'What is the primary difference between IPv4 and IPv6 addresses?',
        options: [
          'IPv4 is encrypted by default while IPv6 is unencrypted.',
          'IPv4 uses 32-bit addresses (~4.3B limit) whereas IPv6 uses 128-bit addresses (virtually infinite pool).',
          'IPv4 works only over copper wire whereas IPv6 only works over satellites.',
          'IPv6 cannot transmit video data.'
        ],
        correctIndex: 1,
        conceptTag: 'IPv4 vs IPv6 Addressing',
        explanation: 'IPv4 exhausted its ~4.29 billion address pool, necessitating IPv6 with 128-bit hexadecimal addressing providing over 340 undecillion addresses.',
        optionExplanations: [
          'Encryption is handled at transport/application layers (TLS/HTTPS), not IP version.',
          'Correct! 32 bits vs 128 bits solves the global address exhaustion crisis.',
          'Both protocols run on any physical transmission media including copper, fiber, and radio.',
          'IPv6 handles high-throughput video streaming seamlessly.'
        ]
      }
    ]
  }
};
