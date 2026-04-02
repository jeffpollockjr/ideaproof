// Seed data for IdeaProof demo

const rInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const fakeEmails = [
  'alex.chen@gmail.com', 'sarah.m@outlook.com', 'j.rodriguez@yahoo.com',
  'marcus.w@gmail.com', 'priya.k@icloud.com', 'dan.foster@gmail.com',
  'linda.nguyen@outlook.com', 'kevin.p@gmail.com', 'anna.bell@yahoo.com',
  'omar.h@gmail.com', 'claire.v@outlook.com', 'raj.s@gmail.com',
  'mia.jones@icloud.com', 'felix.b@gmail.com', 'zoe.t@outlook.com',
  'ben.harris@gmail.com', 'nina.l@yahoo.com', 'tom.wu@gmail.com',
  'grace.k@icloud.com', 'sam.p@gmail.com', 'ella.r@outlook.com',
  'noah.m@gmail.com', 'ava.d@yahoo.com', 'liam.c@gmail.com',
  'isla.f@icloud.com', 'jack.n@gmail.com', 'sofia.g@outlook.com',
  'henry.o@gmail.com', 'luna.j@yahoo.com', 'ethan.w@gmail.com',
];

// ─── PetPulse ──────────────────────────────────────────────────────────────
const petPulseQuestions = [
  {
    id: 'pp_q1',
    type: 'rating',
    text: 'How concerned are you about your pet\'s day-to-day health?',
  },
  {
    id: 'pp_q2',
    type: 'multiple_choice',
    text: 'How much would you pay monthly for real-time pet health monitoring?',
    options: ['Under $5', '$5–$15', '$15–$25', '$25–$40', 'I wouldn\'t pay'],
  },
  {
    id: 'pp_q3',
    type: 'open_text',
    text: 'What\'s your biggest worry about your pet\'s health?',
  },
];

const ppRatingDist = [4, 4, 5, 5, 5, 4, 3, 5, 4, 4, 5, 5, 4, 4, 5, 3, 4, 5, 4, 5,
  4, 4, 5, 5, 3, 4, 4, 5, 4, 5, 5, 4, 3, 4, 5, 4, 4, 5, 5, 4, 4, 5, 4, 3, 5, 4, 5];
const ppPayDist = ['$5–$15','$15–$25','$15–$25','$5–$15','$25–$40','$5–$15','I wouldn\'t pay',
  '$15–$25','$5–$15','$15–$25','$5–$15','$15–$25','$25–$40','$5–$15','$15–$25',
  '$5–$15','$5–$15','$15–$25','Under $5','$15–$25','$5–$15','$25–$40','$15–$25',
  '$5–$15','$15–$25','$5–$15','$15–$25','$5–$15','$25–$40','$15–$25','$5–$15',
  'I wouldn\'t pay','$15–$25','$5–$15','$15–$25','$25–$40','$5–$15','$15–$25',
  '$5–$15','$15–$25','$5–$15','$15–$25','$25–$40','$15–$25','$5–$15','$15–$25','$5–$15'];
const ppOpenText = [
  'Worried about my dog getting sick when I travel',
  'My cat had a health scare — I wish I knew sooner',
  'Vet bills are expensive, early detection would save money',
  'My elderly golden retriever needs constant monitoring',
  '',
  'Want to track activity levels for my rescue dog',
  '',
  'Diabetes management for my diabetic cat',
  'Worried about heart issues in my bulldog breed',
  '',
];

const petPulseResponses = Array.from({ length: 47 }, (_, i) => ({
  id: `pp_r${i + 1}`,
  date: daysAgo(rInt(1, 28)),
  answers: {
    pp_q1: ppRatingDist[i],
    pp_q2: ppPayDist[i],
    pp_q3: ppOpenText[i % ppOpenText.length],
  },
}));

const petPulsePreOrderTiers = [
  { id: 'pp_t1', name: 'Basic', price: 9.99, description: 'Monitor 1 pet · Activity + sleep tracking · Monthly health report' },
  { id: 'pp_t2', name: 'Pro', price: 19.99, description: 'Monitor up to 3 pets · Real-time alerts · Vet report exports' },
  { id: 'pp_t3', name: 'Family', price: 34.99, description: 'Unlimited pets · Priority support · Custom health dashboards' },
];

const ppTierDist = ['pp_t1','pp_t2','pp_t2','pp_t1','pp_t2','pp_t3','pp_t2','pp_t1','pp_t2','pp_t1',
  'pp_t2','pp_t2','pp_t3','pp_t1','pp_t2','pp_t2','pp_t1','pp_t2','pp_t3','pp_t2','pp_t2','pp_t1','pp_t2'];

