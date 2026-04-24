// ════════════════════════════════════════
// CURSOR
// ════════════════════════════════════════
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-ring');
const reducedMotionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery=window.matchMedia('(pointer:fine)');
function syncInteractionMode(){
  const useCustomCursor=finePointerQuery.matches&&!reducedMotionQuery.matches;
  document.body.classList.toggle('custom-cursor',useCustomCursor);
  if(cur)cur.hidden=!useCustomCursor;
  if(curR)curR.hidden=!useCustomCursor;
}
syncInteractionMode();
reducedMotionQuery.addEventListener?.('change',syncInteractionMode);
finePointerQuery.addEventListener?.('change',syncInteractionMode);
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  if(!document.body.classList.contains('custom-cursor'))return;
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
},{passive:true});
(function loop(){
  if(document.body.classList.contains('custom-cursor')){
    rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
    curR.style.left=rx+'px';curR.style.top=ry+'px';
  }
  requestAnimationFrame(loop);
})();

// ════════════════════════════════════════
// SCROLL PROGRESS + BTT
// ════════════════════════════════════════
const spb=document.getElementById('spb');
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  const p=scrollY/(document.documentElement.scrollHeight-innerHeight)*100;
  spb.style.width=Math.min(p,100)+'%';
  btt.classList.toggle('show',scrollY>500);
},{passive:true});

// ════════════════════════════════════════
// NAV ACTIVE
// ════════════════════════════════════════
const secs=[...document.querySelectorAll('section[id]')];
const nas=[...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll',()=>{
  let cur2='';
  secs.forEach(s=>{if(scrollY>=s.offsetTop-200)cur2=s.id;});
  nas.forEach(a=>a.classList.toggle('active',a.dataset.s===cur2));
},{passive:true});

const localeStoreKey='portfolio-lang';
const analyticsStoreKey='portfolio-analytics';
let currentLang=localStorage.getItem(localeStoreKey)==='en'?'en':'fr';
let currentDemo=null;
let resetTerminalView=()=>{};
let redrawRadarChart=()=>{};
const navEl=document.querySelector('nav');

function syncNavHeight(){
  if(!navEl)return;
  requestAnimationFrame(()=>{
    const h=Math.ceil(navEl.getBoundingClientRect().height);
    if(h>0)document.documentElement.style.setProperty('--navH',h+'px');
  });
}

(function syncCanonicalUrl(){
  try{
    if(!location.origin||location.origin==='null')return;
    const url=location.origin+location.pathname;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',url);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',url);
  }catch(_){}
})();

syncNavHeight();
window.addEventListener('resize',syncNavHeight,{passive:true});
window.addEventListener('orientationchange',syncNavHeight,{passive:true});
document.fonts?.ready?.then?.(syncNavHeight).catch?.(()=>{});

function readAnalytics(){
  try{
    return JSON.parse(localStorage.getItem(analyticsStoreKey)||'{}');
  }catch(_){
    return {};
  }
}

function writeAnalytics(data){
  localStorage.setItem(analyticsStoreKey,JSON.stringify(data));
}

function trackEvent(name){
  if(!name)return;
  const analytics=readAnalytics();
  analytics[name]={
    count:(analytics[name]?.count||0)+1,
    lastAt:new Date().toISOString()
  };
  writeAnalytics(analytics);
}

function getAnalyticsLines(){
  const copy=I18N[currentLang].terminal.analytics;
  const analytics=readAnalytics();
  const entries=Object.entries(analytics).sort((a,b)=>b[1].count-a[1].count);
  if(!entries.length){
    return [
      {t:'success',s:copy.title},
      {t:'dim',s:copy.empty}
    ];
  }
  return [
    {t:'success',s:copy.title},
    ...entries.slice(0,8).map(([name,data])=>({t:'out',s:`  ${name.padEnd(24,' ')} ${String(data.count).padStart(2,' ')} hit(s)`})),
    {t:'dim',s:copy.hint}
  ];
}

