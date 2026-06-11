/**
 * LifeRPG - AI Quest Generation Service (Mock Layer)
 * 
 * Generates quests dynamically in English or French based on the user's active locale.
 */

// English Quest Templates
const QUEST_TEMPLATES_EN = {
  "React Development": [
    {
      title: "Build a Custom Hook",
      description: "Extract reusable logic from a component (like useLocalStorage or useWindowSize) and test it in a separate component.",
      difficulty: "Medium"
    },
    {
      title: "Optimize Component Render Cycle",
      description: "Analyze a slow component using React DevTools and optimize it using React.memo(), useMemo(), or useCallback().",
      difficulty: "Hard"
    },
    {
      title: "Write a Simple Form with Validation",
      description: "Create a controlled form with inputs for email and password. Implement client-side error validation states.",
      difficulty: "Easy"
    },
    {
      title: "Integrate a Public API",
      description: "Fetch weather, quote, or image data from a public API using useEffect and fetch/axios, handling loading and error states.",
      difficulty: "Medium"
    },
    {
      title: "Refactor to Context API",
      description: "Migrate prop-drilled states (like user profile or dark mode settings) to React.createContext and useContext provider.",
      difficulty: "Medium"
    },
    {
      title: "Read Official React Docs for 15m",
      description: "Explore the new React Docs (react.dev) specifically regarding 'Escape Hatches' (Refs and Effects).",
      difficulty: "Easy"
    },
    {
      title: "Implement Error Boundary",
      description: "Create an ErrorBoundary class component to catch layout errors gracefully and display a premium glass fallback card.",
      difficulty: "Hard"
    }
  ],
  "Japanese Language": [
    {
      title: "Hiragana / Katakana Review",
      description: "Perform a 15-minute quiz on Duolingo, Anki, or a physical notebook to review Japanese character pronunciation.",
      difficulty: "Easy"
    },
    {
      title: "Learn 10 New Kanji",
      description: "Write down 10 new Kanji characters with their Onyomi/Kunyomi readings, meanings, and stroke orders.",
      difficulty: "Medium"
    },
    {
      title: "Translate a News Headline",
      description: "Go to NHK News Web Easy, read one simplified Japanese news article, and translate the headline and first paragraph.",
      difficulty: "Hard"
    },
    {
      title: "Listen to Japanese Podcast",
      description: "Listen to 15 minutes of native Japanese audio (e.g. 'Nihongo Con Teppei') and write down 5 vocabulary words you recognized.",
      difficulty: "Medium"
    },
    {
      title: "Construct 5 Sentence Patterns",
      description: "Practice using a grammar point (e.g. 〜てみる or 〜たことがある) by writing 5 custom Japanese sentences.",
      difficulty: "Easy"
    }
  ],
  "Fitness & Strength": [
    {
      title: "Morning Mobilization Flow",
      description: "Perform a 10-minute dynamic stretching and mobility session targeting your hips, spine, and shoulders.",
      difficulty: "Easy"
    },
    {
      title: "Complete HIIT Circuit",
      description: "Do 4 rounds of high-intensity intervals: 30s work (squats, pushups, mountain climbers), 30s rest.",
      difficulty: "Medium"
    },
    {
      title: "Progressive Overload Session",
      description: "Track your main compound lift (squats, deadlifts, or pushups) and successfully complete 1 rep or 1 lb more than last week.",
      difficulty: "Hard"
    },
    {
      title: "Active Recovery Walk",
      description: "Walk at a brisk pace for 45 minutes outdoors. Clear your mind without checking your smartphone.",
      difficulty: "Easy"
    },
    {
      title: "Log Daily Core Exercise",
      description: "Perform 3 sets of 45-second planks and 15 hollow-body holds with controlled breathing.",
      difficulty: "Easy"
    }
  ],
  "Creative Writing": [
    {
      title: "Daily Journal Entry",
      description: "Write 300 words describing a vivid memory or your current state of mind in a stream-of-consciousness style.",
      difficulty: "Easy"
    },
    {
      title: "Draft a Character Outline",
      description: "Create a detailed bio for a new fictional character including their core motivation, secret flaw, and visual aesthetic.",
      difficulty: "Medium"
    },
    {
      title: "Write a 500-word Flash Fiction",
      description: "Write a complete story in exactly 500 words containing a plot twist and starting with: 'The glass began to crack...'",
      difficulty: "Hard"
    },
    {
      title: "Analyze a Favorite Scene",
      description: "Re-read a chapter or scene from a book you love and write 3 bullet points on how the author built tension.",
      difficulty: "Easy"
    }
  ]
};