const petPulsePreOrderResponses = ppTierDist.map((tierId, i) => ({
  id: `pp_po${i + 1}`,
  email: fakeEmails[i % fakeEmails.length],
  tierId,
  date: daysAgo(rInt(1, 20)),
}));

const petPulseEmailList = [
  ...petPulsePreOrderResponses.map((r, i) => ({
    id: `pp_e${i + 1}`,
    email: r.email,
    source: 'pre-order',
    status: i < 5 ? 'hot_lead' : 'interested',
    date: r.date,
  })),
  ...fakeEmails.slice(0, 11).map((email, i) => ({
    id: `pp_es${i + 1}`,
    email,
    source: 'survey',
    status: 'interested',
    date: daysAgo(rInt(5, 25)),
  })),
];

// ─── DeskMesh ──────────────────────────────────────────────────────────────
const deskMeshQuestions = [
  {
    id: 'dm_q1',
    type: 'multiple_choice',
    text: 'How often do you work remotely outside your home?',
    options: ['Daily', '3–4x per week', '1–2x per week', 'Occasionally', 'Never'],
  },
  {
    id: 'dm_q2',
    type: 'rating',
    text: 'How satisfied are you with current co-working space options?',
  },
  {
    id: 'dm_q3',
    type: 'multiple_choice',
    text: 'What\'s your biggest pain with finding a workspace?',
    options: ['Price', 'Location / proximity', 'Availability', 'Amenities', 'Booking hassle'],
  },
  {
    id: 'dm_q4',
    type: 'open_text',
    text: 'What would your ideal flexible workspace look like?',
  },
];

const dmFreqDist = ['Daily','3–4x per week','3–4x per week','1–2x per week','Daily','3–4x per week',
  'Occasionally','Daily','3–4x per week','1–2x per week','Daily','3–4x per week','Daily',
  '1–2x per week','3–4x per week','Daily','3–4x per week','Occasionally','Daily','3–4x per week',
  '1–2x per week','Daily','3–4x per week','Daily','3–4x per week','Occasionally','Daily',
  '3–4x per week','1–2x per week','Daily','3–4x per week','Daily','Occasionally','3–4x per week',
  'Daily','1–2x per week','3–4x per week','Daily','3–4x per week','Daily','1–2x per week',
  '3–4x per week','Daily','3–4x per week','Occasionally','Daily','3–4x per week','Daily',
  '3–4x per week','1–2x per week','Daily','3–4x per week','Daily','3–4x per week','Daily',
  'Occasionally','3–4x per week','Daily','1–2x per week','3–4x per week','Daily','3–4x per week',
  'Daily','Occasionally','3–4x per week','Daily','1–2x per week','3–4x per week','Daily',
  '3–4x per week','Occasionally','Daily','3–4x per week','Daily','1–2x per week','3–4x per week',
  'Daily','3–4x per week','Daily','Occasionally','3–4x per week','Daily','3–4x per week',
  '1–2x per week','Daily','3–4x per week','Daily','Occasionally','3–4x per week','Daily',
  '3–4x per week','1–2x per week','Daily','3–4x per week','Daily','Occasionally','3–4x per week',
  'Daily','3–4x per week','Daily','1–2x per week','3–4x per week','Daily','3–4x per week',
  'Occasionally','Daily','3–4x per week','Daily','1–2x per week','3–4x per week'];

const dmSatDist = [2,2,3,2,1,2,3,2,2,3,2,1,2,3,2,2,3,2,1,3,2,2,3,2,2,1,2,3,2,2,
  3,2,1,2,3,2,2,3,1,2,3,2,2,1,2,3,2,2,3,2,2,1,3,2,2,3,2,1,2,3,2,2,1,3,2,2,3,
  2,2,1,2,3,2,2,3,1,2,3,2,2,3,2,1,2,3,2,2,3,2,1,3,2,2,3,2,2,1,2,3,2,2,3,1,2,3,2,2,3,2,1,2,3];

const dmPainDist = ['Price','Location / proximity','Availability','Booking hassle','Location / proximity',
  'Price','Availability','Location / proximity','Price','Booking hassle','Availability',
  'Location / proximity','Price','Availability','Booking hassle','Location / proximity',
  'Price','Amenities','Availability','Location / proximity'];

const deskMeshResponses = Array.from({ length: 112 }, (_, i) => ({
  id: `dm_r${i + 1}`,
  date: daysAgo(rInt(1, 45)),
  answers: {
    dm_q1: dmFreqDist[i % dmFreqDist.length],
    dm_q2: dmSatDist[i % dmSatDist.length],
    dm_q3: dmPainDist[i % dmPainDist.length],
    dm_q4: '',
  },
}));