const I18N={
  fr:{
    meta:{
      title:"Ethan Binisti — Ingénieur R&D",
      description:"Portfolio d'Ethan Binisti, ingénieur en modélisation et mécanique numérique, passionné par le code, les systèmes embarqués et le machine learning.",
      ogLocale:"fr_FR",
      twitterDescription:"Portfolio orienté modélisation, mécanique numérique, embarqué et machine learning."
    },
    nav:{
      links:["Profil","Expérience","Projets","Compétences","Notes"],
      badge:"CDI DÈS SEPT. 2026",
      toggleLabel:"Choisir la langue"
    },
    hero:{
      tag:"INGÉNIEUR MODÉLISATION & MÉCANIQUE NUMÉRIQUE · ESILV 2026",
      desc:"Ingénieur en modélisation et mécanique numérique, passionné par le code, les systèmes embarqués et le machine learning. Je construis des prototypes techniques solides, mesurables, et vite exploitables en entreprise.",
      pills:["CDI DÈS SEPT. 2026","VISION · SIMULATION · EMBARQUÉ","PROJETS MESURÉS ET DOCUMENTÉS"],
      actions:["Voir les projets clés →","📄 Télécharger mon CV"],
      stats:[
        "ACCURACY<br>U-NET CRACK DETECTION",
        "RÉUSSITE<br>ATTERRISSAGE UAV",
        "IMAGES<br>ENTRAÎNEMENT PYTORCH",
        "PRECISION<br>SUR VALIDATION"
      ]
    },
    terminalIntro:{
      section:"01 — PROFIL INTERACTIF",
      heading:"Tape une commande<br>pour me <em>découvrir.</em>",
      body:`Un terminal interactif pour explorer mon profil de façon non linéaire. Commence par <code style="font-family:'Space Mono',monospace;color:var(--g);font-size:.9rem;">help</code> pour voir les commandes disponibles.`,
      commandsLabel:"COMMANDES :",
      quick:["Voir les projets","Me contacter","Ouvrir le CV"]
    },
    experience:{
      section:"02 — EXPÉRIENCE",
      heading:"Ce que j'ai <em>construit.</em>",
      cards:[
        {
          year:"2024 → 2026 · 2 ANS",
          role:"Apprenti Ingénieur R&D — Simulation Mécanique",
          badge:"INDUSTRIE",
          where:"Souchier-Boullet · Soprema Group",
          tasks:[
            "<strong>~100 procédures stockées SQL</strong> et 5 configurateurs métier avec règles métiers, contrôles de cohérence, traduction automatique",
            "Modélisation d'assemblages paramétriques, harmonisation nomenclatures/matériaux",
            "Interface conditionnelle optimisée sous <strong>Design Studio</strong>"
          ],
          tags:["T-SQL","Design Studio","CAO Paramétrique","Abaqus"]
        },
        {
          year:"ÉTÉ 2025 · 3 MOIS",
          role:"Stagiaire Recherche — Vision & Deep Learning",
          badge:"HANOI, VIETNAM",
          where:"USTH — Université des Sciences et Technologies de Hanoi",
          tasks:[
            "Pipeline ROS/PX4 pour atterrissage autonome UAV : détection ArUco, pose estimation solvePnP, consignes MAVLink — <strong>95% réussite, précision centimétrique, ~60 FPS</strong>",
            "Segmentation de fissures : <strong>U-Net + SE-Blocks (PyTorch)</strong> sur ~40 000 images — accuracy 97,65%, F1 97,59%, precision 100%",
            "Containerisation Docker, versioning GitHub, documentation complète"
          ],
          tags:["PyTorch","ROS Noetic","OpenCV","PX4","U-Net","Docker"]
        },
        {
          year:"2023 → 2026 · 3 ANS",
          role:"Projets Académiques — IoT & Simulation",
          badge:"PARIS-LA DÉFENSE",
          where:"ESILV — École d'ingénieurs Léonard de Vinci",
          tasks:[
            "<strong>EV-APP</strong> : optimisation de conduite VE en Python avec ML, validée sur profils réels",
            "<strong>Pullman Concept Room (Accor)</strong> : chambre intelligente BLE + iOS + Raspberry Pi (GRMS)"
          ],
          tags:["Python ML","BLE","Raspberry Pi","iOS"]
        }
      ]
    },
    featured:{
      section:"PROJETS CLÉS",
      heading:"Trois cas concrets <em>qui me définissent.</em>",
      intro:"Des projets avec un problème clair, un rôle identifié, une stack crédible et un résultat mesurable. C’est la partie à lire en premier si tu recrutes.",
      cards:[
        {
          meta:"VISION / DEEP LEARNING",
          title:"Détection de Fissures — U-Net",
          summary:"Pipeline complet de segmentation sémantique pour inspection structurelle sur environ 40 000 images.",
          points:[
            "<strong>Problème</strong> détecter automatiquement des fissures fines avec un signal exploitable en inspection.",
            "<strong>Rôle</strong> entraînement, évaluation, métriques et démonstration du modèle.",
            "<strong>Résultat</strong> accuracy 97,65%, F1 97,59%, precision 100%."
          ],
          stack:"PyTorch · U-Net · SE-Blocks · OpenCV",
          actions:["Voir le notebook","Notebook source ↗"]
        },
        {
          meta:"ROBOTIQUE / EMBARQUÉ",
          title:"Atterrissage Autonome UAV",
          summary:"Boucle vision-guidage temps réel avec ROS/PX4 pour poser un drone sur marqueur visuel en conditions réelles.",
          points:[
            "<strong>Problème</strong> estimer la pose 6DOF et corriger la trajectoire à faible latence.",
            "<strong>Rôle</strong> vision, pose estimation, guidage et validation terrain.",
            "<strong>Résultat</strong> 95% de réussite, précision centimétrique, environ 60 FPS."
          ],
          stack:"ROS Noetic · PX4 · MAVLink · OpenCV",
          actions:["Voir la démo","Repo GitHub ↗"]
        },
        {
          meta:"INDUSTRIE / SQL / CAO",
          title:"Apprentissage R&D chez Soprema",
          summary:"Travail de structuration et d’industrialisation autour des données techniques, configurateurs métier et modèles paramétriques.",
          points:[
            "<strong>Problème</strong> fiabiliser des flux métiers et accélérer la production d’études techniques.",
            "<strong>Rôle</strong> procédures SQL, configurateurs, cohérence de données et interfaces métier.",
            "<strong>Résultat</strong> environ 100 procédures SQL et 5 configurateurs exploités en entreprise."
          ],
          stack:"T-SQL · Design Studio · CAO paramétrique · Abaqus",
          actions:["Voir l’expérience"]
        }
      ]
    },
    projects:{
      section:"DÉMOS & SOURCES",
      heading:"Explorer les <em>démonstrations.</em>",
      cards:[
        {
          num:"P.001 · CLIQUER POUR LE NOTEBOOK ↗",
          title:"Détection de Fissures — U-Net",
          desc:"Segmentation sémantique pour inspection structurelle. U-Net + Squeeze-and-Excitation sur ~40 000 images.",
          proof:`<strong>RÔLE</strong> pipeline d'entraînement et d'évaluation complet · <strong>PREUVE</strong> métriques de validation publiées`,
          links:["Notebook source ↗"],
          metric:"Accuracy 97,65% · F1 97,59% · Precision 100%",
          tags:["PyTorch","U-Net","SE-Blocks","OpenCV"],
          cta:"OUVRIR LE NOTEBOOK"
        },
        {
          num:"P.002 · CLIQUER POUR LA DÉMO ↗",
          title:"Atterrissage Autonome UAV",
          desc:"Pipeline ROS/PX4 complet. Détection ArUco, estimation de pose 6DOF (solvePnP), consignes MAVLink.",
          proof:`<strong>RÔLE</strong> vision, pose estimation et boucle de guidage · <strong>IMPACT</strong> atterrissage centimétrique temps réel`,
          links:["Repo GitHub ↗"],
          metric:"95% de réussite · Précision centimétrique · ~60 FPS",
          tags:["ROS Noetic","PX4","OpenCV","MAVLink"],
          cta:"VOIR LA DÉMO RÉELLE D'ATTERRISSAGE"
        },
        {
          num:"P.003 · CLIQUER POUR LA DÉMO ↗",
          title:"Architecture U-Net Visualisée",
          desc:"Visualisation interactive de l'architecture U-Net utilisée dans le projet fissures — encoder, decoder, skip connections.",
          proof:`<strong>RÔLE</strong> vulgarisation technique et visualisation interactive · <strong>USAGE</strong> rendre le modèle lisible en 30 secondes`,
          links:[],
          metric:"Réseau profond · Skip connections · SE attention",
          tags:["Architecture DL","Visualization","Pédagogie"],
          cta:"EXPLORER L'ARCHITECTURE"
        },
        {
          title:"Pullman Concept Room — Accor",
          desc:"Chambre intelligente BLE sécurisée, application iOS, Raspberry Pi (GRMS). Partenariat Accor.",
          proof:`<strong>RÔLE</strong> logique d'identification et intégration IoT · <strong>CONTEXTE</strong> projet réel avec contrainte métier`,
          metric:"Partenariat Accor · BLE sécurisé · IoT",
          tags:["BLE","iOS Swift","Raspberry Pi","GRMS"],
          cta:"github.com/ethan-bns24/Pullman-Concept-Room ↗"
        },
        {
          title:"EV-APP — Optimisation VE",
          desc:"Application mobile Python pour optimiser la conduite en véhicule électrique. Validée sur profils de conduite réels.",
          proof:`<strong>RÔLE</strong> modélisation ML et logique applicative · <strong>PREUVE</strong> validation sur données de conduite`,
          metric:"ML embarqué · Profils réels validés",
          tags:["Python","ML","Mobile","Énergie"],
          cta:"github.com/ethan-bns24/EV-APP ↗"
        },
        {
          title:"Open Source — GitHub",
          desc:"Projets ML, outils web et algorithmes développés sur temps libre. Tout est documenté et publié.",
          proof:`<strong>SIGNAL</strong> curiosité technique durable · <strong>FORMAT</strong> code public, versionné et réutilisable`,
          metric:"Public · Documenté · Autodidacte",
          tags:["Python","C/C++","Web","ML"],
          cta:"Voir tous les repos ↗"
        }
      ]
    },
    skills:{
      section:"04 — COMPÉTENCES",
      heading:"Stack <em>technique.</em>",
      groups:["PROGRAMMATION","DEEP LEARNING & VISION","ROBOTIQUE & SIMULATION"],
      names:[
        "Python (NumPy, SciPy, ML)",
        "SQL — T-SQL / MySQL",
        "C / C++",
        "Docker / Git",
        "PyTorch",
        "Computer Vision / OpenCV",
        "Architectures DL (U-Net, SE)",
        "ROS / PX4 / MAVLink",
        "FEM — Abaqus / ANSYS",
        "CFD — ANSYS Fluent"
      ],
      radar:{
        labels:["Python","Deep Learning","Vision","Robotique","FEM/CFD","CAO"]
      }
    },
    learn:{
      section:"NOTES TECHNIQUES",
      heading:"Quelques explications <em>si tu veux creuser.</em>",
      cards:[
        {
          title:"Comment fonctionne un U-Net ?",
          body:`Un U-Net est une architecture de réseau de neurones en forme de U. L'<strong>encodeur</strong> compresse l'image progressivement, le <strong>décodeur</strong> la reconstruit. Les <strong>skip connections</strong> transmettent les détails fins entre les deux, permettant une segmentation au pixel près. Les blocs <strong>Squeeze-and-Excitation</strong> ajoutent une attention sur les canaux les plus importants.`,
          tag:"// DEEP LEARNING"
        },
        {
          title:"Comment un drone atterrit-il seul ?",
          body:`Mon pipeline utilise des <strong>marqueurs ArUco</strong> imprimés au sol. La caméra les détecte via OpenCV, puis <strong>solvePnP</strong> calcule la position exacte du drone dans l'espace 3D. Des consignes sont envoyées au pilote automatique <strong>PX4 via MAVLink</strong> pour corriger la trajectoire en temps réel.`,
          tag:"// ROBOTIQUE UAV"
        },
        {
          title:"C'est quoi la méthode des éléments finis ?",
          body:`La FEM découpe une pièce mécanique en milliers de petits éléments géométriques (<strong>maillage</strong>). Sur chacun, des équations simplifiées décrivent comment il se déforme sous une force. En assemblant ces solutions locales, on obtient une simulation globale réaliste sans tester physiquement la pièce.`,
          tag:"// SIMULATION FEA"
        },
        {
          title:"Bluetooth Low Energy en 30 secondes",
          body:`Le <strong>BLE</strong> est une version ultra-économe du Bluetooth classique. Au lieu de maintenir une connexion constante, il envoie de petits paquets de données à la demande. Parfait pour les <strong>IoT</strong> : une batterie peut tenir des années. Dans mon projet Pullman Concept Room, il sert à identifier de façon sécurisée un client d'hôtel à l'approche de sa chambre.`,
          tag:"// IOT / EMBARQUÉ"
        },
        {
          title:"Optimiser la conduite d'un VE avec le ML",
          body:`Un véhicule électrique consomme différemment selon la vitesse, la pente, la température ou le freinage. Mon app EV-APP entraîne un modèle ML sur des <strong>profils de conduite réels</strong> pour prédire la consommation future et suggérer des adaptations. Résultat : jusqu'à 15% d'autonomie gagnée.`,
          tag:"// MACHINE LEARNING"
        },
        {
          title:"Easter Egg",
          body:`Essaie le <strong>Konami Code</strong> sur cette page :<br>↑ ↑ ↓ ↓ ← → ← → B A<br><br>ou utilise un clavier.`,
          tag:"// HIDDEN FEATURE"
        }
      ]
    },
    fit:{
      section:"CE QUE JE RECHERCHE",
      heading:"Un poste R&D avec du <em>vrai contenu technique.</em>",
      cards:[
        {
          key:"POSTES VISÉS",
          title:"Computer vision, robotique, simulation, prototypage R&D",
          body:"Je vise un rôle où je peux relier modélisation, code, expérimentation et passage à un prototype exploitable."
        },
        {
          key:"ENVIRONNEMENT",
          title:"Équipe exigeante, sujets complexes, marge d’apprentissage rapide",
          body:"Je suis le plus utile quand il faut comprendre vite, structurer proprement et rendre un sujet technique lisible et mesurable."
        },
        {
          key:"DISPONIBILITÉ",
          title:"CDI dès septembre 2026, échanges ouverts rapidement",
          body:"Disponible dès maintenant pour échanger (entretiens), prise de poste à partir de septembre 2026."
        }
      ]
    },
    contact:{
      section:"CONTACT",
      heading:"Travaillons<br><em>ensemble.</em>",
      sub:"Je recherche un CDI où les problèmes difficiles sont la norme. Disponible à partir de septembre 2026 (entretiens possibles dès maintenant).",
      labels:["EMAIL","TÉL","LINKEDIN","GITHUB"]
    },
    footer:{
      copyright:"© 2026 ETHAN BINISTI · PORTFOLIO",
      links:["Profil","Expérience","Projets","Compétences","Contact"]
    },
    konami:{
      title:"// MINI SIMU MÉCANIQUE UNLOCKED",
      body:`Tu as trouvé le Konami Code (↑↑↓↓←→←→BA).<br>Mini simu de RDM: choisis l'<strong>appui</strong> (console ou appuis simples) et le <strong>chargement</strong> (ponctuel / réparti / couple). Observe la flèche <strong>w(x)</strong> et les diagrammes <strong>V(x)</strong> et <strong>M(x)</strong>.<br><span style="color:var(--ink4)">Astuce: dM/dx = V et w'' = M/(E·I).</span>`,
      close:"[ FERMER ]"
    },
    terminal:{
      welcome:{
        intro:"Bienvenue sur le portfolio interactif d'Ethan Binisti",
        action:"Tape",
        suffix:"pour commencer"
      },
      help:[
        {t:"out",s:"Commandes disponibles :"},
        {t:"hi",s:"  whoami      → qui suis-je ?"},
        {t:"hi",s:"  skills      → mes compétences techniques"},
        {t:"hi",s:"  projects    → mes projets clés"},
        {t:"hi",s:"  stats       → mes métriques clés"},
        {t:"hi",s:"  education   → ma formation"},
        {t:"hi",s:"  contact     → me contacter"},
        {t:"hi",s:"  analytics   → interactions clés de cette session"},
        {t:"hi",s:"  fun         → anecdote aléatoire"},
        {t:"hi",s:"  clear       → effacer le terminal"},
        {t:"dim",s:"─────────────────────────────────────"}
      ],
      whoami:[
        {t:"success",s:"> Ethan Binisti, 23 ans"},
        {t:"out",s:"  Ingénieur modélisation & mécanique numérique (ESILV, Master 2026)"},
        {t:"out",s:"  Spécialisé en simulation numérique, embarqué, deep learning"},
        {t:"out",s:"  Autodidacte passionné — robotique & IA apprises en dehors de l'école"},
        {t:"out",s:"  Professeur particulier en maths/physique depuis 3 ans"},
        {t:"dim",s:'  "Apprendre vite sur des sujets difficiles est une compétence"'}
      ],
      skills:[
        {t:"hi",s:"── Programmation ──────────────────"},
        {t:"out",s:"  Python         ████████████░░  Expert"},
        {t:"out",s:"  SQL (T-SQL)    ██████████░░░░  Avancé"},
        {t:"out",s:"  C / C++        █████████░░░░░  Intermédiaire"},
        {t:"hi",s:"── Deep Learning ─────────────────"},
        {t:"out",s:"  PyTorch        ███████████░░░  Avancé"},
        {t:"out",s:"  OpenCV         ██████████░░░░  Avancé"},
        {t:"out",s:"  U-Net / SE     ██████████░░░░  Avancé"},
        {t:"hi",s:"── Robotique / Simulation ───────"},
        {t:"out",s:"  ROS / PX4      ██████████░░░░  Avancé"},
        {t:"out",s:"  Abaqus / FEM   ██████████░░░░  Avancé"},
        {t:"out",s:"  ANSYS Fluent   █████████░░░░░  Intermédiaire"}
      ],
      projects:[
        {t:"hi",s:"[1] Détection de fissures — U-Net (PyTorch)"},
        {t:"out",s:"    Accuracy 97.65% · F1 97.59% · Precision 100%"},
        {t:"hi",s:"[2] Atterrissage autonome UAV — ROS/PX4"},
        {t:"out",s:"    95% réussite · centimétrique · ~60 FPS"},
        {t:"hi",s:"[3] EV-APP — Optimisation VE (Python ML)"},
        {t:"out",s:"    Validé sur profils réels de conduite"},
        {t:"hi",s:"[4] Pullman Concept Room — Accor (BLE + iOS)"},
        {t:"out",s:"    Authentification BLE sécurisée"},
        {t:"dim",s:"→ github.com/ethan-bns24"}
      ],
      stats:[
        {t:"success",s:"KEY METRICS ──────────────────────"},
        {t:"out",s:"  97.65%  Accuracy U-Net (crack detection)"},
        {t:"out",s:"  97.59%  F1-score sur le même modèle"},
        {t:"out",s:"  100%    Precision sur jeu de validation"},
        {t:"out",s:"  95%     Taux réussite atterrissage UAV"},
        {t:"out",s:"  ~60 FPS Pipeline UAV temps réel"},
        {t:"out",s:"  40 000  Images d'entraînement PyTorch"},
        {t:"out",s:"  ~100    Procédures SQL déployées (Soprema)"}
      ],
      education:[
        {t:"hi",s:"[2023 → 2026] ESILV Paris-La Défense"},
        {t:"out",s:"  Master Ingénierie Mécanique & Modélisation Numérique"},
        {t:"out",s:"  FEA · CFD · ML · Composite · Aeroelasticity · Digital Twins"},
        {t:"hi",s:"[2021 → 2023] Lycée d'Arsonval, Saint-Maur"},
        {t:"out",s:"  Classes Prépa PCSI / PSI*"},
        {t:"out",s:"  Maths · Physique · Chimie · Sciences industrielles"},
        {t:"dim",s:"  TOEIC : 800 pts (Anglais B2+)"}
      ],
      contact:[
        {t:"success",s:"CONTACT ─────────────────────────"},
        {t:"out",s:"  email    binisti.ethan@yahoo.fr"},
        {t:"out",s:"  tel      07 67 46 45 65"},
        {t:"out",s:"  linkedin linkedin.com/in/ethan-binisti"},
        {t:"out",s:"  github   github.com/ethan-bns24"},
        {t:"dim",s:"  → Disponible pour un CDI dès septembre 2026 (entretiens possibles dès maintenant)"}
      ],
      analytics:{
        title:"ANALYTICS LOCALES ─────────────────",
        empty:"  Aucun clic clé enregistré dans ce navigateur pour l’instant.",
        hint:"  → suivi local simple des CTA et démos"
      },
      facts:[
        [
          {t:"hi",s:"// ANECDOTE #1"},
          {t:"out",s:"Le réseau U-Net a été créé en 2015 pour la segmentation médicale."},
          {t:"out",s:"Je l'ai adapté pour détecter des fissures structurelles avec 97.65% d'accuracy."}
        ],
        [
          {t:"hi",s:"// ANECDOTE #2"},
          {t:"out",s:'ArUco vient de "Augmented Reality University of Cordoba".'},
          {t:"out",s:"Ce sont des QR codes spécialisés pour la vision par ordinateur 3D."}
        ],
        [
          {t:"hi",s:"// ANECDOTE #3"},
          {t:"out",s:"MAVLink est utilisé par la plupart des drones commerciaux et militaires."},
          {t:"out",s:"Mon pipeline l'utilise pour envoyer des consignes au pilote automatique PX4."}
        ],
        [
          {t:"hi",s:"// ANECDOTE #4"},
          {t:"out",s:"Konami Code : ↑↑↓↓←→←→BA — essaie-le sur cette page ;)"}
        ]
      ],
      commandNotFound:'command not found: ',
      helpHint:' (try "help")'
    },
    demos:{
      edge:{
        title:"// DEMO — DÉTECTION DE CONTOURS (STYLE OPENCV)",
        original:"IMAGE ORIGINALE",
        result:"DÉTECTION DE CONTOURS",
        low:"SEUIL BAS :",
        high:"SEUIL HAUT :",
        regen:"NOUVELLE IMAGE",
        explain:`<strong style="color:var(--g);">Comment ça marche ?</strong> La détection de contours Canny fonctionne en 3 étapes : (1) flou gaussien pour réduire le bruit, (2) calcul du gradient d'intensité, (3) suppression des non-maxima et double seuillage. Les sliders contrôlent les seuils : plus ils sont bas, plus de détails sont capturés.`
      },
      uav:{
        title:"// DEMO — ATTERRISSAGE UAV AUTONOME",
        alt:"Démo réelle d'atterrissage autonome UAV",
        stats:["RÉUSSITE","PRÉCISION","FPS","STACK"],
        explain:`<strong style="color:var(--g);">Démo réelle :</strong> ce GIF montre l'atterrissage autonome avec détection du marqueur <strong>ArUco</strong>, estimation de pose via <strong>solvePnP</strong> et corrections envoyées à <strong>PX4</strong> via <strong>MAVLink</strong>. C'est la démo terrain du projet, pas une animation reconstituée.`,
        link:"Voir le repo GitHub",
        load:"Charger la démo complète (~19,8 Mo)"
      },
      net:{
        title:"// ARCHITECTURE U-NET — VISUALISATION INTERACTIVE",
        explain:`<strong style="color:var(--g);">Survole les blocs</strong> pour comprendre leur rôle. L'<strong>encodeur</strong> compresse l'image en représentations abstraites. Le <strong>décodeur</strong> reconstruit la segmentation pixel par pixel. Les <strong>skip connections</strong> transmettent les détails fins. Les blocs <strong>SE</strong> recalibrent les canaux importants.`,
        layers:["Entrée\n256×256","Conv\n128×128","Conv\n64×64","Conv\n32×32","Bridge\n16×16","Up\n32×32","Up\n64×64","Up\n128×128","Sortie\n256×256"],
        tooltips:[
          "Entrée : image 256×256 pixels (niveaux de gris)",
          "Encodeur : convolutions + pooling, extrait les caractéristiques",
          "Encodeur : représentations plus abstraites, résolution réduite",
          "Encodeur : features haute abstraction, 32×32",
          "Bottleneck : représentation la plus comprimée + blocs SE (attention)",
          "Décodeur : upsampling + skip connection",
          "Décodeur : reconstruction progressive de la segmentation",
          "Décodeur : segmentation quasi-finale 128×128",
          "Sortie : masque de segmentation — chaque pixel = fissure ou non"
        ],
        legend:["Encodeur","Bottleneck + SE","Décodeur","Sortie"],
        skip:"skip connection"
      }
    }
  },
  en:{
    meta:{
      title:"Ethan Binisti — R&D Engineer",
      description:"Portfolio of Ethan Binisti, a numerical modeling and mechanics engineer passionate about code, embedded systems, and machine learning.",
      ogLocale:"en_US",
      twitterDescription:"Portfolio focused on numerical modeling, mechanics, embedded systems, and machine learning."
    },
    nav:{
      links:["Profile","Experience","Projects","Skills","Notes"],
      badge:"FULL-TIME SEP 2026",
      toggleLabel:"Choose language"
    },
    hero:{
      tag:"NUMERICAL MODELING & MECHANICS · ESILV 2026",
      desc:"Numerical modeling and mechanics engineer, passionate about code, embedded systems, and machine learning. I build strong technical prototypes that are measurable and quickly usable in industry.",
      pills:["FULL-TIME FROM SEP 2026","VISION · SIMULATION · EMBEDDED","MEASURED AND DOCUMENTED PROJECTS"],
      actions:["View featured work →","📄 Download resume"],
      stats:[
        "ACCURACY<br>U-NET CRACK DETECTION",
        "SUCCESS RATE<br>UAV LANDING",
        "IMAGES<br>PYTORCH TRAINING",
        "PRECISION<br>ON VALIDATION"
      ]
    },
    terminalIntro:{
      section:"01 — INTERACTIVE PROFILE",
      heading:"Type a command<br>to <em>explore.</em>",
      body:`An interactive terminal to explore my profile in a non-linear way. Start with <code style="font-family:'Space Mono',monospace;color:var(--g);font-size:.9rem;">help</code> to see the available commands.`,
      commandsLabel:"COMMANDS:",
      quick:["View projects","Contact me","Open resume"]
    },
    experience:{
      section:"02 — EXPERIENCE",
      heading:"What I have <em>built.</em>",
      cards:[
        {
          year:"2024 → 2026 · 2 YEARS",
          role:"R&D Engineer Apprentice — Mechanical Simulation",
          badge:"INDUSTRY",
          where:"Souchier-Boullet · Soprema Group",
          tasks:[
            "<strong>~100 SQL stored procedures</strong> and 5 business configurators with business rules, consistency checks, and automatic translation",
            "Parametric assembly modeling, bill-of-materials and material harmonization",
            "Optimized conditional interface in <strong>Design Studio</strong>"
          ],
          tags:["T-SQL","Design Studio","Parametric CAD","Abaqus"]
        },
        {
          year:"SUMMER 2025 · 3 MONTHS",
          role:"Research Intern — Vision & Deep Learning",
          badge:"HANOI, VIETNAM",
          where:"USTH — University of Science and Technology of Hanoi",
          tasks:[
            "ROS/PX4 pipeline for autonomous UAV landing: ArUco detection, solvePnP pose estimation, MAVLink commands — <strong>95% success rate, centimeter-level precision, ~60 FPS</strong>",
            "Crack segmentation: <strong>U-Net + SE-Blocks (PyTorch)</strong> on ~40,000 images — 97.65% accuracy, 97.59% F1, 100% precision",
            "Docker containerization, GitHub versioning, full documentation"
          ],
          tags:["PyTorch","ROS Noetic","OpenCV","PX4","U-Net","Docker"]
        },
        {
          year:"2023 → 2026 · 3 YEARS",
          role:"Academic Projects — IoT & Simulation",
          badge:"PARIS-LA DÉFENSE",
          where:"ESILV — Léonard de Vinci Graduate School of Engineering",
          tasks:[
            "<strong>EV-APP</strong>: EV driving optimization in Python with ML, validated on real driving profiles",
            "<strong>Pullman Concept Room (Accor)</strong>: secure smart room with BLE + iOS + Raspberry Pi (GRMS)"
          ],
          tags:["Python ML","BLE","Raspberry Pi","iOS"]
        }
      ]
    },
    featured:{
      section:"FEATURED WORK",
      heading:"Three concrete cases <em>that define me.</em>",
      intro:"Projects with a clear problem, a defined role, a credible stack, and measurable outcomes. This is the part to read first if you are hiring.",
      cards:[
        {
          meta:"VISION / DEEP LEARNING",
          title:"Crack Detection — U-Net",
          summary:"End-to-end semantic segmentation pipeline for structural inspection on roughly 40,000 images.",
          points:[
            "<strong>Problem</strong> detect thin structural cracks automatically with a signal usable in inspection workflows.",
            "<strong>Role</strong> training, evaluation, metrics, and demo delivery for the model.",
            "<strong>Outcome</strong> 97.65% accuracy, 97.59% F1, 100% precision."
          ],
          stack:"PyTorch · U-Net · SE-Blocks · OpenCV",
          actions:["View notebook","Source notebook ↗"]
        },
        {
          meta:"ROBOTICS / EMBEDDED",
          title:"Autonomous UAV Landing",
          summary:"Real-time vision and guidance loop built with ROS/PX4 to land a drone on a visual marker in real conditions.",
          points:[
            "<strong>Problem</strong> estimate 6DOF pose and correct the trajectory with low latency.",
            "<strong>Role</strong> vision, pose estimation, guidance, and field validation.",
            "<strong>Outcome</strong> 95% success rate, centimeter-level precision, around 60 FPS."
          ],
          stack:"ROS Noetic · PX4 · MAVLink · OpenCV",
          actions:["View demo","GitHub repo ↗"]
        },
        {
          meta:"INDUSTRY / SQL / CAD",
          title:"R&D Apprenticeship at Soprema",
          summary:"Industrialization and data-structuring work around technical data, business configurators, and parametric models.",
          points:[
            "<strong>Problem</strong> make business flows more reliable and speed up technical study production.",
            "<strong>Role</strong> SQL procedures, configurators, data consistency, and business-facing interfaces.",
            "<strong>Outcome</strong> about 100 SQL procedures and 5 business configurators used in production."
          ],
          stack:"T-SQL · Design Studio · Parametric CAD · Abaqus",
          actions:["View experience"]
        }
      ]
    },
    projects:{
      section:"DEMOS & SOURCES",
      heading:"Explore the <em>demos.</em>",
      cards:[
        {
          num:"P.001 · CLICK FOR NOTEBOOK ↗",
          title:"Crack Detection — U-Net",
          desc:"Semantic segmentation for structural inspection. U-Net + Squeeze-and-Excitation on ~40,000 images.",
          proof:`<strong>ROLE</strong> full training and evaluation pipeline · <strong>PROOF</strong> published validation metrics`,
          links:["Source notebook ↗"],
          metric:"Accuracy 97.65% · F1 97.59% · Precision 100%",
          tags:["PyTorch","U-Net","SE-Blocks","OpenCV"],
          cta:"OPEN THE NOTEBOOK"
        },
        {
          num:"P.002 · CLICK FOR DEMO ↗",
          title:"Autonomous UAV Landing",
          desc:"Full ROS/PX4 pipeline. ArUco detection, 6DOF pose estimation (solvePnP), MAVLink commands.",
          proof:`<strong>ROLE</strong> vision, pose estimation, and guidance loop · <strong>IMPACT</strong> real-time centimeter-level landing`,
          links:["GitHub repo ↗"],
          metric:"95% success rate · Centimeter precision · ~60 FPS",
          tags:["ROS Noetic","PX4","OpenCV","MAVLink"],
          cta:"WATCH THE REAL LANDING DEMO"
        },
        {
          num:"P.003 · CLICK FOR DEMO ↗",
          title:"Visualized U-Net Architecture",
          desc:"Interactive visualization of the U-Net architecture used in the crack detection project — encoder, decoder, skip connections.",
          proof:`<strong>ROLE</strong> technical explanation and interactive visualization · <strong>USE</strong> make the model readable in 30 seconds`,
          links:[],
          metric:"Deep network · Skip connections · SE attention",
          tags:["DL Architecture","Visualization","Teaching"],
          cta:"EXPLORE THE ARCHITECTURE"
        },
        {
          title:"Pullman Concept Room — Accor",
          desc:"Secure BLE smart room, iOS app, Raspberry Pi (GRMS). Accor partnership.",
          proof:`<strong>ROLE</strong> identification logic and IoT integration · <strong>CONTEXT</strong> real project with business constraints`,
          metric:"Accor partnership · Secure BLE · IoT",
          tags:["BLE","iOS Swift","Raspberry Pi","GRMS"],
          cta:"github.com/ethan-bns24/Pullman-Concept-Room ↗"
        },
        {
          title:"EV-APP — EV Optimization",
          desc:"Python mobile app to optimize electric vehicle driving. Validated on real driving profiles.",
          proof:`<strong>ROLE</strong> ML modeling and application logic · <strong>PROOF</strong> validation on driving data`,
          metric:"Embedded ML · Validated on real profiles",
          tags:["Python","ML","Mobile","Energy"],
          cta:"github.com/ethan-bns24/EV-APP ↗"
        },
        {
          title:"Open Source — GitHub",
          desc:"ML projects, web tools, and algorithms built in my free time. Everything is documented and public.",
          proof:`<strong>SIGNAL</strong> long-term technical curiosity · <strong>FORMAT</strong> public, versioned, reusable code`,
          metric:"Public · Documented · Self-taught",
          tags:["Python","C/C++","Web","ML"],
          cta:"See all repositories ↗"
        }
      ]
    },
    skills:{
      section:"04 — SKILLS",
      heading:"Technical <em>stack.</em>",
      groups:["PROGRAMMING","DEEP LEARNING & VISION","ROBOTICS & SIMULATION"],
      names:[
        "Python (NumPy, SciPy, ML)",
        "SQL — T-SQL / MySQL",
        "C / C++",
        "Docker / Git",
        "PyTorch",
        "Computer Vision / OpenCV",
        "DL Architectures (U-Net, SE)",
        "ROS / PX4 / MAVLink",
        "FEM — Abaqus / ANSYS",
        "CFD — ANSYS Fluent"
      ],
      radar:{
        labels:["Python","Deep Learning","Vision","Robotics","FEM/CFD","CAD"]
      }
    },
    learn:{
      section:"TECHNICAL NOTES",
      heading:"A few explainers <em>if you want to dig deeper.</em>",
      cards:[
        {
          title:"How does a U-Net work?",
          body:`A U-Net is a U-shaped neural network architecture. The <strong>encoder</strong> progressively compresses the image, while the <strong>decoder</strong> reconstructs it. <strong>Skip connections</strong> transfer fine details between both sides for pixel-level segmentation. <strong>Squeeze-and-Excitation</strong> blocks add attention over the most relevant channels.`,
          tag:"// DEEP LEARNING"
        },
        {
          title:"How does a drone land on its own?",
          body:`My pipeline uses printed <strong>ArUco markers</strong> on the ground. The camera detects them with OpenCV, then <strong>solvePnP</strong> computes the exact 3D pose of the drone. Commands are sent to the <strong>PX4 autopilot through MAVLink</strong> to correct the trajectory in real time.`,
          tag:"// UAV ROBOTICS"
        },
        {
          title:"What is the finite element method?",
          body:`FEM splits a mechanical part into thousands of small geometric elements (<strong>mesh</strong>). On each one, simplified equations describe how it deforms under load. When assembled together, these local solutions produce a realistic global simulation without physically testing the part.`,
          tag:"// FEA SIMULATION"
        },
        {
          title:"Bluetooth Low Energy in 30 seconds",
          body:`<strong>BLE</strong> is an ultra-low-power version of classic Bluetooth. Instead of keeping a permanent connection, it sends small packets on demand. Perfect for <strong>IoT</strong>: a watch battery can last for years. In my Pullman Concept Room project, it securely identifies a hotel guest approaching the room.`,
          tag:"// IOT / EMBEDDED"
        },
        {
          title:"Optimizing EV driving with ML",
          body:`An electric vehicle behaves differently depending on speed, slope, temperature, or braking. My EV-APP trains an ML model on <strong>real driving profiles</strong> to predict future consumption and suggest adjustments. Result: up to 15% extra range.`,
          tag:"// MACHINE LEARNING"
        },
        {
          title:"Easter Egg",
          body:`Try the <strong>Konami Code</strong> on this page:<br>↑ ↑ ↓ ↓ ← → ← → B A<br><br>or use a keyboard.`,
          tag:"// HIDDEN FEATURE"
        }
      ]
    },
    fit:{
      section:"WHAT I AM LOOKING FOR",
      heading:"An R&D role with <em>real technical depth.</em>",
      cards:[
        {
          key:"TARGET ROLES",
          title:"Computer vision, robotics, simulation, R&D prototyping",
          body:"I am looking for a role where I can connect modeling, code, experimentation, and the path to a usable prototype."
        },
        {
          key:"ENVIRONMENT",
          title:"Demanding team, complex subjects, room to learn fast",
          body:"I am most useful when I need to understand quickly, structure cleanly, and turn technical work into something measurable and readable."
        },
        {
          key:"AVAILABILITY",
          title:"Full-time starting September 2026",
          body:"Open to talk now (interviews), start date from September 2026."
        }
      ]
    },
    contact:{
      section:"CONTACT",
      heading:"Let's build<br><em>together.</em>",
      sub:"I am looking for a full-time role where hard problems are the norm. Available starting September 2026 (interviews possible now).",
      labels:["EMAIL","PHONE","LINKEDIN","GITHUB"]
    },
    footer:{
      copyright:"© 2026 ETHAN BINISTI · PORTFOLIO",
      links:["Profile","Experience","Projects","Skills","Contact"]
    },
    konami:{
      title:"// MINI MECHANICS SIM UNLOCKED",
      body:`You found the Konami Code (↑↑↓↓←→←→BA).<br>Mini beam mechanics sim: pick the <strong>support</strong> (cantilever or simply supported) and the <strong>load</strong> (point / distributed / moment). Observe <strong>w(x)</strong> and the <strong>V(x)</strong> and <strong>M(x)</strong> diagrams.<br><span style="color:var(--ink4)">Tip: dM/dx = V and w'' = M/(E·I).</span>`,
      close:"[ CLOSE ]"
    },
    terminal:{
      welcome:{
        intro:"Welcome to Ethan Binisti's interactive portfolio",
        action:"Type",
        suffix:"to get started"
      },
      help:[
        {t:"out",s:"Available commands:"},
        {t:"hi",s:"  whoami      → who am I?"},
        {t:"hi",s:"  skills      → technical skills"},
        {t:"hi",s:"  projects    → key projects"},
        {t:"hi",s:"  stats       → key metrics"},
        {t:"hi",s:"  education   → education"},
        {t:"hi",s:"  contact     → contact info"},
        {t:"hi",s:"  analytics   → key interactions in this session"},
        {t:"hi",s:"  fun         → random fact"},
        {t:"hi",s:"  clear       → clear terminal"},
        {t:"dim",s:"─────────────────────────────────────"}
      ],
      whoami:[
        {t:"success",s:"> Ethan Binisti, 23 years old"},
        {t:"out",s:"  Numerical modeling & mechanics engineer (ESILV, MSc 2026)"},
        {t:"out",s:"  Focused on numerical simulation, embedded systems, and deep learning"},
        {t:"out",s:"  Self-taught in robotics & AI outside school"},
        {t:"out",s:"  Private tutor in math and physics for 3 years"},
        {t:"dim",s:'  "Learning hard things quickly is a skill"'}
      ],
      skills:[
        {t:"hi",s:"── Programming ─────────────────────"},
        {t:"out",s:"  Python         ████████████░░  Expert"},
        {t:"out",s:"  SQL (T-SQL)    ██████████░░░░  Advanced"},
        {t:"out",s:"  C / C++        █████████░░░░░  Intermediate"},
        {t:"hi",s:"── Deep Learning ─────────────────"},
        {t:"out",s:"  PyTorch        ███████████░░░  Advanced"},
        {t:"out",s:"  OpenCV         ██████████░░░░  Advanced"},
        {t:"out",s:"  U-Net / SE     ██████████░░░░  Advanced"},
        {t:"hi",s:"── Robotics / Simulation ─────────"},
        {t:"out",s:"  ROS / PX4      ██████████░░░░  Advanced"},
        {t:"out",s:"  Abaqus / FEM   ██████████░░░░  Advanced"},
        {t:"out",s:"  ANSYS Fluent   █████████░░░░░  Intermediate"}
      ],
      projects:[
        {t:"hi",s:"[1] Crack detection — U-Net (PyTorch)"},
        {t:"out",s:"    Accuracy 97.65% · F1 97.59% · Precision 100%"},
        {t:"hi",s:"[2] Autonomous UAV landing — ROS/PX4"},
        {t:"out",s:"    95% success rate · centimeter precision · ~60 FPS"},
        {t:"hi",s:"[3] EV-APP — EV optimization (Python ML)"},
        {t:"out",s:"    Validated on real driving profiles"},
        {t:"hi",s:"[4] Pullman Concept Room — Accor (BLE + iOS)"},
        {t:"out",s:"    Secure BLE authentication"},
        {t:"dim",s:"→ github.com/ethan-bns24"}
      ],
      stats:[
        {t:"success",s:"KEY METRICS ──────────────────────"},
        {t:"out",s:"  97.65%  U-Net accuracy (crack detection)"},
        {t:"out",s:"  97.59%  F1-score on the same model"},
        {t:"out",s:"  100%    Validation precision"},
        {t:"out",s:"  95%     UAV landing success rate"},
        {t:"out",s:"  ~60 FPS Real-time UAV pipeline"},
        {t:"out",s:"  40,000  PyTorch training images"},
        {t:"out",s:"  ~100    Deployed SQL procedures (Soprema)"}
      ],
      education:[
        {t:"hi",s:"[2023 → 2026] ESILV Paris-La Défense"},
        {t:"out",s:"  MSc in Mechanical Engineering & Numerical Modeling"},
        {t:"out",s:"  FEA · CFD · ML · Composite · Aeroelasticity · Digital Twins"},
        {t:"hi",s:"[2021 → 2023] Lycée d'Arsonval, Saint-Maur"},
        {t:"out",s:"  PCSI / PSI* preparatory classes"},
        {t:"out",s:"  Math · Physics · Chemistry · Industrial sciences"},
        {t:"dim",s:"  TOEIC: 800 (English B2+)"}
      ],
      contact:[
        {t:"success",s:"CONTACT ─────────────────────────"},
        {t:"out",s:"  email    binisti.ethan@yahoo.fr"},
        {t:"out",s:"  phone    07 67 46 45 65"},
        {t:"out",s:"  linkedin linkedin.com/in/ethan-binisti"},
        {t:"out",s:"  github   github.com/ethan-bns24"},
        {t:"dim",s:"  → Available for a full-time role from Sep 2026 (interviews possible now)"}
      ],
      analytics:{
        title:"LOCAL ANALYTICS ──────────────────",
        empty:"  No tracked key interactions in this browser yet.",
        hint:"  → lightweight local tracking for CTAs and demos",
      },
      facts:[
        [
          {t:"hi",s:"// FACT #1"},
          {t:"out",s:"The U-Net architecture was created in 2015 for medical segmentation."},
          {t:"out",s:"I adapted it to detect structural cracks with 97.65% accuracy."}
        ],
        [
          {t:"hi",s:"// FACT #2"},
          {t:"out",s:'ArUco comes from "Augmented Reality University of Cordoba".'},
          {t:"out",s:"These are specialized markers for 3D computer vision."}
        ],
        [
          {t:"hi",s:"// FACT #3"},
          {t:"out",s:"MAVLink is used by most commercial and military drones."},
          {t:"out",s:"My pipeline uses it to send commands to the PX4 autopilot."}
        ],
        [
          {t:"hi",s:"// FACT #4"},
          {t:"out",s:"Konami Code: ↑↑↓↓←→←→BA — try it on this page ;)"}
        ]
      ],
      commandNotFound:"command not found: ",
      helpHint:' (try "help")'
    },
    demos:{
      edge:{
        title:"// DEMO — EDGE DETECTION (OPENCV STYLE)",
        original:"ORIGINAL IMAGE",
        result:"EDGE DETECTION",
        low:"LOW THRESHOLD:",
        high:"HIGH THRESHOLD:",
        regen:"NEW IMAGE",
        explain:`<strong style="color:var(--g);">How does it work?</strong> Canny edge detection works in 3 steps: (1) Gaussian blur to reduce noise, (2) intensity gradient computation, (3) non-maximum suppression and double thresholding. The sliders control the thresholds: the lower they are, the more details are captured.`
      },
      uav:{
        title:"// DEMO — AUTONOMOUS UAV LANDING",
        alt:"Real autonomous UAV landing demo",
        stats:["SUCCESS","PRECISION","FPS","STACK"],
        explain:`<strong style="color:var(--g);">Real demo:</strong> this GIF shows autonomous landing with <strong>ArUco</strong> marker detection, <strong>solvePnP</strong> pose estimation, and corrections sent to <strong>PX4</strong> through <strong>MAVLink</strong>. This is the real field demo, not a recreated animation.`,
        link:"View GitHub repo",
        load:"Load the full demo (~19.8 MB)"
      },
      net:{
        title:"// U-NET ARCHITECTURE — INTERACTIVE VISUALIZATION",
        explain:`<strong style="color:var(--g);">Hover over the blocks</strong> to understand their role. The <strong>encoder</strong> compresses the image into abstract representations. The <strong>decoder</strong> reconstructs the segmentation pixel by pixel. <strong>Skip connections</strong> transfer fine details. The <strong>SE</strong> blocks recalibrate the important channels.`,
        layers:["Input\n256×256","Conv\n128×128","Conv\n64×64","Conv\n32×32","Bridge\n16×16","Up\n32×32","Up\n64×64","Up\n128×128","Output\n256×256"],
        tooltips:[
          "Input: 256×256 grayscale image",
          "Encoder: convolutions + pooling extract features",
          "Encoder: more abstract representations, lower resolution",
          "Encoder: highly abstract 32×32 features",
          "Bottleneck: most compressed representation + SE attention blocks",
          "Decoder: upsampling + skip connection",
          "Decoder: progressive segmentation reconstruction",
          "Decoder: near-final 128×128 segmentation",
          "Output: segmentation mask — each pixel = crack or not"
        ],
        legend:["Encoder","Bottleneck + SE","Decoder","Output"],
        skip:"skip connection"
      }
    }
  }
};