const GENERIC_TEMPLATES_EN = [
  {
    title: "Review Foundational Concepts",
    description: "Dedicate 20 minutes to read, summarize, or watch an educational tutorial explaining a core concept in this domain.",
    difficulty: "Easy"
  },
  {
    title: "Hands-on Practice Session",
    description: "Work on a practical, minor project or draft related to this domain for 30 minutes without interruptions.",
    difficulty: "Medium"
  },
  {
    title: "Solve a Complex Challenge",
    description: "Locate a difficult task or bug within your current project and spend 45 minutes debugging or brainstorming solutions.",
    difficulty: "Hard"
  },
  {
    title: "Organize Workspace & Resources",
    description: "Clean up your workspace, bookmark folders, digital files, and update your study planner for this week.",
    difficulty: "Easy"
  },
  {
    title: "Teach a Concept to a Friend",
    description: "Write a short blog post, social post, or explain out loud (Feynman Technique) a key concept from this domain.",
    difficulty: "Medium"
  }
];

// French Quest Templates
const QUEST_TEMPLATES_FR = {
  "React Development": [
    {
      title: "Créer un Custom Hook",
      description: "Extrayez la logique réutilisable d'un composant (comme useLocalStorage ou useWindowSize) et testez-la dans un composant séparé.",
      difficulty: "Medium"
    },
    {
      title: "Optimiser le cycle de rendu",
      description: "Analysez un composant lent avec React DevTools et optimisez-le en utilisant React.memo(), useMemo() ou useCallback().",
      difficulty: "Hard"
    },
    {
      title: "Formulaire simple avec validation",
      description: "Créez un formulaire contrôlé avec des champs e-mail et mot de passe. Implémentez des messages d'erreur de validation.",
      difficulty: "Easy"
    },
    {
      title: "Intégrer une API publique",
      description: "Récupérez des données météo ou d'images via une API publique avec useEffect et fetch/axios, en gérant le chargement et les erreurs.",
      difficulty: "Medium"
    },
    {
      title: "Réfactoriser vers la Context API",
      description: "Migrez les états passés en props (comme le profil ou le mode sombre) vers un fournisseur React.createContext et useContext.",
      difficulty: "Medium"
    },
    {
      title: "Lire la doc officielle React",
      description: "Explorez la nouvelle documentation React (react.dev), en particulier la section 'Escape Hatches' (Refs et Effects) pendant 15 minutes.",
      difficulty: "Easy"
    },
    {
      title: "Implémenter une Error Boundary",
      description: "Créez un composant de classe ErrorBoundary pour capturer proprement les erreurs d'affichage et afficher une carte de secours.",
      difficulty: "Hard"
    }
  ],
  "Japanese Language": [
    {
      title: "Réviser Hiragana / Katakana",
      description: "Faites un quiz de 15 minutes sur Duolingo, Anki ou un cahier physique pour réviser la prononciation des caractères japonais.",
      difficulty: "Easy"
    },
    {
      title: "Apprendre 10 nouveaux Kanji",
      description: "Écrivez 10 nouveaux Kanji avec leurs lectures Onyomi/Kunyomi, leurs significations et l'ordre des traits.",
      difficulty: "Medium"
    },
    {
      title: "Traduire un titre d'actualité",
      description: "Allez sur NHK News Web Easy, lisez un article de presse simplifié en japonais, et traduisez le titre et le premier paragraphe.",
      difficulty: "Hard"
    },
    {
      title: "Écouter un podcast japonais",
      description: "Écoutez 15 minutes d'audio japonais natif (ex: 'Nihongo Con Teppei') et notez 5 mots de vocabulaire reconnus.",
      difficulty: "Medium"
    },
    {
      title: "Pratiquer la grammaire (5 phrases)",
      description: "Entraînez-vous sur un point de grammaire spécifique (ex: 〜てみる ou 〜たことがある) en écrivant 5 phrases en japonais.",
      difficulty: "Easy"
    }
  ],
  "Fitness & Strength": [
    {
      title: "Mobilité matinale",
      description: "Effectuez une séance de 10 minutes d'étirements dynamiques ciblant vos hanches, votre colonne et vos épaules.",
      difficulty: "Easy"
    },
    {
      title: "Circuit HIIT complet",
      description: "Faites 4 tours d'intervalles haute intensité : 30s d'effort (squats, pompes, jumping jacks) et 30s de repos.",
      difficulty: "Medium"
    },
    {
      title: "Surcharge progressive",
      description: "Notez votre charge sur un exercice de base (squats, soulevé de terre ou pompes) et effectuez 1 rep de plus ou ajoutez du poids par rapport à la dernière fois.",
      difficulty: "Hard"
    },
    {
      title: "Marche active à l'extérieur",
      description: "Marchez à un rythme soutenu pendant 45 minutes à l'extérieur. Visez à vous vider l'esprit sans regarder votre smartphone.",
      difficulty: "Easy"
    },
    {
      title: "Entraînement de gainage",
      description: "Effectuez 3 séries de gainage (planche de 45 secondes) et 15 secondes d'exercice hollow-body avec respiration contrôlée.",
      difficulty: "Easy"
    }
  ],
  "Creative Writing": [
    {
      title: "Journal quotidien (écriture)",
      description: "Écrivez 300 mots décrivant un souvenir d'enfance ou votre humeur du jour dans un style d'écriture libre.",
      difficulty: "Easy"
    },
    {
      title: "Créer un profil personnage",
      description: "Écrivez la fiche détaillée d'un nouveau personnage de fiction : motivation principale, peur enfouie et style visuel.",
      difficulty: "Medium"
    },
    {
      title: "Micro-nouvelle de 500 mots",
      description: "Écrivez une histoire complète en exactement 500 mots contenant un rebondissement et commençant par : 'Le verre commença à se fissurer...'",
      difficulty: "Hard"
    },
    {
      title: "Analyser une scène marquante",
      description: "Relisez un chapitre ou une scène d'un livre que vous adorez et notez 3 points sur la construction de la tension narrative par l'auteur.",
      difficulty: "Easy"
    }
  ]
};

