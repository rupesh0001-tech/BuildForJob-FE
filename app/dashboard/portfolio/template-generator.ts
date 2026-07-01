export interface SectionItem {
  title?: string;
  description?: string;
  icon?: string;
  name?: string;
  role?: string;
  company?: string;
  quote?: string;
  question?: string;
  answer?: string;
}

export interface PortfolioSection {
  id: string;
  title: string;
  subtitle?: string;
  isVisible: boolean;
  type: 'services' | 'about' | 'testimonials' | 'benefits' | 'faqs' | 'custom';
  items: SectionItem[];
  aboutDescription?: string;
  stats?: { value: string; label: string }[];
}

export interface PortfolioData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  location: string;
  avatarUrl: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  skills: { name: string }[];
  projects: { name: string; techStack?: string; description?: string; githubUrl?: string; liveUrl?: string; bannerImage?: string }[];
  brandColor: string;
  themeMode: "light" | "dark";
  resumeUrl: string;
  templateId?: 'modern' | 'minimalist' | 'glassmorphism';
  sections?: PortfolioSection[];
}

// Default values for portfolio sections to use as initial drafts or fallback
export const DEFAULT_SECTIONS: PortfolioSection[] = [
  {
    id: "services",
    title: "Our Services",
    subtitle: "We Provide Best Web & Software Services",
    isVisible: true,
    type: "services",
    items: [
      { title: "Web Development", description: "We build fast, secure, and beautiful websites tailored to your business needs, using modern frameworks.", icon: "fa-solid fa-laptop-code" },
      { title: "Mobile Application", description: "High-performance native and cross-platform mobile apps designed for smooth user experience.", icon: "fa-solid fa-mobile-screen" },
      { title: "UI/UX Interface Design", description: "User-centric design solutions that make your product intuitive, accessible, and delightful.", icon: "fa-solid fa-bezier-curve" },
      { title: "Brand Identity", description: "Stand out from competitors with a memorable logo, consistent visual language, and brand strategy.", icon: "fa-solid fa-palette" }
    ]
  },
  {
    id: "about",
    title: "About Us",
    subtitle: "DesignAGENCY Success Story",
    isVisible: true,
    type: "about",
    aboutDescription: "We are a dedicated collective of engineers, designers, and systems architects driven by single-minded goals: creating digital properties that deliver. Whether optimizing codebases, engineering seamless automation pipelines, or establishing visual identities, we build for impact.",
    stats: [
      { value: "99%", label: "Success Rate" },
      { value: "40+", label: "Shipped Apps" },
      { value: "12m+", label: "End Users" },
      { value: "24/7", label: "Live Support" }
    ],
    items: []
  },
  {
    id: "testimonials",
    title: "Testimonials",
    subtitle: "What Clients Say",
    isVisible: true,
    type: "testimonials",
    items: [
      { name: "Alex Rivera", role: "Lead Designer", company: "RotationMatch", quote: "Incredibly fluid animations. Solved our alignment and onboarding issues perfectly!" },
      { name: "Sarah Thompson", role: "Founder", company: "Boomzo", quote: "Rupesh Jagtap built an incredible platform that perfectly captures our vibrant brand." },
      { name: "Michael Roberts", role: "Owner", company: "TopGunz Auto", quote: "Built us a modern platform that transformed our shop. Intuitive and our team loves it!" },
      { name: "Emma Larson", role: "Creative Director", company: "Hger", quote: "Stunning aesthetics and responsiveness. Our visual engagement has doubled!" }
    ]
  },
  {
    id: "benefits",
    title: "Benefits",
    subtitle: "Why Work With Me?",
    isVisible: true,
    type: "benefits",
    items: [
      { title: "Fast Communication", description: "Always reachable. I maintain clear, transparent and prompt updates throughout the project lifecycle.", icon: "fa-solid fa-circle-check" },
      { title: "Clean Code", description: "Writing readable, well-documented, and modular code that is easy to maintain, debug, and expand.", icon: "fa-solid fa-circle-check" },
      { title: "Scalable Architecture", description: "Designing systems prepared for growth, handling increased traffic and database scale effortlessly.", icon: "fa-solid fa-circle-check" },
      { title: "On-Time Delivery", description: "Strict adherence to schedules and milestones, delivering high-quality results exactly when promised.", icon: "fa-solid fa-circle-check" }
    ]
  },
  {
    id: "faqs",
    title: "FAQ",
    subtitle: "Frequently Asked Questions",
    isVisible: true,
    type: "faqs",
    items: [
      { question: "What web development services do you offer?", answer: "I specialize in building custom, high-performance web applications and landing pages using Modern React and Next.js. My services cover full-stack development, custom animations (Framer Motion), database design, third-party API integrations, and local SEO optimization." },
      { question: "Are you available for projects in Pune as well as remote work?", answer: "Yes, I am based in Pune, India, and am available for local as well as remote contract opportunities worldwide." },
      { question: "What tech stack do you use for your web applications?", answer: "I typically build with Next.js, React, Node.js, TypeScript, PostgreSQL/MongoDB, and Tailwind CSS." },
      { question: "How long does a typical web development project take?", answer: "Timelines vary depending on complexity, but a standard landing page takes 1-2 weeks, while a full-stack platform ranges from 4-8 weeks." },
      { question: "How do you ensure web applications are optimized for search engines (SEO)?", answer: "I implement semantic HTML, configure meta-data tags dynamically, optimize image sizes, and ensure fast page speeds for search engine crawls." },
      { question: "Do you provide post-launch support and maintenance?", answer: "Yes, I provide post-launch maintenance, bug fixes, and feature updates as per our service level agreement." }
    ]
  }
];