function setText(selector,value){
  const el=document.querySelector(selector);
  if(el)el.textContent=value;
}

function setHTML(selector,value){
  const el=document.querySelector(selector);
  if(el)el.innerHTML=value;
}

function setNodeListText(selector,values){
  document.querySelectorAll(selector).forEach((el,i)=>{
    if(values[i]!==undefined)el.textContent=values[i];
  });
}

function setNodeListHTML(selector,values){
  document.querySelectorAll(selector).forEach((el,i)=>{
    if(values[i]!==undefined)el.innerHTML=values[i];
  });
}

function setList(selector,items){
  const el=document.querySelector(selector);
  if(el)el.innerHTML=items.map(item=>`<li>${item}</li>`).join('');
}

function getSkillLevelLabel(p,lang){
  if(!Number.isFinite(p))return '';
  if(lang==='fr'){
    if(p>=90)return 'Expert';
    if(p>=75)return 'Avancé';
    if(p>=60)return 'Intermédiaire';
    return 'Notions';
  }
  if(p>=90)return 'Expert';
  if(p>=75)return 'Advanced';
  if(p>=60)return 'Intermediate';
  return 'Familiar';
}

function applyLanguage(lang){
  const copy=I18N[lang]||I18N.fr;
  currentLang=lang;
  localStorage.setItem(localeStoreKey,lang);
  document.documentElement.lang=lang;
  document.title=copy.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content',copy.meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',copy.meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',copy.meta.description);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content',copy.meta.ogLocale);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content',copy.meta.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content',copy.meta.twitterDescription);

  setNodeListText('.nav-links a',copy.nav.links);
  setText('.nav-badge',copy.nav.badge);
  document.getElementById('lang-toggle')?.setAttribute('aria-label',copy.nav.toggleLabel);
  document.querySelectorAll('#lang-toggle button').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.lang===lang);
    btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang));
  });

  setText('.hero-tag',copy.hero.tag);
  setText('.hero-desc',copy.hero.desc);
  setNodeListText('.hero-pill',copy.hero.pills);
  setText('#hero .btn-g',copy.hero.actions[0]);
  setText('#hero .btn-outline',copy.hero.actions[1]);
  setNodeListHTML('.hst-l',copy.hero.stats);

  setText('#terminal-section .section-label',copy.terminalIntro.section);
  setHTML('#terminal-section h2',copy.terminalIntro.heading);
  setHTML('#terminal-section .terminal-intro p',copy.terminalIntro.body);
  setText('#terminal-section .hint > span',copy.terminalIntro.commandsLabel);
  setNodeListText('#terminal-section .quick-link',copy.terminalIntro.quick);

  setText('#experience .sl',copy.experience.section);
  setHTML('#experience .sh',copy.experience.heading);
  copy.experience.cards.forEach((card,i)=>{
    const base=`#experience .tl-item:nth-of-type(${i+1})`;
    setText(`${base} .tl-year`,card.year);
    setText(`${base} .tl-role`,card.role);
    setText(`${base} .tl-badge`,card.badge);
    setText(`${base} .tl-where`,card.where);
    setList(`${base} .tl-tasks`,card.tasks);
    setNodeListText(`${base} .ttag`,card.tags);
  });

  setText('#featured-work .sl',copy.featured.section);
  setHTML('#featured-work .sh',copy.featured.heading);
  setText('#featured-work .fw-intro',copy.featured.intro);
  copy.featured.cards.forEach((card,i)=>{
    const base=`#featured-work .fw-card:nth-of-type(${i+1})`;
    setText(`${base} .fw-meta`,card.meta);
    setText(`${base} .fw-title`,card.title);
    setText(`${base} .fw-summary`,card.summary);
    setList(`${base} .fw-points`,card.points);
    setText(`${base} .fw-stack`,card.stack);
    setNodeListText(`${base} .fw-actions a`,card.actions);
  });

  setText('#projects .sl',copy.projects.section);
  setHTML('#projects .sh',copy.projects.heading);
  copy.projects.cards.forEach((card,i)=>{
    const base=`#projects .pc:nth-of-type(${i+1})`;
    if(card.num)setText(`${base} .pc-num`,card.num);
    setText(`${base} .pc-title`,card.title);
    setText(`${base} .pc-desc`,card.desc);
    setHTML(`${base} .pc-proof`,card.proof);
    if(card.links?.length)setNodeListText(`${base} .pc-link`,card.links);
    setText(`${base} .pc-metric`,card.metric);
    setNodeListText(`${base} .ptag`,card.tags);
    const cta= document.querySelector(`${base} .pc-cta`) || document.querySelector(`${base} .btn-g`);
    if(cta){
      if(cta.querySelector('svg')){
        const labelNode=[...cta.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
        if(labelNode)labelNode.textContent=card.cta;
        else cta.append(document.createTextNode(card.cta));
      } else {
        cta.textContent=card.cta;
      }
    }
  });

  setText('#skills .sl',copy.skills.section);
  setHTML('#skills .sh',copy.skills.heading);
  setNodeListText('#skills .sg-title',copy.skills.groups);
  setNodeListText('#skills .sk-name',copy.skills.names);
  document.querySelectorAll('#skills .sk-item').forEach(item=>{
    const p=+(item.querySelector('.sk-fill')?.dataset.p||'');
    const val=item.querySelector('.sk-val');
    if(val)val.textContent=getSkillLevelLabel(p,lang);
  });

  setText('#learn .sl',copy.learn.section);
  setHTML('#learn .sh',copy.learn.heading);
  copy.learn.cards.forEach((card,i)=>{
    const base=`#learn .lc:nth-of-type(${i+1})`;
    setText(`${base} .lc-title`,card.title);
    setHTML(`${base} .lc-body`,card.body);
    setText(`${base} .lc-tag`,card.tag);
  });

  setText('#fit .sl',copy.fit.section);
  setHTML('#fit .sh',copy.fit.heading);
  copy.fit.cards.forEach((card,i)=>{
    const base=`#fit .fit-card:nth-of-type(${i+1})`;
    setText(`${base} .fit-k`,card.key);
    setText(`${base} .fit-t`,card.title);
    setText(`${base} .fit-b`,card.body);
  });

  setText('#contact .sl',copy.contact.section);
  setHTML('#contact .contact-heading',copy.contact.heading);
  setText('#contact .contact-sub',copy.contact.sub);
  setNodeListText('#contact .cc-l',copy.contact.labels);
  document.getElementById('term-input')?.setAttribute('aria-label',lang==='fr'?'Entrer une commande du terminal':'Enter a terminal command');

  setText('footer .fl',copy.footer.copyright);
  setNodeListText('footer .fr-links a',copy.footer.links);

  setText('#konami h2',copy.konami.title);
  setHTML('#konami p',copy.konami.body);
  setText('#konami-close',copy.konami.close);

  resetTerminalView();
  redrawRadarChart();
  syncNavHeight();
  if(document.getElementById('demo-overlay')?.classList.contains('open')&&currentDemo){
    if(currentDemo==='uav')launchUAVDemo();
    if(currentDemo==='net')launchNetDemo();
  }
}

