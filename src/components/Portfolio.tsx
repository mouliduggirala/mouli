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
  Phone
} from "lucide-react";
import { toast } from "react-toastify";
import Chatbot from "./Chatbot";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, increment, serverTimestamp } from "firebase/firestore";

const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
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
  const hasIncremented = useRef(false);

  useEffect(() => {
    const visitorDoc = doc(db, "stats", "visitors");

    // Listen for real-time updates
    const unsubscribe = onSnapshot(visitorDoc, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().count || 0);
      }
    });

    // Increment count once per session
    if (!hasIncremented.current && !sessionStorage.getItem("visited")) {
      const incrementCount = async () => {
        try {
          const docSnap = await getDoc(visitorDoc);
          if (docSnap.exists()) {
            await updateDoc(visitorDoc, {
              count: increment(1),
              updatedAt: serverTimestamp()
            });
          } else {
            await setDoc(visitorDoc, {
              count: 1,
              updatedAt: serverTimestamp()
            });
          }
          sessionStorage.setItem("visited", "true");
          hasIncremented.current = true;
        } catch (error) {
          console.error("Error updating visitor count:", error);
        }
      };
      incrementCount();
    }

    return () => unsubscribe();
  }, []);

  return count;
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Logo />
        </motion.div>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {['About', 'Skills', 'Projects', 'Experience', 'Journey', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const visitorCount = useVisitorCount();

  return (
    <section className="section-padding pt-40 min-h-screen flex flex-col justify-center relative overflow-hidden">
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
            <span><Counter value={visitorCount} /> Profile Visits</span>
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
          <a 
            href="#projects" 
            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            View My Work <ChevronRight size={16} />
          </a>
          <a 
            href="/resume.pdf" 
            download="Mouli_Duggirala_Resume.pdf"
            className="bg-white border border-slate-200 text-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            Download Resume <ExternalLink size={16} />
          </a>
          <div className="flex gap-4 items-center px-4">
            <a href="https://github.com/mouli4401" target="_blank" className="p-2 hover:text-accent transition-colors"><Github size={24} /></a>
            <a href="https://linkedin.com/in/mouliduggirala" target="_blank" className="p-2 hover:text-accent transition-colors"><Linkedin size={24} /></a>
            <a href="https://leetcode.com/u/mouli881/" target="_blank" className="p-2 hover:text-accent transition-colors"><Code2 size={24} /></a>
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
            I am a dedicated B.Tech CSE student (2022-2026) at VR Siddhartha Engineering College, passionate about competitive programming and full-stack development.
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

        {/* Codolio Stats */}
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
              <h3 className="text-xl font-bold">Codolio Profile</h3>
            </div>
            <span className="text-sm font-mono text-slate-400">@mouli811</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 rounded-2xl bg-slate-50">
              <p className="text-2xl font-bold text-primary"><Counter value={1978} /></p>
              <p className="text-xs text-muted uppercase tracking-wider font-bold">Total Solved</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-50">
              <p className="text-2xl font-bold text-primary"><Counter value={495} /></p>
              <p className="text-xs text-muted uppercase tracking-wider font-bold">Active Days</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-50">
              <p className="text-2xl font-bold text-primary"><Counter value={89} /></p>
              <p className="text-xs text-muted uppercase tracking-wider font-bold">Max Streak</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-muted font-medium">DSA (Easy/Med/Hard)</span>
                <span className="font-bold"><Counter value={1089} /> Solved</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '55%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-emerald-500" 
                  title="Easy: 595" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '40%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-orange-500" 
                  title="Medium: 439" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '5%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  className="h-full bg-rose-500" 
                  title="Hard: 55" 
                />
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] text-slate-400 font-bold"><Counter value={595} /> EASY</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> <span className="text-[10px] text-slate-400 font-bold"><Counter value={439} /> MED</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-[10px] text-slate-400 font-bold"><Counter value={55} /> HARD</span></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-50">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Competitive</p>
                <p className="text-lg font-bold"><Counter value={711} /> Solved</p>
                <p className="text-[10px] text-muted">CodeChef: 707 | CF: 4</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-50">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Fundamentals</p>
                <p className="text-lg font-bold"><Counter value={178} /> Solved</p>
                <p className="text-[10px] text-muted">HackerRank: 114 | GFG: 64</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-xs font-medium">
              <Award size={14} className="text-accent" /> 31 Awards
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-xs font-medium">
              <Activity size={14} className="text-accent" /> 39 Contests
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-xs font-medium">
              <Trophy size={14} className="text-accent" /> LeetCode: 1358
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
              <p className="text-sm text-muted uppercase tracking-wider font-bold">Contributions (Year)</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50">
              <p className="text-3xl font-bold text-primary"><Counter value={51} /></p>
              <p className="text-sm text-muted uppercase tracking-wider font-bold">Repositories</p>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center p-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="text-center">
              <Activity className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-sm text-slate-400">Consistent growth in open source contributions.</p>
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
            <div className="flex flex-wrap gap-2">
              {cat.skills.map(skill => (
                <span key={skill} className="px-4 py-2 rounded-xl bg-slate-50 text-sm font-medium text-slate-600">
                  {skill}
                </span>
              ))}
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
      title: "Agentic AI HR Assistant",
      desc: "An Agentic AI-powered HR Assistant built using LangGraph + Groq (LLaMA 3) that automates resume screening, skill matching, and candidate evaluation with an interactive dashboard.",
      tech: ["LangGraph", "Groq", "LLaMA 3", "Python"],
      image: "https://picsum.photos/seed/ai-hr/600/400",
      link: "https://github.com/mouli4401/ai-hr-agent"
    },
    {
      title: "Coastal Erosion Monitoring",
      desc: "Automated system using CoastSat toolkit to analyze satellite imagery, detecting shoreline changes with 92% accuracy.",
      tech: ["Python", "Flask", "ML", "GEE API"],
      image: "https://picsum.photos/seed/satellite/600/400",
      link: "https://github.com/mouli4401"
    },
    {
      title: "Java Job Portal",
      desc: "Scalable platform connecting job seekers with employers using RESTful APIs and role-based access control.",
      tech: ["Java", "Spring Boot", "ReactJS", "MySQL"],
      image: "https://picsum.photos/seed/coding/600/400",
      link: "https://github.com/mouli4401"
    },
    {
      title: "EEG Emotion Recognition",
      desc: "BCI using BioAmp hardware to capture EEG signals, achieving 80% accuracy via real-time signal processing.",
      tech: ["Python", "Arduino", "Signal Processing", "FFT"],
      image: "https://picsum.photos/seed/brain/600/400",
      link: "https://github.com/mouli4401"
    }
  ];

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
        <div>
          <h2 className="heading-lg mb-4">Projects</h2>
          <p className="text-muted">Innovative solutions built with modern technology.</p>
        </div>
        <a href="https://github.com/mouli4401" target="_blank" className="text-accent font-semibold flex items-center gap-2 hover:underline">
          View all on GitHub <ExternalLink size={16} />
        </a>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-3">{project.title}</h3>
              <p className="text-muted text-sm mb-6">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a href={project.link} target="_blank" className="text-sm font-bold flex items-center gap-1 hover:text-accent">Demo <ExternalLink size={14} /></a>
                <a href={project.link} target="_blank" className="text-sm font-bold flex items-center gap-1 hover:text-accent">Code <Github size={14} /></a>
              </div>
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
      company: "Infosys SpringBoard",
      date: "Jan 2026 - Present",
      desc: "Implementing NLP models for sentiment analysis and ML models to forecast discount trends across competitor products.",
      link: "#" // Placeholder for certificate
    },
    {
      title: "Java Full Stack Intern",
      company: "Eduskills",
      date: "Jul 2025 - Aug 2025",
      desc: "Developed a full-stack job portal using Spring Boot and ReactJS, implementing JWT-based authentication.",
      link: "#" // Placeholder for certificate
    }
  ];

  const academicExperience = [
    {
      role: "Project Lead",
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
      role: "Research Assistant",
      context: "EEG Emotion Recognition Project",
      date: "2023 - 2024",
      desc: "Conducted research on BCI and signal processing for real-time emotion detection using EEG signals."
    }
  ];

  return (
    <section id="experience" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <div className="mb-12">
            <h2 className="heading-lg mb-4 flex items-center gap-3">
              <Briefcase className="text-accent" /> Professional Experience
            </h2>
            <p className="text-muted">My professional journey and internships.</p>
          </div>
          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 border-l-2 border-slate-200"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-sm" />
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 block">{exp.date}</span>
                  <h3 className="text-lg font-bold mb-1">{exp.title}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-muted text-xs leading-relaxed mb-4">{exp.desc}</p>
                  {exp.link && (
                    <a 
                      href={exp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent font-bold text-xs hover:underline"
                    >
                      View Certificate <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-12">
            <h2 className="heading-lg mb-4 flex items-center gap-3">
              <GraduationCap className="text-accent" /> Academic Experience
            </h2>
            <p className="text-muted">Projects and roles within the university.</p>
          </div>
          <div className="space-y-8">
            {academicExperience.map((exp, i) => (
              <motion.div
                key={exp.context}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 border-l-2 border-slate-200"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">{exp.date}</span>
                  <h3 className="text-lg font-bold mb-1">{exp.role}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-3">{exp.context}</p>
                  <p className="text-muted text-xs leading-relaxed">{exp.desc}</p>
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('sending');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
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
        toast.success("Message sent successfully! I'll get back to you soon.", {
          icon: "🚀"
        });
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
    <section id="contact" className="section-padding">
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
                <Phone className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Phone</p>
                <p className="font-medium">+91 9154694401</p>
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
                <input name="name" required type="text" className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                <input name="email" required type="email" className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
              <textarea name="message" required rows={4} className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none resize-none" placeholder="Let's discuss opportunities..."></textarea>
            </div>
            <button 
              disabled={formState === 'sending' || formState === 'sent'}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {formState === 'idle' && <><Send size={18} /> Send Message</>}
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
  return (
    <footer className="py-12 px-6 border-top border-slate-100 text-center bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://github.com/mouli4401" target="_blank" className="text-slate-400 hover:text-accent transition-colors"><Github size={20} /></a>
          <a href="https://linkedin.com/in/mouliduggirala" target="_blank" className="text-slate-400 hover:text-accent transition-colors"><Linkedin size={20} /></a>
          <a href="https://leetcode.com/u/mouli881/" target="_blank" className="text-slate-400 hover:text-accent transition-colors"><Code2 size={20} /></a>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()} Duggirala Mouli. Built with React & Tailwind.
        </p>
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
      title: "Project Leadership",
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="text-accent" /> Academic Journey
          </h2>
          <p className="text-muted">A timeline of my growth at Velagapudi Ramakrishna Siddhartha Engineering College.</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-12">
            {journey.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 w-full md:w-auto">
                  <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-accent/30 transition-all ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-accent font-bold text-lg mb-1 block">{item.year}</span>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-3">{item.institution}</p>
                    <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="relative z-10 w-10 h-10 rounded-full bg-white border-4 border-accent shadow-sm flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Certifications = () => {
  const certifications = [
    {
      title: "Prompt Engineering Foundation",
      issuer: "AWS",
      link: "#" // Drive link placeholder
    },
    {
      title: "Cloud Fundamentals",
      issuer: "AWS",
      link: "#" // Drive link placeholder
    },
    {
      title: "Design Thinking",
      issuer: "DotSphere",
      link: "#" // Drive link placeholder
    },
    {
      title: "Java Developer Certification",
      issuer: "Infosys",
      link: "#" // Drive link placeholder
    },
    {
      title: "Computer Networks",
      issuer: "Cisco",
      link: "#" // Drive link placeholder
    }
  ];

  return (
    <section id="certifications" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4 flex items-center justify-center gap-3">
            <Award className="text-accent" /> Certifications Gallery
          </h2>
          <p className="text-muted">Professional certifications and recognitions.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <Trophy className="text-accent" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2 leading-tight">{cert.title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">{cert.issuer}</p>
              </div>
              
              <a 
                href={cert.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:underline mt-auto"
              >
                View Certificate <ExternalLink size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  const achievements = [
    {
      title: "APEAPCET 2022 Rank 7551",
      issuer: "Among 166,000 candidates",
      desc: "Secured a top rank in the state-level engineering entrance examination."
    },
    {
      title: "Runner-up",
      issuer: "Design Thinking Workshop 2024",
      desc: "Recognized for innovative problem-solving and design methodology."
    },
    {
      title: "Diamond League Winner",
      issuer: "Google Cloud",
      desc: "Achieved top-tier recognition in Google Cloud skill challenges."
    }
  ];

  return (
    <section id="achievements" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4 flex items-center justify-center gap-3">
            <Trophy className="text-accent" /> Achievements
          </h2>
          <p className="text-muted">Milestones and competitive recognitions.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Flame className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 leading-tight">{ach.title}</h3>
              <p className="text-accent text-sm font-bold mb-3">{ach.issuer}</p>
              <p className="text-muted text-xs leading-relaxed">{ach.desc}</p>
            </motion.div>
          ))}
        </div>
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
      <Achievements />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
}