const GENERIC_TEMPLATES_FR = [
  {
    title: "Réviser des concepts clés",
    description: "Consacrez 20 minutes à lire, résumer ou regarder un tutoriel expliquant un concept fondamental de ce domaine.",
    difficulty: "Easy"
  },
  {
    title: "Séance de pratique concrète",
    description: "Travaillez sur un exercice pratique ou un projet lié à ce domaine pendant 30 minutes sans interruptions.",
    difficulty: "Medium"
  },
  {
    title: "Résoudre un défi complexe",
    description: "Trouvez une tâche ardue ou un bug dans votre projet actuel et passez 45 minutes à déboguer ou chercher des solutions.",
    difficulty: "Hard"
  },
  {
    title: "Organiser l'espace d'étude",
    description: "Nettoyez votre bureau, rangez vos fichiers numériques ou organisez vos favoris et planifiez vos tâches de la semaine.",
    difficulty: "Easy"
  },
  {
    title: "Expliquer un concept (Feynman)",
    description: "Expliquez à voix haute (Technique Feynman) ou résumez par écrit un concept clé de ce domaine comme si vous l'enseigniez.",
    difficulty: "Medium"
  }
];

// Helper to generate dynamic rewards matching the schema
const getRewards = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return {
        xp: Math.floor(Math.random() * 51) + 50,  // 50-100
        gold: Math.floor(Math.random() * 11) + 10  // 10-20
      };
    case "Medium":
      return {
        xp: Math.floor(Math.random() * 101) + 150, // 150-250
        gold: Math.floor(Math.random() * 21) + 25  // 25-45
      };
    case "Hard":
      return {
        xp: Math.floor(Math.random() * 201) + 300, // 300-500
        gold: Math.floor(Math.random() * 41) + 60  // 60-100
      };
    default:
      return { xp: 50, gold: 10 };
  }
};