// ════════════════════════════════════════
// HERO NEURAL CANVAS
// ════════════════════════════════════════
(function(){
  const c=document.getElementById('neural-canvas');
  if(!c||reducedMotionQuery.matches)return;
  const ctx=c.getContext('2d');
  let W,H,nodes=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}
  resize();
  window.addEventListener('resize',()=>{resize();init();});
  function init(){
    nodes=[];
    const n=Math.floor(W*H/14000);
    for(let i=0;i<n;i++){
      nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*2+1});
    }
  }
  init();
  let mouseX=W/2,mouseY=H/2;
  document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;},{passive:true});
  function draw(){
    ctx.clearRect(0,0,W,H);
    // draw connections
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.strokeStyle=`rgba(26,107,74,${(1-d/120)*0.2})`;
          ctx.lineWidth=0.5;
          ctx.stroke();
        }
      }
      // mouse interaction
      const dx2=nodes[i].x-mouseX,dy2=nodes[i].y-mouseY;
      const d2=Math.sqrt(dx2*dx2+dy2*dy2);
      if(d2<160){
        ctx.beginPath();
        ctx.moveTo(nodes[i].x,nodes[i].y);
        ctx.lineTo(mouseX,mouseY);
        ctx.strokeStyle=`rgba(26,107,74,${(1-d2/160)*0.3})`;
        ctx.lineWidth=0.5;
        ctx.stroke();
      }
      // draw node
      ctx.beginPath();
      ctx.arc(nodes[i].x,nodes[i].y,nodes[i].r,0,Math.PI*2);
      ctx.fillStyle=d2<160?'rgba(26,107,74,0.7)':'rgba(26,107,74,0.25)';
      ctx.fill();
      // move
      nodes[i].x+=nodes[i].vx;
      nodes[i].y+=nodes[i].vy;
      if(nodes[i].x<0||nodes[i].x>W)nodes[i].vx*=-1;
      if(nodes[i].y<0||nodes[i].y>H)nodes[i].vy*=-1;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ════════════════════════════════════════