const deskMeshPreOrderTiers = [
  { id: 'dm_t1', name: 'Day Pass', price: 15, description: 'Single-day access · Any listed space · Book same-day' },
  { id: 'dm_t2', name: 'Monthly', price: 79, description: '10 days/month · Priority booking · Cancel anytime' },
  { id: 'dm_t3', name: 'Unlimited', price: 149, description: 'Unlimited access · Premium spaces · Guest passes' },
];

const dmTierDist = Array.from({ length: 67 }, (_, i) =>
  ['dm_t1','dm_t2','dm_t2','dm_t2','dm_t3','dm_t1','dm_t2','dm_t2','dm_t3','dm_t2'][i % 10]
);

const deskMeshPreOrderResponses = dmTierDist.map((tierId, i) => ({
  id: `dm_po${i + 1}`,
  email: fakeEmails[i % fakeEmails.length],
  tierId,
  date: daysAgo(rInt(1, 35)),
}));

const deskMeshEmailList = [
  ...deskMeshPreOrderResponses.map((r, i) => ({
    id: `dm_e${i + 1}`,
    email: r.email,
    source: 'pre-order',
    status: i < 12 ? 'hot_lead' : i < 30 ? 'contacted' : 'interested',
    date: r.date,
  })),
  ...fakeEmails.slice(0, 22).map((email, i) => ({
    id: `dm_es${i + 1}`,
    email,
    source: 'survey',
    status: 'interested',
    date: daysAgo(rInt(10, 40)),
  })),
];

// ─── Main seed export ───────────────────────────────────────────────────────
export const seedIdeas = [
  {
    id: 'idea_1',
    title: 'PetPulse',
    oneLiner: 'Real-time health monitoring for pets via a smart collar + subscription app',
    category: 'Consumer Tech',
    emoji: '🐾',
    status: 'validating',
    validationScore: 72,
    pitch: {
      problem: 'Pet owners often don\'t know their pet is sick until symptoms become severe — leading to expensive emergency vet visits and unnecessary suffering. There\'s no affordable way to continuously monitor a pet\'s health at home.',
      solution: 'PetPulse is an IoT smart collar paired with a mobile app that tracks your pet\'s vitals (heart rate, temperature, activity, sleep) 24/7. The AI flags anomalies early and generates monthly health reports to share with your vet.',
      targetCustomer: 'Dog and cat owners aged 25–50 who treat pets as family members, spend $100+/month on pet care, and have mid-to-high household income. Early adopters are likely in urban and suburban markets.',
      businessModel: 'Hardware device sold at cost (~$49) to drive adoption. Recurring subscription revenue ($9.99–$34.99/month) for the monitoring service, vet report exports, and premium features. Target 30%+ gross margin on subscriptions.',
    },
    validationConfig: {
      survey: true,
      landingPage: true,
      preOrder: true,
      emailCapture: true,
    },
    survey: {
      questions: petPulseQuestions,
      responses: petPulseResponses,
    },
    landingPage: {
      headline: 'Know Your Pet\'s Health Before It\'s Too Late',
      subheadline: 'Real-time health monitoring for dogs & cats. PetPulse catches illness early so your pet lives longer and you save on vet bills.',
      cta: 'Get Early Access — Free',
      isRunning: true,
      metrics: {
        impressions: 4820,
        visitors: 1240,
        clicks: 310,
      },
    },
    preOrder: {
      tiers: petPulsePreOrderTiers,
      responses: petPulsePreOrderResponses,
    },
    emailList: petPulseEmailList,
    marketplace: {
      callPrice: 199,
      isListed: false,
      callsBooked: [],
    },
    createdAt: daysAgo(32),
  },
  {
    id: 'idea_2',
    title: 'DeskMesh',
    oneLiner: 'A peer-to-peer marketplace connecting remote workers with spare desks in homes, studios & cafes',
    category: 'Marketplace',
    emoji: '💼',
    status: 'listed',
    validationScore: 88,
    pitch: {
      problem: 'Remote workers are stuck choosing between expensive co-working memberships ($200–$500/month) and uninspiring home offices. Meanwhile, thousands of spare desks in studios, homes, and offices sit empty every day.',
      solution: 'DeskMesh is an Airbnb-style marketplace where hosts list their spare desk space by the day, week, or month. Workers browse by location, amenities, and vibe — and book instantly. Hosts earn passive income; workers get flexible, affordable workspaces they actually like.',
      targetCustomer: 'Remote workers, freelancers, and digital nomads aged 22–45. Secondary market: businesses needing occasional overflow workspace. Initial focus on top-10 US cities with large remote-work populations.',
      businessModel: 'Marketplace take rate of 15% on each transaction (10% from host, 5% from guest). Projected GMV of $2.4M in year 1 based on 3 cities, 200 hosts, and 600 monthly active workers. Path to profitability at ~$500K GMV.',
    },
    validationConfig: {
      survey: true,
      landingPage: true,
      preOrder: true,
      emailCapture: true,
    },
    survey: {
      questions: deskMeshQuestions,
      responses: deskMeshResponses,
    },
    landingPage: {
      headline: 'Work From Anywhere. Actually Anywhere.',
      subheadline: 'Book a great desk by the day — in someone\'s home studio, creative office, or private space. No membership. No commitment.',
      cta: 'Find a Desk Near Me',
      isRunning: true,
      metrics: {
        impressions: 18400,
        visitors: 5100,
        clicks: 1530,
      },
    },
    preOrder: {
      tiers: deskMeshPreOrderTiers,
      responses: deskMeshPreOrderResponses,
    },
    emailList: deskMeshEmailList,
    marketplace: {
      callPrice: 349,
      isListed: true,
      callsBooked: [
        { id: 'cb_1', buyerName: 'Marcus Webb', company: 'Lightspeed Ventures', date: daysAgo(-3), time: '10:00 AM', status: 'upcoming' },
        { id: 'cb_2', buyerName: 'Priya Kapoor', company: 'Self / Serial Entrepreneur', date: daysAgo(7), time: '2:00 PM', status: 'completed' },
      ],
    },
    createdAt: daysAgo(61),
  },
  {
    id: 'idea_3',
    title: 'LegalDraft AI',
    oneLiner: 'AI-powered legal document generator built for freelancers and solo operators',
    category: 'LegalTech',
    emoji: '⚖️',
    status: 'draft',
    validationScore: 0,
    pitch: {
      problem: 'Freelancers routinely skip legal contracts because lawyer fees are prohibitive ($300–$500/hr) and generic templates don\'t cover their specific situations. This leaves them unprotected on scope creep, late payments, and IP ownership.',
      solution: 'LegalDraft AI generates custom, state-specific freelance contracts in under 5 minutes using a simple interview-style questionnaire. Users answer plain-language questions about their project, and the AI outputs a legally sound, editable document.',
      targetCustomer: 'Freelancers, consultants, and solo service providers in the US earning $50K+ annually. Particularly strong fit for designers, developers, writers, and marketers who regularly need contracts but can\'t justify legal fees.',
      businessModel: 'Freemium model: 3 free documents per month, then $19/month for unlimited. Enterprise tier at $49/month for teams and agencies. Estimated LTV of $420 at 18-month average retention.',
    },
    validationConfig: {
      survey: false,
      landingPage: false,
      preOrder: false,
      emailCapture: false,
    },
    survey: { questions: [], responses: [] },
    landingPage: {
      headline: 'Contracts That Protect You. Without the Legal Bill.',
      subheadline: 'Generate professional freelance contracts in minutes using AI. State-specific, editable, and legally reviewed.',
      cta: 'Generate My First Contract',
      isRunning: false,
      metrics: { impressions: 0, visitors: 0, clicks: 0 },
    },
    preOrder: { tiers: [], responses: [] },
    emailList: [],
    marketplace: { callPrice: 149, isListed: false, callsBooked: [] },
    createdAt: daysAgo(5),
  },
];