// Generates a random UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Simulates fetching quests from an AI agent in the selected language
 * @param {string} domain - The skill/learning domain
 * @param {number} count - Number of quests to generate
 * @param {string} lang - Selected language ('en' or 'fr')
 * @returns {Promise<Array>} List of generated quest objects
 */
export const fetchQuestsFromAI = (domain, count = 5, lang = 'en') => {
  return new Promise((resolve) => {
    // Simulate API Network Delay (1200ms)
    setTimeout(() => {
      // Resolve dictionary based on selected language
      const isFr = lang === 'fr';
      const templatesDict = isFr ? QUEST_TEMPLATES_FR : QUEST_TEMPLATES_EN;
      const genericTemplates = isFr ? GENERIC_TEMPLATES_FR : GENERIC_TEMPLATES_EN;

      // Find domain templates or default to generic
      const templates = templatesDict[domain] || genericTemplates;
      
      // Shuffle templates
      const shuffled = [...templates].sort(() => 0.5 - Math.random());
      
      // Select count, populate with ID, dynamic rewards, and metadata
      const generated = shuffled.slice(0, count).map((t, idx) => {
        const rewards = getRewards(t.difficulty);
        return {
          id: `${domain.replace(/\s+/g, '-').toLowerCase()}-${idx}-${generateUUID().slice(0,8)}`,
          title: t.title,
          description: t.description,
          difficulty: t.difficulty,
          xp: rewards.xp,
          gold: rewards.gold,
          completed: false
        };
      });
      
      // If we need more quests than templates, duplicate/generate standard generic items
      while (generated.length < count) {
        const fallback = genericTemplates[Math.floor(Math.random() * genericTemplates.length)];
        const rewards = getRewards(fallback.difficulty);
        generated.push({
          id: `${domain.replace(/\s+/g, '-').toLowerCase()}-${generated.length}-${generateUUID().slice(0,8)}`,
          title: isFr ? `${fallback.title} (Niveau supérieur)` : `${fallback.title} (Level Up)`,
          description: fallback.description,
          difficulty: fallback.difficulty,
          xp: rewards.xp,
          gold: rewards.gold,
          completed: false
        });
      }
      
      resolve(generated);
    }, 1200);
  });
};

/**
 * Simulates generating a single alternative quest to replace a refreshed one
 * @param {string} domain - The skill/learning domain
 * @param {Array<string>} existingTitles - Titles of currently displayed quests to avoid duplicate generation
 * @param {string} lang - Selected language ('en' or 'fr')
 * @returns {Promise<Object>} A single new quest object
 */
export const fetchSingleAlternativeQuest = (domain, existingTitles = [], lang = 'en') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isFr = lang === 'fr';
      const templatesDict = isFr ? QUEST_TEMPLATES_FR : QUEST_TEMPLATES_EN;
      const genericTemplates = isFr ? GENERIC_TEMPLATES_FR : GENERIC_TEMPLATES_EN;

      const templates = templatesDict[domain] || genericTemplates;
      
      // Filter out templates that match current titles
      let unusedTemplates = templates.filter(t => !existingTitles.includes(t.title));
      
      // Fallback to generic if everything was used
      if (unusedTemplates.length === 0) {
        unusedTemplates = genericTemplates.filter(t => !existingTitles.includes(t.title));
      }
      if (unusedTemplates.length === 0) {
        unusedTemplates = templates;
      }
      
      // Pick one
      const selected = unusedTemplates[Math.floor(Math.random() * unusedTemplates.length)];
      const rewards = getRewards(selected.difficulty);
      
      resolve({
        id: `${domain.replace(/\s+/g, '-').toLowerCase()}-alt-${generateUUID().slice(0,8)}`,
        title: selected.title,
        description: selected.description,
        difficulty: selected.difficulty,
        xp: rewards.xp,
        gold: rewards.gold,
        completed: false
      });
    }, 1200);
  });
};