// COUNTER ANIMATION
// ════════════════════════════════════════
function animCount(el,target,dur=1600){
  if(reducedMotionQuery.matches){
    el.textContent=target;
    return;
  }
  const start=performance.now();
  (function step(ts){
    const p=Math.min((ts-start)/dur,1);
    const e=1-Math.pow(1-p,3);
    el.textContent=Math.round(e*target);
    if(p<1)requestAnimationFrame(step);
  })(performance.now());
}
const ctObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.ct').forEach(el=>animCount(el,+el.dataset.t));
      e.target.querySelectorAll('.hst-bar').forEach(b=>{b.style.width=b.dataset.w+'%';});
      ctObs.unobserve(e.target);
    }
  });
},{threshold:.3});
if(reducedMotionQuery.matches){
  document.querySelectorAll('.ct').forEach(el=>{el.textContent=el.dataset.t;});
  document.querySelectorAll('.hst-bar').forEach(b=>{b.style.width=b.dataset.w+'%';});
}else{
  document.querySelector('.hero-content')&&ctObs.observe(document.querySelector('.hero-content'));
}

// ════════════════════════════════════════
// REVEAL ON SCROLL
// ════════════════════════════════════════
if(reducedMotionQuery.matches){
  document.querySelectorAll('.rv,.rvl').forEach(el=>el.classList.add('on'));
}else{
  const rvObs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting)setTimeout(()=>e.target.classList.add('on'),i*70);
    });
  },{threshold:.08});
  document.querySelectorAll('.rv,.rvl').forEach(el=>rvObs.observe(el));
}

// ════════════════════════════════════════
// SKILL BARS ANIMATION
// ════════════════════════════════════════
let skillsDone=false;
const skillSec=document.getElementById('skills');
if(reducedMotionQuery.matches){
  document.querySelectorAll('.sk-fill[data-p]').forEach(f=>{f.style.width=f.dataset.p+'%';});
}else{
  const skillObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!skillsDone){
        skillsDone=true;
        document.querySelectorAll('.sk-fill[data-p]').forEach((f,i)=>{
          setTimeout(()=>{f.style.width=f.dataset.p+'%';},i*50);
        });
      }
    });
  },{threshold:.2});
  if(skillSec)skillObs.observe(skillSec);
}

// ════════════════════════════════════════
// RADAR CHART
// ════════════════════════════════════════
(function(){
  const c=document.getElementById('radar-canvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  const W=420,H=420,cx=W/2,cy=H/2,R=160;
  const vals=[0.93,0.88,0.85,0.80,0.76,0.78];
  let progress=0,raf;
  function drawRadar(p){
    const labels=I18N[currentLang].skills.radar.labels;
    ctx.clearRect(0,0,W,H);
    const n=labels.length;
    // grid
    for(let ring=1;ring<=5;ring++){
      ctx.beginPath();
      for(let i=0;i<n;i++){
        const angle=(i/n)*Math.PI*2-Math.PI/2;
        const r=R*ring/5;
        const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle='rgba(26,107,74,0.15)';ctx.lineWidth=1;ctx.stroke();
    }
    // axes
    for(let i=0;i<n;i++){
      const angle=(i/n)*Math.PI*2-Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);
      ctx.strokeStyle='rgba(26,107,74,0.2)';ctx.lineWidth=1;ctx.stroke();
      // label
      const lx=cx+Math.cos(angle)*(R+28);
      const ly=cy+Math.sin(angle)*(R+28);
      ctx.fillStyle='#6b5f52';
      ctx.font='600 11px "Space Mono", monospace';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(labels[i],lx,ly);
    }
    // data polygon
    ctx.beginPath();
    for(let i=0;i<n;i++){
      const angle=(i/n)*Math.PI*2-Math.PI/2;
      const r=R*vals[i]*p;
      const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle='rgba(26,107,74,0.1)';ctx.fill();
    ctx.strokeStyle='rgba(26,107,74,0.7)';ctx.lineWidth=2;ctx.stroke();
    // dots
    for(let i=0;i<n;i++){
      const angle=(i/n)*Math.PI*2-Math.PI/2;
      const r=R*vals[i]*p;
      ctx.beginPath();
      ctx.arc(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,4,0,Math.PI*2);
      ctx.fillStyle='#1a6b4a';ctx.fill();
    }
  }
  drawRadar(0);
  let radarDone=false;
  if(reducedMotionQuery.matches){
    radarDone=true;
    drawRadar(1);
  }else{
    const rObs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting&&!radarDone){
        radarDone=true;
        const start=performance.now();
        (function anim(ts){
          progress=Math.min((ts-start)/1200,1);
          const ease=1-Math.pow(1-progress,3);
          drawRadar(ease);
          if(progress<1)requestAnimationFrame(anim);
        })(performance.now());
      }
    },{threshold:.3});
    rObs.observe(c);
  }
  redrawRadarChart=()=>drawRadar(radarDone?1:0);
})();

// ════════════════════════════════════════
// TERMINAL
// ════════════════════════════════════════
(function(){
  const body=document.getElementById('term-body');
  const input=document.getElementById('term-input');
  const promptSpan=document.querySelector('#terminal .term-ps');
  if(!input)return;

  const smallPromptQuery=window.matchMedia?.('(max-width:540px)');
  function getPrompt(){
    const isSmall=smallPromptQuery?.matches;
    return isSmall ? '$' : 'ethan@portfolio:~$';
  }
  function syncPrompt(){
    if(promptSpan)promptSpan.textContent=getPrompt();
  }
  syncPrompt();
  smallPromptQuery?.addEventListener?.('change',syncPrompt);

  function focusTerminal(preventScroll=false){
    if(preventScroll){
      try{
        input.focus({preventScroll:true});
        return;
      }catch(_){}
    }
    input.focus();
  }

  document.getElementById('terminal').addEventListener('click',()=>focusTerminal());
  document.querySelectorAll('a[href="#terminal-section"]').forEach(link=>{
    link.addEventListener('click',()=>focusTerminal(true));
  });

  const CMDS={
    help:{run:()=>[
      {t:'out',s:'Commandes disponibles :'},
      {t:'hi',s:'  whoami      → qui suis-je ?'},
      {t:'hi',s:'  skills      → mes compétences techniques'},
      {t:'hi',s:'  projects    → mes projets clés'},
      {t:'hi',s:'  stats       → mes métriques clés'},
      {t:'hi',s:'  education   → ma formation'},
      {t:'hi',s:'  contact     → me contacter'},
      {t:'hi',s:'  analytics   → interactions clés de cette session'},
      {t:'hi',s:'  fun         → anecdote aléatoire'},
      {t:'hi',s:'  clear       → effacer le terminal'},
      {t:'dim',s:'─────────────────────────────────────'},
    ]},
    whoami:{run:()=>[
      {t:'success',s:'> Ethan Binisti, 23 ans'},
      {t:'out',s:'  Ingénieur modélisation & mécanique numérique (ESILV, Master 2026)'},
      {t:'out',s:'  Spécialisé en simulation numérique, embarqué, deep learning'},
      {t:'out',s:'  Autodidacte passionné — robotique & IA apprises en dehors de l\'école'},
      {t:'out',s:'  Professeur particulier en maths/physique depuis 3 ans'},
      {t:'dim',s:'  "Apprendre vite sur des sujets difficiles est une compétence"'},
    ]},
    skills:{run:()=>[
      {t:'hi',s:'── Programmation ──────────────────'},
      {t:'out',s:'  Python         ████████████░░  Expert'},
      {t:'out',s:'  SQL (T-SQL)    ██████████░░░░  Avancé'},
      {t:'out',s:'  C / C++        █████████░░░░░  Intermédiaire'},
      {t:'hi',s:'── Deep Learning ──────────────────'},
      {t:'out',s:'  PyTorch        ███████████░░░  Avancé'},
      {t:'out',s:'  OpenCV         ██████████░░░░  Avancé'},
      {t:'out',s:'  U-Net / SE     ██████████░░░░  Avancé'},
      {t:'hi',s:'── Robotique / Simulation ─────────'},
      {t:'out',s:'  ROS / PX4      ██████████░░░░  Avancé'},
      {t:'out',s:'  Abaqus / FEM   ██████████░░░░  Avancé'},
      {t:'out',s:'  ANSYS Fluent   █████████░░░░░  Intermédiaire'},
    ]},
    projects:{run:()=>[
      {t:'hi',s:'[1] Détection de fissures — U-Net (PyTorch)'},
      {t:'out',s:'    Accuracy 97.65% · F1 97.59% · Precision 100%'},
      {t:'hi',s:'[2] Atterrissage autonome UAV — ROS/PX4'},
      {t:'out',s:'    95% réussite · centimétrique · ~60 FPS'},
      {t:'hi',s:'[3] EV-APP — Optimisation VE (Python ML)'},
      {t:'out',s:'    Validé sur profils réels de conduite'},
      {t:'hi',s:'[4] Pullman Concept Room — Accor (BLE + iOS)'},
      {t:'out',s:'    Authentification BLE sécurisée'},
      {t:'dim',s:'→ github.com/ethan-bns24'},
    ]},
    stats:{run:()=>[
      {t:'success',s:'KEY METRICS ──────────────────────'},
      {t:'out',s:'  97.65%  Accuracy U-Net (crack detection)'},
      {t:'out',s:'  97.59%  F1-score sur le même modèle'},
      {t:'out',s:'  100%    Precision sur jeu de validation'},
      {t:'out',s:'  95%     Taux réussite atterrissage UAV'},
      {t:'out',s:'  ~60 FPS Pipeline UAV temps réel'},
      {t:'out',s:'  40 000  Images d\'entraînement PyTorch'},
      {t:'out',s:'  ~100    Procédures SQL déployées (Soprema)'},
    ]},
    education:{run:()=>[
      {t:'hi',s:'[2023 → 2026] ESILV Paris-La Défense'},
      {t:'out',s:'  Master Ingénierie Mécanique & Modélisation Numérique'},
      {t:'out',s:'  FEA · CFD · ML · Composite · Aeroelasticity · Digital Twins'},
      {t:'hi',s:'[2021 → 2023] Lycée d\'Arsonval, Saint-Maur'},
      {t:'out',s:'  Classes Prépa PCSI / PSI*'},
      {t:'out',s:'  Maths · Physique · Chimie · Sciences industrielles'},
      {t:'dim',s:'  TOEIC : 800 pts (Anglais B2+)'},
    ]},
    contact:{run:()=>[
      {t:'success',s:'CONTACT ──────────────────────────'},
      {t:'out',s:'  email    binisti.ethan@yahoo.fr'},
      {t:'out',s:'  tel      07 67 46 45 65'},
      {t:'out',s:'  linkedin linkedin.com/in/ethan-binisti'},
      {t:'out',s:'  github   github.com/ethan-bns24'},
      {t:'dim',s:'  → Disponible pour un CDI dès septembre 2026 (entretiens possibles dès maintenant)'},
    ]},
    fun:{run:()=>{
      const facts=[
        [{t:'hi',s:'// ANECDOTE #1'},{t:'out',s:'Le réseau U-Net a été créé en 2015 pour la segmentation médicale.'},{t:'out',s:'Je l\'ai adapté pour détecter des fissures structurelles avec 97.65% d\'accuracy.'}],
        [{t:'hi',s:'// ANECDOTE #2'},{t:'out',s:'ArUco vient de "Augmented Reality University of Cordoba".'},{t:'out',s:'Ce sont des QR codes spécialisés pour la vision par ordinateur 3D.'}],
        [{t:'hi',s:'// ANECDOTE #3'},{t:'out',s:'MAVLink est utilisé par la plupart des drones commerciaux et militaires.'},{t:'out',s:'Mon pipeline l\'utilise pour envoyer des consignes au pilote automatique PX4.'}],
        [{t:'hi',s:'// ANECDOTE #4'},{t:'out',s:'Konami Code : ↑↑↓↓←→←→BA — essaie-le sur cette page 😉'}],
      ];
      return facts[Math.floor(Math.random()*facts.length)];
    }},
    clear:{run:()=>{
      setTimeout(()=>{
        const kept=body.querySelectorAll('.term-line.dim');
        body.innerHTML='';
        kept.forEach(k=>body.appendChild(k.cloneNode(true)));
      },50);
      return[];
    }},
  };

  function renderWelcome(){
    const copy=I18N[currentLang].terminal.welcome;
    body.innerHTML=`
      <div class="term-line dim">// ${copy.intro}</div>
      <div class="term-line dim">// ${copy.action} <span style="color:var(--g)">help</span> ${copy.suffix}</div>
      <div class="term-line dim" style="margin-bottom:.5rem;">// ─────────────────────────────────────</div>
    `;
  }

  function getCommands(){
    const copy=I18N[currentLang].terminal;
    return {
      help:{run:()=>copy.help},
      whoami:{run:()=>copy.whoami},
      skills:{run:()=>copy.skills},
      projects:{run:()=>copy.projects},
      stats:{run:()=>copy.stats},
      education:{run:()=>copy.education},
      contact:{run:()=>copy.contact},
      analytics:{run:()=>getAnalyticsLines()},
      fun:{run:()=>copy.facts[Math.floor(Math.random()*copy.facts.length)]},
      clear:{run:()=>{renderWelcome();return[];}},
    };
  }

  function addLine(type,text){
    const d=document.createElement('div');
    d.className=`term-line ${type}`;
    d.textContent=text;
    body.insertBefore(d,body.lastElementChild||null);
    body.scrollTop=body.scrollHeight;
  }

  function typeLines(lines,i=0){
    if(i>=lines.length)return;
    addLine(lines[i].t,lines[i].s);
    setTimeout(()=>typeLines(lines,i+1),28);
  }

  input.addEventListener('keydown',e=>{
    if(e.key!=='Enter')return;
    const cmd=input.value.trim().toLowerCase();
    input.value='';
    if(!cmd)return;
    addLine('cmd',`${getPrompt()} ${cmd}`);
    const cmds=getCommands();
    if(cmds[cmd]){
      const out=cmds[cmd].run();
      if(out&&out.length)typeLines(out);
    } else {
      const copy=I18N[currentLang].terminal;
      addLine('err',copy.commandNotFound+cmd+copy.helpHint);
    }
  });

  resetTerminalView=renderWelcome;
  renderWelcome();
})();

// ════════════════════════════════════════
// DEMOS
// ════════════════════════════════════════
const overlay=document.getElementById('demo-overlay');
const demoBody=document.getElementById('demo-body');
const demoTitle=document.getElementById('demo-title');
const crackNotebookDemo='crack-detection-demo.html';
const uavLandingDemoGif='uav-landing-demo.gif';
const uavLandingPoster='media/uav-landing-poster.png';
let lastFocusedElement=null;
let removeOverlayTabTrap=()=>{};

