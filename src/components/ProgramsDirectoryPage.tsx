import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Layers,
  Clock,
  Briefcase,
  Sparkles,
  Building2,
  CheckCircle2,
  GraduationCap,
  Cpu,
  TrendingUp,
  Scale,
  Stethoscope,
  Atom,
  X,
} from 'lucide-react';
import { University, Institution, Language } from '../types';

interface Props {
  universities: University[];
  institutions: Institution[];
  lang: Language;
  onBackToHome: () => void;
  onSelectInstitution: (inst: Institution) => void;
  onToggleLanguage?: () => void;
}

export interface AccreditedDiploma {
  id: string;
  code: string;
  title_ar: string;
  title_fr: string;
  degree_level: 'license' | 'master' | 'engineering' | 'dut' | 'doctorate';
  degree_level_ar: string;
  degree_level_fr: string;
  duration_years: number;
  discipline: string;
  discipline_ar: string;
  discipline_fr: string;
  prerequisites_ar: string;
  prerequisites_fr: string;
  career_outcomes_ar: string[];
  career_outcomes_fr: string[];
  sectors_ar: string;
  sectors_fr: string;
  key_skills_ar: string[];
  key_skills_fr: string[];
  institution_codes: string[];
}

export const SAMPLE_DIPLOMAS: AccreditedDiploma[] = [
  {
    id: 'dip-1',
    code: 'ING-INFO',
    title_ar: 'دبلوم مهندس دولة في المعلوميات والذكاء الاصطناعي',
    title_fr: 'Diplôme d’Ingénieur d’État en Informatique & IA',
    degree_level: 'engineering',
    degree_level_ar: 'شهادة مهندس دولة (BAC+5)',
    degree_level_fr: 'Ingénieur d’État (BAC+5)',
    duration_years: 5,
    discipline: 'engineering',
    discipline_ar: 'هندسة وتكنولوجيا',
    discipline_fr: 'Ingénierie & Tech',
    prerequisites_ar: 'الأقسام التحضيرية للمدارس العليا (CNC) أو السنتين التحضيريتين المدمجتين (AP) أو انتقاء موازٍ بعد DEUG/DUT',
    prerequisites_fr: 'Classes Préparatoires (CNC) ou Cycle Préparatoire Intégré (AP) / Passerelle DEUG/DUT',
    career_outcomes_ar: [
      'مهندس برمجيات والأنظمة السحابية (Cloud & DevOps Architect)',
      'مهندس ذكاء اصطناعي ونظم التعلم الآلي (AI / ML Engineer)',
      'مستشار التحول الرقمي والأمن المعلوماتي (Cybersecurity Consultant)',
    ],
    career_outcomes_fr: [
      'Ingénieur Logiciel & Architecte Cloud',
      'Ingénieur IA & Machine Learning',
      'Consultant Cybersécurité & Transformation Digitale',
    ],
    sectors_ar: 'شركات التكنولوجيا، المؤسسات البنكية والمالية، مشغلو الاتصالات، ومراكز البحث والابتكار (تكنوبوليس الرباط، كازانيرشور، وطنجة المتوسط)',
    sectors_fr: 'ESN, Banques & Fintech, Télécoms, Centres R&D (Technopolis Rabat, Casanearshore, Tanger Med)',
    key_skills_ar: ['معمارية البرمجيات الحديثة', 'التعلم الآلي والبيانات الضخمة', 'الحوسبة السحابية وأمن النظم'],
    key_skills_fr: ['Architecture logicielle', 'Machine Learning & Big Data', 'Cloud & DevOps'],
    institution_codes: ['ENSA', 'ENSIAS', 'EMI', 'INPT', 'FST'],
  },
  {
    id: 'dip-2',
    code: 'ING-CIVIL',
    title_ar: 'دبلوم مهندس دولة في الهندسة المدنية والبناء والأشغال العمومية',
    title_fr: 'Diplôme d’Ingénieur d’État en Génie Civil & BTP',
    degree_level: 'engineering',
    degree_level_ar: 'شهادة مهندس دولة (BAC+5)',
    degree_level_fr: 'Ingénieur d’État (BAC+5)',
    duration_years: 5,
    discipline: 'engineering',
    discipline_ar: 'هندسة وتكنولوجيا',
    discipline_fr: 'Ingénierie & Tech',
    prerequisites_ar: 'الأقسام التحضيرية (CPGE/CNC) أو انتقاء موازٍ لحاملي DEUP/DUT/Licence',
    prerequisites_fr: 'Classes Préparatoires (CNC) ou Passerelles (DUT/DEUG/Licence)',
    career_outcomes_ar: [
      'مهندس دراسات وتصميم المنشآت الكبرى والجسور (BIM Engineer)',
      'مدير مشاريع البناء والتهيئة الحضرية والموانئ',
      'مهندس مراقبة الجودة والسلامة ومكاتب التدقيق الهندسي',
    ],
    career_outcomes_fr: [
      'Ingénieur Calcul & Structures (BIM)',
      'Directeur de Travaux & Projets d’Infrastructures',
      'Ingénieur Contrôle Technique & Audit BTP',
    ],
    sectors_ar: 'مشاريع البنيات التحتية الكبرى بالمغرب (القطار فائق السرعة، الموانئ، السدود، ملاعب مونديال 2030)، مكاتب الدراسات، وشركات البناء الكبرى',
    sectors_fr: 'Grands chantiers nationaux (LGV, Ports, Barrages, Stades 2030), Bureaux d’études & Entreprises BTP',
    key_skills_ar: ['حساب المنشآت الخرسانية والمعدنية', 'النمذجة الرقمية BIM', 'تدبير صفقات الأشغال والمشاريع'],
    key_skills_fr: ['Calcul des structures', 'Modélisation BIM', 'Gestion de chantiers'],
    institution_codes: ['EMI', 'EHTP', 'ENSA', 'FST'],
  },
  {
    id: 'dip-3',
    code: 'ING-INDUS',
    title_ar: 'دبلوم مهندس دولة في الهندسة الصناعية واللوجستيك الميكانيكي',
    title_fr: 'Diplôme d’Ingénieur d’État en Génie Industriel & Supply Chain',
    degree_level: 'engineering',
    degree_level_ar: 'شهادة مهندس دولة (BAC+5)',
    degree_level_fr: 'Ingénieur d’État (BAC+5)',
    duration_years: 5,
    discipline: 'engineering',
    discipline_ar: 'هندسة وتكنولوجيا',
    discipline_fr: 'Ingénierie & Tech',
    prerequisites_ar: 'مباراة CNC بعد الأقسام التحضيرية أو ولوج السلك التحضيري المدمج لمدارس ENSA و ENSAM',
    prerequisites_fr: 'Concours CNC ou Cycle Préparatoire ENSA / ENSAM',
    career_outcomes_ar: [
      'مهندس إنتاج وتطوير خطوط التصنيع (Lean Manufacturing)',
      'مسؤول سلاسل التوريد واللوجستيك الدولي (Supply Chain Manager)',
      'مهندس جودة وضبط المعايير الصناعية (Quality Assurance)',
    ],
    career_outcomes_fr: [
      'Ingénieur Production & Lean Manufacturing',
      'Responsable Supply Chain & Logistique Globale',
      'Ingénieur Qualité & Amélioration Continue',
    ],
    sectors_ar: 'صناعة السيارات والطيران (القنيطرة، طنجة، النواصر)، مجمع الفوسفاط (OCP)، المجموعات الغذائية والموانئ',
    sectors_fr: 'Industrie automobile & aéronautique (Tanger Automotive City, Kénitra, Midparc), OCP & Agroalimentaire',
    key_skills_ar: ['تدبير الإنتاج واللين 6 سيجما', 'تخطيط سلاسل الإمداد ERP', 'الأتمتة الصناعية والروبوتات'],
    key_skills_fr: ['Lean Six Sigma', 'ERP & Supply Chain', 'Automatisme industriel'],
    institution_codes: ['ENSAM', 'ENSA', 'EMI', 'FST'],
  },
  {
    id: 'dip-4',
    code: 'ING-ENERGIE',
    title_ar: 'دبلوم مهندس دولة في الطاقات المتجددة والنجاعة الطاقية',
    title_fr: 'Diplôme d’Ingénieur en Énergies Renouvelables & Efficacité Énergétique',
    degree_level: 'engineering',
    degree_level_ar: 'شهادة مهندس دولة (BAC+5)',
    degree_level_fr: 'Ingénieur d’État (BAC+5)',
    duration_years: 5,
    discipline: 'engineering',
    discipline_ar: 'هندسة وتكنولوجيا',
    discipline_fr: 'Ingénierie & Tech',
    prerequisites_ar: 'مباراة وطنية مشتركة (CNC) أو السنتين التحضيريتين بمدارس المهندسين أو كليات العلوم والتقنيات',
    prerequisites_fr: 'Concours CNC ou Cycle Préparatoire ENSA/FST',
    career_outcomes_ar: [
      'مهندس محطات الطاقة الشمسية والريحية',
      'مستشار النجاعة الطاقية والتدقيق البيئي للمصانع والمباني',
      'مهندس تطوير مشاريع الهيدروجين الأخضر وخفض الانبعاثات',
    ],
    career_outcomes_fr: [
      'Ingénieur Centrales Solaires & Éoliennes',
      'Auditeur Efficacité Énergétique',
      'Chef de projet Hydrogène Vert & Décarbonation',
    ],
    sectors_ar: 'الوكالة المغربية للطاقة المستدامة (MASEN)، المكتب الوطني للكهرباء (ONEE)، مزارع الرياح، ومصانع الفوسفاط والصلب',
    sectors_fr: 'MASEN, ONEE, Parcs éoliens, OCP & Entreprises de transition écologique',
    key_skills_ar: ['تصميم محطات الطاقة النظيفة', 'التدقيق الطاقي الصناعي', 'أنظمة التخزين والشبكات الذكية'],
    key_skills_fr: ['Ingénierie solaire & éolienne', 'Audit énergétique', 'Smart Grids'],
    institution_codes: ['ENSA', 'FST', 'EMI', 'ENSAM'],
  },
  {
    id: 'dip-5',
    code: 'ENCG-MGT',
    title_ar: 'دبلوم المدارس الوطنية للتجارة والتسيير (ENCG)',
    title_fr: 'Diplôme des Écoles Nationales de Commerce & de Gestion (ENCG)',
    degree_level: 'master',
    degree_level_ar: 'دبلوم وطني (BAC+5)',
    degree_level_fr: 'Diplôme Grande École (BAC+5)',
    duration_years: 5,
    discipline: 'economics',
    discipline_ar: 'اقتصاد وتدبير',
    discipline_fr: 'Commerce & Gestion',
    prerequisites_ar: 'بكالوريا اقتصادية أو علمية + انتقاء أولي واجتياز مباراة TAFEM الوطنية الموحدة',
    prerequisites_fr: 'Baccalauréat Économique ou Scientifique + Concours TAFEM',
    career_outcomes_ar: [
      'مدقق مالي ومراقب تسيير بمكاتب الاستشارة الدولية (Big Four)',
      'مدير تسويق رقمي وتطوير الأعمال والاستراتيجية التجارية',
      'مسؤول الموارد البشرية وإدارة الكفاءات',
    ],
    career_outcomes_fr: [
      'Auditeur Financier & Contrôleur de Gestion (Big Four)',
      'Chef de Produit & Business Developer',
      'Responsable Ressources Humaines',
    ],
    sectors_ar: 'الأبناك ومؤسسات الاستثمار، الشركات متعددة الجنسيات، مكاتب التدقيق المحاسبي، وشركات التجارة والتوزيع',
    sectors_fr: 'Banques, Multinationales, Cabinets d’audit & conseil, Grande distribution',
    key_skills_ar: ['الافتحاص المالي والتسيير', 'التسويق الاستراتيجي', 'قانون الأعمال والتفاوض التجاري'],
    key_skills_fr: ['Audit financier', 'Marketing digital', 'Négociation & Stratégie'],
    institution_codes: ['ENCG', 'FSJES'],
  },
  {
    id: 'dip-6',
    code: 'MST-BD',
    title_ar: 'الماستر المتخصص في علوم البيانات والأمن السيبراني',
    title_fr: 'Master Spécialisé en Data Science & Cybersécurité',
    degree_level: 'master',
    degree_level_ar: 'الماستر المتخصص (BAC+5)',
    degree_level_fr: 'Master Spécialisé (BAC+5)',
    duration_years: 2,
    discipline: 'engineering',
    discipline_ar: 'هندسة وتكنولوجيا',
    discipline_fr: 'Ingénierie & Tech',
    prerequisites_ar: 'إجازة في المعلوميات، الرياضيات التطبيقية، أو دبلوم معادل + دراسة الملف وامتحان كتابي/شفوي',
    prerequisites_fr: 'Licence en Informatique / Mathématiques + Épreuve écrite & entretien',
    career_outcomes_ar: [
      'عالم بيانات ومحلل ذكاء الأعمال (Data Scientist & BI)',
      'محلل أمن سيبراني واستجابة للحوادث (SOC / Incident Responder)',
      'مهندس نظم التنقيب وتأمين البنيات السحابية',
    ],
    career_outcomes_fr: [
      'Data Scientist & Analyste BI',
      'Analyste Cybersécurité / SOC',
      'Ingénieur Cloud & Sécurité des données',
    ],
    sectors_ar: 'المؤسسات البنكية، شركات الاتصالات، المديرية العامة لأمن نظم المعلومات (DGSSI)، ومراكز البيانات',
    sectors_fr: 'Secteur bancaire, Télécoms, ESN, Cabinets de cybersécurité',
    key_skills_ar: ['تحليل البيانات بالبايثون و R', 'اختبار الاختراق وأمن الشبكات', 'الذكاء الاصطناعي التوليدي'],
    key_skills_fr: ['Data Science & Python', 'Pentesting & Sécurité réseau', 'IA générative'],
    institution_codes: ['FST', 'FS', 'ENSIAS'],
  },
  {
    id: 'dip-7',
    code: 'MST-LOG',
    title_ar: 'الماستر في تدبير اللوجستيك وسلاسل الإمداد والتجارة الدولية',
    title_fr: 'Master en Management Logistique, Supply Chain & Commerce International',
    degree_level: 'master',
    degree_level_ar: 'الماستر المهني (BAC+5)',
    degree_level_fr: 'Master Professionnel (BAC+5)',
    duration_years: 2,
    discipline: 'economics',
    discipline_ar: 'اقتصاد وتدبير',
    discipline_fr: 'Économie & Gestion',
    prerequisites_ar: 'إجازة في التدبير، الاقتصاد، أو الهندسة اللوجستيكية + دراسة الملف ومقابلة شفوية',
    prerequisites_fr: 'Licence en Gestion, Économie ou Logistique + Sélection sur dossier',
    career_outcomes_ar: [
      'مدير العمليات المينائية ومناطق التبادل الحر',
      'مسؤول المشتريات الدولية وتنسيق الشحن والجمارك',
      'مستشار تحسين سلاسل التوريد وتوزيع السلع',
    ],
    career_outcomes_fr: [
      'Manager d’opérations portuaires & zones franches',
      'Responsable Achats Internationaux & Transit',
      'Consultant Optimisation des Flux',
    ],
    sectors_ar: 'مركب ميناء طنجة المتوسط، موانئ الدار البيضاء وأكادير، شركات النقل الجوي والبحري، والجمارك المغربية',
    sectors_fr: 'Tanger Med Port, Ports de Casablanca & Agadir, Fret aérien/maritime & Douanes',
    key_skills_ar: ['تدبير المساحات اللوجستيكية', 'مساطر الاستيراد والتصدير', 'تتبع الشحنات بالأنظمة الرقمية'],
    key_skills_fr: ['Gestion des flux', 'Procédures douanières', 'Supply Chain Analytics'],
    institution_codes: ['ENCG', 'FSJES', 'EST'],
  },
  {
    id: 'dip-8',
    code: 'LIC-ECO',
    title_ar: 'الإجازة الوطنية في العلوم الاقتصادية والتدبير (المسار المالي والمحاسبي)',
    title_fr: 'Licence Nationale en Sciences Économiques & Gestion',
    degree_level: 'license',
    degree_level_ar: 'الإجازة الوطنية (BAC+3)',
    degree_level_fr: 'Licence Nationale (BAC+3)',
    duration_years: 3,
    discipline: 'economics',
    discipline_ar: 'اقتصاد وتدبير',
    discipline_fr: 'Économie & Gestion',
    prerequisites_ar: 'شهادة البكالوريا في العلوم الاقتصادية، التدبير المحاسباتي، أو العلوم التجريبية والرياضية (استقطاب مفتوح بكليات FSJES)',
    prerequisites_fr: 'Baccalauréat Éco, Gestion, Sciences Expérimentales ou Maths (Accès ouvert en FSJES)',
    career_outcomes_ar: [
      'مكلف بالمحاسبة والجبايات بالشركات والمقاولات',
      'مستشار زبناء أو مسؤول عمليات بالوكالات البنكية',
      'إمكانية اجتياز مباريات الماستر، مباريات وزارة المالية، والوظيفة العمومية',
    ],
    career_outcomes_fr: [
      'Comptable & Chargé fiscal en entreprise',
      'Conseiller clientèle en agence bancaire',
      'Passerelle vers Master ou Concours de la fonction publique',
    ],
    sectors_ar: 'الأبناك، شركات التأمين، مكاتب المحاسبة والافتحاص، المديرية العامة للضرائب، والشركات الوطنية',
    sectors_fr: 'Banques, Assurances, Cabinets comptables, DGI & PME nationales',
    key_skills_ar: ['المحاسبة العامة والتحليلية', 'التحليل المالي للشركات', 'التشريع الضريبي وقانون الشركات'],
    key_skills_fr: ['Comptabilité générale & analytique', 'Analyse financière', 'Fiscalité marocaine'],
    institution_codes: ['FSJES'],
  },
  {
    id: 'dip-9',
    code: 'LST-INFO',
    title_ar: 'الإجازة في العلوم والتقنيات — هندسة البرمجيات وتطبيقات الويب (LST)',
    title_fr: 'Licence Sciences & Techniques en Génie Logiciel (FST)',
    degree_level: 'license',
    degree_level_ar: 'إجازة العلوم والتقنيات (BAC+3)',
    degree_level_fr: 'Licence Sciences & Tech (BAC+3)',
    duration_years: 3,
    discipline: 'science_tech',
    discipline_ar: 'علوم وتقنيات',
    discipline_fr: 'Sciences & Techniques',
    prerequisites_ar: 'بكالوريا علمية أو تقنية + ولوج عبر الجذع المشترك (MIP أو MIPC) بكليات العلوم والتقنيات (FST)',
    prerequisites_fr: 'Bac Scientifique/Technique + Tronc commun MIP/MIPC en Faculté des Sciences et Techniques',
    career_outcomes_ar: [
      'مطور واجهات وتطبيقات الويب والهاتف (Full-Stack Developer)',
      'مسؤول إدماج وتحديث قواعد البيانات (Database Administrator)',
      'فرصة استثنائية لمتابعة سلك المهندسين أو الماستر التكنولوجي',
    ],
    career_outcomes_fr: [
      'Développeur Full-Stack & Mobile',
      'Administrateur Bases de Données & Systèmes',
      'Passerelle directe vers Cycle Ingénieur ou Master',
    ],
    sectors_ar: 'الشركات الناشئة، الوكالات الرقمية، شركات تطوير البرمجيات بالدار البيضاء والرباط، ومصالح تكنولوجيا المعلومات',
    sectors_fr: 'Startups, Agences digitales, Éditeurs de logiciels & Départements IT',
    key_skills_ar: ['تطوير الويب React و Node.js', 'قواعد البيانات SQL و NoSQL', 'البرمجة كائنية التوجه (Java/Python)'],
    key_skills_fr: ['Développement Web', 'Bases de données SQL/NoSQL', 'POO & Algorithmique'],
    institution_codes: ['FST', 'FS'],
  },
  {
    id: 'dip-10',
    code: 'LIC-DROIT',
    title_ar: 'الإجازة الوطنية في العلوم القانونية — القانون الخاص والعام',
    title_fr: 'Licence en Droit Public & Droit Privé (Arabe & Français)',
    degree_level: 'license',
    degree_level_ar: 'الإجازة الوطنية (BAC+3)',
    degree_level_fr: 'Licence Nationale (BAC+3)',
    duration_years: 3,
    discipline: 'law',
    discipline_ar: 'قانون وعلوم سياسية',
    discipline_fr: 'Droit & Sciences Po',
    prerequisites_ar: 'جميع أنواع شهادة البكالوريا المغربية (استقطاب مفتوح بكليات العلوم القانونية والاقتصادية)',
    prerequisites_fr: 'Tous types de Baccalauréat (Accès ouvert en Faculté des Sciences Juridiques)',
    career_outcomes_ar: [
      'ولوج مباريات القضاء والمحاماة والتوثيق والمفوضين القضائيين',
      'متصرف بإدارات الدولة والجماعات الترابية ومصالح المحافظة العقارية',
      'مستشار ومكلف بالمنازعات القانونية في الشركات ومؤسسات الائتمان',
    ],
    career_outcomes_fr: [
      'Concours de la magistrature, barreau, notariat',
      'Administrateur public & Collectivités territoriales',
      'Juriste contentieux & Recouvrement en entreprise',
    ],
    sectors_ar: 'وزارة العدل، المحاكم، مكاتب المحاماة والتوثيق، الوكالة الوطنية للمحافظة العقارية، والأبناك والشركات',
    sectors_fr: 'Ministère de la Justice, Tribunaux, Notaires, ANCFCC, Banques & Assurances',
    key_skills_ar: ['الصياغة والمرافعات القانونية', 'قانون الالتزامات والعقود المغربي', 'المسطرة الجنائية والمدنية'],
    key_skills_fr: ['Rédaction juridique', 'Droit des obligations & contrats', 'Procédures civiles & pénales'],
    institution_codes: ['FSJES'],
  },
  {
    id: 'dip-11',
    code: 'DUT-GIM',
    title_ar: 'الدبلوم الجامعي للتكنولوجيا في الصيانة الصناعية والتصنيع (DUT)',
    title_fr: 'Diplôme Universitaire de Technologie en Génie Industriel & Maintenance',
    degree_level: 'dut',
    degree_level_ar: 'الدبلوم الجامعي للتكنولوجيا (BAC+2)',
    degree_level_fr: 'DUT Technologique (BAC+2)',
    duration_years: 2,
    discipline: 'science_tech',
    discipline_ar: 'علوم وتقنيات',
    discipline_fr: 'Sciences & Techniques',
    prerequisites_ar: 'بكالوريا تقنية، علوم رياضية أو فيزيائية + انتقاء أولي عبر منصة توجيهي (EST)',
    prerequisites_fr: 'Baccalauréat Technique ou Scientifique + Sélection plateforme Tawjihi (EST)',
    career_outcomes_ar: [
      'تقني متخصص رفيع المستوى في تشخيص الأعطال الصناعية والأتمتة',
      'مشرف صيانة وتأهيل الآلات وخطوط الإنتاج المؤتمتة',
      'متابعة المسار نحو الإجازة المهنية أو سلك المهندسين بمباراة التوازي',
    ],
    career_outcomes_fr: [
      'Technicien supérieur de maintenance & automatisme',
      'Superviseur de lignes de fabrication',
      'Poursuite en Licence Pro ou Cycle Ingénieur',
    ],
    sectors_ar: 'مصانع السيارات (رونو طنجة، بياجو القنيطرة)، قطاع الطيران بالنواصر، مجمعات تكرير الفوسفاط، ومحطات تحلية المياه',
    sectors_fr: 'Usines automobiles (Renault, Stellantis), Aéronautique, OCP & Stations industrielles',
    key_skills_ar: ['الميكاترونيك والأنظمة الكهروميكانيكية', 'الأتمتة الصناعية (Automates PLC)', 'الصيانة الاستباقية'],
    key_skills_fr: ['Mécatronique & Électromécanique', 'Automates programmables', 'Maintenance prédictive'],
    institution_codes: ['EST'],
  },
  {
    id: 'dip-12',
    code: 'DUT-GEII',
    title_ar: 'الدبلوم الجامعي للتكنولوجيا في الهندسة الكهربائية والإعلاميات الصناعية',
    title_fr: 'DUT en Génie Électrique & Informatique Industrielle (GEII)',
    degree_level: 'dut',
    degree_level_ar: 'الدبلوم الجامعي للتكنولوجيا (BAC+2)',
    degree_level_fr: 'DUT Technologique (BAC+2)',
    duration_years: 2,
    discipline: 'science_tech',
    discipline_ar: 'علوم وتقنيات',
    discipline_fr: 'Sciences & Techniques',
    prerequisites_ar: 'بكالوريا كهربائية، رياضية أو فيزيائية عبر انتقاء منصة المدارس العليا للتكنولوجيا (EST)',
    prerequisites_fr: 'Bac Technique, Sciences Maths ou PC sur sélection nationale (EST)',
    career_outcomes_ar: [
      'تقني متخصص في البرمجة المدمجة والمتحكمات الدقيقة',
      'تقني تركيب وصيانة الشبكات الكهربائية الذكية والأنظمة الشمسية',
      'مواصلة الدراسة بمدارس المهندسين الوطنية (ENSA / ENSAM)',
    ],
    career_outcomes_fr: [
      'Technicien en systèmes embarqués & microcontrôleurs',
      'Technicien réseaux électriques & énergies solaires',
      'Accès aux Écoles d’Ingénieurs sur passerelle',
    ],
    sectors_ar: 'شركات صناعة الكوابل والسيارات، الطاقات المتجددة، ومصالح الصيانة الكهربائية للمصانع الكبرى',
    sectors_fr: 'Câblage automobile, Énergies renouvelables, Systèmes industriels',
    key_skills_ar: ['الأنظمة المدمجة والميكروكونترولر', 'الإلكترونيات والدوائر المطبوعة', 'الإعلاميات الصناعية'],
    key_skills_fr: ['Systèmes embarqués', 'Électronique de puissance', 'Informatique industrielle'],
    institution_codes: ['EST'],
  },
  {
    id: 'dip-13',
    code: 'MED-GEN',
    title_ar: 'دبلوم الدكتوراه الوطنية في الطب البشري والصيدلة وجراحة الأسنان',
    title_fr: 'Doctorat d’État en Médecine Générale, Pharmacie & Chirurgie Dentaire',
    degree_level: 'doctorate',
    degree_level_ar: 'دكتوراه دولة في الطب (BAC+6)',
    degree_level_fr: 'Doctorat d’État en Médecine (BAC+6)',
    duration_years: 6,
    discipline: 'medicine',
    discipline_ar: 'طب وصحة',
    discipline_fr: 'Médecine & Santé',
    prerequisites_ar: 'بكالوريا علمية بمعدل مرتفع + اجتياز المباراة الوطنية المشتركة لكليات الطب والصيدلة (FMP / FMD)',
    prerequisites_fr: 'Baccalauréat Scientifique + Concours Commun National FMP/FMD',
    career_outcomes_ar: [
      'طبيب عام بالقطاع العمومي (المستشفيات والمراكز الصحية القروية والحضرية)',
      'طبيب مقيم لاجتياز مباريات التخصص الطبي أو الجراحي (BAC+10/12)',
      'ممارسة الطب أو الصيدلة بالقطاع الحر أو العمل بالمختبرات الدولية',
    ],
    career_outcomes_fr: [
      'Médecin généraliste (Hôpitaux publics / Centres de santé)',
      'Médecin résident vers une spécialité médicale ou chirurgicale',
      'Pratique libérale ou recherche biomédicale internationale',
    ],
    sectors_ar: 'المستشفيات الجامعية الكبرى (CHU) بالرباط والدار البيضاء ومراكش وفاس ووجدة وأكادير وطنجة، وزارة الصحة، والعيادات الخاصة',
    sectors_fr: 'Centres Hospitaliers Universitaires (CHU), Ministère de la Santé, Cliniques & Industrie pharmaceutique',
    key_skills_ar: ['التشخيص السريري والعلاجي', 'الجراحة الصغرى والرعاية المركزة', 'أخلاقيات الممارسة الطبية والبحث السريري'],
    key_skills_fr: ['Diagnostic clinique', 'Prise en charge d’urgence', 'Éthique médicale'],
    institution_codes: ['FMP', 'FMD'],
  },
  {
    id: 'dip-14',
    code: 'LIC-HUM',
    title_ar: 'الإجازة في اللغات الحية التطبيقية والترجمة والتواصل المؤسساتي',
    title_fr: 'Licence en Langues Étrangères Appliquées, Traduction & Communication',
    degree_level: 'license',
    degree_level_ar: 'الإجازة الوطنية (BAC+3)',
    degree_level_fr: 'Licence Nationale (BAC+3)',
    duration_years: 3,
    discipline: 'humanities',
    discipline_ar: 'آداب وعلوم إنسانية',
    discipline_fr: 'Lettres & Sciences Humaines',
    prerequisites_ar: 'جميع أنواع شهادة البكالوريا مع التمكن من اللغات الأجنبية (كليات الآداب والعلوم الإنسانية FLSH ومدرسة الملك فهد للترجمة)',
    prerequisites_fr: 'Tous types de Baccalauréat avec bonne maîtrise des langues (FLSH & ESRFT)',
    career_outcomes_ar: [
      'مباريات أطر التدريس والتربية والتعليم بالقطاعين العام والخاص',
      'مكلف بالتواصل المؤسساتي والصحافة والإعلام الرقمي والعلاقات العامة',
      'مترجم فوري أو تحريري بالمؤسسات الدبلوماسية والمنظمات الدولية',
    ],
    career_outcomes_fr: [
      'Cadres de l’enseignement & éducation nationale',
      'Chargé de communication institutionnelle & Relations publiques',
      'Traducteur / Rédacteur multilingue',
    ],
    sectors_ar: 'قطاع التربية والتعليم، المؤسسات الإعلامية والثقافية، السفارات، القطاع السياحي، ومراكز الترجمة والاستشارات',
    sectors_fr: 'Éducation & Enseignement, Médias & Édition, Tourisme & Organisations internationales',
    key_skills_ar: ['الترجمة والتحرير الاحترافي', 'التواصل الرقمي وصناعة المحتوى', 'التفكير النقدي والبحث الميداني'],
    key_skills_fr: ['Traduction multilingue', 'Communication corporate', 'Rédaction professionnelle'],
    institution_codes: ['FLSH'],
  },
];