export const seedNotifications = [
  {
    id: 'n1',
    type: 'survey_response',
    message: 'New survey response on PetPulse',
    ideaId: 'idea_1',
    ideaTitle: 'PetPulse',
    read: false,
    date: daysAgo(0),
  },
  {
    id: 'n2',
    type: 'call_booked',
    message: 'Marcus Webb booked a call for DeskMesh',
    ideaId: 'idea_2',
    ideaTitle: 'DeskMesh',
    read: false,
    date: daysAgo(1),
  },
  {
    id: 'n3',
    type: 'preorder',
    message: 'New pre-order signal on DeskMesh (Monthly tier)',
    ideaId: 'idea_2',
    ideaTitle: 'DeskMesh',
    read: false,
    date: daysAgo(2),
  },
  {
    id: 'n4',
    type: 'landing_page',
    message: 'PetPulse landing page passed 4,000 impressions',
    ideaId: 'idea_1',
    ideaTitle: 'PetPulse',
    read: true,
    date: daysAgo(4),
  },
  {
    id: 'n5',
    type: 'survey_response',
    message: 'DeskMesh survey hit 100+ responses',
    ideaId: 'idea_2',
    ideaTitle: 'DeskMesh',
    read: true,
    date: daysAgo(6),
  },
];

export const demoUser = {
  id: 'user_demo',
  name: 'Jordan Rivera',
  email: 'jordan@ideaproof.co',
  avatar: 'JR',
  role: 'seller',
  joinedAt: daysAgo(90),
};
