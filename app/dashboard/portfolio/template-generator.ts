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
}

export function generatePortfolioHtml(data: PortfolioData): string {
  const nameCombined = `${data.firstName} ${data.lastName}`;
  const jobTitleParts = data.jobTitle.split(" ");
  const firstJobWord = jobTitleParts[0] || "";
  const restJobWords = jobTitleParts.slice(1).join(" ") || "";
  const displayAvatar = data.avatarUrl || "";

  // Helper to map skill names to FontAwesome icons and colors
  const getSkillIconAndColors = (skillName: string) => {
    const lower = skillName.toLowerCase();
    if (lower.includes("react")) return { icon: "fa-brands fa-react", color: "#61DAFB", bg: "#0D1117" };
    if (lower.includes("node")) return { icon: "fa-brands fa-node-js", color: "#68A063", bg: "#1A2E1C" };
    if (lower.includes("js") || lower.includes("javascript")) return { icon: "fa-brands fa-js", color: "#F7DF1E", bg: "#2B2914" };
    if (lower.includes("mongo")) return { icon: "fa-solid fa-database", color: "#4DB33D", bg: "#0F1E11" };
    if (lower.includes("express")) return { icon: "fa-solid fa-server", color: "#alignment", bg: "#212121" };
    if (lower.includes("tailwind")) return { icon: "fa-solid fa-wind", color: "#38BDF8", bg: "#1E293B" };
    if (lower.includes("bootstrap")) return { icon: "fa-brands fa-bootstrap", color: "#7952B3", bg: "#25153A" };
    if (lower.includes("figma")) return { icon: "fa-brands fa-figma", color: "#F24E1E", bg: "#2A1A15" };
    if (lower.includes("git")) return { icon: "fa-brands fa-git-alt", color: "#F05032", bg: "#2D1D19" };
    if (lower.includes("c++") || lower.includes("cpp")) return { icon: "fa-solid fa-microchip", color: "#00599C", bg: "#112233" };
    if (lower.includes("python")) return { icon: "fa-brands fa-python", color: "#3776AB", bg: "#142533" };
    if (lower.includes("ts") || lower.includes("typescript")) return { icon: "fa-solid fa-code", color: "#3178C6", bg: "#152538" };
    if (lower.includes("html")) return { icon: "fa-brands fa-html5", color: "#E34F26", bg: "#2D1914" };
    if (lower.includes("css")) return { icon: "fa-brands fa-css3-alt", color: "#1572B6", bg: "#132130" };
    if (lower.includes("sql") || lower.includes("postgres") || lower.includes("mysql")) return { icon: "fa-solid fa-database", color: "#336791", bg: "#142533" };
    return { icon: "fa-solid fa-code", color: data.brandColor, bg: "#1F242E" };
  };

  const skillsHtml = data.skills.map((skill) => {
    const { icon, color, bg } = getSkillIconAndColors(skill.name);
    return `
          <li class="skill-item skill-card-size flex flex-col justify-center items-center shadow-md rounded-xl p-4 w-[180px] h-[180px]" style="background-color: ${bg};">
            <i class="${icon} text-5xl mb-3 skill-img" style="color: ${color};"></i>
            <p class="skill-name-text text-lg font-semibold text-white">${skill.name}</p>
          </li>`;
  }).join("\n");

  const projectsHtml = data.projects.map((proj) => {
    const bgImage = proj.bannerImage || "";

    const github = proj.githubUrl && proj.githubUrl !== "#";
    const live = proj.liveUrl && proj.liveUrl !== "#";

    return `
        <!-- ${proj.name} Card -->
        <article class="project-card group bg-white dark:bg-[#161B22] shadow-md rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5">
          ${bgImage ? `<div class="h-48 bg-cover bg-center" style="background-image: url('${bgImage}')"></div>` : `<div class="h-48 bg-gray-100 dark:bg-[#202731] flex items-center justify-center"><i class="fa-solid fa-image text-4xl text-gray-300 dark:text-gray-600"></i></div>`}
          <div class="p-5 flex flex-col justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">${proj.name || "Untitled Project"}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mt-2 min-h-[40px]">${proj.description || (proj.techStack ? `Built with ${proj.techStack}` : "A software application built using modern tech stack.")}</p>
            <div class="flex gap-4 mt-5">
              <a href="${proj.githubUrl || "#"}" target="_blank" rel="noopener noreferrer" class="bg-[#2b2414] dark:bg-black hover:bg-brandYellow hover:text-gray-900 transition-colors text-white font-medium py-2 px-4 rounded-lg flex items-center text-sm ${!github ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}" ${!github ? "onclick='event.preventDefault()'" : ""}>
                <i class="fa-brands fa-github mr-2"></i>GitHub
              </a>
              <a href="${proj.liveUrl || "#"}" target="_blank" rel="noopener noreferrer" class="bg-[#1c26db] hover:bg-[#121ba8] transition-colors text-white font-medium py-2 px-4 rounded-lg flex items-center text-sm ${!live ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}" ${!live ? "onclick='event.preventDefault()'" : ""}>
                <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i>Visit Site
              </a>
            </div>
          </div>
        </article>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nameCombined} - Portfolio</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="Portfolio of ${nameCombined} - ${data.jobTitle}">
  <meta name="keywords" content="${nameCombined}, ${data.jobTitle}, Portfolio, Software Developer">
  <meta name="author" content="${nameCombined}">
  
  <!-- FontAwesome for Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Outfit', 'Poppins', 'sans-serif'],
          },
          colors: {
            brandYellow: '${data.brandColor}',
            brandDark: '#0D1117',
          }
        }
      }
    }
  </script>

  <style>
    /* Global Styles */
    body {
      font-family: 'Outfit', 'Poppins', sans-serif;
      background-color: ${data.themeMode === "light" ? "#f1f1f6" : "#0D1117"};
      padding-left: 8rem;
      padding-right: 8rem;
      scroll-behavior: smooth;
      color: ${data.themeMode === "light" ? "#1f2937" : "#f3f4f6"};
    }

    @media (max-width: 650px) {
      body {
        padding-left: 2rem;
        padding-right: 2rem;
        margin: 0px;
      }
    }

    /* Navbar Custom Styles */
    .navbar {
      border-bottom: 1px solid rgba(0, 0, 0, ${data.themeMode === "light" ? "0.1" : "0.3"});
      border-radius: 1rem;
      box-shadow: 0px 4px 20px rgba(65, 65, 65, ${data.themeMode === "light" ? "0.08" : "0.2"});
      transition: all 0.3s ease;
    }

    @media (max-width: 750px) {
      .navbar-icons-desktop {
        display: none !important;
      }
      .dark-toggle {
        display: none !important;
      }
      .bar {
        display: block !important;
      }
    }

    @media (max-width: 650px) {
      .res {
        transform: scale(0.9);
      }
    }

    @media (max-width: 550px) {
      .navbar {
        padding: 1rem 1.5rem !important;
      }
    }

    @media (max-width: 470px) {
      .navbar {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .res {
        transform: scale(0.8);
      }
      .nav-btn {
        padding: 0.5rem 1.5rem !important;
      }
    }

    /* Hero custom media query */
    @media (max-width: 430px) {
      .hero-content {
        padding: 1rem;
        gap: 1rem;
      }
      .hero-container {
        margin-top: 1rem;
        margin-bottom: 1.5rem;
      }
    }

    /* Skills custom media query */
    @media (max-width: 450px) {
      .skill-box {
        gap: 10px;
      }
      .skill-card-size {
        height: 8rem !important;
        width: 8rem !important;
      }
      .skill-img-size {
        font-size: 2.5rem !important;
      }
      .skill-name-text {
        font-size: 0.875rem !important;
      }
    }

    /* Animations & Transitions */
    @keyframes floatHorizontal {
      0% { transform: translateX(10px); }
      50% { transform: translateX(230px); }
      100% { transform: translateX(10px); }
    }

    .floating-dot {
      animation: floatHorizontal 3s infinite ease-in-out;
    }

    /* Skill Card Hover Shake Animation */
    .skill-item {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .skill-item:hover {
      transform: scale(1.1);
      box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.25);
      animation: shakeRotate 0.4s ease-in-out;
    }

    @keyframes shakeRotate {
      0% { transform: scale(1.1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-3deg); }
      50% { transform: scale(1.1) rotate(3deg); }
      75% { transform: scale(1.1) rotate(-3deg); }
      100% { transform: scale(1.1) rotate(0deg); }
    }

    .skill-img {
      transition: transform 0.3s ease-in-out;
    }

    .skill-item:hover .skill-img {
      animation: imgRotate 0.4s ease-in-out;
    }

    @keyframes imgRotate {
      0% { transform: rotate(0deg); }
      33% { transform: rotate(5deg); }
      66% { transform: rotate(-5deg); }
      100% { transform: rotate(0deg); }
    }

    /* Project Card Transitions */
    .project-card {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .project-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }

    /* Toast styling */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background-color: #333;
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transform: translateY(150%);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 100;
    }
    .toast.show {
      transform: translateY(0);
    }
  </style>
</head>
<body class="py-6 ${data.themeMode === "dark" ? "dark bg-[#0D1117] text-white" : "bg-[#f1f1f6] text-gray-800"}">

  <!-- Desktop & Tablet Navbar -->
  <header id="home-section" class="navbar flex bg-white dark:bg-[#161B22] h-16 justify-between p-8 items-center mt-3">
    <!-- Resume Button -->
    <div class="navbar-hireme-section hover:scale-110 ease-in-out transition-all">
      <a href="${data.resumeUrl}" download="${data.firstName}_Resume.pdf" target="_blank">
        <button class="nav-btn res p-2 w-28 rounded-2xl bg-brandYellow text-gray-950 font-medium text-sm cursor-pointer hover:brightness-110 transition-all">
          Resume <i class="fa-solid fa-arrow-right ml-1"></i>
        </button>
      </a>
    </div>

    <!-- Desktop Navigation Links -->
    <nav class="navbar-icons-desktop flex gap-6">
      <button onclick="scrollToSection('home-section')" class="res flex flex-col items-center justify-center group cursor-pointer hover:scale-110 ease-in-out transition-all" title="Home">
        <div class="flex items-center justify-center w-10 h-10 bg-[#f1f1f6] dark:bg-[#202731] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all duration-300">
          <i class="fa-solid fa-house text-md"></i>
        </div>
      </button>
      <button onclick="scrollToSection('skills-section')" class="res flex flex-col items-center justify-center group cursor-pointer hover:scale-110 ease-in-out transition-all" title="Skills">
        <div class="flex items-center justify-center w-10 h-10 bg-[#f1f1f6] dark:bg-[#202731] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all duration-300">
          <i class="fa-solid fa-code text-md"></i>
        </div>
      </button>
      <button onclick="scrollToSection('projects-section')" class="res flex flex-col items-center justify-center group cursor-pointer hover:scale-110 ease-in-out transition-all" title="Projects">
        <div class="flex items-center justify-center w-10 h-10 bg-[#f1f1f6] dark:bg-[#202731] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all duration-300">
          <i class="fa-solid fa-laptop-code text-md"></i>
        </div>
      </button>
      <button onclick="scrollToSection('aboutme-section')" class="res flex flex-col items-center justify-center group cursor-pointer hover:scale-110 ease-in-out transition-all" title="About Me">
        <div class="flex items-center justify-center w-10 h-10 bg-[#f1f1f6] dark:bg-[#202731] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all duration-300">
          <i class="fa-solid fa-address-card text-md"></i>
        </div>
      </button>
      <button onclick="scrollToSection('contact-section')" class="res flex flex-col items-center justify-center group cursor-pointer hover:scale-110 ease-in-out transition-all" title="Contact">
        <div class="flex items-center justify-center w-10 h-10 bg-[#f1f1f6] dark:bg-[#202731] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all duration-300">
          <i class="fa-solid fa-address-book text-md"></i>
        </div>
      </button>
    </nav>

    <!-- Hamburger & Name Branding -->
    <div class="res navbar-heading flex justify-between items-center gap-4">
      <button onclick="toggleMobileMenu()" class="bar hidden cursor-pointer"> 
        <i class="fa-solid fa-bars font-bold text-3xl"></i> 
      </button>
      <button class="dark-toggle flex items-center justify-center p-3 rounded-full bg-gray-100 dark:bg-[#202731] text-gray-700 dark:text-white shadow-md font-semibold hover:bg-gray-200 dark:hover:bg-[#28323f] transition-all">
        ${data.firstName}
      </button>
    </div>
  </header>

  <!-- Mobile Overlay Navbar -->
  <div id="mobile-menu" class="hidden z-50 fixed top-4 left-1/2 -translate-x-1/2 bg-[#c1bcbc] dark:bg-[#2a2f3d]/90 backdrop-blur-md h-16 w-[90%] max-w-[400px] px-4 rounded-xl items-center justify-between shadow-xl">
    <div class="phone-nav-icons-s flex gap-3">
      <button onclick="scrollToSection('home-section')" class="flex items-center justify-center w-9 h-9 bg-[#f1f1f6] dark:bg-[#161B22] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all">
        <i class="fa-solid fa-house text-sm"></i>
      </button>
      <button onclick="scrollToSection('skills-section')" class="flex items-center justify-center w-9 h-9 bg-[#f1f1f6] dark:bg-[#161B22] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all">
        <i class="fa-solid fa-code text-sm"></i>
      </button>
      <button onclick="scrollToSection('projects-section')" class="flex items-center justify-center w-9 h-9 bg-[#f1f1f6] dark:bg-[#161B22] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all">
        <i class="fa-solid fa-laptop-code text-sm"></i>
      </button>
      <button onclick="scrollToSection('aboutme-section')" class="flex items-center justify-center w-9 h-9 bg-[#f1f1f6] dark:bg-[#161B22] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all">
        <i class="fa-solid fa-address-card text-sm"></i>
      </button>
      <button onclick="scrollToSection('contact-section')" class="flex items-center justify-center w-9 h-9 bg-[#f1f1f6] dark:bg-[#161B22] rounded-full hover:bg-brandYellow hover:text-gray-900 transition-all">
        <i class="fa-solid fa-address-book text-sm"></i>
      </button>
    </div>
    <button onclick="toggleMobileMenu()" class="cursor-pointer text-gray-800 dark:text-white">
      <i class="fa-solid fa-x text-md font-bold"></i>
    </button>
  </div>


  <!-- Main Content Wrapper -->
  <main class="flex flex-col gap-12 mt-8">

    <!-- Hero Section -->
    <section class="hero-container flex flex-col md:flex-row items-center justify-center bg-white dark:bg-[#161B22] p-6 md:p-12 w-full rounded-2xl shadow-sm">
      <!-- Hero Details -->
      <div class="hero-content flex flex-col gap-6 md:w-1/2 relative">
        <div class="hero-header">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
            I'm ${nameCombined} <br>
            <span class="text-brandYellow">${firstJobWord}</span> ${restJobWords}
          </h1>
        </div>

        <!-- Animated decoration dot -->
        <div class="hidden md:block absolute -top-8 left-12 w-full h-8 overflow-visible pointer-events-none">
          <div class="h-4 w-4 rounded-full bg-blue-500 floating-dot"></div>
        </div>

        <div class="hero-para text-cyan-955 dark:text-gray-300 text-sm sm:text-base md:text-lg">
          <p>${data.bio}</p>
        </div>

        <div>
          <a href="${data.linkedinUrl}" target="_blank" rel="noopener noreferrer">
            <button class="p-3 w-36 sm:w-40 rounded-2xl bg-brandYellow text-gray-955 font-semibold text-sm sm:text-lg md:text-xl cursor-pointer hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-300">
              Hire Me <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </a>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="hero-img-section md:w-1/2 flex justify-center mt-6 md:mt-0 items-center">
        ${displayAvatar ? `<img
          class="w-64 h-64 md:w-80 md:h-80 object-cover aspect-square rounded-2xl border-4 border-white/10 dark:border-white/5 shadow-xl transition-all duration-300 hover:scale-[1.02]"
          src="${displayAvatar}"
          alt="${nameCombined} Profile"
        />` : `<div class="w-64 h-64 md:w-80 md:h-80 rounded-2xl border-4 border-white/10 dark:border-white/5 shadow-xl bg-gray-100 dark:bg-[#202731] flex items-center justify-center"><i class="fa-solid fa-user text-6xl text-gray-300 dark:text-gray-600"></i></div>`}
      </div>
    </section>


    <!-- Skills Section -->
    <section id="skills-section" class="w-full">
      <div class="skills-content mb-8">
        <h2 class="text-4xl sm:text-5xl text-center font-bold text-gray-800 dark:text-white">My Skills</h2>
      </div>

      <div class="skills-container w-full flex flex-row items-center justify-center p-2">
        <ul class="skill-box flex flex-wrap gap-6 justify-center max-w-5xl">
          ${skillsHtml || `
          <li class="skill-item skill-card-size flex flex-col justify-center items-center shadow-md bg-[#1F242C] rounded-xl p-4 w-[180px] h-[180px]">
            <i class="fa-solid fa-code text-5xl mb-3 text-brandYellow"></i>
            <p class="skill-name-text text-lg font-semibold text-white">Full-Stack Development</p>
          </li>
          `}
        </ul>
      </div>
    </section>


    <!-- Projects Section -->
    <section id="projects-section" class="flex flex-col items-center py-12 px-4 bg-[#fafafa] dark:bg-[#161B22]/50 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <h2 class="text-4xl sm:text-5xl font-bold mb-10 text-gray-800 dark:text-white tracking-wide">
        My <span class="text-brandYellow">Projects</span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        ${projectsHtml || `
        <article class="project-card group bg-white dark:bg-[#161B22] shadow-md rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
          <i class="fa-solid fa-folder-open text-5xl text-gray-300 mb-4 animate-pulse"></i>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">No Projects Loaded</h3>
          <p class="text-gray-550 dark:text-gray-400 text-sm mt-2">Edit your project details in the sidebar to populate items here.</p>
        </article>
        `}
      </div>
    </section>


    <!-- About Me Section -->
    <section id="aboutme-section" class="w-full">
      <h2 class="text-4xl sm:text-5xl text-center font-bold mb-10 text-gray-800 dark:text-white">About Me</h2>

      <div class="about-container bg-white dark:bg-[#161B22] shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10 transition-all duration-300">
        <!-- Profile Image -->
        <div class="about-img flex-shrink-0">
          ${displayAvatar ? `<img
            class="h-56 w-56 md:h-64 md:w-64 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            src="${displayAvatar}"
            alt="${nameCombined} Portrait"
          />` : `<div class="h-56 w-56 md:h-64 md:w-64 rounded-full border-4 border-indigo-500 shadow-md bg-gray-100 dark:bg-[#202731] flex items-center justify-center"><i class="fa-solid fa-user text-5xl text-gray-300 dark:text-gray-600"></i></div>`}
        </div>

        <!-- Info & Details -->
        <div class="about-info text-center md:text-left space-y-4 flex-1">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white">${nameCombined}</h3>
          <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            ${data.bio}
          </p>

          <!-- Action Button -->
          <div class="flex justify-center md:justify-start gap-4 mt-6">
            <a href="${data.resumeUrl}" download="${data.firstName}_Resume.pdf" target="_blank">
              <button class="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all duration-200 cursor-pointer hover:scale-105 font-medium shadow-sm">
                Download Resume
              </button>
            </a>
          </div>

          <!-- Social Media Profiles -->
          <div class="flex justify-center md:justify-start gap-6 mt-6 text-2xl text-gray-600 dark:text-gray-400">
            <a href="${data.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-all duration-200">
              <i class="fa-brands fa-linkedin"></i>
            </a>
            <a href="${data.twitterUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-black dark:hover:text-white transition-all duration-200">
              <i class="fa-brands fa-x-twitter"></i>
            </a>
            <a href="${data.instagramUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-pink-600 transition-all duration-200">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200">
              <i class="fa-brands fa-github"></i>
            </a>
          </div>

          <!-- Address / Contact Details -->
          <div class="mt-6 text-gray-700 dark:text-gray-300 space-y-2 pt-2 border-t border-gray-100 dark:border-white/5 flex flex-col items-center md:items-start text-sm">
            <p class="flex items-center gap-3">
              <i class="fa-solid fa-envelope text-indigo-500"></i>
              <span>${data.email}</span>
            </p>
            <p class="flex items-center gap-3">
              <i class="fa-solid fa-location-dot text-red-500"></i>
              <span>${data.location}</span>
            </p>
          </div>
        </div>
      </div>
    </section>


    <!-- Contact Me Section -->
    <section id="contact-section" class="contact-section bg-[#fafafa] dark:bg-[#161B22]/50 py-12 px-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm mb-12">
      <h2 class="text-3xl sm:text-4xl text-center font-bold mb-4 text-gray-800 dark:text-white">Contact Me</h2>
      <p class="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto">
        Feel free to drop a message. When you upload this HTML to hosting, this form can be easily integrated!
      </p>

      <div class="max-w-2xl mx-auto bg-white dark:bg-[#161B22] shadow-md rounded-xl p-6 flex flex-col gap-6">
        <!-- Contact Form -->
        <form id="contact-form" class="flex flex-col gap-4" onsubmit="handleFormSubmit(event)">
          <div class="flex flex-col md:flex-row gap-4">
            <input
              id="form-name"
              type="text"
              required
              placeholder="Your Name"
              class="flex-1 bg-transparent border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <input
              id="form-email"
              type="email"
              required
              placeholder="Your Email"
              class="flex-1 bg-transparent border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <input
            id="form-subject"
            type="text"
            required
            placeholder="Subject"
            class="bg-transparent border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          
          <textarea
            id="form-message"
            required
            placeholder="Your Message"
            rows="4"
            class="bg-transparent border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          ></textarea>

          <button type="submit" class="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-indigo-700 transition-all duration-200 w-max text-sm shadow-sm cursor-pointer hover:scale-105">
            Send Message
          </button>
        </form>
      </div>
    </section>

  </main>


  <!-- Toast Success Notification -->
  <div id="toast-message" class="toast">
    <i class="fa-solid fa-circle-check text-green-400 text-xl"></i>
    <div>
      <h4 class="font-bold text-sm">Message Sent!</h4>
      <p class="text-xs text-gray-300">Thank you for reaching out.</p>
    </div>
  </div>


  <!-- Custom JS Scripts -->
  <script>
    // Toggle Mobile Navigation Menu Overlay
    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
      } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
      }
    }

    // Scroll smoothly to target section
    function scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Ensure mobile menu is hidden after navigation
      const menu = document.getElementById('mobile-menu');
      menu.classList.add('hidden');
      menu.classList.remove('flex');
    }

    // Handle Mock Form Submission
    function handleFormSubmit(event) {
      event.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      if (name && email && subject && message) {
        // Trigger Toast Notification
        const toast = document.getElementById('toast-message');
        toast.classList.add('show');

        // Reset form
        document.getElementById('contact-form').reset();

        // Dismiss Toast after 3.5 seconds
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3500);
      }
    }
  </script>
</body>
</html>`;
}
