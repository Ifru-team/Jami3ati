import { DisciplineKey, Institution, University } from '../types';

export interface CareerProfile {
  id: string;
  title_ar: string;
  title_fr: string;
  sectors_ar: string;
  sectors_fr: string;
  skills_ar: string[];
  skills_fr: string[];
  demand_level_ar: string;
  demand_level_fr: string;
}

const DISCIPLINE_CAREERS: Record<DisciplineKey, CareerProfile[]> = {
  engineering: [
    {
      id: 'eng-software-ai',
      title_ar: 'مهندس برمجيات والذكاء الاصطناعي',
      title_fr: 'Ingénieur Logiciel, Cloud & IA',
      sectors_ar: 'أقطاب الأوفشورينغ (Technopolis, Casanearshore)، الأبناك، والاتصالات',
      sectors_fr: 'Offshoring (Technopolis, Casanearshore), Banques & Télécoms',
      skills_ar: ['هندسة البرمجيات', 'Python / Java / Cloud', 'الذكاء الاصطناعي والبيانات', 'الأمن السيبراني'],
      skills_fr: ['Architecture logicielle', 'Python / Java / Cloud', 'IA & Data Science', 'Cybersécurité'],
      demand_level_ar: 'طلب مرتفع جداً بالمغرب',
      demand_level_fr: 'Très forte demande au Maroc',
    },
    {
      id: 'eng-industrial',
      title_ar: 'مهندس صناعي وسلاسل الإمداد (Supply Chain)',
      title_fr: 'Ingénieur Industriel & Supply Chain',
      sectors_ar: 'صناعة السيارات (طنجة، القنيطرة)، الطيران (النواصر)، ومجموعة OCP',
      sectors_fr: 'Automobile (Tanger, Kénitra), Aéronautique (Nouaceur) & Groupe OCP',
      skills_ar: ['إدارة الإنتاج واللين (Lean Six Sigma)', 'النمذجة الصناعية CAD', 'اللوجستيك الدولي', 'ضبط الجودة ISO'],
      skills_fr: ['Lean Six Sigma', 'CAO / Conception industrielle', 'Logistique & Supply Chain', 'Qualité ISO'],
      demand_level_ar: 'طلب مرتفع بالمنظومات الصناعية',
      demand_level_fr: 'Forte demande industrielle',
    },
    {
      id: 'eng-energy-infra',
      title_ar: 'مهندس الطاقات المتجددة والبنية التحتية',
      title_fr: 'Ingénieur Énergies Renouvelables & BTP',
      sectors_ar: 'مشاريع الطاقة الشمسية والريحية، الوكالة الوطنية للماء والكهرباء (ONEE)، ومكاتب الدراسات',
      sectors_fr: 'Projets solaires/éoliens, ONEE, Bureaux d’études & Grands travaux',
      skills_ar: ['الهندسة الكهربائية والطاقية', 'إدارة المشاريع الكبرى', 'الأنظمة المدمجة', 'الاستدامة البيئية'],
      skills_fr: ['Génie électrique & énergétique', 'Gestion de grands projets', 'Systèmes embarqués', 'Efficacité énergétique'],
      demand_level_ar: 'طلب متنامٍ (استعدادات 2030)',
      demand_level_fr: 'Demande en forte croissance (Horizon 2030)',
    },
  ],
  medicine: [
    {
      id: 'med-general-specialist',
      title_ar: 'طبيب عام أو طبيب مقيم متخصص',
      title_fr: 'Médecin Généraliste ou Médecin Résident Spécialiste',
      sectors_ar: 'المستشفيات الجامعية (CHU)، المراكز الصحية العمومية، والمصحات الخاصة',
      sectors_fr: 'CHU, Ministère de la Santé & Cliniques privées',
      skills_ar: ['التشخيص السريري', 'تدبير الحالات المستعجلة', 'بروتوكولات العلاج الحديثة', 'التواصل الطبي مع المرضى'],
      skills_fr: ['Diagnostic clinique', 'Médecine d’urgence', 'Protocoles thérapeutiques', 'Relation patient'],
      demand_level_ar: 'حاجة وطنية أولوية قصوى',
      demand_level_fr: 'Priorité nationale absolue',
    },
    {
      id: 'med-pharma',
      title_ar: 'صيدلي أو مسؤول الجودة في الصناعات الدوائية',
      title_fr: 'Pharmacien d’Officine ou Responsable Qualité Pharmaceutique',
      sectors_ar: 'الصيدليات، مختبرات تصنيع الأدوية (الدار البيضاء، برشيد)، والبحث السريري',
      sectors_fr: 'Officines, Industrie pharmaceutique (Casablanca, Berrechid) & R&D',
      skills_ar: ['علم الأدوية والسموم', 'معايير التصنيع الجيد (GMP)', 'التحاليل المخبرية', 'تيقظ الأدوية'],
      skills_fr: ['Pharmacologie & Toxicologie', 'Normes GMP / Assurance qualité', 'Biologie médicale', 'Pharmacovigilance'],
      demand_level_ar: 'طلب مستقر ومرتفع',
      demand_level_fr: 'Demande stable et soutenue',
    },
    {
      id: 'med-public-health',
      title_ar: 'باحث في الصحة العمومية والوبائيات',
      title_fr: 'Chercheur en Santé Publique & Épidémiologie',
      sectors_ar: 'المديريات الجهوية للصحة، معاهد البحث الطبي، والمنظمات الصحية الدولية',
      sectors_fr: 'Directions régionales de santé, Instituts de recherche & ONG santé',
      skills_ar: ['علم الأوبئة والإحصاء الحيوي', 'إدارة البرامج الصحية', 'البحث العلمي الطبي', 'الصحة الرقمية'],
      skills_fr: ['Épidémiologie & Biostatistiques', 'Gestion des systèmes de santé', 'Recherche clinique', 'E-santé'],
      demand_level_ar: 'طلب متصاعد مع تعميم الحماية الاجتماعية',
      demand_level_fr: 'En hausse avec la généralisation AMO',
    },
  ],
  economics: [
    {
      id: 'eco-audit-finance',
      title_ar: 'مدقق مالي ومراقب تسيير (Audit & Contrôle)',
      title_fr: 'Auditeur Financier & Contrôleur de Gestion',
      sectors_ar: 'مكاتب التدقيق الدولية (Big Four)، الأبناك المغربية، والمديريات المالية للشركات',
      sectors_fr: 'Cabinets d’audit (Big Four), Banques marocaines & Directions financières',
      skills_ar: ['المحاسبة والمعايير IFRS', 'التدقيق الداخلي والضريبي', 'النمذجة المالية (Excel / BI)', 'تدبير المخاطر'],
      skills_fr: ['Normes comptables & IFRS', 'Audit interne & fiscalité', 'Modélisation financière & BI', 'Gestion des risques'],
      demand_level_ar: 'طلب مرتفع جداً بالدار البيضاء والرباط',
      demand_level_fr: 'Très forte demande (Casablanca, Rabat)',
    },
    {
      id: 'eco-marketing-digital',
      title_ar: 'مدير التسويق الرقمي وتطوير الأعمال',
      title_fr: 'Responsable Marketing Digital & Business Development',
      sectors_ar: 'التجارة الإلكترونية، شركات الاتصالات، وكالات التواصل، والمجموعات التجارية',
      sectors_fr: 'E-commerce, Télécoms, Agences digitales & Grande distribution',
      skills_ar: ['استراتيجيات النمو الرقمي', 'تحليل سلوك المستهلك', 'إدارة العلامة التجارية', 'التفاوض التجاري'],
      skills_fr: ['Growth & Marketing digital', 'Analytics & CRM', 'Stratégie de marque', 'Négociation commerciale'],
      demand_level_ar: 'طلب قوي وسريع النمو',
      demand_level_fr: 'Forte croissance',
    },
    {
      id: 'eco-hr-consulting',
      title_ar: 'مستشار الموارد البشرية والتنظيم المقاولاتي',
      title_fr: 'Consultant RH & Organisation des Entreprises',
      sectors_ar: 'الشركات متعددة الجنسيات، المناطق الصناعية الحرة، ومكاتب الاستشارة',
      sectors_fr: 'Multinationales, Zones industrielles & Cabinets de conseil',
      skills_ar: ['قانون الشغل المغربي', 'تدبير الكفاءات والتوظيف', 'أنظمة الرواتب (SIRH)', 'التواصل القيادي'],
      skills_fr: ['Droit social marocain', 'Gestion des talents', 'Outils SIRH & Paie', 'Leadership & Coaching'],
      demand_level_ar: 'طلب مستمر بالمقاولات الكبرى',
      demand_level_fr: 'Demande constante en grandes entreprises',
    },
  ],
  science_tech: [
    {
      id: 'sci-data-dev',
      title_ar: 'مطور تطبيقات الويب ومحلل بيانات تطبيقية',
      title_fr: 'Développeur Full-Stack & Analyste de Données',
      sectors_ar: 'شركات البرمجيات، المقاولات الناشئة، ومصالح تكنولوجيا المعلومات بالإدارات',
      sectors_fr: 'Éditeurs logiciels, Startups & Directions SI',
      skills_ar: ['تطوير الويب والهاتف', 'قواعد البيانات SQL / NoSQL', 'تحليل المعطيات الإحصائية', 'الخوارزميات'],
      skills_fr: ['Développement Web & Mobile', 'Bases de données SQL / NoSQL', 'Statistiques appliquées', 'Algorithmique'],
      demand_level_ar: 'طلب مرتفع عبر جميع الجهات',
      demand_level_fr: 'Forte demande nationale',
    },
    {
      id: 'sci-lab-quality',
      title_ar: 'إطار تقني في مختبرات التحاليل ومراقبة الجودة',
      title_fr: 'Cadre de Laboratoire & Contrôle Qualité Industriel',
      sectors_ar: 'الصناعات الغذائية والكيماوية، قطاع المعادن، ومختبرات المعايرة والبيئة',
      sectors_fr: 'Agroalimentaire, Chimie, Mines & Laboratoires d’analyses',
      skills_ar: ['الكيمياء التحليلية والميكروبيولوجيا', 'معايير السلامة والجودة', 'أجهزة القياس المخبرية', 'تحرير التقارير التقنية'],
      skills_fr: ['Chimie analytique & Microbiologie', 'Normes Qualité & HSE', 'Instrumentation de laboratoire', 'Rédaction technique'],
      demand_level_ar: 'طلب مستقر بالصناعات التحويلية',
      demand_level_fr: 'Demande régulière en industrie',
    },
    {
      id: 'sci-teaching-research',
      title_ar: 'أستاذ باحث أو أستاذ العلوم بالتعليم الثانوي',
      title_fr: 'Enseignant-Chercheur ou Professeur des Sciences',
      sectors_ar: 'الجامعات العمومية، مراكز البحث العلمي (CNRST)، ووزارة التربية الوطنية',
      sectors_fr: 'Universités publiques, CNRST & Ministère de l’Éducation Nationale',
      skills_ar: ['البيداغوجيا العلمية', 'منهجية البحث التجريبي', 'النمذجة الرياضية', 'النشر العلمي'],
      skills_fr: ['Pédagogie scientifique', 'Méthodologie de recherche', 'Modélisation mathématique', 'Publication scientifique'],
      demand_level_ar: 'مسار مفتوح عبر المباريات الوطنية',
      demand_level_fr: 'Recrutement régulier sur concours',
    },
  ],
  law: [
    {
      id: 'law-judiciary-bar',
      title_ar: 'محامٍ، قاضٍ، أو موثق (عبر المباريات الوطنية)',
      title_fr: 'Avocat, Magistrat ou Notaire (sur concours nationaux)',
      sectors_ar: 'هيئات المحامين، المجلس الأعلى للسلطة القضائية، ومكاتب التوثيق والمحافظة العقارية',
      sectors_fr: 'Barreaux du Maroc, Magistrature, Notariat & Conservation Foncière',
      skills_ar: ['الصياغة القانونية الدقيقة', 'المساطر المدنية والجنائية', 'القانون العقاري والتجاري', 'المرافعة والتحليل التشريعي'],
      skills_fr: ['Rédaction juridique', 'Procédures civile & pénale', 'Droit foncier & des affaires', 'Plaidoirie'],
      demand_level_ar: 'مسار مهني كلاسيكي وحيوي',
      demand_level_fr: 'Filière juridique réglementée clé',
    },
    {
      id: 'law-corporate-counsel',
      title_ar: 'مستشار قانوني ومختص في الصفقات والامتثال',
      title_fr: 'Juriste d’Entreprise, Marchés Publics & Conformité',
      sectors_ar: 'المقاولات الكبرى، المؤسسات العمومية، الأبناك، وشركات التأمين',
      sectors_fr: 'Grandes entreprises, Établissements publics, Banques & Assurances',
      skills_ar: ['قانون الشركات والعقود', 'تدبير الصفقات العمومية', 'الامتثال وحماية المعطيات (CNDP)', 'الوساطة والتحكيم'],
      skills_fr: ['Droit des sociétés & contrats', 'Marchés publics', 'Conformité & Protection des données', 'Arbitrage'],
      demand_level_ar: 'طلب متزايد في القطاع الخاص',
      demand_level_fr: 'Demande croissante en entreprise',
    },
    {
      id: 'law-public-admin',
      title_ar: 'متصرف بالإدارات العمومية والجماعات الترابية',
      title_fr: 'Administrateur Public & Collectivités Territoriales',
      sectors_ar: 'الوزارات، العمالات والأقاليم، المجالس الجهوية، والهيئات الدبلوماسية',
      sectors_fr: 'Ministères, Collectivités territoriales, Régions & Diplomatie',
      skills_ar: ['القانون الإداري والمالية العمومية', 'الحكامة الترابية', 'إعداد السياسات العمومية', 'التواصل باللغتين العربية والفرنسية'],
      skills_fr: ['Droit administratif & Finances publiques', 'Gouvernance territoriale', 'Politiques publiques', 'Bilinguisme administratif'],
      demand_level_ar: 'توظيف منتظم بالمباريات العمومية',
      demand_level_fr: 'Concours de la fonction publique',
    },
  ],
  humanities: [
    {
      id: 'hum-education-training',
      title_ar: 'أستاذ التعليم أو مكوّن في اللغات والتواصل',
      title_fr: 'Professeur de l’Enseignement ou Formateur en Langues',
      sectors_ar: 'الأكاديميات الجهوية للتربية والتكوين، معاهد اللغات، ومؤسسات التعليم الخصوصي',
      sectors_fr: 'AREF / Éducation nationale, Centres de langues & Enseignement privé',
      skills_ar: ['ديداكتيك اللغات والعلوم الإنسانية', 'هندسة التكوين', 'التنشيط التربوي', 'الإلقاء والكتابة الأكاديمية'],
      skills_fr: ['Didactique des langues', 'Ingénierie pédagogique', 'Animation éducative', 'Expression académique'],
      demand_level_ar: 'طلب مستمر بقطاع التربية والتكوين',
      demand_level_fr: 'Recrutement continu dans l’éducation',
    },
    {
      id: 'hum-media-translation',
      title_ar: 'صحفي، مترجم محلف، أو مكلف بالتواصل المؤسساتي',
      title_fr: 'Journaliste, Traducteur ou Chargé de Communication',
      sectors_ar: 'المؤسسات الإعلامية، مكاتب الترجمة، الإدارات العمومية، ووكالات التواصل الثقافي',
      sectors_fr: 'Médias, Bureaux de traduction, Institutions & Agences de communication',
      skills_ar: ['الترجمة التحريرية متعددة اللغات', 'الصحافة الرقمية وصناعة المحتوى', 'العلاقات العامة', 'التحرير المؤسساتي'],
      skills_fr: ['Traduction multilingue', 'Journalisme & Rédaction web', 'Relations publiques', 'Communication institutionnelle'],
      demand_level_ar: 'فرص متنوعة بالإعلام والثقافة',
      demand_level_fr: 'Débouchés variés médias & culture',
    },
  ],
};