export const ProgramsDirectoryPage: React.FC<Props> = ({
  institutions,
  lang,
  onBackToHome,
  onSelectInstitution,
  onToggleLanguage,
}) => {
  const isAr = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');

  const filteredDiplomas = useMemo(() => {
    return SAMPLE_DIPLOMAS.filter((dip) => {
      if (selectedLevel !== 'all' && dip.degree_level !== selectedLevel) return false;
      if (selectedDiscipline !== 'all' && dip.discipline !== selectedDiscipline) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        dip.title_ar.toLowerCase().includes(q) ||
        dip.title_fr.toLowerCase().includes(q) ||
        dip.code.toLowerCase().includes(q) ||
        dip.degree_level_ar.toLowerCase().includes(q) ||
        dip.degree_level_fr.toLowerCase().includes(q) ||
        dip.discipline_ar.toLowerCase().includes(q) ||
        dip.discipline_fr.toLowerCase().includes(q) ||
        dip.sectors_ar.toLowerCase().includes(q) ||
        dip.sectors_fr.toLowerCase().includes(q) ||
        dip.prerequisites_ar.toLowerCase().includes(q) ||
        dip.prerequisites_fr.toLowerCase().includes(q) ||
        dip.institution_codes.some((c) => c.toLowerCase().includes(q)) ||
        dip.career_outcomes_ar.some((c) => c.toLowerCase().includes(q)) ||
        dip.career_outcomes_fr.some((c) => c.toLowerCase().includes(q)) ||
        dip.key_skills_ar.some((s) => s.toLowerCase().includes(q)) ||
        dip.key_skills_fr.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedLevel, selectedDiscipline]);

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: SAMPLE_DIPLOMAS.length,
      engineering: 0,
      license: 0,
      master: 0,
      dut: 0,
      doctorate: 0,
    };
    SAMPLE_DIPLOMAS.forEach((d) => {
      counts[d.degree_level] = (counts[d.degree_level] || 0) + 1;
    });
    return counts;
  }, []);

  const getLevelBadgeTheme = (level: string) => {
    switch (level) {
      case 'engineering':
        return {
          bg: 'bg-[#143D30] text-amber-300 border border-amber-400/30',
          dot: 'bg-amber-400',
        };
      case 'master':
        return {
          bg: 'bg-indigo-900 text-indigo-100 border border-indigo-700/40',
          dot: 'bg-indigo-400',
        };
      case 'license':
        return {
          bg: 'bg-emerald-800 text-emerald-100 border border-emerald-600/40',
          dot: 'bg-emerald-300',
        };
      case 'dut':
        return {
          bg: 'bg-amber-800 text-amber-100 border border-amber-600/40',
          dot: 'bg-amber-300',
        };
      case 'doctorate':
        return {
          bg: 'bg-rose-900 text-rose-100 border border-rose-700/40',
          dot: 'bg-rose-300',
        };
      default:
        return {
          bg: 'bg-stone-800 text-stone-100 border border-stone-600',
          dot: 'bg-stone-300',
        };
    }
  };

  const getDisciplineIcon = (disc: string) => {
    switch (disc) {
      case 'engineering':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'economics':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'science_tech':
        return <Atom className="w-3.5 h-3.5" />;
      case 'medicine':
        return <Stethoscope className="w-3.5 h-3.5" />;
      case 'law':
        return <Scale className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col justify-between overflow-x-clip">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-3.5 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-5 flex-1">
        {/* Clean Editorial Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-4 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr ? 'المسالك والشهادات المعتمدة' : 'Filières et diplômes accrédités'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'استعرض أبرز التخصصات الجامعية العمومية بالمغرب مع شروط الولوج، مدة الدراسة، والمهن المتاحة بعد التخرج.'
                : 'Explorez les formations universitaires publiques au Maroc : conditions d’accès, durée d’études et débouchés professionnels.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-medium text-stone-500 shrink-0">
            <span className="inline-flex items-center gap-1 text-stone-800 font-semibold">
              <span dir="ltr" className="font-mono font-bold text-[#143D30] tabular-nums">
                {SAMPLE_DIPLOMAS.length}
              </span>
              <span>{isAr ? 'مسلكاً معتمداً' : 'filières'}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span dir="ltr" className="font-mono font-semibold text-stone-700">
              BAC+2 — BAC+6
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{isAr ? 'مرتبطة بسوق الشغل' : 'Liées au marché du travail'}</span>
          </div>
        </header>

        {/* Compact Search & Filter Bar */}
        <section className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
          {/* Search Box with Clear Button */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث باسم المسلك، الشهادة، المهنة، أو المؤسسة (مثلاً: هندسة، ENSA، اقتصاد)...'
                  : 'Rechercher une filière, un diplôme, un métier ou une école (ENSA, Économie)...'
              }
              className="w-full ps-10 pe-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#143D30] focus:bg-white transition-all min-h-[42px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label={isAr ? 'مسح البحث' : 'Effacer la recherche'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Compact Dropdown Filters + Live Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="program-discipline-select"
                className="flex items-center gap-1 text-[11px] font-bold text-stone-600 mb-1 px-0.5"
              >
                <Layers className="w-3 h-3 text-[#143D30]" />
                <span>{isAr ? 'الشعبة / المجال الدراسي' : 'Filière / Domaine'}</span>
              </label>
              <select
                id="program-discipline-select"
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#143D30] cursor-pointer"
              >
                <option value="all">{isAr ? 'جميع الشعب والتخصصات' : 'Tous les domaines'}</option>
                <option value="engineering">{isAr ? 'هندسة وتكنولوجيا' : 'Ingénierie & Tech'}</option>
                <option value="economics">{isAr ? 'اقتصاد وتدبير وتجارة' : 'Économie & Gestion'}</option>
                <option value="science_tech">{isAr ? 'علوم وتقنيات' : 'Sciences & Tech'}</option>
                <option value="medicine">{isAr ? 'طب وصيدلة وصحة' : 'Médecine & Santé'}</option>
                <option value="law">{isAr ? 'قانون وعلوم سياسية' : 'Droit & Sciences Po'}</option>
                <option value="humanities">{isAr ? 'آداب وعلوم إنسانية' : 'Lettres & Humaines'}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="program-level-select"
                className="flex items-center gap-1 text-[11px] font-bold text-stone-600 mb-1 px-0.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#143D30]" />
                <span>{isAr ? 'المستوى الأكاديمي والشهادة' : 'Niveau de diplôme'}</span>
              </label>
              <select
                id="program-level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#143D30] cursor-pointer"
              >
                <option value="all">
                  {isAr ? `جميع المستويات (${levelCounts.all})` : `Tous les niveaux (${levelCounts.all})`}
                </option>
                <option value="engineering">
                  {isAr ? `شهادة مهندس دولة BAC+5 (${levelCounts.engineering})` : `Ingénieur BAC+5 (${levelCounts.engineering})`}
                </option>
                <option value="master">
                  {isAr ? `الماستر والمدارس الوطنية BAC+5 (${levelCounts.master})` : `Master / ENCG BAC+5 (${levelCounts.master})`}
                </option>
                <option value="license">
                  {isAr ? `الإجازة الوطنية و LST BAC+3 (${levelCounts.license})` : `Licence BAC+3 (${levelCounts.license})`}
                </option>
                <option value="dut">
                  {isAr ? `الدبلوم الجامعي للتكنولوجيا BAC+2 (${levelCounts.dut})` : `DUT BAC+2 (${levelCounts.dut})`}
                </option>
                <option value="doctorate">
                  {isAr ? `الدكتوراه في الطب BAC+6 (${levelCounts.doctorate})` : `Doctorat / Méd (${levelCounts.doctorate})`}
                </option>
              </select>
            </div>
          </div>

          {/* Results Summary & Reset Row */}
          <div className="flex items-center justify-between pt-1.5 border-t border-stone-100 text-[11px]">
            <span className="font-mono font-bold text-[#143D30]">
              {filteredDiplomas.length} {isAr ? 'مسلك مطابق' : 'résultats'}
            </span>
            {(selectedLevel !== 'all' || selectedDiscipline !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedDiscipline('all');
                  setSearchQuery('');
                }}
                className="text-[#B43425] hover:underline font-bold py-0.5 px-1"
              >
                {isAr ? 'إعادة ضبط البحث' : 'Réinitialiser'}
              </button>
            )}
          </div>
        </section>

        {/* Diplomas Cards Grid (Responsive 1-col on mobile, 2-col on desktop) */}
        {filteredDiplomas.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {isAr ? 'لا توجد شهادات مطابقة لخيارات البحث' : 'Aucun diplôme trouvé'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {isAr
                ? 'جرّب البحث بكلمة عامة مثل "هندسة"، "إجازة"، أو اختر "الكل" لعرض جميع التخصصات.'
                : 'Essayez un mot-clé plus général ou réinitialisez les filtres.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('all');
                setSelectedDiscipline('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 px-4 py-2 bg-[#143D30] text-white text-xs font-bold rounded-xl"
            >
              <span>{isAr ? 'عرض جميع الشهادات' : 'Tous les diplômes'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            {filteredDiplomas.map((dip) => {
              const theme = getLevelBadgeTheme(dip.degree_level);
              const outcomes = isAr ? dip.career_outcomes_ar : dip.career_outcomes_fr;
              const skills = isAr ? dip.key_skills_ar : dip.key_skills_fr;

              // Matching real institutions
              const matchingInsts = institutions.filter((inst) =>
                dip.institution_codes.some(
                  (code) =>
                    inst.code.toUpperCase().includes(code.toUpperCase()) ||
                    inst.name_fr.toUpperCase().includes(code.toUpperCase())
                )
              );

              return (
                <article
                  key={dip.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 hover:border-[#143D30]/60 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Main Body */}
                  <div className="p-3.5 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Top Badges Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-stone-100 text-stone-900 rounded-lg border border-stone-200/80">
                          {dip.code}
                        </span>
                        <span
                          className={`text-[10.5px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 ${theme.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                          <span>{isAr ? dip.degree_level_ar : dip.degree_level_fr}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-semibold text-stone-500 bg-stone-50 px-2 py-0.5 rounded-lg border border-stone-200/70">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#143D30]" />
                        <span>{isAr ? `${dip.duration_years} سنوات` : `${dip.duration_years} ans`}</span>
                      </div>
                    </div>

                    {/* Diploma Title */}
                    <h2 className="text-sm sm:text-lg font-extrabold sm:font-black text-stone-900 leading-snug">
                      {isAr ? dip.title_ar : dip.title_fr}
                    </h2>

                    {/* Quick Discipline & Access Mode Strip */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-xs text-stone-600 bg-[#FAF8F5] p-2.5 sm:p-3 rounded-2xl border border-stone-200/80">
                      <div className="flex items-center gap-1.5 font-semibold text-[#143D30] shrink-0">
                        {getDisciplineIcon(dip.discipline)}
                        <span>{isAr ? dip.discipline_ar : dip.discipline_fr}</span>
                      </div>
                      <span aria-hidden="true" className="hidden sm:inline text-stone-300">·</span>
                      <div className="text-[11px] text-stone-700 leading-relaxed min-w-0">
                        <strong className="text-stone-900">{isAr ? 'الولوج: ' : 'Accès : '}</strong>
                        <span>{isAr ? dip.prerequisites_ar : dip.prerequisites_fr}</span>
                      </div>
                    </div>

                    {/* Education-to-Career Moroccan Market Outcomes */}
                    <div className="bg-emerald-50/60 p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 space-y-2.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 font-extrabold text-[#143D30]">
                          <Briefcase className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span>{isAr ? 'الآفاق والمهن في سوق الشغل المغربي' : 'Débouchés & Métiers cibles au Maroc'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                          {isAr ? 'طلب مرتفع' : 'Forte demande'}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-stone-800">
                        {outcomes.map((role, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                            <span className="font-semibold">{role}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Recruiter Sectors & Hubs */}
                      <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-stone-700 leading-relaxed">
                        <strong className="text-stone-900 block mb-0.5">
                          {isAr ? 'القطاعات المشغلة بالمملكة:' : 'Secteurs recruteurs au Royaume :'}
                        </strong>
                        <span>{isAr ? dip.sectors_ar : dip.sectors_fr}</span>
                      </div>

                      {/* Key Skills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-stone-700 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{isAr ? 'المهارات:' : 'Compétences:'}</span>
                        </span>
                        {skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white text-emerald-950 border border-emerald-200 shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Accredited Institutions List */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-stone-600">
                        <span className="font-bold flex items-center gap-1 text-stone-800">
                          <Building2 className="w-3.5 h-3.5 text-[#143D30] shrink-0" />
                          <span>{isAr ? 'أبرز المؤسسات المعتمدة الموفرة للتكوين:' : 'Établissements accrédités :'}</span>
                        </span>
                        <span className="text-[11px] text-stone-500 font-mono shrink-0">
                          {matchingInsts.length} {isAr ? 'مؤسسة مدرجة' : 'établissements'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {matchingInsts.slice(0, 6).map((inst) => (
                          <button
                            key={inst.id}
                            type="button"
                            onClick={() => onSelectInstitution(inst)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-[#143D30] text-stone-800 hover:text-white border border-stone-200/90 transition-colors shadow-2xs active:scale-95"
                            title={isAr ? inst.name_ar : inst.name_fr}
                          >
                            <span>{inst.code}</span>
                            <span className="text-[9px] text-stone-400 font-normal">({inst.city_ar})</span>
                          </button>
                        ))}
                        {matchingInsts.length > 6 && (
                          <span className="text-[11px] text-stone-400 font-mono px-1">
                            +{matchingInsts.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-stone-500 font-medium">
                      {isAr ? 'شهادة وطنية معتمدة' : 'Diplôme accrédité'}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const inst = matchingInsts[0] || institutions[0];
                        if (inst) onSelectInstitution(inst);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-[#143D30] hover:bg-[#0e2c23] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0"
                      aria-label={isAr ? `عرض المؤسسة الموفرة لـ ${dip.title_ar}` : `Voir établissement ${dip.title_fr}`}
                    >
                      <span>{isAr ? 'استعراض المؤسسة المعتمدة' : 'Voir Établissement'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 pt-6 pb-24 lg:pb-6 border-t border-stone-800 text-xs text-center">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-stone-300">
            {isAr
              ? 'جامعتي | مسالك وشهادات معتمدة بمرجع وزارة التعليم العالي والبحث العلمي والابتكار 2026'
              : 'Jami3ati | Filières et diplômes accrédités (MESRSI & data.gov.ma 2026)'}
          </p>
          <p className="text-[11px] text-stone-500">
            {isAr
              ? 'جميع التخصصات والشهادات مرتبطة بشروط الولوج الرسمية (توجيهي، TAFEM، مباريات، استقطاب مفتوح) وسوق الشغل بالمغرب'
              : 'Tous les diplômes sont adossés aux conditions d’accès officielles (Tawjihi, TAFEM, Concours) et au marché de l’emploi marocain.'}
          </p>
        </div>
      </footer>
    </div>
  );
};