function getFocusable(container){
  const sel=[
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  return [...container.querySelectorAll(sel)].filter(el=>{
    if(el.hidden)return false;
    if(el.getAttribute('aria-hidden')==='true')return false;
    return typeof el.focus==='function' && el.offsetParent!==null;
  });
}

function installTabTrap(container){
  function onKeyDown(e){
    if(e.key!=='Tab')return;
    const f=getFocusable(container);
    if(!f.length){
      e.preventDefault();
      return;
    }
    const first=f[0];
    const last=f[f.length-1];
    const active=document.activeElement;
    if(e.shiftKey){
      if(active===first||!container.contains(active)){
        e.preventDefault();
        last.focus();
      }
    }else{
      if(active===last){
        e.preventDefault();
        first.focus();
      }
    }
  }
  container.addEventListener('keydown',onKeyDown);
  return ()=>container.removeEventListener('keydown',onKeyDown);
}

function closeDemoOverlay(){
  currentDemo=null;
  overlay.classList.remove('open');
  demoBody.innerHTML='';
  removeOverlayTabTrap();
  if(lastFocusedElement&&typeof lastFocusedElement.focus==='function')lastFocusedElement.focus();
}
function openDemoOverlay(demo,trigger){
  currentDemo=demo;
  lastFocusedElement=trigger||document.activeElement;
  trackEvent(`demo-${demo}-open`);
  overlay.classList.add('open');
  removeOverlayTabTrap();
  removeOverlayTabTrap=installTabTrap(overlay);
  if(demo==='edge')launchEdgeDemo();
  else if(demo==='uav')launchUAVDemo();
  else if(demo==='net')launchNetDemo();
  document.getElementById('demo-close')?.focus();
}
document.getElementById('demo-close').onclick=closeDemoOverlay;
overlay.addEventListener('click',e=>{if(e.target===overlay)closeDemoOverlay();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&overlay.classList.contains('open'))closeDemoOverlay();
});

document.querySelectorAll('.pc a').forEach(link=>{
  link.addEventListener('click',e=>e.stopPropagation());
});

document.querySelectorAll('.pc[data-demo]').forEach(card=>{
  if(card.dataset.demo==='none')return;
  const openCardDemo=()=>{
    if(card.dataset.demo==='edge'){
      trackEvent('crack-notebook-open');
      window.open(crackNotebookDemo,'_blank','noopener,noreferrer');
      return;
    }
    openDemoOverlay(card.dataset.demo,card);
  };
  card.addEventListener('click',openCardDemo);
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      openCardDemo();
    }
  });
});

// ── EDGE DETECTION DEMO ──
function launchEdgeDemo(){
  const copy=I18N[currentLang].demos.edge;
  demoTitle.textContent=copy.title;
  demoBody.innerHTML=`
    <div class="edgedemo">
      <div><div style="font-family:'Space Mono',monospace;font-size:9px;color:var(--ink4);letter-spacing:.1em;margin-bottom:.5rem;">${copy.original}</div><canvas id="ec-orig" width="360" height="240"></canvas></div>
      <div><div style="font-family:'Space Mono',monospace;font-size:9px;color:var(--ink4);letter-spacing:.1em;margin-bottom:.5rem;">${copy.result}</div><canvas id="ec-edge" width="360" height="240"></canvas></div>
      <div class="edgedemo-ctrl">
        <span class="edge-label">${copy.low}</span>
        <input class="edge-slider" type="range" id="ec-low" min="10" max="150" value="50">
        <span class="edge-label" id="ec-low-v">50</span>
        <span class="edge-label" style="margin-left:1rem;">${copy.high}</span>
        <input class="edge-slider" type="range" id="ec-high" min="50" max="255" value="120">
        <span class="edge-label" id="ec-high-v">120</span>
        <button class="btn-g" id="ec-regen" type="button" style="font-size:9px;padding:8px 16px;">${copy.regen}</button>
      </div>
      <div class="demo-explain">${copy.explain}</div>
    </div>`;
  const co=document.getElementById('ec-orig');
  const ce=document.getElementById('ec-edge');
  const ctxO=co.getContext('2d');
  const ctxE=ce.getContext('2d');

  function genScene(){
    ctxO.fillStyle='#faf8f4';ctxO.fillRect(0,0,360,240);
    // draw structural shapes simulating concrete/building (Light mode colors)
    const shapes=[
      {type:'rect',x:40,y:30,w:80,h:180,c:'#d8cfc4'},
      {type:'rect',x:140,y:60,w:60,h:150,c:'#c8bfa4'},
      {type:'rect',x:220,y:20,w:100,h:200,c:'#e8e2d8'},
      {type:'rect',x:60,y:100,w:40,h:2,c:'#1a1612'}, // crack
      {type:'rect',x:100,y:80,w:2,h:60,c:'#1a1612'}, // crack
      {type:'rect',x:230,y:120,w:50,h:2,c:'#1a1612'},
      {type:'circle',x:290,y:80,r:25,c:'#a09080'},
      {type:'rect',x:0,y:200,w:360,h:40,c:'#e0d8cc'},
    ];
    shapes.forEach(s=>{
      ctxO.fillStyle=s.c;
      if(s.type==='rect'){ctxO.fillRect(s.x,s.y,s.w,s.h);}
      else{ctxO.beginPath();ctxO.arc(s.x,s.y,s.r,0,Math.PI*2);ctxO.fill();}
    });
    // add some noise
    const id=ctxO.getImageData(0,0,360,240);
    for(let i=0;i<id.data.length;i+=4){
      const noise=(Math.random()-.5)*30;
      id.data[i]+=noise;id.data[i+1]+=noise;id.data[i+2]+=noise;
    }
    ctxO.putImageData(id,0,0);
  }
  genScene();

  function cannySimple(low,high){
    const src=ctxO.getImageData(0,0,360,240);
    const w=360,h=240,d=src.data;
    // grayscale
    const gray=new Float32Array(w*h);
    for(let i=0;i<w*h;i++){const o=i*4;gray[i]=.299*d[o]+.587*d[o+1]+.114*d[o+2];}
    // sobel
    const gx=new Float32Array(w*h),gy=new Float32Array(w*h),mag=new Float32Array(w*h);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const i=y*w+x;
      gx[i]=(-gray[i-w-1]+gray[i-w+1]-2*gray[i-1]+2*gray[i+1]-gray[i+w-1]+gray[i+w+1]);
      gy[i]=(-gray[i-w-1]-2*gray[i-w]-gray[i-w+1]+gray[i+w-1]+2*gray[i+w]+gray[i+w+1]);
      mag[i]=Math.sqrt(gx[i]*gx[i]+gy[i]*gy[i]);
    }
    // threshold
    const out=ctxE.createImageData(w,h);
    for(let i=0;i<w*h;i++){
      const o=i*4;
      const v=mag[i]>high?255:(mag[i]>low?128:0);
      const isEdge=v>100;
      out.data[o]  = isEdge ? 26 : 250;
      out.data[o+1]= isEdge ? 107 : 248;
      out.data[o+2]= isEdge ? 74 : 244;
      out.data[o+3]= 255;
    }
    ctxE.putImageData(out,0,0);
  }
  cannySimple(50,120);

  const slL=document.getElementById('ec-low');
  const slH=document.getElementById('ec-high');
  const vL=document.getElementById('ec-low-v');
  const vH=document.getElementById('ec-high-v');
  slL.oninput=()=>{vL.textContent=slL.value;cannySimple(+slL.value,+slH.value);};
  slH.oninput=()=>{vH.textContent=slH.value;cannySimple(+slL.value,+slH.value);};
  document.getElementById('ec-regen').onclick=()=>{genScene();cannySimple(+slL.value,+slH.value);};
}

// ── UAV LANDING DEMO ──
function launchUAVDemo(){
  const copy=I18N[currentLang].demos.uav;
  demoTitle.textContent=copy.title;
  const useLitePreview=!!(navigator.connection&&navigator.connection.saveData)||reducedMotionQuery.matches;
  const mediaHTML=useLitePreview
    ? `
      <button type="button" class="uav-load" id="uav-load" aria-label="${copy.load}">
        <img src="${uavLandingPoster}" alt="${copy.alt}" loading="lazy" decoding="async" width="854" height="480">
        <div class="uav-load-badge">${copy.load}</div>
      </button>`
    : `<img src="${uavLandingDemoGif}" alt="${copy.alt}" loading="lazy" decoding="async" width="854" height="480">`;
  demoBody.innerHTML=`
    <div class="uavdemo">
      ${mediaHTML}
      <div class="uav-info">
        <div class="uav-stat"><div class="uav-stat-n">95%</div><div class="uav-stat-l">RÉUSSITE</div></div>
        <div class="uav-stat"><div class="uav-stat-n">cm</div><div class="uav-stat-l">PRÉCISION</div></div>
        <div class="uav-stat"><div class="uav-stat-n">~60</div><div class="uav-stat-l">FPS</div></div>
        <div class="uav-stat"><div class="uav-stat-n">ROS/PX4</div><div class="uav-stat-l">STACK</div></div>
      </div>
      <div style="margin-top:1rem;font-size:.85rem;color:var(--ink3);line-height:1.75;font-weight:400;border-left:2px solid var(--border);padding-left:1rem;">
        ${copy.explain}
      </div>
      <div style="margin-top:1rem;display:flex;gap:.6rem;flex-wrap:wrap;">
        <a href="https://github.com/ethan-bns24/quadrotors_landing_vision" target="_blank" rel="noopener noreferrer" class="quick-link">Voir le repo GitHub</a>
      </div>
    </div>`;
  demoBody.querySelectorAll('.uav-stat-l').forEach((el,i)=>{el.textContent=copy.stats[i];});
  demoBody.querySelector('.quick-link').textContent=copy.link;
  if(useLitePreview){
    const btn=demoBody.querySelector('#uav-load');
    btn?.addEventListener('click',()=>{
      trackEvent('uav-gif-load');
      btn.outerHTML=`<img src="${uavLandingDemoGif}" alt="${copy.alt}" loading="lazy" decoding="async" width="854" height="480">`;
    });
  }
}

// ── UNET ARCHITECTURE DEMO ──
function launchNetDemo(){
  const copy=I18N[currentLang].demos.net;
  demoTitle.textContent='// ARCHITECTURE U-NET — VISUALISATION INTERACTIVE';
  demoBody.innerHTML=`
    <canvas id="net-c" width="700" height="320"></canvas>
    <div class="net-explain">
      <strong style="color:var(--g);">Survole les blocs</strong> pour comprendre leur rôle. L'<strong>encodeur</strong> (gauche) compresse progressivement l'image en représentations abstraites. Le <strong>décodeur</strong> (droite) reconstruit la segmentation pixel par pixel. Les <strong>skip connections</strong> (flèches grises) transmettent les détails fins entre les deux. Les blocs <strong>SE (Squeeze-and-Excitation)</strong> que j'ai ajoutés recalibrent les canaux — le réseau "apprend" quels filtres sont importants pour chaque image.
    </div>`;
  demoTitle.textContent=copy.title;
  demoBody.querySelector('.net-explain').innerHTML=copy.explain;
  const c=document.getElementById('net-c');
  const ctx=c.getContext('2d');
  const W=700,H=320;

  const layers=[
    // encoder
    {x:30,y:130,w:40,h:60,label:'Input\n256×256',color:'rgba(0,184,255,.7)',type:'enc'},
    {x:90,y:115,w:40,h:90,label:'Conv\n128×128',color:'rgba(0,184,255,.6)',type:'enc'},
    {x:150,y:100,w:40,h:120,label:'Conv\n64×64',color:'rgba(0,184,255,.5)',type:'enc'},
    {x:210,y:85,w:40,h:150,label:'Conv\n32×32',color:'rgba(0,184,255,.4)',type:'enc'},
    // bottleneck
    {x:295,y:70,w:50,h:180,label:'Bridge\n16×16',color:'rgba(26,107,74,.8)',type:'bridge'},
    // decoder
    {x:390,y:85,w:40,h:150,label:'Up\n32×32',color:'rgba(212,168,67,.5)',type:'dec'},
    {x:450,y:100,w:40,h:120,label:'Up\n64×64',color:'rgba(212,168,67,.6)',type:'dec'},
    {x:510,y:115,w:40,h:90,label:'Up\n128×128',color:'rgba(212,168,67,.7)',type:'dec'},
    {x:580,y:130,w:40,h:60,label:'Output\n256×256',color:'rgba(194,74,26,.7)',type:'out'},
  ];

  layers.forEach((layer,i)=>{layer.label=copy.layers[i];});
  let hovered=-1;
  const localizedTooltips=copy.tooltips;
  const tooltips={
    0:'Entrée : image 256×256 pixels (niveaux de gris)',
    1:'Encodeur : convolutions + pooling, extrait les caractéristiques',
    2:'Encodeur : représentations plus abstraites, résolution réduite',
    3:'Encodeur : features haute abstraction, 32×32',
    4:'Bottleneck : représentation la plus comprimée + blocs SE (attention)',
    5:'Décodeur : upsampling + skip connection (détails fins réinjectés)',
    6:'Décodeur : reconstruction progressive de la segmentation',
    7:'Décodeur : segmentation quasi-finale 128×128',
    8:'Sortie : masque de segmentation — chaque pixel = fissure ou non',
  };

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#faf8f4';ctx.fillRect(0,0,W,H);

    // skip connections (gray arcs)
    [[1,7],[2,6],[3,5]].forEach(([a,b])=>{
      const la=layers[a],lb=layers[b];
      ctx.beginPath();
      ctx.moveTo(la.x+la.w/2,la.y);
      ctx.bezierCurveTo(la.x+la.w/2,la.y-35,lb.x+lb.w/2,lb.y-35,lb.x+lb.w/2,lb.y);
      ctx.strokeStyle='rgba(26,22,18,0.15)';ctx.lineWidth=1.5;
      ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
      // label
      const mx=(la.x+la.w/2+lb.x+lb.w/2)/2;
      ctx.fillStyle='rgba(26,22,18,.3)';ctx.font='7px Space Mono';
      ctx.textAlign='center';ctx.fillText(copy.skip,mx,la.y-40);
    });

    // forward arrows
    for(let i=0;i<layers.length-1;i++){
      if(i===3)continue; // handled by bottleneck gap
      const a=layers[i],b=layers[i+1];
      ctx.beginPath();
      ctx.moveTo(a.x+a.w,a.y+a.h/2);
      ctx.lineTo(b.x,b.y+b.h/2);
      ctx.strokeStyle='rgba(26,22,18,0.2)';ctx.lineWidth=1;ctx.stroke();
    }

    layers.forEach((l,i)=>{
      const isH=i===hovered;
      ctx.beginPath();
      ctx.roundRect(l.x,l.y,l.w,l.h,3);
      ctx.fillStyle=isH?l.color.replace(/[\d.]+\)$/,'1)'):l.color;
      ctx.fill();
      if(isH){ctx.strokeStyle='rgba(26,22,18,.5)';ctx.lineWidth=1.5;ctx.stroke();}

      // SE badge on bridge
      if(l.type==='bridge'){
        ctx.fillStyle='rgba(26,107,74,.3)';
        ctx.fillRect(l.x+5,l.y+5,l.w-10,20);
        ctx.fillStyle='rgba(26,107,74,1)';
        ctx.font='bold 7px Space Mono';ctx.textAlign='center';
        ctx.fillText('SE',l.x+l.w/2,l.y+17);
      }

      // label
      const lines=l.label.split('\n');
      ctx.fillStyle='#ffffff';ctx.font='7px DM Sans';
      ctx.textAlign='center';
      lines.forEach((ln,li)=>ctx.fillText(ln,l.x+l.w/2,l.y+l.h/2-4+li*12));
    });

    // legend
    [['rgba(0,184,255,.7)',copy.legend[0]],['rgba(26,107,74,.8)',copy.legend[1]],['rgba(212,168,67,.7)',copy.legend[2]],['rgba(194,74,26,.7)',copy.legend[3]]].forEach(([col,txt],i)=>{
      ctx.fillStyle=col;ctx.fillRect(20+i*155,290,10,10);
      ctx.fillStyle='#6b5f52';ctx.font='9px Space Mono';
      ctx.textAlign='left';ctx.fillText(txt,36+i*155,299);
    });

    if(hovered>=0){
      ctx.fillStyle='rgba(255,255,255,.95)';ctx.strokeStyle='rgba(26,107,74,.3)';
      ctx.lineWidth=1;
      const l=layers[hovered];
      const tx=Math.min(l.x+l.w+10,W-220),ty=Math.max(l.y-20,10);
      ctx.beginPath();ctx.roundRect(tx,ty,210,36,3);ctx.fill();ctx.stroke();
      ctx.fillStyle='#3d352c';ctx.font='9px DM Sans';
      ctx.textAlign='left';
      wrapText(ctx,localizedTooltips[hovered],tx+8,ty+14,195,13);
    }
  }

  function wrapText(ctx,text,x,y,maxW,lineH){
    const words=text.split(' ');let line='';
    words.forEach(w=>{
      const t=line?line+' '+w:w;
      if(ctx.measureText(t).width>maxW&&line){
        ctx.fillText(line,x,y);line=w;y+=lineH;
      } else line=t;
    });
    ctx.fillText(line,x,y);
  }

  c.addEventListener('mousemove',e=>{
    const rect=c.getBoundingClientRect();
    const sx=(e.clientX-rect.left)*(W/rect.width);
    const sy=(e.clientY-rect.top)*(H/rect.height);
    hovered=-1;
    layers.forEach((l,i)=>{if(sx>=l.x&&sx<=l.x+l.w&&sy>=l.y&&sy<=l.y+l.h)hovered=i;});
    draw();
  });
  c.addEventListener('mouseleave',()=>{hovered=-1;draw();});
  draw();
}

