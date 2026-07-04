export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolioUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  duration: string;
  gpa?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface CodingProfile {
  platform: 'GitHub' | 'LeetCode' | 'Codeforces' | 'CodeChef' | 'HackerRank';
  username: string;
  rating?: string;
  solved?: string;
  badge?: string;
  ranking?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  meta?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  description?: string;
  layout: 'text' | 'grid' | 'timeline';
  items: CustomSectionItem[];
}

export interface PortfolioData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    tagline: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl: string;
    resumeUrl?: string;
    isOpenToWork: boolean;
    socialLinks: SocialLinks;
  };
  aboutMe: {
    paragraphs: string[];
  };
  techStack: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  achievements: string[];
  codingProfiles: CodingProfile[];
  customSections: CustomSection[];
}

export interface PortfolioSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  fontFamily: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  defaultSettings: PortfolioSettings;
  defaultData: PortfolioData;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'sleek-dark',
    name: 'Sleek Dark Developer',
    description: 'A premium, high-performance dark-themed portfolio featuring smooth glow cards, subtle typing headers, and sleek gradients.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coding-screen-screen-close-up-1736-large.mp4',
    defaultSettings: {
      theme: 'dark',
      accentColor: '#3B82F6', // Blue
      fontFamily: 'Inter',
    },
    defaultData: {
      personalInfo: {
        fullName: 'Rupesh Jagtap',
        jobTitle: 'Full-Stack Software Developer',
        tagline: 'Building scalable web applications with React, Next.js, Node.js, and AI.',
        bio: 'I\'m a full-stack developer passionate about building modern web applications. I enjoy solving real-world problems using JavaScript, TypeScript, React, Node.js, and AI technologies.',
        email: 'rupesh@example.com',
        phone: '+91 9876543210',
        location: 'Pune, India',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rupesh',
        resumeUrl: '#',
        isOpenToWork: true,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          portfolioUrl: 'https://rupeshhh.in'
        }
      },
      aboutMe: {
        paragraphs: [
          'I\'m a computer engineering student passionate about building full-stack web applications and exploring AI-powered solutions. Based in Pune, India, I specialize in creating scalable, user-friendly web applications with strong foundations in Data Structures and Algorithms.',
          'Currently, I\'m building Leet#, an AI-powered platform that helps software engineers create resumes, cover letters, and prepare for interviews. I love optimization, clean architecture, and working on tools that enhance developer productivity.'
        ]
      },
      techStack: [
        { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'FastAPI', 'Spring Boot'] },
        { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
        { category: 'Cloud', items: ['AWS', 'Docker', 'Vercel', 'Firebase'] }
      ],
      projects: [
        {
          id: '1',
          name: 'Leet# - AI Resume Builder',
          description: 'An AI-powered career enhancement platform for software engineers that builds resumes, optimizes cover letters, and evaluates ATS scores.',
          techStack: ['React', 'Next.js', 'OpenAI API', 'Supabase', 'Tailwind CSS'],
          features: ['AI Resume Generation', 'ATS Score Checker', 'Cover Letter Builder', 'Interview Preparation Modules'],
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com',
          caseStudyUrl: '#',
          imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coding-screen-screen-close-up-1736-large.mp4'
        },
        {
          id: '2',
          name: 'CollabCode IDE',
          description: 'A collaborative real-time code editor and whiteboard with sandboxed code execution, text chat, and video calling capabilities.',
          techStack: ['React', 'Node.js', 'Socket.io', 'WebRTC', 'Docker'],
          features: ['Real-time editing', 'Compiler Sandbox for 10+ languages', 'WebRTC Voice/Video Chat', 'Collaborative Whiteboard'],
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com',
          imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34283-large.mp4'
        }
      ],
      experience: [
        {
          id: 'exp1',
          company: 'CoolCliq Systems',
          role: 'Full-Stack Developer Intern',
          duration: 'Jan 2025 – Present',
          responsibilities: [
            'Built complex interactive dashboards and user management modules using React and Redux.',
            'Developed secure and optimized RESTful APIs in Node.js, implementing JWT auth and rate limiting.',
            'Improved website loading and rendering speeds by 35% using code splitting and asset compression.'
          ],
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS']
        }
      ],
      education: [
        {
          id: 'edu1',
          degree: 'Bachelor of Engineering',
          field: 'Computer Engineering',
          institution: 'Pune Institute of Computer Technology',
          duration: '2022 – 2026',
          gpa: '8.7 CGPA'
        }
      ],
      skills: [
        { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
        { category: 'Web Technologies', items: ['React', 'Next.js', 'HTML5/CSS3', 'Tailwind CSS', 'Redux'] },
        { category: 'Backend & DB', items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis'] },
        { category: 'Tools & DevOps', items: ['Git', 'Docker', 'AWS', 'Vercel', 'Postman'] }
      ],
      achievements: [
        'Solved 700+ DSA problems on LeetCode (Top 5% user rating: 1950+)',
        'Winner of National Level Smart India Hackathon 2024',
        'Active Open-Source Contributor to major developer utilities',
        'Lead Organizer of Google Developer Student Club (GDSC) Web Dev wing'
      ],
      codingProfiles: [
        { platform: 'GitHub', username: 'rupesh-jagtap', solved: '450+ Contributions', rating: 'A+ Grade' },
        { platform: 'LeetCode', username: 'rupesh_leetcode', solved: '720 solved', rating: '1984 Max Rating', badge: 'Knight' },
        { platform: 'Codeforces', username: 'jagtap_rupesh', solved: '150 solved', rating: '1420 Specialist' }
      ],
      customSections: []
    }
  },
  {
    id: 'creative-green',
    name: 'Creative Agency / Pastel Green',
    description: 'A beautiful light-themed layout using soothing sage greens, playful shapes, organic icons, and bold headlines.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-dimly-lit-office-41589-large.mp4',
    defaultSettings: {
      theme: 'light',
      accentColor: '#10B981', // Emerald/Sage Green
      fontFamily: 'Space Grotesk',
    },
    defaultData: {
      personalInfo: {
        fullName: 'Sarah Jenkins',
        jobTitle: 'Creative UI/UX Developer',
        tagline: 'Turning your ideas into beautiful, pixel-perfect software today.',
        bio: 'I help businesses like yours earn more customers, stand out from competitors, and make more money by crafting accessible and striking frontends.',
        email: 'sarah.jenkins@design.io',
        phone: '+1 415 889 2311',
        location: 'San Francisco, CA',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah',
        resumeUrl: '#',
        isOpenToWork: true,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com'
        }
      },
      aboutMe: {
        paragraphs: [
          'Hello! I am a design-driven frontend engineer dedicated to creating high-fidelity visual systems. I merge aesthetic principles with robust React components to construct seamless web apps.',
          'I specialize in Tailwind CSS, framer-motion, and design tools like Figma. I enjoy working on interfaces that move gracefully and provide clear feedback to the user.'
        ]
      },
      techStack: [
        { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Figma'] },
        { category: 'Libraries', items: ['Radix UI', 'Shadcn/UI', 'Three.js', 'Redux Toolkit'] },
        { category: 'Development', items: ['Vite', 'Git', 'GitHub', 'NPM', 'Bun'] }
      ],
      projects: [
        {
          id: 'green-p1',
          name: 'ZenSpace App',
          description: 'A mental wellness interface offering guided meditation tracks, soundscapes, and customizable visual breathing grids.',
          techStack: ['React', 'Framer Motion', 'HowlerJS', 'Tailwind CSS'],
          features: ['Elegant spatial sound engine', 'Custom micro-animations', 'Zen Mode timer', 'Interactive progress dials'],
          liveUrl: '#',
          githubUrl: '#',
          imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=500&auto=format&fit=crop&q=60'
        },
        {
          id: 'green-p2',
          name: 'Hyperion E-Commerce',
          description: 'A premium apparel storefront with 3D product previews, fluid filtering transitions, and animated checkout sheets.',
          techStack: ['Next.js', 'Three.js', 'Stripe', 'Tailwind CSS'],
          features: ['3D WebGL preview cards', 'Instant faceted filters', 'Glassmorphic card drawer', 'Optimized image loading'],
          liveUrl: '#',
          githubUrl: '#'
        }
      ],
      experience: [
        {
          id: 'exp-green',
          company: 'Luminate Creative Agency',
          role: 'Lead UI Engineer',
          duration: 'Mar 2023 – Present',
          responsibilities: [
            'Oversaw front-end architecture for 15+ client web platforms, boosting conversions by 22% average.',
            'Collaborated with design teams to translate Figma design systems into reusable tailwind components.',
            'Enforced web accessibility guidelines, achieving AAA compliance across core customer journeys.'
          ],
          technologies: ['React', 'Tailwind CSS', 'Figma', 'TypeScript']
        }
      ],
      education: [
        {
          id: 'edu-green',
          degree: 'Bachelor of Fine Arts',
          field: 'Web Design & New Media',
          institution: 'Academy of Art University',
          duration: '2019 – 2023',
          gpa: '3.9 GPA'
        }
      ],
      skills: [
        { category: 'Design', items: ['UI/UX Design', 'Design Systems', 'Typography', 'Figma', 'Prototyping'] },
        { category: 'Frontend', items: ['HTML5/CSS3', 'React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
        { category: 'Core Tech', items: ['JavaScript', 'TypeScript', 'Git & GitHub', 'Web Accessibility (WCAG)'] }
      ],
      achievements: [
        'Featured in CSS Design Awards (Best UI/UX Design, 2024)',
        'Creator of popular Tailwind UI component package (20k+ NPM downloads)',
        'Speaker at local UX meetup about Framer Motion micro-interactions',
        'Completed Advanced Accessibility Certification (W3C standards)'
      ],
      codingProfiles: [
        { platform: 'GitHub', username: 'sarah-jenkins-designs', solved: '1200+ Contributions', rating: 'Top 8%' }
      ],
      customSections: []
    }
  },
  {
    id: 'retro-terminal',
    name: 'Retro Terminal Console',
    description: 'A developer-centric console aesthetic using monospace typography, green/amber phosphors, scanlines, and CLI command queries.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-technology-background-48995-large.mp4',
    defaultSettings: {
      theme: 'dark',
      accentColor: '#22C55E', // Matrix Green
      fontFamily: 'Fira Code',
    },
    defaultData: {
      personalInfo: {
        fullName: 'Neo Hackerman',
        jobTitle: 'Systems & Security Engineer',
        tagline: 'Debugging kernel modules, compiling drivers, and testing secure interfaces.',
        bio: 'I thrive in low-level details. I write performant C/C++, audit backend security architectures, and configure Linux clusters.',
        email: 'neo@localhost.localdomain',
        phone: '+0 127 000 0001',
        location: 'Matrix Mainframe',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neo',
        resumeUrl: '#',
        isOpenToWork: true,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com'
        }
      },
      aboutMe: {
        paragraphs: [
          'root@neo-machine:~$ cat bio.txt',
          'I am a systems programmer who builds secure infrastructure from scratch. I spend my days writing high-speed multi-threaded utilities and reverse-engineering complex memory layouts.',
          'I avoid bloated frameworks, choosing instead to write memory-safe code in Rust or assembly, and optimizing disk read/write interfaces to maximize throughput.'
        ]
      },
      techStack: [
        { category: 'Languages', items: ['C', 'C++', 'Rust', 'Go', 'Bash', 'Assembly'] },
        { category: 'Linux/OS', items: ['Linux Kernel', 'Debian', 'Docker', 'eBPF', 'systemd'] },
        { category: 'Networking', items: ['TCP/IP', 'Wireshark', 'gRPC', 'DNSSEC', 'OpenSSL'] }
      ],
      projects: [
        {
          id: 'term-p1',
          name: 'KShield Kernel Guard',
          description: 'A lightweight Linux security module utilizing eBPF to monitor, intercept, and log unauthorized system calls in real-time.',
          techStack: ['C', 'Rust', 'eBPF', 'Linux Kernel'],
          features: ['Zero user-space runtime footprint', 'Intercepts sys_execve & sys_clone', 'Ring-buffer log alerts'],
          liveUrl: '#',
          githubUrl: '#'
        },
        {
          id: 'term-p2',
          name: 'FastRaft Consensus Engine',
          description: 'A distributed state-machine synchronization engine implementing the Raft protocol, writing disk-journals under 2ms.',
          techStack: ['Go', 'Protobuf', 'gRPC', 'RocksDB'],
          features: ['Strict serializability log audits', 'Dynamic leader election sub-millisecond', 'Zero-copy packet serialization'],
          liveUrl: '#',
          githubUrl: '#'
        }
      ],
      experience: [
        {
          id: 'exp-term',
          company: 'Aperture Cyber Defense',
          role: 'Senior Kernel Engineer',
          duration: 'Jul 2024 – Present',
          responsibilities: [
            'Designed high-throughput network filters in C, mitigating DDoS packet storms of 100+ Gbps.',
            'Wrote automated fuzzing frameworks in Rust to detect security flaws in proprietary API protocols.',
            'Optimized kernel memory management drivers, freeing up 18% memory overhead on virtualization nodes.'
          ],
          technologies: ['C', 'Rust', 'eBPF', 'Valgrind', 'Bash']
        }
      ],
      education: [
        {
          id: 'edu-term',
          degree: 'Master of Science',
          field: 'Information Security & Systems',
          institution: 'MIT Computer Science Lab',
          duration: '2022 – 2024',
          gpa: '4.0 GPA'
        }
      ],
      skills: [
        { category: 'Systems', items: ['Linux Core', 'Socket Programming', 'Concurrency', 'Assembly (x86)', 'Memory Profiling'] },
        { category: 'Security', items: ['Reverse Engineering', 'Symmetric Cryptography', 'Log Auditing', 'IAM & SSH'] },
        { category: 'Tools', items: ['Vim/Emacs', 'GDB / Valgrind', 'Makefile / CMake', 'Arch Linux', 'Git'] }
      ],
      achievements: [
        'Reported 3 CVE vulnerabilities in Linux network interfaces',
        'Top 100 on HackTheBox (Capture the Flag global ranking)',
        'Maintainer of an open-source Rust disk-cache engine with 5k stars',
        'First place at DEFCON CTF regional competition (2024)'
      ],
      codingProfiles: [
        { platform: 'GitHub', username: 'neodev-root', solved: '3000+ Commits', rating: 'Top 1% Compiler' },
        { platform: 'LeetCode', username: 'neohack', solved: '400 solved', rating: '1850 Rating' }
      ],
      customSections: []
    }
  },
  {
    id: 'glass-creative',
    name: 'Glassmorphic Creative / Futuristic',
    description: 'A stunning futuristic template utilizing rich colorful mesh gradients, translucent frosted-glass cards, and elegant glows.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34283-large.mp4',
    defaultSettings: {
      theme: 'dark',
      accentColor: '#A855F7', // Purple/Violet
      fontFamily: 'Outfit',
    },
    defaultData: {
      personalInfo: {
        fullName: 'Aria Sterling',
        jobTitle: 'AI Research & Platform Engineer',
        tagline: 'Engineering the next generation of intelligent software using Large Language Models and vector embeddings.',
        bio: 'I bridge the gap between complex AI models and production-ready applications. I design neural pipelines, build vector databases, and engineer agents.',
        email: 'aria.sterling@future.ai',
        phone: '+1 650 900 8128',
        location: 'Seattle, WA',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aria',
        resumeUrl: '#',
        isOpenToWork: true,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com'
        }
      },
      aboutMe: {
        paragraphs: [
          'As an AI Software Architect, I construct cognitive microservices that process structured and unstructured information. I specialize in prompt engineering, model fine-tuning, and retrieval-augmented generation (RAG).',
          'I believe AI should be fast, contextual, and useful. I spend my time building LangChain graphs, implementing vector similarity indexing, and wrapping complex inference loops behind high-performance APIs.'
        ]
      },
      techStack: [
        { category: 'AI & Data', items: ['OpenAI API', 'LangChain', 'LlamaIndex', 'Pinecone', 'Hugging Face'] },
        { category: 'Backend', items: ['FastAPI', 'Node.js', 'Python', 'TypeScript', 'GraphQL'] },
        { category: 'Cloud', items: ['AWS', 'Docker', 'K8s', 'Modal', 'Supabase'] }
      ],
      projects: [
        {
          id: 'glass-p1',
          name: 'MindLink AI Agent',
          description: 'A multi-agent cognitive workspace that generates software mockups, runs automated tests, and fixes compilation bugs dynamically.',
          techStack: ['Python', 'LangChain', 'Pinecone', 'FastAPI', 'React'],
          features: ['Autonomous multi-agent orchestration', 'Vector memory graph', 'Real-time websocket agent status stream'],
          liveUrl: '#',
          githubUrl: '#'
        },
        {
          id: 'glass-p2',
          name: 'Lumina Semantic Indexer',
          description: 'A real-time search engine indexing 10M+ documents under 50ms using chunking algorithms and custom embedding models.',
          techStack: ['Go', 'Pinecone', 'AWS Lambda', 'gRPC'],
          features: ['Semantic query search', 'Dynamic context window compression', 'Highly parallel ingestion pipeline'],
          liveUrl: '#',
          githubUrl: '#'
        }
      ],
      experience: [
        {
          id: 'exp-glass',
          company: 'FutureMind AI',
          role: 'AI Engineer',
          duration: 'Nov 2024 – Present',
          responsibilities: [
            'Built custom RAG knowledge bases serving 500k+ monthly active queries with 94% user relevance score.',
            'Optimized model inference costs by 42% by implementing semantic caching and batch request queues.',
            'Supervised fine-tuning of Llama 3 models on proprietary client developer logs for code completion.'
          ],
          technologies: ['Python', 'Pinecone', 'Docker', 'LangChain', 'OpenAI']
        }
      ],
      education: [
        {
          id: 'edu-glass',
          degree: 'Bachelor of Science',
          field: 'Data Science & Artificial Intelligence',
          institution: 'University of Washington',
          duration: '2020 – 2024',
          gpa: '3.8 GPA'
        }
      ],
      skills: [
        { category: 'AI/ML', items: ['RAG Architectures', 'Vector Search (Pinecone/Milvus)', 'Prompt Engineering', 'LangChain / LangGraph', 'Fine-tuning'] },
        { category: 'Software', items: ['Python', 'TypeScript', 'FastAPI', 'Node.js', 'GraphQL', 'React'] },
        { category: 'Infrastructure', items: ['AWS', 'Docker', 'Kubernetes', 'Serverless Functions', 'PostgreSQL'] }
      ],
      achievements: [
        'Winner of OpenAI Developer Challenge (Agentic Workflows category, 2025)',
        'Contributed 3 core features to LangChain open-source repository',
        'Published paper on Semantic Search optimizations in IEEE AI conference',
        'Certified AWS Machine Learning Specialty'
      ],
      codingProfiles: [
        { platform: 'GitHub', username: 'aria-ai-sterling', solved: '1800+ Contributions', rating: 'Expert' }
      ],
      customSections: []
    }
  },
  {
    id: 'architect-prismatic',
    name: 'The Architect / Prismatic',
    description: 'A beautiful light-themed design using prismatic gradients, precise hairlines, and Geist/Geist Mono typography.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60',
    videoUrl: '',
    defaultSettings: {
      theme: 'light',
      accentColor: '#4648d4',
      fontFamily: 'Inter',
    },
    defaultData: {
      personalInfo: {
        fullName: 'Rupesh Jagtap',
        jobTitle: 'Principal Backend Engineer',
        tagline: 'Building distributed systems, high-availability architecture, and performance engineering.',
        bio: 'Distributed systems engineer focusing on Rust, Go, cloud infrastructure, and low-latency APIs. Turning complex requirements into scalable reality.',
        email: 'guest@localhost',
        phone: '',
        location: 'San Francisco, CA',
        avatarUrl: '',
        resumeUrl: '#',
        isOpenToWork: true,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          portfolioUrl: ''
        }
      },
      aboutMe: {
        paragraphs: [
          'Distributed systems engineer focusing on Rust, Go, cloud infrastructure, and low-latency APIs. Turning complex requirements into scalable reality.'
        ]
      },
      techStack: [
        { category: 'Toolbox', items: ['Rust', 'Go', 'AWS', 'Kubernetes'] }
      ],
      projects: [
        {
          id: 'arch-p1',
          name: 'FinTech Ledger Optimization',
          description: 'Optimized FinTech ledger throughput by 400% through a custom-built distributed log architecture using Rust and Raft consensus.',
          techStack: ['Rust', 'gRPC', 'ScyllaDB'],
          features: [],
          liveUrl: '#',
          githubUrl: '#',
          imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60'
        }
      ],
      experience: [
        {
          id: 'arch-exp1',
          company: 'FinTech Systems',
          role: 'Principal Backend Engineer',
          duration: '2022 - Present',
          responsibilities: ['Developed and optimized low-latency payment processing pipelines handling high volumes.'],
          technologies: ['Rust', 'Go', 'AWS', 'Kubernetes']
        }
      ],
      education: [
        {
          id: 'arch-edu1',
          degree: 'Master of Science',
          field: 'Computer Engineering',
          institution: 'Stanford University',
          duration: '2018 - 2020',
          gpa: '3.9 GPA'
        }
      ],
      skills: [
        { category: 'Rust Systems', items: ['Low-level control', 'Zero-cost abstractions', 'Memory safety'] },
        { category: 'Go Microservices', items: ['High concurrency', 'Fast execution', 'Clean APIs'] },
        { category: 'Cloud Infrastructure', items: ['AWS Systems', 'IAM Automation', 'Auto-scaling'] },
        { category: 'Kubernetes Scale', items: ['Orchestration', 'Global traffic routing', 'Self-healing'] }
      ],
      achievements: [
        'Reduced ledger latency to <2ms p99 at 1M RPM.',
        'Designed multi-region failover handling 500k RPS.'
      ],
      codingProfiles: [],
      customSections: []
    }
  },
  {
    id: 'engineering-sleek',
    name: 'Engineering Sleek',
    description: 'A clean light grid layout featuring services highlights, custom marquee sliders, and technical details.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
    videoUrl: '',
    defaultSettings: {
      theme: 'light',
      accentColor: '#3525cd',
      fontFamily: 'Inter',
    },
    defaultData: {
      personalInfo: {
        fullName: 'Rupesh Jagtap',
        jobTitle: 'Full-Stack Software Engineer',
        tagline: 'Turn your idea into a successful Website/Software today.',
        bio: 'We help businesses like yours earn more customers, standout from competitors, and make more money through precision-engineered digital solutions.',
        email: 'rupeshjagtap157@gmail.com',
        phone: '',
        location: 'Pune, India',
        avatarUrl: '',
        resumeUrl: '#',
        isOpenToWork: true,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          portfolioUrl: ''
        }
      },
      aboutMe: {
        paragraphs: [
          'Full-stack developer passionate about building scalable, search-optimized web applications with modern design systems.'
        ]
      },
      techStack: [
        { category: 'Expertise', items: ['React', 'Next.js', 'Go', 'Docker'] }
      ],
      projects: [
        {
          id: 'sleek-p1',
          name: 'RotationMatch Sports platform',
          description: 'A high-performance sports analytics dashboard showing live player stats and scheduling grids.',
          techStack: ['Next.js', 'Go', 'PostgreSQL'],
          features: [],
          liveUrl: '#',
          githubUrl: '#',
          imageUrl: 'https://images.unsplash.com/photo-1508830524479-70c3c3e4d7ec?w=500&auto=format&fit=crop&q=60'
        },
        {
          id: 'sleek-p2',
          name: 'Boomzo E-Commerce',
          description: 'An elegant e-commerce product flow optimizing checkout speed and conversion rates.',
          techStack: ['React', 'Node.js', 'MongoDB'],
          features: [],
          liveUrl: '#',
          githubUrl: '#',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60'
        }
      ],
      experience: [
        {
          id: 'sleek-exp1',
          company: 'Digital Solutions',
          role: 'Full-Stack Software Developer',
          duration: '2021 - Present',
          responsibilities: ['Designed and deployed search-optimized responsive web platforms.'],
          technologies: ['React', 'Next.js', 'Go', 'Docker']
        }
      ],
      education: [
        {
          id: 'sleek-edu1',
          degree: 'Bachelor of Engineering',
          field: 'Information Technology',
          institution: 'Pune University',
          duration: '2017 - 2021',
          gpa: '9.2 CGPA'
        }
      ],
      skills: [
        { category: 'Web Development', items: ['React & Next.js', 'TypeScript', 'SEO Optimization'] },
        { category: 'Systems Concurrency', items: ['Go routing', 'Dockerization', 'Redis caching'] }
      ],
      achievements: [
        'Engineered high conversion checkout architectures.',
        'Maintained 99.99% uptime across production clusters.'
      ],
      codingProfiles: [],
      customSections: []
    }
  }
];