export function getCareerProfilesForItem(
  item: University | Institution,
  itemType: 'university' | 'institution'
): CareerProfile[] {
  const code = item.code.toUpperCase();

  // Specific curated matches for flagship schools first
  if (code.includes('ENSIAS')) {
    return [
      DISCIPLINE_CAREERS.engineering[0],
      DISCIPLINE_CAREERS.science_tech[0],
      {
        id: 'ensias-cyber-arch',
        title_ar: 'مهندس أمن سيبراني وبنيات سحابية (Cloud & SecOps)',
        title_fr: 'Ingénieur Cybersécurité & Architecture Cloud',
        sectors_ar: 'المديرية العامة لأمن نظم المعلومات، الأبناك المركزية والتجارية، وشركات التكنولوجيا',
        sectors_fr: 'Banques, Secteur stratégique, Opérateurs Télécoms & ESN',
        skills_ar: ['اختبار الاختراق وSOC', 'Kubernetes / Cloud', 'حماية الشبكات الحساسة', 'التشفير'],
        skills_fr: ['Pentest & SOC', 'Kubernetes & Cloud Native', 'Sécurité des infrastructures', 'Cryptographie'],
        demand_level_ar: 'ندرة وطنية وطلب استراتيجي',
        demand_level_fr: 'Profil très recherché & stratégique',
      },
    ];
  }

  if (code.includes('EMI') || code.includes('ENSEM') || code.includes('ENSAM') || code.includes('ENSA')) {
    return [
      DISCIPLINE_CAREERS.engineering[0],
      DISCIPLINE_CAREERS.engineering[1],
      DISCIPLINE_CAREERS.engineering[2],
    ];
  }

  if (code.includes('ENCG')) {
    return DISCIPLINE_CAREERS.economics;
  }

  if (code.includes('FMP')) {
    return DISCIPLINE_CAREERS.medicine;
  }

  if (code.includes('FSJES')) {
    return [
      DISCIPLINE_CAREERS.law[0],
      DISCIPLINE_CAREERS.law[1],
      DISCIPLINE_CAREERS.economics[0],
    ];
  }

  const discs = item.disciplines && item.disciplines.length > 0
    ? item.disciplines
    : itemType === 'university'
    ? (['engineering', 'economics', 'science_tech', 'law'] as DisciplineKey[])
    : (['science_tech'] as DisciplineKey[]);

  const seen = new globalThis.Set<string>();
  const collected: CareerProfile[] = [];

  discs.forEach((d) => {
    const list = DISCIPLINE_CAREERS[d] || [];
    list.forEach((profile) => {
      if (!seen.has(profile.id) && collected.length < 4) {
        seen.add(profile.id);
        collected.push(profile);
      }
    });
  });

  return collected;
}