// ════════════════════════════════════════
document.querySelectorAll('#lang-toggle button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    trackEvent(`lang-${btn.dataset.lang}`);
    applyLanguage(btn.dataset.lang);
  });
});

document.querySelectorAll('[data-track]').forEach(el=>{
  el.addEventListener('click',()=>trackEvent(el.dataset.track));
});

applyLanguage(currentLang);

// KONAMI CODE
// ════════════════════════════════════════
(function(){
  const seq=[38,38,40,40,37,39,37,39,66,65];
  let pos=0;
  document.addEventListener('keydown',e=>{
    if(e.keyCode===seq[pos]){
      pos++;
      if(pos===seq.length){pos=0;launchMech();}
    } else pos=0;
  });

  function launchMech(){
    const k=document.getElementById('konami');
    k.classList.add('on');
    const previouslyFocused=document.activeElement;
    let removeKonamiTabTrap=()=>{};
    const canvas=document.getElementById('mech-canvas');
    const ctrl=document.getElementById('mech-ctrl');
    if(!canvas||!ctrl)return;
    removeKonamiTabTrap=installTabTrap(k);
    const ctx=canvas.getContext('2d');

    const state={
      L:1.0,
      support:'cantilever', // 'cantilever' | 'simple'
      load:'point',         // 'point' | 'udl' | 'moment'
      diagram:'M',          // 'M' | 'V'
      a:0.7,                // load position (0..1)
      F:350,                // N
      q:420,                // N/m (UDL)
      M0:220,               // N·m (end moment)
      EI:160,               // arbitrary scale
      probe:0.55,           // x probe (0..1)
      drag:false
    };

    function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
    function rgba(r,g,b,a){return `rgba(${r},${g},${b},${a})`;}

    function getLabels(){
      if(currentLang==='fr'){
        return {
          support:'APPUI:',
          cantilever:'Console',
          simple:'Appuis simples',
          load:'CHARGE:',
          point:'Ponctuelle',
          udl:'Répartie',
          moment:'Couple',
          pos:'POSITION:',
          force:'FORCE:',
          udlQ:'CHARGE q:',
          mom:'COUPLE M:',
          stiff:'RIGIDITÉ E·I:',
          diagram:'DIAGRAMME:',
          reset:'RESET',
          random:'RANDOM',
          tip:'Flèche max',
          reactions:'Réactions',
          probe:'Sonde',
          hint:'dM/dx = V  ·  w\'\' = M/(E·I)  ·  (touche: drag la charge ponctuelle)'
        };
      }
      return {
        support:'SUPPORT:',
        cantilever:'Cantilever',
        simple:'Simply supported',
        load:'LOAD:',
        point:'Point',
        udl:'Distributed',
        moment:'Moment',
        pos:'POSITION:',
        force:'FORCE:',
        udlQ:'LOAD q:',
        mom:'MOMENT M:',
        stiff:'STIFFNESS E·I:',
        diagram:'DIAGRAM:',
        reset:'RESET',
        random:'RANDOM',
        tip:'Max deflection',
        reactions:'Reactions',
        probe:'Probe',
        hint:'dM/dx = V  ·  w\'\' = M/(E·I)  ·  (touch: drag the point load)'
      };
    }

    function normalizeModes(){
      if(state.support!=='cantilever'&&state.load==='moment'){
        state.load='point';
      }
      state.support=state.support==='simple'?'simple':'cantilever';
      state.load=state.load==='udl'?'udl':(state.load==='moment'?'moment':'point');
      state.diagram=state.diagram==='V'?'V':'M';
    }

    function getPosClamp(){
      // Avoid degenerate conditions at the supports.
      return state.support==='cantilever' ? {min:0.2,max:1.0} : {min:0.05,max:0.95};
    }

    function syncControlValues(){
      // Keep HTML + state in sync after a re-render.
      const slA=ctrl.querySelector('#mech-a');
      const vA=ctrl.querySelector('#mech-a-v');
      if(slA){
        const {min,max}=getPosClamp();
        slA.min=String(Math.round(min*100));
        slA.max=String(Math.round(max*100));
        slA.value=String(Math.round(state.a*100));
        if(vA)vA.textContent=Math.round(state.a*100)+'%';
      }
      const slF=ctrl.querySelector('#mech-f');
      const vF=ctrl.querySelector('#mech-f-v');
      if(slF){
        slF.value=String(state.F);
        if(vF)vF.textContent=state.F+'N';
      }
      const slQ=ctrl.querySelector('#mech-q');
      const vQ=ctrl.querySelector('#mech-q-v');
      if(slQ){
        slQ.value=String(state.q);
        if(vQ)vQ.textContent=state.q+'N/m';
      }
      const slM=ctrl.querySelector('#mech-m');
      const vM=ctrl.querySelector('#mech-m-v');
      if(slM){
        slM.value=String(state.M0);
        if(vM)vM.textContent=state.M0+'N·m';
      }
      const slEI=ctrl.querySelector('#mech-ei');
      const vEI=ctrl.querySelector('#mech-ei-v');
      if(slEI){
        slEI.value=String(state.EI);
        if(vEI)vEI.textContent=String(state.EI);
      }
    }

    function renderControls(){
      normalizeModes();
      const t=getLabels();
      const isPoint=state.load==='point';
      const isUdl=state.load==='udl';
      const isMom=state.load==='moment';
      const momentDisabled=state.support!=='cantilever';

      ctrl.innerHTML=`
        <div class="mech-row">
          <span class="edge-label">${t.support}</span>
          <button type="button" data-support="cantilever" class="${state.support==='cantilever'?'active':''}">${t.cantilever}</button>
          <button type="button" data-support="simple" class="${state.support==='simple'?'active':''}">${t.simple}</button>
          <span class="edge-label" style="margin-left:.25rem;">${t.load}</span>
          <button type="button" data-load="point" class="${isPoint?'active':''}">${t.point}</button>
          <button type="button" data-load="udl" class="${isUdl?'active':''}">${t.udl}</button>
          <button type="button" data-load="moment" class="${isMom?'active':''}" ${momentDisabled?'disabled':''}>${t.moment}</button>
        </div>

        <div class="mech-row">
          ${isPoint?`
            <span class="edge-label">${t.pos}</span>
            <input class="edge-slider" type="range" id="mech-a" min="20" max="100" value="${Math.round(state.a*100)}">
            <span class="edge-label" id="mech-a-v">${Math.round(state.a*100)}%</span>

            <span class="edge-label">${t.force}</span>
            <input class="edge-slider" type="range" id="mech-f" min="50" max="900" value="${state.F}">
            <span class="edge-label" id="mech-f-v">${state.F}N</span>
          `:''}

          ${isUdl?`
            <span class="edge-label">${t.udlQ}</span>
            <input class="edge-slider" type="range" id="mech-q" min="40" max="900" value="${state.q}">
            <span class="edge-label" id="mech-q-v">${state.q}N/m</span>
          `:''}

          ${isMom?`
            <span class="edge-label">${t.mom}</span>
            <input class="edge-slider" type="range" id="mech-m" min="40" max="700" value="${state.M0}">
            <span class="edge-label" id="mech-m-v">${state.M0}N·m</span>
          `:''}

          <span class="edge-label">${t.stiff}</span>
          <input class="edge-slider" type="range" id="mech-ei" min="60" max="420" value="${state.EI}">
          <span class="edge-label" id="mech-ei-v">${state.EI}</span>
        </div>

        <div class="mech-row">
          <span class="edge-label">${t.diagram}</span>
          <button type="button" data-diag="V" class="${state.diagram==='V'?'active':''}">V(x)</button>
          <button type="button" data-diag="M" class="${state.diagram==='M'?'active':''}">M(x)</button>
          <button type="button" id="mech-reset">${t.reset}</button>
          <button type="button" id="mech-rand">${t.random}</button>
        </div>
        <div class="mech-row mech-hint"><span class="edge-label" style="white-space:normal;max-width:860px;line-height:1.5;text-align:center;">${t.hint}</span></div>
      `;

      syncControlValues();

      // mode buttons
      ctrl.querySelectorAll('button[data-support]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          state.support=btn.dataset.support;
          renderControls();
          draw();
        });
      });
      ctrl.querySelectorAll('button[data-load]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const next=btn.dataset.load;
          if(next==='moment'&&state.support!=='cantilever')return;
          state.load=next;
          renderControls();
          draw();
        });
      });
      ctrl.querySelectorAll('button[data-diag]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          state.diagram=btn.dataset.diag;
          renderControls();
          draw();
        });
      });

      // sliders
      const slA=ctrl.querySelector('#mech-a');
      const slF=ctrl.querySelector('#mech-f');
      const slQ=ctrl.querySelector('#mech-q');
      const slM=ctrl.querySelector('#mech-m');
      const slEI=ctrl.querySelector('#mech-ei');
      const update=()=>{
        if(slA)state.a=+slA.value/100;
        if(slF)state.F=+slF.value;
        if(slQ)state.q=+slQ.value;
        if(slM)state.M0=+slM.value;
        if(slEI)state.EI=+slEI.value;
        syncControlValues();
        draw();
      };
      slA?.addEventListener('input',update);
      slF?.addEventListener('input',update);
      slQ?.addEventListener('input',update);
      slM?.addEventListener('input',update);
      slEI?.addEventListener('input',update);

      // reset/random
      ctrl.querySelector('#mech-reset')?.addEventListener('click',()=>{
        state.support='cantilever';
        state.load='point';
        state.diagram='M';
        state.a=0.7;
        state.F=350;
        state.q=420;
        state.M0=220;
        state.EI=160;
        state.probe=0.55;
        renderControls();
        draw();
      });

      ctrl.querySelector('#mech-rand')?.addEventListener('click',()=>{
        const supports=['cantilever','simple'];
        state.support=supports[Math.floor(Math.random()*supports.length)];
        const loads=state.support==='cantilever' ? ['point','udl','moment'] : ['point','udl'];
        state.load=loads[Math.floor(Math.random()*loads.length)];
        state.diagram=(Math.random()>0.5?'M':'V');
        const {min,max}=getPosClamp();
        state.a=clamp(min+Math.random()*(max-min),min,max);
        state.F=Math.round(120+Math.random()*760);
        state.q=Math.round(120+Math.random()*780);
        state.M0=Math.round(80+Math.random()*580);
        state.EI=Math.round(80+Math.random()*320);
        state.probe=clamp(Math.random(),0,1);
        renderControls();
        draw();
      });
    }

    function getA(){
      const {min,max}=getPosClamp();
      state.a=clamp(state.a,min,max);
      return state.a*state.L;
    }

    function shearV(x){
      const L=state.L;
      const EI=state.EI;
      void EI;
      if(state.support==='cantilever'){
        const a=getA();
        if(state.load==='point')return x<=a ? -state.F : 0;
        if(state.load==='udl')return -state.q*(L-x);
        return 0;
      }
      // simply supported
      if(state.load==='point'){
        const a=getA();
        const R1=state.F*(L-a)/L;
        return x<a ? R1 : (R1-state.F);
      }
      // udl
      const R1=state.q*L/2;
      return R1 - state.q*x;
    }

    function momentM(x){
      const L=state.L;
      if(state.support==='cantilever'){
        const a=getA();
        if(state.load==='point')return x<=a ? -state.F*(a-x) : 0;
        if(state.load==='udl')return -state.q*Math.pow(L-x,2)/2;
        return -state.M0;
      }
      // simply supported
      if(state.load==='point'){
        const a=getA();
        const R1=state.F*(L-a)/L;
        return x<a ? R1*x : (R1*x - state.F*(x-a));
      }
      // udl
      const R1=state.q*L/2;
      return R1*x - state.q*x*x/2;
    }

    function deflectionW(x){
      const L=state.L;
      const EI=Math.max(1e-6,state.EI);
      if(state.support==='cantilever'){
        const a=getA();
        if(state.load==='point'){
          if(x<=a){
            return -(state.F/EI)*(a*x*x/2 - x*x*x/6);
          }
          return -(state.F/EI)*(a*a*x/2 - a*a*a/6);
        }
        if(state.load==='udl'){
          const q=state.q;
          return -(q/(24*EI))*x*x*(6*L*L - 4*L*x + x*x);
        }
        // end moment
        return -(state.M0/(2*EI))*x*x;
      }
      // simply supported
      if(state.load==='point'){
        const a=getA();
        const b=L-a;
        if(x<=a){
          return -(state.F*b*x*(L*L - b*b - x*x))/(6*L*EI);
        }
        const xp=L-x;
        return -(state.F*a*xp*(L*L - a*a - xp*xp))/(6*L*EI);
      }
      // udl
      const q=state.q;
      return -(q*x*(Math.pow(L,3) - 2*L*x*x + x*x*x))/(24*EI);
    }

    function resizeCanvas(){
      const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
      const maxW=Math.min(940,Math.max(320,Math.floor(window.innerWidth*0.92)));
      const w=maxW;
      const h=Math.floor(w*0.50);
      canvas.style.width=w+'px';
      canvas.style.height=h+'px';
      canvas.width=Math.floor(w*dpr);
      canvas.height=Math.floor(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function computeMaxAbs(fn,segs){
      let m=0;
      for(let i=0;i<=segs;i++){
        const x=(i/segs)*state.L;
        m=Math.max(m,Math.abs(fn(x)));
      }
      return m;
    }

    function drawSupportAndReactions(x0,x1,beamY,Lpx){
      const L=state.L;
      const base=beamY+10;
      ctx.strokeStyle='rgba(61,53,44,0.85)';
      ctx.fillStyle='rgba(61,53,44,0.85)';
      ctx.lineWidth=1.5;

      if(state.support==='cantilever'){
        // Fixed clamp
        ctx.fillRect(x0-8,beamY-22,8,44);
        ctx.fillStyle='rgba(216,207,196,1)';
        for(let i=0;i<9;i++)ctx.fillRect(x0-8,beamY-22+i*5,8,1);
        // Reaction arrow + moment at clamp (educational hint)
        ctx.fillStyle='rgba(26,107,74,0.9)';
        ctx.strokeStyle='rgba(26,107,74,0.9)';
        ctx.beginPath();
        ctx.moveTo(x0+10,base+24);
        ctx.lineTo(x0+10,base+6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x0+4,base+12);
        ctx.lineTo(x0+10,base+6);
        ctx.lineTo(x0+16,base+12);
        ctx.stroke();

        const a=getA();
        const R=(state.load==='moment')?0:(state.load==='udl'?state.q*L:state.F);
        const Mfix=(state.load==='moment')?state.M0:(state.load==='udl'?state.q*L*L/2:state.F*a);
        ctx.fillStyle='rgba(107,95,82,1)';
        ctx.font='600 10px "Space Mono", monospace';
        ctx.textAlign='left';ctx.textBaseline='middle';
        ctx.fillText(`R≈${Math.round(R)}N`,x0+18,base+10);
        ctx.fillText(`M0≈${Math.round(Mfix)}N·m`,x0+18,base+24);
        return;
      }

      // Simply supported: left pin + right roller
      const pinX=x0;
      const rolX=x1;
      const triH=18, triW=18;
      ctx.fillStyle='rgba(61,53,44,0.85)';
      ctx.beginPath();
      ctx.moveTo(pinX,base);
      ctx.lineTo(pinX-triW/2,base+triH);
      ctx.lineTo(pinX+triW/2,base+triH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle='rgba(216,207,196,1)';
      ctx.beginPath();
      ctx.moveTo(pinX-triW/2-6,base+triH);
      ctx.lineTo(pinX+triW/2+6,base+triH);
      ctx.stroke();

      // roller
      ctx.fillStyle='rgba(61,53,44,0.85)';
      ctx.beginPath();ctx.arc(rolX,base+triH-5,5,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(216,207,196,1)';
      ctx.beginPath();ctx.moveTo(rolX-14,base+triH+2);ctx.lineTo(rolX+14,base+triH+2);ctx.stroke();

      // Reactions
      const Lm=L;
      let R1=0,R2=0;
      if(state.load==='point'){
        const a=getA();
        R1=state.F*(Lm-a)/Lm;
        R2=state.F*a/Lm;
      }else{
        R1=R2=state.q*Lm/2;
      }
      const drawUp=(x,label)=>{
        ctx.strokeStyle='rgba(26,107,74,0.9)';
        ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(x,base+24);ctx.lineTo(x,base+6);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-6,base+12);ctx.lineTo(x,base+6);ctx.lineTo(x+6,base+12);ctx.stroke();
        ctx.fillStyle='rgba(107,95,82,1)';
        ctx.font='600 10px "Space Mono", monospace';
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(label,x,base+30);
      };
      drawUp(pinX+10,`R1≈${Math.round(R1)}N`);
      drawUp(rolX-10,`R2≈${Math.round(R2)}N`);
    }

    function drawLoad(x0,x1,beamY,Lpx){
      const L=state.L;
      ctx.strokeStyle='rgba(194,74,26,0.95)';
      ctx.fillStyle='rgba(194,74,26,0.95)';
      ctx.lineWidth=2;
      if(state.load==='point'){
        const a=getA();
        const ax=x0+(a/L)*Lpx;
        ctx.beginPath();ctx.moveTo(ax,beamY-34);ctx.lineTo(ax,beamY-6);ctx.stroke();
        ctx.beginPath();ctx.moveTo(ax-6,beamY-10);ctx.lineTo(ax,beamY-2);ctx.lineTo(ax+6,beamY-10);ctx.stroke();
        return;
      }
      if(state.load==='udl'){
        const n=10;
        for(let i=0;i<=n;i++){
          const t=i/n;
          const x=x0+t*Lpx;
          ctx.beginPath();ctx.moveTo(x,beamY-30);ctx.lineTo(x,beamY-6);ctx.stroke();
          ctx.beginPath();ctx.moveTo(x-5,beamY-10);ctx.lineTo(x,beamY-2);ctx.lineTo(x+5,beamY-10);ctx.stroke();
        }
        // small label
        ctx.fillStyle='rgba(107,95,82,1)';
        ctx.font='600 10px "Space Mono", monospace';
        ctx.textAlign='left';ctx.textBaseline='bottom';
        ctx.fillText(`q=${Math.round(state.q)} N/m`,x0,beamY-36);
        return;
      }
      // end moment (curved arrow at tip)
      const x=x1;
      const r=14;
      ctx.beginPath();
      ctx.arc(x,beamY-6,r,Math.PI*0.2,Math.PI*1.6,false);
      ctx.stroke();
      // arrow head
      ctx.beginPath();
      ctx.moveTo(x-3,beamY-6-r-2);
      ctx.lineTo(x-10,beamY-6-r+6);
      ctx.lineTo(x+1,beamY-6-r+6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle='rgba(107,95,82,1)';
      ctx.font='600 10px "Space Mono", monospace';
      ctx.textAlign='right';ctx.textBaseline='bottom';
      ctx.fillText(`M=${Math.round(state.M0)} N·m`,x1,beamY-36);
    }

    function draw(){
      const W=canvas.clientWidth||860;
      const H=canvas.clientHeight||360;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='rgba(250,248,244,1)';
      ctx.fillRect(0,0,W,H);

      const pad=18;
      const top=pad;
      const plotH=Math.floor(H*0.30);
      const beamH=H-plotH-pad*2-14;
      const beamY=top+Math.floor(beamH*0.50);
      const x0=pad+10;
      const x1=W-pad-10;
      const Lpx=x1-x0;
      const segs=110;

      // Deflection scaling
      const maxAbsW=computeMaxAbs(deflectionW,segs);
      const targetDef=beamH*0.36;
      const scale=clamp(targetDef/(Math.max(1e-6,maxAbsW)),0,1400);

      // Moment magnitude for coloring
      const maxAbsM=computeMaxAbs(momentM,segs);
      for(let i=0;i<segs;i++){
        const t0=i/segs, t1=(i+1)/segs;
        const xm=(t0+t1)/2*state.L;
        const r=maxAbsM>0?Math.abs(momentM(xm))/maxAbsM:0;
        ctx.fillStyle=rgba(26,107,74,0.08+0.55*r);
        const sx=x0+t0*Lpx;
        const sw=(t1-t0)*Lpx+1;
        ctx.fillRect(sx,beamY-10,sw,20);
      }
      ctx.strokeStyle='rgba(216,207,196,1)';
      ctx.lineWidth=1;
      ctx.strokeRect(x0,beamY-10,Lpx,20);

      // supports + reactions
      drawSupportAndReactions(x0,x1,beamY,Lpx);

      // deflection curve
      ctx.beginPath();
      for(let i=0;i<=segs;i++){
        const t=i/segs;
        const x=t*state.L;
        const w=deflectionW(x);
        const sx=x0+t*Lpx;
        const sy=beamY - w*scale;
        if(i===0)ctx.moveTo(sx,sy);
        else ctx.lineTo(sx,sy);
      }
      ctx.strokeStyle='rgba(26,107,74,0.9)';
      ctx.lineWidth=2;
      ctx.stroke();

      // load marker(s)
      drawLoad(x0,x1,beamY,Lpx);

      // probe (vertical guide + values)
      state.probe=clamp(state.probe,0,1);
      const px=x0+state.probe*Lpx;
      ctx.strokeStyle='rgba(61,53,44,0.25)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px,top+6);ctx.lineTo(px,beamY+38);ctx.stroke();

      const xProbe=state.probe*state.L;
      const wProbe=deflectionW(xProbe);
      const vProbe=shearV(xProbe);
      const mProbe=momentM(xProbe);

      // Diagram area (shear or moment)
      const plotY=H-pad-plotH;
      ctx.fillStyle='rgba(245,240,232,1)';
      ctx.fillRect(x0,plotY,Lpx,plotH);
      ctx.strokeStyle='rgba(216,207,196,1)';
      ctx.lineWidth=1;
      ctx.strokeRect(x0,plotY,Lpx,plotH);

      const fn=state.diagram==='V'?shearV:momentM;
      const maxAbs=computeMaxAbs(fn,segs);
      const midY=plotY+plotH/2;
      const amp=(plotH/2)-18;
      // axis
      ctx.strokeStyle='rgba(61,53,44,0.25)';
      ctx.beginPath();ctx.moveTo(x0,midY);ctx.lineTo(x1,midY);ctx.stroke();

      // fill diagram
      ctx.beginPath();
      ctx.moveTo(x0,midY);
      for(let i=0;i<=segs;i++){
        const t=i/segs;
        const x=t*state.L;
        const val=fn(x);
        const y=midY - (maxAbs>0?(val/maxAbs)*amp:0);
        const sx=x0+t*Lpx;
        ctx.lineTo(sx,y);
      }
      ctx.lineTo(x1,midY);
      ctx.closePath();
      ctx.fillStyle='rgba(26,107,74,0.12)';
      ctx.fill();
      ctx.strokeStyle='rgba(26,107,74,0.55)';
      ctx.stroke();

      // probe on plot
      ctx.strokeStyle='rgba(61,53,44,0.25)';
      ctx.beginPath();ctx.moveTo(px,plotY+6);ctx.lineTo(px,plotY+plotH-6);ctx.stroke();

      const t=getLabels();
      // labels
      ctx.fillStyle='rgba(107,95,82,1)';
      ctx.font='600 11px "Space Mono", monospace';
      ctx.textAlign='left';
      ctx.textBaseline='top';

      // max deflection (use sampling for simply supported)
      let wMin=0, xWMin=state.L;
      for(let i=0;i<=segs;i++){
        const x=(i/segs)*state.L;
        const w=deflectionW(x);
        if(w<wMin){wMin=w; xWMin=x;}
      }
      const wShow=state.support==='cantilever'?deflectionW(state.L):wMin;
      const wMm=Math.abs(wShow)*1000;
      const xPct=Math.round((xWMin/state.L)*100);

      const supportLabel=state.support==='cantilever'?(currentLang==='fr'?'Console':'Cantilever'):(currentLang==='fr'?'Appuis simples':'Simply supported');
      const loadLabel=state.load==='point'?(currentLang==='fr'?'Charge ponctuelle':'Point load'):(state.load==='udl'?(currentLang==='fr'?'Charge répartie':'Distributed load'):(currentLang==='fr'?'Couple en bout':'End moment'));

      ctx.fillText(`${supportLabel} · ${loadLabel}`,x0,top);
      ctx.fillText(`${t.tip}: ${wMm.toFixed(1)} mm${state.support==='simple'?` (x≈${xPct}%)`:''}`,x0,top+16);
      ctx.fillText(`w(x): ${(wProbe*1000).toFixed(1)} mm   V(x): ${vProbe.toFixed(0)} N   M(x): ${mProbe.toFixed(0)} N·m`,x0,top+32);
      ctx.fillText(`x=${Math.round(state.probe*100)}%`,x0,top+48);
      ctx.fillText(`EI=${state.EI}`,x0,top+64);

      ctx.fillText(`${state.diagram}(x)`,x0+6,plotY+6);
      if(maxAbs>0){
        const unit=state.diagram==='V'?'N':'N·m';
        ctx.textAlign='right';
        ctx.fillText(`max |${state.diagram}| ≈ ${Math.round(maxAbs)} ${unit}`,x1,plotY+6);
      }
    }

    function setAFromPointer(clientX){
      const rect=canvas.getBoundingClientRect();
      const x=(clientX-rect.left)/rect.width;
      const {min,max}=getPosClamp();
      state.a=clamp(x,min,max);
      const slA=ctrl.querySelector('#mech-a');
      if(slA)slA.value=String(Math.round(state.a*100));
      const vA=ctrl.querySelector('#mech-a-v');
      if(vA)vA.textContent=Math.round(state.a*100)+'%';
    }

    function setProbeFromPointer(clientX){
      const rect=canvas.getBoundingClientRect();
      const x=(clientX-rect.left)/rect.width;
      state.probe=clamp(x,0,1);
    }

    function onPointerDown(e){
      const rect=canvas.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width;
      const y=(e.clientY-rect.top)/rect.height;
      state.probe=clamp(x,0,1);
      // Drag only for point load, near beam zone.
      if(state.load==='point'&&y<0.62){
        state.drag=true;
        setAFromPointer(e.clientX);
        draw();
        canvas.setPointerCapture?.(e.pointerId);
        return;
      }
      draw();
    }
    function onPointerMove(e){
      if(state.drag){
        setAFromPointer(e.clientX);
        draw();
        return;
      }
      setProbeFromPointer(e.clientX);
      draw();
    }
    function onPointerUp(){
      state.drag=false;
    }

    function closeMech(){
      k.classList.remove('on');
      removeKonamiTabTrap();
      document.removeEventListener('keydown',handleEscape);
      window.removeEventListener('resize',handleResize);
      canvas.removeEventListener('pointerdown',onPointerDown);
      canvas.removeEventListener('pointermove',onPointerMove);
      canvas.removeEventListener('pointerup',onPointerUp);
      canvas.removeEventListener('pointercancel',onPointerUp);
      if(previouslyFocused&&typeof previouslyFocused.focus==='function')previouslyFocused.focus();
    }

    function handleEscape(e){
      if(e.key==='Escape'&&k.classList.contains('on'))closeMech();
    }

    function handleResize(){
      resizeCanvas();
      draw();
    }

    renderControls();
    resizeCanvas();
    draw();
    document.getElementById('konami-close')?.focus();
    canvas.addEventListener('pointerdown',onPointerDown);
    canvas.addEventListener('pointermove',onPointerMove);
    canvas.addEventListener('pointerup',onPointerUp);
    canvas.addEventListener('pointercancel',onPointerUp);
    window.addEventListener('resize',handleResize,{passive:true});
    document.addEventListener('keydown',handleEscape);
    document.getElementById('konami-close').onclick=closeMech;
  }
})();
