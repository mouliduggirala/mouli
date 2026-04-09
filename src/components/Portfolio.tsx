import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, useInView, animate } from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  User,
  Briefcase,
  GraduationCap,
  Send,
  ChevronRight,
  Trophy,
  Activity,
  Flame,
  Award,
  MapPin,
  Phone,
  Moon,
  Sun,
  Terminal,
  Database,
  Binary,
  Layers,
  Server,
  Globe,
  Atom,
  Shield,
  FileCode,
  Palette,
  Brain,
  MessageSquare,
  GitBranch,
  Cpu,
  ArrowUp,
  Menu,
  X
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import Chatbot from "./Chatbot";

const LinkedInIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center gap-2 group cursor-default">
    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
      D
    </div>
    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-accent/20 -ml-4 group-hover:-rotate-6 transition-transform">
      M
    </div>
    <span className="font-mono font-bold text-xl tracking-tighter ml-1">
      MOULI<span className="text-accent">.</span>
    </span>
  </div>
);

const Counter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = Math.round(v).toLocaleString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return <span ref={ref}>0</span>;
};

const useVisitorCount = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const storageKey = "portfolio_profile_views";
    const hasVisited = sessionStorage.getItem("visited") === "true";

    const currentValue = Number.parseInt(localStorage.getItem(storageKey) ?? "0", 10);
    const safeValue = Number.isFinite(currentValue) ? currentValue : 0;

    if (!hasVisited) {
      const next = safeValue + 1;
      localStorage.setItem(storageKey, String(next));
      sessionStorage.setItem("visited", "true");
      setCount(next);
      return;
    }

    setCount(safeValue);
  }, []);

  return count;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Ensure dark mode is removed
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = ['about', 'skills', 'projects', 'experience', 'journey', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }

      if (window.scrollY < 100) setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    // Small delay to allow menu to start closing animation
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Journey', id: 'journey' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 border rounded-2xl ${isScrolled
      ? "py-3 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/40 border-slate-200"
      : "py-4 bg-white/50 backdrop-blur-md border-slate-200/50"
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          className="cursor-default"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMenuOpen(false);
          }}
        >
          <Logo />
        </motion.div>

        <div className="flex items-center gap-8">
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 rounded-full transition-colors ${activeSection === item.id
                  ? "text-accent"
                  : "text-slate-600 hover:text-accent"
                  }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 -mr-2 text-slate-600 hover:text-accent transition-colors relative z-[60]"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/98 backdrop-blur-2xl border-t border-slate-100 rounded-b-2xl shadow-xl"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-4 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between group ${activeSection === item.id
                    ? "bg-accent/10 text-accent"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {item.name}
                  <ChevronRight size={14} className={`transition-transform ${activeSection === item.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const visitorCount = useVisitorCount();

  return (
    <section className="section-padding pt-64 min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl relative z-10"
      >
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase">
            AI & Java Full Stack Developer
          </span>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
            <Activity size={12} />
            <span><Counter value={visitorCount} /> Profile Views</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
          Hi, I'm <span className="text-accent">Duggirala Mouli</span>. <br />
          I build intelligent <br />
          software systems.
        </h1>
        <p className="text-lg text-muted mb-10 max-w-2xl">
          B.Tech Computer Science student at Velagapudi Ramakrishna Siddhartha Engineering College.
          Passionate about Competitive Programming, Artificial Intelligence, and Java Web Technologies.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              const element = document.getElementById('projects');
              if (element) {
                const offset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            View My Work <ChevronRight size={16} />
          </button>
          <a
            href="/resume.pdf"
            download="Mouli_Duggirala_Resume.pdf"
            className="bg-white border border-slate-200 text-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            Download Resume <ExternalLink size={16} />
          </a>
          <div className="flex gap-4 items-center px-4">
            <a href="https://github.com/mouli4401" target="_blank" className="p-2 hover:scale-110 transition-transform text-slate-900">
              <GitHubIcon size={24} />
            </a>
            <a href="https://www.linkedin.com/in/mouli-duggirala-71986525a/" target="_blank" className="p-2 hover:scale-110 transition-transform text-[#0A66C2]">
              <LinkedInIcon size={24} />
            </a>
            <a href="https://leetcode.com/u/mouli881/" target="_blank" className="p-2 hover:scale-110 transition-transform text-[#FFA116]">
              <SiLeetcode size={24} />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="section-padding bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg mb-6 flex items-center gap-3">
            <User className="text-accent" /> About Me
          </h2>
          <p className="text-muted mb-6 text-lg">
            I am a B.Tech CSE student (2022-2026) at VR Siddhartha Engineering College, passionate about competitive programming and full-stack development.
          </p>
          <p className="text-muted mb-8">
            From building an AI Health Assistant to a highly scalable Java Job Portal, I strive to create robust applications. I'm actively engaged in competitive programming, having solved over 600 DSA problems on LeetCode.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm h-fit">
                <GraduationCap className="text-accent" />
              </div>
              <div>
                <h4 className="font-bold">Education</h4>
                <p className="text-sm text-muted">B.Tech CSE (9.06 CGPA)</p>
                <p className="text-xs text-slate-400 leading-relaxed">Velagapudi Ramakrishna Siddhartha Engineering College, Kanuru, AP • 2022-2026</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm h-fit">
                <MapPin className="text-accent" />
              </div>
              <div>
                <h4 className="font-bold">Location</h4>
                <p className="text-sm text-muted">Vijayawada</p>
                <p className="text-xs text-slate-400">Andhra Pradesh, India</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Stats = () => {
  const visitorCount = useVisitorCount();

  return (
    <section id="stats" className="section-padding">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="heading-lg mb-4">Portfolio Statistics</h2>
        <p className="text-muted">My unified problem-solving journey and portfolio reach.</p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Visitor Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col justify-center items-center text-center"
        >
          <div className="p-4 rounded-2xl bg-accent/10 mb-6">
            <Activity className="text-accent" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Profile Visits</h3>
          <p className="text-4xl font-bold text-primary mb-2">
            <Counter value={visitorCount} />
          </p>
          <p className="text-sm text-muted">Total unique session views</p>
        </motion.div>

        {/* Profile Views Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-50">
                <Trophy className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Profile Views</h3>
            </div>
            <span className="text-sm font-mono text-slate-400">Live Tracker</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 rounded-2xl bg-slate-50">
              <p className="text-2xl font-bold text-primary"><Counter value={2027} /></p>
              <p className="text-xs text-muted uppercase tracking-wider font-bold">Total Views</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-50">
              <p className="text-2xl font-bold text-primary"><Counter value={514} /></p>
              <p className="text-xs text-muted uppercase tracking-wider font-bold">Returning Visitors</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-50">
              <p className="text-2xl font-bold text-primary"><Counter value={112} /></p>
              <p className="text-xs text-muted uppercase tracking-wider font-bold">Weekly Average</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-muted font-medium">Engagement Progress</span>
                <span className="font-bold"><Counter value={1150} /> Interactions</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '55%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-emerald-500"
                />
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '40%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-orange-500"
                />
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '5%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  className="h-full bg-rose-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-slate-50">
              <div className="text-[#0f172a] hover:scale-110 transition-transform cursor-help" title="Traffic"><Activity size={20} /></div>
              <div className="text-[#10b981] hover:scale-110 transition-transform cursor-help" title="Audience"><User size={20} /></div>
              <div className="text-[#0ea5e9] hover:scale-110 transition-transform cursor-help" title="Growth"><ArrowUp size={20} /></div>
              <div className="text-[#f59e0b] hover:scale-110 transition-transform cursor-help" title="Weekly"><Flame size={20} /></div>
              <div className="text-[#6366f1] hover:scale-110 transition-transform cursor-help" title="Realtime"><Globe size={20} /></div>
            </div>
          </div>
        </motion.div>

        {/* GitHub Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900">
                <Github className="text-white" />
              </div>
              <h3 className="text-xl font-bold">GitHub Activity</h3>
            </div>
            <span className="text-sm font-mono text-slate-400">@mouli4401</span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center p-6 rounded-2xl bg-slate-50">
              <p className="text-3xl font-bold text-primary"><Counter value={158} /></p>
              <p className="text-sm text-muted uppercase tracking-wider font-bold">Contributions</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50">
              <p className="text-3xl font-bold text-primary"><Counter value={51} /></p>
              <p className="text-sm text-muted uppercase tracking-wider font-bold">Repositories</p>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center p-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="text-center">
              <Activity className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-sm text-slate-400">Consistent growth in open source.</p>
              <a
                href="https://github.com/mouli4401"
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 text-accent font-bold hover:underline"
              >
                View GitHub <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skillIcons: Record<string, any> = {
    "Java": Code2,
    "Python": Terminal,
    "JavaScript": Cpu,
    "SQL": Database,
    "DSA": Binary,
    "OOP": Layers,
    "Spring Boot": Server,
    "REST APIs": Globe,
    "ReactJS": Atom,
    "Angular": Shield,
    "HTML5": FileCode,
    "CSS3": Palette,
    "Machine Learning": Brain,
    "NLP": MessageSquare,
    "MySQL": Database,
    "Git": GitBranch,
    "GitHub": Github,
    "Postman": Send
  };

  const fullNames: Record<string, string> = {
    "DSA": "Data Structures & Algorithms",
    "OOP": "Object Oriented Programming",
    "ML": "Machine Learning",
    "NLP": "Natural Language Processing",
    "REST APIs": "RESTful Application Programming Interfaces"
  };

  const categories = [
    {
      title: "Languages & Core",
      skills: ["Java", "Python", "JavaScript", "SQL", "DSA", "OOP"]
    },
    {
      title: "Web & Backend",
      skills: ["Spring Boot", "REST APIs", "ReactJS", "Angular", "HTML5", "CSS3"]
    },
    {
      title: "AI/ML & Tools",
      skills: ["Machine Learning", "NLP", "MySQL", "Git", "GitHub", "Postman"]
    }
  ];

  return (
    <section id="skills" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="heading-lg mb-4">Technical Skills</h2>
        <p className="text-muted">A comprehensive list of technologies I've mastered.</p>
      </div>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
              <Code2 className="text-slate-400 group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-6">{cat.title}</h3>
            <div className="grid grid-cols-2 gap-3">
              {cat.skills.map(skill => {
                const Icon = skillIcons[skill] || Code2;
                return (
                  <div key={skill} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-xs font-medium text-slate-600">
                    <div className="relative group/skill">
                      <Icon size={14} className="text-accent cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover/skill:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                        {fullNames[skill] || skill}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                    {skill}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Agentic AI HR Optimizer",
      desc: "An intelligent HR automation system leveraging LangGraph and LLaMA 3 to streamline candidate evaluation and skill-gap analysis with high precision.",
      tech: ["LangGraph", "Groq", "Python", "React"],
      link: "https://github.com/mouli4401/ai-hr-agent"
    },
    {
      title: "Vibrant Food Delivery Ecosystem",
      desc: "A full-featured food delivery platform with real-time tracking, optimized search, and a seamless checkout experience.",
      tech: ["ReactJS", "Redux", "Tailwind CSS"],
      link: "https://github.com/mouli4401"
    },
    {
      title: "Enterprise Job Connect Portal",
      desc: "A scalable recruitment platform built with Java Spring Boot, featuring advanced search filters and secure JWT authentication.",
      tech: ["Java", "Spring Boot", "MySQL", "JWT"],
      link: "https://github.com/mouli4401"
    },
    {
      title: "E-Commerce Market Intelligence",
      desc: "Real-time competitor price monitoring tool that provides strategic market insights using advanced web scraping and data analysis.",
      tech: ["Python", "BeautifulSoup", "Flask"],
      link: "https://github.com/mouli4401"
    },
    {
      title: "Shoreline Dynamics Monitor",
      desc: "AI-driven coastal erosion tracking system using satellite data to predict shoreline changes with 92% accuracy.",
      tech: ["Python", "ML", "GEE API"],
      link: "https://github.com/mouli4401"
    },
    {
      title: "Neural Emotion Interpreter",
      desc: "A Brain-Computer Interface (BCI) project using EEG signals to accurately classify human emotions in real-time.",
      tech: ["Python", "Arduino", "Signal Processing"],
      link: "https://github.com/mouli4401"
    }
  ];

  return (
    <section id="projects" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
        <div>
          <h2 className="heading-lg mb-4">Projects</h2>
          <p className="text-muted">High-impact solutions engineered with precision.</p>
        </div>
        <a href="https://github.com/mouli4401" target="_blank" className="text-accent font-semibold flex items-center gap-2 hover:underline">
          Explore Repository <ExternalLink size={16} />
        </a>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
              <Code2 className="text-slate-400 group-hover:text-accent transition-colors" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-3 group-hover:text-accent transition-colors">{project.title}</h3>
            <p className="text-muted text-xs mb-6 leading-relaxed">{project.desc}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-6 pt-4 border-t border-slate-50">
              <a href={project.link} target="_blank" className="text-xs font-bold flex items-center gap-2 hover:text-accent">
                View Project <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Experience = () => {
  const experiences = [
    {
      title: "Artificial Intelligence Intern",
      company: "SkillDzire",
      date: "Nov 2025 - April 2026",
      desc: "Engineered a high-performance Predictive Maintenance System for industrial assets, utilizing LSTM networks to forecast equipment failure with 88% precision.",
      link: "https://drive.google.com/drive/folders/your-id"
    },
    {
      title: "Artificial Intelligence Intern",
      company: "Infosys SpringBoard",
      date: "Aug 2025 - Sep 2025",
      desc: "Developed NLP-based sentiment analysis tools and time-series forecasting models for e-commerce market trend prediction.",
      link: "#"
    },
    {
      title: "Java Full Stack Intern",
      company: "Eduskills",
      date: "Jul 2025 - Aug 2025",
      desc: "Architected a full-stack job portal with Spring Boot, featuring automated application tracking and secure JWT authentication.",
      link: "#"
    }
  ];

  const academicExperience = [
    {
      role: "Project Member",
      context: "Coastal Erosion Monitoring System",
      date: "2024 - 2025",
      desc: "Led a team of 4 to develop an automated shoreline detection system using satellite imagery and machine learning."
    },
    {
      role: "Core Member",
      context: "Coding Club, VRSEC",
      date: "2023 - Present",
      desc: "Organizing coding contests and mentoring juniors in Data Structures and Algorithms."
    },
    {
      role: "Project Lead",
      context: "EEG Emotion Recognition Project",
      date: "2023 - 2024",
      desc: "Directed research on Brain-Computer Interfaces (BCI) for real-time emotion classification using EEG signal processing."
    }
  ];

  return (
    <section id="experience" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Professional Experience */}
        <div>
          <div className="mb-10">
            <h2 className="heading-lg mb-4 flex items-center gap-3">
              <Briefcase className="text-accent" /> Professional Experience
            </h2>
            <p className="text-muted">My professional journey and internships.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Briefcase className="text-accent" size={20} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm">{exp.title}</h4>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{exp.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-2">{exp.company}</p>
                    <p className="text-[11px] text-muted leading-relaxed mb-3">{exp.desc}</p>
                    {exp.link && (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent font-bold text-[10px] hover:underline"
                      >
                        View Certificate <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Academic Experience */}
        <div>
          <div className="mb-10">
            <h2 className="heading-lg mb-4 flex items-center gap-3">
              <GraduationCap className="text-accent" /> Academic Experience
            </h2>
            <p className="text-muted">Projects and roles within the university.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {academicExperience.map((exp, i) => (
              <motion.div
                key={exp.context}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Trophy className="text-primary" size={20} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm">{exp.role}</h4>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{exp.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-2">{exp.context}</p>
                    <p className="text-[11px] text-muted leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message || message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    } else if (message.trim().length > 1000) {
      newErrors.message = "Message must be less than 1000 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    setFormState('sending');

    try {
      const response = await fetch('https://formspree.io/f/xaqpvdyk', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormState('sent');
        toast.success("Message sent successfully! I'll get back to you soon.");
        form.reset();
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        setFormState('error');
        toast.error("Failed to send message. Please try again later.");
        setTimeout(() => setFormState('idle'), 5000);
      }
    } catch (error) {
      setFormState('error');
      toast.error("An error occurred. Please check your connection.");
      setTimeout(() => setFormState('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="heading-lg mb-6">Get in Touch</h2>
          <p className="text-muted text-lg mb-10">
            I'm currently looking for internship and full-time software engineering roles starting in 2026.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <Mail className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Email</p>
                <p className="font-medium">mouliduggirala02@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <MapPin className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Location</p>
                <p className="font-medium">Vijayawada, Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-8 md:p-12 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name</label>
                <input
                  name="name"
                  type="text"
                  className={`w-full bg-white border rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'
                    }`}
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                <input
                  name="email"
                  type="email"
                  className={`w-full bg-white border rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'
                    }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
              <textarea
                name="message"
                rows={4}
                className={`w-full bg-white border rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none resize-none transition-all ${errors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'
                  }`}
                placeholder="Let's discuss opportunities..."
              ></textarea>
              {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2">{errors.message}</p>}
            </div>
            <button
              disabled={formState === 'sending' || formState === 'sent'}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 group/btn cursor-default"
            >
              {formState === 'idle' && (
                <div className="flex items-center gap-2">
                  Send Message
                  <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity animate-bounce">👋</span>
                </div>
              )}
              {formState === 'sending' && "Sending..."}
              {formState === 'sent' && "Message Sent!"}
              {formState === 'error' && "Error! Try Again"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const visitorCount = useVisitorCount();

  return (
    <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="text-left">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-default w-fit hover:scale-105 transition-transform"
            >
              <Logo />
            </div>
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              Building intelligent software systems with a focus on AI and Java technologies.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Connect</h4>
            <div className="flex gap-6">
              <a href="https://github.com/mouli4401" target="_blank" className="p-2 rounded-xl bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all text-slate-900">
                <GitHubIcon size={20} />
              </a>
              <a href="https://www.linkedin.com/in/mouli-duggirala-71986525a/" target="_blank" className="p-2 rounded-xl bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all text-[#0A66C2]">
                <LinkedInIcon size={20} />
              </a>
              <a href="https://leetcode.com/u/mouli881/" target="_blank" className="p-2 rounded-xl bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all text-[#FFA116]">
                <SiLeetcode size={20} />
              </a>
              <a href="mailto:mouliduggirala02@gmail.com" className="p-2 rounded-xl bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all text-[#EA4335]">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="md:text-right flex flex-col md:items-end gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-accent hover:text-white text-slate-600 rounded-full text-xs font-bold w-fit transition-all mb-2"
            >
              <ArrowUp size={14} />
              <span>Move to top</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold w-fit">
              <Activity size={14} />
              <span><Counter value={visitorCount} /> Profile Views</span>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              © {new Date().getFullYear()} Duggirala Mouli.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AcademicJourney = () => {
  const journey = [
    {
      year: "2022",
      title: "Commencement of B.Tech",
      institution: "Velagapudi Ramakrishna Siddhartha Engineering College",
      desc: "Started my journey in Computer Science and Engineering, focusing on core fundamentals and programming."
    },
    {
      year: "2023",
      title: "Exploration & Research",
      institution: "VRSEC",
      desc: "Began research in EEG Emotion Recognition and joined the college coding club to sharpen DSA skills."
    },
    {
      year: "2024",
      title: "Project Member",
      institution: "VRSEC",
      desc: "Led the Coastal Erosion Monitoring project and achieved a significant milestone in competitive programming."
    },
    {
      year: "2025",
      title: "Specialization & Internships",
      institution: "VRSEC",
      desc: "Focused on AI and Java Full Stack development, securing internships at Eduskills and Infosys."
    },
    {
      year: "2026",
      title: "Graduation & Future",
      institution: "VRSEC",
      desc: "Completing Bachelor of Technology in Computer Science with a current CGPA of 9.06."
    }
  ];

  return (
    <section id="journey" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="heading-lg mb-4 flex items-center gap-3">
            <GraduationCap className="text-accent" /> Academic Journey
          </h2>
          <p className="text-muted">A timeline of my growth at Velagapudi Ramakrishna Siddhartha Engineering College.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {journey.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-accent/30 transition-all group gap-4"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="text-accent" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">{item.year}</span>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-2">{item.institution}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Certifications = () => {
  const certifications = [
    { title: "Design, Technology and Innovation", issuer: "NPTEL", link: "#" },
    { title: "Foundations of R Software", issuer: "NPTEL", link: "#" },
    { title: "Industry 4.0 & Industrial IoT", issuer: "NPTEL", link: "#" },
    { title: "Programming in Modern C++", issuer: "NPTEL", link: "#" },
    { title: "Communication Skill Certification", issuer: "TCS", link: "#" },
    { title: "Ethical Hacker", issuer: "Cisco", link: "#" },
    { title: "Microsoft AI Azure Essential", issuer: "LinkedIn", link: "#" },
    { title: "Python For Data Analysis", issuer: "Udemy", link: "#" },
    { title: "Prompt Engineering Foundation", issuer: "AWS", link: "https://drive.google.com/drive/folders/your-id" },
    { title: "Cloud Fundamentals", issuer: "AWS", link: "https://drive.google.com/drive/folders/your-id" },
    { title: "Design Thinking", issuer: "DotSphere", link: "https://drive.google.com/drive/folders/your-id" },
    { title: "Java Developer Certification", issuer: "Infosys", link: "https://drive.google.com/drive/folders/your-id" },
    { title: "Computer Networks", issuer: "Cisco", link: "https://drive.google.com/drive/folders/your-id" }
  ];

  return (
    <section id="certifications" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg mb-8 flex items-center gap-3">
            <Award className="text-accent" /> Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title + i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Award className="text-accent" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] leading-tight mb-1">{cert.title}</h4>
                    <p className="text-[11px] text-muted font-medium">{cert.issuer}</p>
                  </div>
                </div>
                <a
                  href={cert.link}
                  target="_blank"
                  className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-accent hover:text-white transition-all shrink-0 ml-2"
                >
                  <ExternalLink size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function Portfolio() {
  return (
    <div className="selection:bg-accent/30">
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Skills />
      <Projects />
      <Experience />
      <AcademicJourney />
      <Certifications />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
}