// Helper to look up a section from user data or fallback to defaults
export function getPortfolioSection(data: PortfolioData, sectionId: string): PortfolioSection {
  const customSection = data.sections?.find((s) => s.id === sectionId);
  if (customSection) return customSection;

  const defaultSection = DEFAULT_SECTIONS.find((s) => s.id === sectionId);
  if (defaultSection) return defaultSection;

  // Fallback structural placeholder
  return {
    id: sectionId,
    title: sectionId.toUpperCase(),
    isVisible: false,
    type: "custom",
    items: []
  };
}

export function generatePortfolioHtml(data: PortfolioData): string {
  const template = data.templateId || 'modern';
  if (template === 'minimalist') {
    return generateMinimalistTemplate(data);
  }
  if (template === 'glassmorphism') {
    return generateGlassmorphismTemplate(data);
  }
  return generateModernTemplate(data);
}

// -------------------- 1. MODERN TEMPLATE --------------------
export function generateModernTemplate(data: PortfolioData): string {
  const nameCombined = `${data.firstName} ${data.lastName}`;
  const isDark = data.themeMode === 'dark';

  // Get active custom or default sections
  const servicesSec = getPortfolioSection(data, "services");
  const aboutSec = getPortfolioSection(data, "about");
  const testimonialsSec = getPortfolioSection(data, "testimonials");
  const benefitsSec = getPortfolioSection(data, "benefits");
  const faqsSec = getPortfolioSection(data, "faqs");

  // Tech items list
  const techItems = [
    "React", "Next.js", "TypeScript", "JavaScript", "Angular", "Tailwind CSS",
    "Node.js", "Bun", "Go", "Express", "Redis", "RabbitMQ", "AWS", "GCP",
    "Docker", "Kubernetes", "Jira", "Jenkins", "Ansible", "Terraform",
    "Prometheus", "Slack", "Twilio", "Mailgun", "Supabase", "PostgreSQL",
    "Prisma", "MongoDB"
  ];

  const marqueeHtml = techItems.map(tech => `
    <span class="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-semibold whitespace-nowrap">
      <i class="fa-solid fa-circle-nodes" style="color: ${data.brandColor};"></i> ${tech}
    </span>
  `).join('\n');

  // Image-only Project cards
  const projectsHtml = data.projects.map(p => {
    const bgImage = p.bannerImage || "";
    const targetUrl = p.liveUrl && p.liveUrl !== '#' ? p.liveUrl : (p.githubUrl && p.githubUrl !== '#' ? p.githubUrl : '#');
    return `
      <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="block aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-md hover:scale-[1.02] hover:shadow-xl transition-all duration-300 relative group">
        ${bgImage 
          ? `<img src="${bgImage}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />`
          : `<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white text-center">
               <i class="fa-solid fa-laptop-code text-3xl mb-2 opacity-80 animate-pulse"></i>
               <span class="font-bold text-lg leading-tight">${p.name || 'Untitled Project'}</span>
             </div>`}
      </a>
    `;
  }).join('\n');

  // Services html render
  const servicesItemsHtml = servicesSec.items.map(s => `
    <div class="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4 hover:border-brandAccent/30 hover:scale-[1.01] transition-all">
      <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
        <i class="${s.icon || 'fa-solid fa-cube'}"></i>
      </div>
      <h3 class="font-bold dark:text-white">${s.title}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">${s.description || ''}</p>
    </div>
  `).join('\n');

  // Stats HTML
  const statsHtml = (aboutSec.stats || []).map(st => `
    <div class="p-6 border border-gray-200 dark:border-white/5 rounded-3xl bg-gray-50 dark:bg-[#0D1117] text-center">
      <h3 class="text-3xl font-extrabold text-brandAccent">${st.value}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold pt-1 uppercase">${st.label}</p>
    </div>
  `).join('\n');

  // Testimonials HTML
  const testimonialsItemsHtml = testimonialsSec.items.map(t => `
    <div class="p-8 border border-gray-200 dark:border-white/5 rounded-3xl space-y-4">
      <p class="italic text-gray-600 dark:text-gray-300">"${t.quote || ''}"</p>
      <div class="pt-2">
        <h4 class="font-bold dark:text-white">${t.name}</h4>
        <p class="text-xs text-gray-400">${t.role}${t.company ? `, ${t.company}` : ''}</p>
      </div>
    </div>
  `).join('\n');

  // Benefits HTML
  const benefitsItemsHtml = benefitsSec.items.map(b => `
    <div class="p-6 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-3xl space-y-2">
      <h3 class="font-bold dark:text-white text-md flex gap-2 items-center">
        <i class="${b.icon || 'fa-solid fa-circle-check'} text-brandAccent"></i> ${b.title}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">${b.description || ''}</p>
    </div>
  `).join('\n');

  // FAQ HTML
  const faqsItemsHtml = faqsSec.items.map((f, idx) => `
    <div class="border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#0D1117] transition-all">
      <button onclick="toggleFaq(${idx})" class="w-full text-left px-6 py-4 font-bold flex justify-between items-center dark:text-white text-sm sm:text-base focus:outline-none">
        <span>${f.question}</span>
        <i id="faq-icon-${idx}" class="fa-solid fa-plus text-xs text-gray-400 transition-transform"></i>
      </button>
      <div id="faq-answer-${idx}" class="hidden px-6 pb-5 text-sm text-gray-500 dark:text-gray-450 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4 bg-white dark:bg-[#161B22]">
        ${f.answer}
      </div>
    </div>
  `).join('\n');

  // Custom User Sections HTML
  const customSectionsHtml = (data.sections || [])
    .filter((s) => s.type === "custom" && s.isVisible)
    .map((s) => {
      const cardHtml = s.items.map((it) => `
        <div class="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-2">
          <h3 class="font-bold dark:text-white">${it.title || ''}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">${it.description || ''}</p>
        </div>
      `).join('\n');
      return `
        <section id="${s.id}" class="max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
          <div class="text-center space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">${s.title}</h4>
            ${s.subtitle ? `<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">${s.subtitle}</h2>` : ''}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${cardHtml}
          </div>
        </section>
      `;
    }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nameCombined} - Portfolio</title>
  
  <meta name="description" content="Portfolio of ${nameCombined} - ${data.jobTitle}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Outfit', 'Poppins', 'sans-serif'],
          },
          colors: {
            brandAccent: '${data.brandColor}',
          }
        }
      }
    }
  </script>
  
  <style>
    html {
      scroll-behavior: smooth;
    }
    body {
      font-family: 'Outfit', 'Poppins', sans-serif;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="${isDark ? 'dark bg-[#0D1117] text-gray-150' : 'bg-gray-50 text-gray-800'} min-h-screen flex flex-col">
  
  <!-- Navigation -->
  <nav class="sticky top-0 z-40 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" class="text-xl font-bold tracking-tight dark:text-white">${data.firstName}</a>
      
      <div class="flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
        ${servicesSec.isVisible ? `<a href="#services" class="hover:text-brandAccent transition-colors">${servicesSec.title}</a>` : ''}
        ${aboutSec.isVisible ? `<a href="#about-us" class="hover:text-brandAccent transition-colors">${aboutSec.title}</a>` : ''}
        <a href="#projects" class="hover:text-brandAccent transition-colors">Projects</a>
        <a href="#contact" class="hover:text-brandAccent transition-colors">Contact Us</a>
      </div>
      
      <div class="hidden sm:block">
        ${data.resumeUrl ? `
          <a href="${data.resumeUrl}" download target="_blank" class="px-4 py-2 border border-gray-300 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs font-bold text-gray-900 dark:text-white">
            Resume <i class="fa-solid fa-arrow-down ml-1"></i>
          </a>
        ` : ''}
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="max-w-6xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
    <div class="space-y-6">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandAccent/10 text-brandAccent text-xs font-semibold uppercase tracking-wide">
        <span class="w-1.5 h-1.5 rounded-full bg-brandAccent animate-pulse"></span> Available for projects
      </div>
      <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight dark:text-white leading-tight">
        Turn your idea into a successful <span style="color: ${data.brandColor};">Website</span> today.
      </h2>
      <p class="text-lg text-gray-500 dark:text-gray-400 font-light">
        We help businesses like yours earn more customers, standout from competitors, make more money.
      </p>
      
      <!-- User profile block -->
      <div class="p-6 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-3xl space-y-4 shadow-sm">
        <div class="flex gap-4 items-center">
          ${data.avatarUrl ? `<img src="${data.avatarUrl}" alt="${nameCombined}" class="w-12 h-12 rounded-full object-cover" />` : ''}
          <div>
            <h4 class="font-bold dark:text-white">${nameCombined}</h4>
            <p class="text-xs text-gray-400">${data.jobTitle}</p>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">${data.bio}</p>
        
        <div class="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          ${data.email ? `<span><i class="fa-solid fa-envelope mr-1.5 text-brandAccent"></i> ${data.email}</span>` : ''}
          ${data.location ? `<span><i class="fa-solid fa-location-dot mr-1.5 text-red-500"></i> ${data.location}</span>` : ''}
        </div>
      </div>
    </div>
    
    <div class="relative flex justify-center">
      <div class="absolute -inset-4 bg-brandAccent/20 rounded-full blur-[100px] pointer-events-none"></div>
      ${data.avatarUrl ? `
        <img src="${data.avatarUrl}" alt="${nameCombined}" class="w-72 h-72 sm:w-96 sm:h-96 object-cover rounded-3xl border-4 border-white dark:border-white/10 shadow-2xl relative z-10 hover:scale-[1.01] transition-all duration-300" />
      ` : `
        <div class="w-72 h-72 sm:w-96 sm:h-96 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161B22] flex items-center justify-center relative z-10 shadow-2xl">
          <i class="fa-solid fa-user text-8xl text-gray-200 dark:text-gray-700"></i>
        </div>
      `}
    </div>
  </section>

  <!-- Tech Stack Marquee -->
  <section class="py-8 bg-white dark:bg-[#161B22] border-y border-gray-200 dark:border-white/5 overflow-hidden w-full">
    <div class="flex gap-4 animate-marquee overflow-x-auto scrollbar-hide py-1">
      <div class="flex gap-4 shrink-0 px-4 justify-around min-w-full">
        ${marqueeHtml}
      </div>
      <div class="flex gap-4 shrink-0 px-4 justify-around min-w-full">
        ${marqueeHtml}
      </div>
    </div>
  </section>

  <!-- Services Section -->
  ${servicesSec.isVisible ? `
  <section id="services" class="max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
    <div class="text-center space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">${servicesSec.title}</h4>
      ${servicesSec.subtitle ? `<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">${servicesSec.subtitle}</h2>` : ''}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      ${servicesItemsHtml}
    </div>
  </section>
  ` : ''}

  <!-- About Us Section -->
  ${aboutSec.isVisible ? `
  <section id="about-us" class="py-20 bg-white dark:bg-[#161B22] border-y border-gray-200 dark:border-white/5 w-full">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">${aboutSec.title}</h4>
        ${aboutSec.subtitle ? `<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white leading-tight">${aboutSec.subtitle}</h2>` : ''}
        <p class="text-gray-500 dark:text-gray-300 leading-relaxed font-light">
          ${aboutSec.aboutDescription || ''}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        ${statsHtml}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Projects Section (Image/Photo grid only) -->
  <section id="projects" class="max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
    <div class="text-center space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">Projects</h4>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">Selected Projects & Works</h2>
      <p class="text-sm text-gray-400 font-light">Click any card preview image below to visit the live site directly.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      ${projectsHtml || '<div class="col-span-2 text-center py-12 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl"><p class="text-gray-400 italic text-sm">No project cards configured. Open the Editor to add items.</p></div>'}
    </div>
  </section>

  <!-- Client Testimonials Section -->
  ${testimonialsSec.isVisible ? `
  <section class="py-20 bg-white dark:bg-[#161B22] border-y border-gray-200 dark:border-white/5 w-full">
    <div class="max-w-6xl mx-auto px-6 space-y-12">
      <div class="text-center space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">${testimonialsSec.title}</h4>
        ${testimonialsSec.subtitle ? `<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">${testimonialsSec.subtitle}</h2>` : ''}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${testimonialsItemsHtml}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Benefits Section -->
  ${benefitsSec.isVisible ? `
  <section class="max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
    <div class="text-center space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">${benefitsSec.title}</h4>
      ${benefitsSec.subtitle ? `<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">${benefitsSec.subtitle}</h2>` : ''}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      ${benefitsItemsHtml}
    </div>
  </section>
  ` : ''}

  <!-- FAQ Section -->
  ${faqsSec.isVisible ? `
  <section class="py-20 bg-white dark:bg-[#161B22] border-y border-gray-200 dark:border-white/5 w-full">
    <div class="max-w-4xl mx-auto px-6 space-y-12">
      <div class="text-center space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">${faqsSec.title}</h4>
        ${faqsSec.subtitle ? `<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">${faqsSec.subtitle}</h2>` : ''}
      </div>

      <div class="space-y-4">
        ${faqsItemsHtml}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Custom User Sections -->
  ${customSectionsHtml}

  <!-- Contact Us / Get in touch -->
  <section id="contact" class="max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
    <div class="space-y-6">
      <h4 class="text-xs font-bold uppercase tracking-widest text-brandAccent">Get In Touch</h4>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">Let's build something real.</h2>
      <p class="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
        Let's turn your ideas into meaningful products that solve real problems and create real impact.
      </p>

      <div class="space-y-4 pt-6 text-sm">
        <div class="flex gap-4 items-center">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-brandAccent flex items-center justify-center"><i class="fa-solid fa-envelope"></i></div>
          <div>
            <h4 class="font-bold dark:text-white text-xs text-gray-400 uppercase">Email Me</h4>
            <a href="mailto:${data.email || 'rupeshjagtap157@gmail.com'}" class="font-semibold text-gray-800 dark:text-gray-200">${data.email || 'rupeshjagtap157@gmail.com'}</a>
          </div>
        </div>

        <div class="flex gap-4 items-center">
          <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center"><i class="fa-solid fa-location-dot"></i></div>
          <div>
            <h4 class="font-bold dark:text-white text-xs text-gray-400 uppercase">Location</h4>
            <span class="font-semibold text-gray-800 dark:text-gray-200">${data.location || 'Pune, India'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
      <form id="contact-form" class="space-y-4" onsubmit="handleSubmit(event)">
        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500">Name</label>
          <input id="form-name" type="text" required placeholder="John Doe" class="w-full bg-gray-55 dark:bg-[#0D1117] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brandAccent/30" />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500">Email Address</label>
          <input id="form-email" type="email" required placeholder="john@example.com" class="w-full bg-gray-55 dark:bg-[#0D1117] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brandAccent/30" />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500">Your Message</label>
          <textarea id="form-message" required placeholder="How can I help you build something great?" rows="4" class="w-full bg-gray-55 dark:bg-[#0D1117] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brandAccent/30 resize-none"></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-brandAccent text-gray-950 font-bold rounded-xl shadow-lg shadow-brandAccent/20 hover:brightness-105 active:scale-[0.99] transition-all text-sm cursor-pointer">
          Send Message
        </button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto bg-white dark:bg-[#0D1117] border-t border-gray-200 dark:border-white/5 py-12 px-6">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="space-y-3">
        <h3 class="font-extrabold text-lg dark:text-white">${data.firstName}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
          ${nameCombined} – A passionate software engineer and designer crafting bespoke web experiences.
        </p>
      </div>

      <div class="space-y-3">
        <h4 class="font-bold text-xs uppercase tracking-wider text-gray-400">Quick Links</h4>
        <div class="flex flex-col gap-2 text-xs font-semibold text-gray-500 dark:text-gray-450">
          ${servicesSec.isVisible ? `<a href="#services" class="hover:underline">${servicesSec.title}</a>` : ''}
          ${aboutSec.isVisible ? `<a href="#about-us" class="hover:underline">${aboutSec.title}</a>` : ''}
          <a href="#contact" class="hover:underline">Contact Us</a>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="font-bold text-xs uppercase tracking-wider text-gray-400">Services</h4>
        <div class="flex flex-col gap-2 text-xs font-semibold text-gray-500 dark:text-gray-450">
          <a href="#services" class="hover:underline">Web Development</a>
          <a href="#services" class="hover:underline">Mobile Application</a>
          <a href="#services" class="hover:underline">UI/UX Interface Design</a>
          <a href="#services" class="hover:underline">Brand Identity & Strategy</a>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="font-bold text-xs uppercase tracking-wider text-gray-400">Office Details</h4>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-450 space-y-1">
          <p>${data.location || 'Pune, India'}</p>
          <p class="underline">${data.email || 'rupeshjagtap157@gmail.com'}</p>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto pt-8 mt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
      <p>© 2026 ${nameCombined}. All rights reserved.</p>
      <div class="flex gap-4">
        <a href="#" class="hover:underline">Privacy Policy</a>
        <a href="#" class="hover:underline">Terms of Service</a>
        <a href="#" class="hover:underline">Back to top</a>
      </div>
    </div>
  </footer>

  <!-- Script logics -->
  <script>
    function toggleFaq(id) {
      const ans = document.getElementById('faq-answer-' + id);
      const icon = document.getElementById('faq-icon-' + id);
      if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        icon.className = 'fa-solid fa-minus text-xs text-gray-400';
      } else {
        ans.classList.add('hidden');
        icon.className = 'fa-solid fa-plus text-xs text-gray-400';
      }
    }

    function handleSubmit(e) {
      e.preventDefault();
      alert('Thank you for getting in touch, ' + document.getElementById('form-name').value + '! Messages will sync once deployed.');
      document.getElementById('contact-form').reset();
    }
  </script>
</body>
</html>`;
}

// -------------------- 2. MINIMALIST TEMPLATE --------------------
export function generateMinimalistTemplate(data: PortfolioData): string {
  const nameCombined = `${data.firstName} ${data.lastName}`;
  const isDark = data.themeMode === 'dark';

  const servicesSec = getPortfolioSection(data, "services");
  const aboutSec = getPortfolioSection(data, "about");
  const testimonialsSec = getPortfolioSection(data, "testimonials");
  const benefitsSec = getPortfolioSection(data, "benefits");
  const faqsSec = getPortfolioSection(data, "faqs");

  const projectsHtml = data.projects.map(p => {
    const bgImage = p.bannerImage || "";
    const targetUrl = p.liveUrl && p.liveUrl !== '#' ? p.liveUrl : (p.githubUrl && p.githubUrl !== '#' ? p.githubUrl : '#');
    return `
      <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="block aspect-video w-full rounded overflow-hidden border border-gray-300 dark:border-white/10 shadow-sm hover:opacity-90 transition-opacity duration-300 relative group">
        ${bgImage 
          ? `<img src="${bgImage}" alt="${p.name}" class="w-full h-full object-cover" />`
          : `<div class="w-full h-full bg-gray-100 dark:bg-[#111] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-gray-300 dark:border-white/10">
               <span class="font-mono text-sm font-bold">${p.name || 'Project'}</span>
             </div>`}
      </a>
    `;
  }).join('\n');

  // Services HTML
  const servicesItemsHtml = servicesSec.items.map(s => `
    <div class="space-y-2">
      <h4 class="font-bold font-mono text-sm">${s.title}</h4>
      <p class="text-xs text-gray-555 dark:text-gray-400 leading-relaxed font-light">${s.description || ''}</p>
    </div>
  `).join('\n');

  // Stats HTML
  const statsHtml = (aboutSec.stats || []).map(st => `
    <div>
      <span class="block text-xl font-bold dark:text-white">${st.value}</span>
      <span>${st.label}</span>
    </div>
  `).join('\n');

  // Testimonials HTML
  const testimonialsItemsHtml = testimonialsSec.items.map(t => `
    <div class="p-6 border border-gray-200 dark:border-white/10 rounded space-y-2">
      <p class="italic text-xs">"${t.quote || ''}"</p>
      <p class="text-[10px] font-mono text-gray-400">— ${t.name}, ${t.role}${t.company ? ` (${t.company})` : ''}</p>
    </div>
  `).join('\n');

  // Benefits HTML
  const benefitsItemsHtml = benefitsSec.items.map(b => `
    <div class="space-y-1">
      <h4 class="font-bold font-mono text-xs">// ${b.title}</h4>
      <p class="text-xs text-gray-500 leading-relaxed font-light">${b.description || ''}</p>
    </div>
  `).join('\n');

  // FAQs HTML
  const faqsItemsHtml = faqsSec.items.map((f, idx) => `
    <div class="border-b border-gray-100 dark:border-white/5 py-2">
      <p class="font-bold cursor-pointer" onclick="toggleFaq(${idx})">[+] ${f.question}</p>
      <p id="faq-ans-${idx}" class="hidden text-gray-550 mt-2 pl-4">${f.answer}</p>
    </div>
  `).join('\n');

  // Custom User Sections HTML
  const customSectionsHtml = (data.sections || [])
    .filter((s) => s.type === "custom" && s.isVisible)
    .map((s) => {
      const cardHtml = s.items.map((it) => `
        <div class="space-y-1.5">
          <h4 class="font-bold font-mono text-sm">${it.title || ''}</h4>
          <p class="text-xs text-gray-555 dark:text-gray-400 leading-relaxed font-light">${it.description || ''}</p>
        </div>
      `).join('\n');
      return `
        <section id="${s.id}" class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
          <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// ${s.title}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${cardHtml}
          </div>
        </section>
      `;
    }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nameCombined} - Portfolio</title>
  <meta name="description" content="Portfolio of ${nameCombined} - ${data.jobTitle}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['Courier Prime', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: ${isDark ? '#0a0a0a' : '#ffffff'};
      color: ${isDark ? '#e5e5e5' : '#171717'};
    }
  </style>
</head>
<body class="max-w-5xl mx-auto px-6 py-12 font-sans">
  
  <!-- Header -->
  <header class="flex justify-between items-center py-6 border-b border-gray-200 dark:border-white/10 mb-12">
    <h1 class="text-xl font-bold font-mono tracking-widest uppercase">${data.firstName}</h1>
    <nav class="flex gap-6 text-xs font-mono">
      ${servicesSec.isVisible ? `<a href="#services" class="hover:underline">${servicesSec.title}</a>` : ''}
      ${aboutSec.isVisible ? `<a href="#about-us" class="hover:underline">${aboutSec.title}</a>` : ''}
      <a href="#projects" class="hover:underline">Work</a>
      <a href="#contact" class="hover:underline">Contact</a>
    </nav>
  </header>

  <!-- Hero -->
  <section class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h2 class="text-3xl md:text-5xl font-light font-mono leading-tight tracking-tight">// Turn your idea into a successful Website today.</h2>
    <p class="text-sm font-mono text-gray-500 max-w-2xl">
      We help businesses like yours earn more customers, standout from competitors, make more money.
    </p>

    <div class="py-6 space-y-3 border-t border-dashed border-gray-200 dark:border-white/10 max-w-3xl">
      <h3 class="font-bold font-mono tracking-widest text-sm uppercase">${nameCombined}</h3>
      <p class="text-xs font-mono text-gray-400">// ${data.jobTitle}</p>
      <p class="text-sm font-light leading-relaxed">${data.bio}</p>
      <div class="flex gap-6 pt-2 text-xs font-mono text-gray-500">
        ${data.email ? `<span><i class="fa-solid fa-envelope mr-1.5"></i> ${data.email}</span>` : ''}
        ${data.location ? `<span><i class="fa-solid fa-location-dot mr-1.5"></i> ${data.location}</span>` : ''}
      </div>
    </div>
  </section>

  <!-- Services -->
  ${servicesSec.isVisible ? `
  <section id="services" class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// ${servicesSec.title}</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      ${servicesItemsHtml}
    </div>
  </section>
  ` : ''}

  <!-- About Us Success Stories -->
  ${aboutSec.isVisible ? `
  <section id="about-us" class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// ${aboutSec.title}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="space-y-4">
        <h4 class="text-lg font-bold font-mono">${aboutSec.subtitle || ''}</h4>
        <p class="text-sm text-gray-555 leading-relaxed font-light">
          ${aboutSec.aboutDescription || ''}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4 font-mono text-xs text-gray-500">
        ${statsHtml}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Projects (Gallery of images only) -->
  <section id="projects" class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// Selected Work</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${projectsHtml || '<p class="text-xs font-mono text-gray-400">No project works available.</p>'}
    </div>
  </section>

  <!-- Client Testimonials -->
  ${testimonialsSec.isVisible ? `
  <section class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// ${testimonialsSec.title}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${testimonialsItemsHtml}
    </div>
  </section>
  ` : ''}

  <!-- Benefits -->
  ${benefitsSec.isVisible ? `
  <section class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// ${benefitsSec.title}</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
      ${benefitsItemsHtml}
    </div>
  </section>
  ` : ''}

  <!-- FAQ Accordion -->
  ${faqsSec.isVisible ? `
  <section class="py-12 border-b border-gray-200 dark:border-white/10 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// ${faqsSec.title}</h3>
    <div class="space-y-3 font-mono text-xs">
      ${faqsItemsHtml}
    </div>
  </section>
  ` : ''}

  <!-- Custom User Sections -->
  ${customSectionsHtml}

  <!-- Contact -->
  <section id="contact" class="py-12 space-y-6">
    <h3 class="text-xs uppercase tracking-widest font-mono text-gray-400">// Contact</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono">
      <div class="space-y-4">
        <h4 class="text-lg font-bold">Let's build something real.</h4>
        <p class="text-xs text-gray-500 leading-relaxed">Let's turn your ideas into meaningful products that solve real problems and create real impact.</p>
        <div class="text-xs space-y-1.5 pt-4 text-gray-500">
          <p>Email: ${data.email || 'rupeshjagtap157@gmail.com'}</p>
          <p>Location: ${data.location || 'Pune, India'}</p>
        </div>
      </div>
      <form id="contact-form" class="space-y-3 text-xs" onsubmit="alert('Form submitted'); return false;">
        <input type="text" placeholder="Name" required class="w-full bg-transparent border-b border-gray-300 dark:border-white/10 py-2 focus:outline-none focus:border-white" />
        <input type="email" placeholder="Email Address" required class="w-full bg-transparent border-b border-gray-300 dark:border-white/10 py-2 focus:outline-none focus:border-white" />
        <textarea placeholder="Message" required rows="3" class="w-full bg-transparent border-b border-gray-300 dark:border-white/10 py-2 focus:outline-none focus:border-white resize-none"></textarea>
        <button type="submit" class="px-6 py-2 border border-gray-400 text-gray-700 dark:text-white rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Submit</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="pt-12 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-xs font-mono text-gray-500">
    <p>© 2026 ${data.firstName}. All rights reserved.</p>
    <div class="flex gap-4">
      ${data.githubUrl ? `<a href="${data.githubUrl}" class="hover:underline">GitHub</a>` : ''}
      ${data.linkedinUrl ? `<a href="${data.linkedinUrl}" class="hover:underline">LinkedIn</a>` : ''}
    </div>
  </footer>

  <script>
    function toggleFaq(id) {
      const el = document.getElementById('faq-ans-' + id);
      el.classList.toggle('hidden');
    }
  </script>
</body>
</html>`;
}

// -------------------- 3. GLASSMORPHISM TEMPLATE --------------------
export function generateGlassmorphismTemplate(data: PortfolioData): string {
  const nameCombined = `${data.firstName} ${data.lastName}`;
  const isDark = data.themeMode === 'dark';

  const servicesSec = getPortfolioSection(data, "services");
  const aboutSec = getPortfolioSection(data, "about");
  const testimonialsSec = getPortfolioSection(data, "testimonials");
  const benefitsSec = getPortfolioSection(data, "benefits");
  const faqsSec = getPortfolioSection(data, "faqs");

  const projectsHtml = data.projects.map(p => {
    const bgImage = p.bannerImage || "";
    const targetUrl = p.liveUrl && p.liveUrl !== '#' ? p.liveUrl : (p.githubUrl && p.githubUrl !== '#' ? p.githubUrl : '#');
    return `
      <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="block aspect-video w-full rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300 relative group shadow-lg shadow-indigo-500/5">
        ${bgImage 
          ? `<img src="${bgImage}" alt="${p.name}" class="w-full h-full object-cover" />`
          : `<div class="w-full h-full bg-white/10 dark:bg-[#1e1b4b]/20 flex flex-col items-center justify-center p-6 text-center">
               <span class="font-bold text-lg text-indigo-400">${p.name || 'Project'}</span>
             </div>`}
      </a>
    `;
  }).join('\n');

  // Services HTML
  const servicesItemsHtml = servicesSec.items.map(s => `
    <div class="space-y-2">
      <h4 class="font-bold text-md dark:text-white">${s.title}</h4>
      <p class="text-xs text-gray-500 leading-relaxed font-light">${s.description || ''}</p>
    </div>
  `).join('\n');

  // Testimonials HTML
  const testimonialsItemsHtml = testimonialsSec.items.map(t => `
    <div class="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-2">
      <p class="italic text-xs font-light">"${t.quote || ''}"</p>
      <p class="text-[10px] text-indigo-400 font-semibold">— ${t.name}, ${t.role}</p>
    </div>
  `).join('\n');

  // FAQ HTML
  const faqsItemsHtml = faqsSec.items.map((f, idx) => `
    <div class="border-b border-white/10 py-3">
      <p class="font-bold cursor-pointer text-sm" onclick="toggleFaq(${idx})">[+] ${f.question}</p>
      <p id="faq-ans-${idx}" class="hidden text-xs text-gray-400 mt-2 pl-4 leading-relaxed">${f.answer}</p>
    </div>
  `).join('\n');

  // Custom User Sections HTML
  const customSectionsHtml = (data.sections || [])
    .filter((s) => s.type === "custom" && s.isVisible)
    .map((s) => {
      const cardHtml = s.items.map((it) => `
        <div class="space-y-2">
          <h4 class="font-bold text-md dark:text-white">${it.title || ''}</h4>
          <p class="text-xs text-gray-500 leading-relaxed font-light">${it.description || ''}</p>
        </div>
      `).join('\n');
      return `
        <section id="${s.id}" class="glass-card rounded-[2rem] p-8 shadow-xl space-y-6 text-left">
          <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-400">${s.title}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${cardHtml}
          </div>
        </section>
      `;
    }).join('\n');

  const bgStyle = isDark 
    ? `background: radial-gradient(circle at 10% 20%, #100e2b 0%, #03040c 100%);`
    : `background: radial-gradient(circle at 10% 20%, #eff6ff 0%, #f8fafc 100%);`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nameCombined} - Portfolio</title>
  <meta name="description" content="Portfolio of ${nameCombined} - ${data.jobTitle}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Outfit', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Outfit', sans-serif;
      ${bgStyle}
      color: ${isDark ? '#e2e8f0' : '#1e293b'};
    }
    .glass-card {
      background: ${isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.4)'};
      backdrop-filter: blur(16px);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.2)'};
    }
  </style>
</head>
<body class="min-h-screen px-6 py-12 sm:px-12">
  <main class="max-w-5xl mx-auto space-y-12">
    
    <!-- Header -->
    <header class="glass-card rounded-[2rem] px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 class="font-bold text-lg">${data.firstName}</h1>
      <nav class="flex gap-6 text-sm font-semibold">
        ${servicesSec.isVisible ? `<a href="#services" class="hover:text-indigo-400 transition-colors">${servicesSec.title}</a>` : ''}
        ${aboutSec.isVisible ? `<a href="#about-us" class="hover:text-indigo-400 transition-colors">${aboutSec.title}</a>` : ''}
        <a href="#projects" class="hover:text-indigo-400 transition-colors">Work</a>
        <a href="#contact" class="hover:text-indigo-400 transition-colors">Contact</a>
      </nav>
    </header>

    <!-- Hero Card -->
    <section class="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-6 relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
      
      <div class="space-y-4 relative z-10 text-left">
        <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">Turn your idea into a successful Website today.</h2>
        <p class="text-md text-gray-500 max-w-2xl font-light">We help businesses like yours earn more customers, standout from competitors, make more money.</p>
        
        <div class="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center gap-6">
          ${data.avatarUrl ? `<img src="${data.avatarUrl}" alt="Avatar" class="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/20" />` : ''}
          <div class="flex-1">
            <h4 class="font-bold text-base">${nameCombined}</h4>
            <p class="text-xs text-indigo-400 font-semibold uppercase tracking-wider">${data.jobTitle}</p>
            <p class="text-sm mt-1 text-gray-400 max-w-2xl">${data.bio}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    ${servicesSec.isVisible ? `
    <section id="services" class="glass-card rounded-[2rem] p-8 shadow-xl space-y-6 text-left">
      <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-400">${servicesSec.title}</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        ${servicesItemsHtml}
      </div>
    </section>
    ` : ''}

    <!-- About Section -->
    ${aboutSec.isVisible ? `
    <section id="about-us" class="glass-card rounded-[2rem] p-8 shadow-xl space-y-6 text-left">
      <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-400">${aboutSec.title}</h3>
      <p class="text-sm text-gray-500 font-light leading-relaxed">${aboutSec.aboutDescription || ''}</p>
    </section>
    ` : ''}

    <!-- Projects (Gallery of images only) -->
    <section id="projects" class="space-y-6">
      <h3 class="text-2xl font-bold tracking-tight text-left">Selected Projects & Works</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projectsHtml || '<p class="text-sm text-gray-400 py-8 text-center glass-card rounded-[2rem]">No project cards configured.</p>'}
      </div>
    </section>

    <!-- Testimonials -->
    ${testimonialsSec.isVisible ? `
    <section class="glass-card rounded-[2rem] p-8 shadow-xl space-y-6 text-left">
      <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-400">${testimonialsSec.title}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${testimonialsItemsHtml}
      </div>
    </section>
    ` : ''}

    <!-- FAQ Accordion -->
    ${faqsSec.isVisible ? `
    <section class="glass-card rounded-[2rem] p-8 shadow-xl space-y-6 text-left">
      <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-400">${faqsSec.title}</h3>
      <div class="space-y-3">
        ${faqsItemsHtml}
      </div>
    </section>
    ` : ''}

    <!-- Custom User Sections -->
    ${customSectionsHtml}

    <!-- Contact & Form -->
    <section id="contact" class="glass-card rounded-[2.5rem] p-8 shadow-2xl text-left">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="space-y-4">
          <h4 class="text-3xl font-extrabold tracking-tight">Let's build something real.</h4>
          <p class="text-sm text-gray-500">Let's turn your ideas into meaningful products that solve real problems and create real impact.</p>
          <div class="text-xs space-y-1.5 pt-4 text-gray-400">
            <p>Email: ${data.email || 'rupeshjagtap157@gmail.com'}</p>
            <p>Location: ${data.location || 'Pune, India'}</p>
          </div>
        </div>
        <form id="contact-form" class="space-y-4 text-sm" onsubmit="alert('Form submitted'); return false;">
          <input type="text" placeholder="Name" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500" />
          <input type="email" placeholder="Email Address" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500" />
          <textarea placeholder="Message" required rows="3" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 resize-none"></textarea>
          <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">Submit</button>
        </form>
      </div>
    </section>

    <!-- Footer -->
    <footer class="glass-card rounded-[2rem] p-6 flex justify-between items-center text-xs text-gray-400">
      <p>© 2026 ${data.firstName}. All rights reserved.</p>
      <div class="flex gap-4">
        ${data.githubUrl ? `<a href="${data.githubUrl}" class="hover:text-indigo-400 transition-colors">GitHub</a>` : ''}
        ${data.linkedinUrl ? `<a href="${data.linkedinUrl}" class="hover:text-indigo-400 transition-colors">LinkedIn</a>` : ''}
      </div>
    </footer>

  </main>

  <script>
    function toggleFaq(id) {
      const el = document.getElementById('faq-ans-' + id);
      el.classList.toggle('hidden');
    }
  </script>
</body>
</html>`;
}
