import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowRight, 
  Code, 
  Search, 
  Tags, 
  Folder, 
  Users, 
  Star, 
  ArrowDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CodeBlock, CodeBlockCode } from '@/components/ui/code-block';

const Glow = ({ className = '' }) => (
  <div
    className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/30 blur-3xl opacity-70 animate-pulse ${className}`}
    aria-hidden="true"
  />
);

const Landing = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true);
    
    // Add scroll event listener for animations
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (scrollY > sectionTop - window.innerHeight * 0.75) {
          section.classList.add('animate-fade-in');
          section.classList.remove('opacity-0');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Sample code snippet for the hero section
  const sampleCode = `// Store your code snippets effortlessly
const snippet = {
  title: "Useful React Hook",
  language: "typescript",
  code: \`const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
};\`,
  tags: ["react", "hooks", "typescript", "localStorage"]
};

// Save it to your collection
saveSnippet(snippet);\``;

  const features = [
    { 
      title: "Smart Organization", 
      description: "Automatically categorize your snippets with AI-powered tagging",
      icon: <Tags className="w-8 h-8 text-primary" />,
      delay: 0.2
    },
    { 
      title: "Powerful Search", 
      description: "Find exactly what you need with full-text and tag-based search",
      icon: <Search className="w-8 h-8 text-primary" />,
      delay: 0.3
    },
    { 
      title: "Rich Syntax Highlighting", 
      description: "Support for over 100 programming languages with beautiful highlighting",
      icon: <Code className="w-8 h-8 text-primary" />,
      delay: 0.4
    },
    { 
      title: "Custom Collections", 
      description: "Group related snippets into collections for easy access",
      icon: <Folder className="w-8 h-8 text-primary" />,
      delay: 0.5
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Senior Developer",
      text: "SnipStash has completely changed how I manage code snippets. The search is lightning fast!",
      avatar: "AC",
      delay: 0.3
    },
    {
      name: "Maria Rodriguez",
      role: "Full Stack Engineer",
      text: "I love how it automatically detects languages and suggests tags. Huge time saver!",
      avatar: "MR",
      delay: 0.4
    },
    {
      name: "Jamal Williams",
      role: "DevOps Specialist",
      text: "Managing my scripts and config files has never been easier. The organization is top-notch.",
      avatar: "JW",
      delay: 0.5
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center justify-center">
          <motion.span 
            className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            SnipStash
          </motion.span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <Button asChild>
                <Link to="/snippets">My Snippets</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full pt-24 pb-16 md:pt-32 md:pb-24 relative">
        <Glow />
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <motion.div 
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block">Store and organize</span>
                  <span className="block text-primary">your code snippets</span>
                </h1>
              </motion.div>
              <motion.p 
                className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Keep your code organized and easily accessible with powerful search, 
                tagging, and smart organization features.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {user ? (
                  <Button asChild size="lg" className="group">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="group">
                      <Link to="/auth">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                      <Link to="/auth?mode=login">Login</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.div>
            <motion.div
              className="mx-auto lg:mx-0 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-card border border-border shadow-xl rounded-xl p-2 overflow-hidden relative z-10">
                <div className="flex items-center gap-2 bg-muted rounded-t-lg px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary/70"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/70"></div>
                  <div className="text-sm text-muted-foreground ml-2">useLocalStorage.ts</div>
                </div>
                <CodeBlockCode 
                  code={sampleCode} 
                  language="typescript"
                  className="max-h-96 overflow-auto code-scrollbar rounded-b-lg"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -top-6 -left-6 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex justify-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button 
              variant="ghost" 
              size="lg" 
              className="flex items-center gap-2 group animate-bounce"
              onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
            >
              <span>Explore Features</span>
              <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col items-center text-center space-y-4 animate-on-scroll opacity-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything you need to manage code snippets
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SnipStash provides all the tools you need to collect, organize and find your code when you need it most.
            </p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                className="relative flex flex-col items-center text-center space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md overflow-hidden"
              >
                {/* Glow behind the icon */}
                <Glow className="absolute -z-10 left-1/2 top-8 w-40 h-32 opacity-40 blur-2xl" />
                <div className="p-3 rounded-full bg-primary/10 ring-1 ring-primary/20 z-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold z-10">{feature.title}</h3>
                <p className="text-muted-foreground z-10">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Code showcase section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div 
              className="animate-on-scroll opacity-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Beautiful Syntax Highlighting
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  With support for over 100 programming languages, your code always looks its best. 
                  Identify patterns, share solutions, and organize your knowledge all in one place.
                </p>
                <ul className="space-y-2">
                  {["Pattern detection", "Line numbering", "Copy with one click", "Collapsible sections"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link to={user ? "/snippets" : "/auth"}>
                      Try it yourself
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="animate-on-scroll opacity-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                <CodeBlockCode 
                  code={`function detectPattern(code) {
  // Detect common patterns in code
  const patterns = {
    loops: /(for|while|do)\\s*\\(/g,
    conditionals: /(if|switch|\\?:)\\s*\\(/g,
    functions: /function\\s+\\w+\\s*\\(/g,
    apis: /(fetch|axios|request)\\s*\\(/g,
    reactHooks: /use[A-Z]\\w+\\s*\\(/g
  };
  
  const results = {};
  
  // Find all patterns
  Object.entries(patterns).forEach(([key, regex]) => {
    const matches = [...code.matchAll(regex)];
    results[key] = matches.length;
  });
  
  return results;
}`} 
                  language="javascript"
                  className="code-scrollbar max-h-96"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-col items-center text-center space-y-4 animate-on-scroll opacity-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Loved by developers
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              See what others are saying about SnipStash
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-16"
            variants={container}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
          >
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={item}
                className="flex flex-col h-full p-6 bg-card border border-border rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </div>
                <p className="text-muted-foreground flex-grow">{testimonial.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-col items-center text-center space-y-4 animate-on-scroll opacity-0 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 lg:p-16 rounded-2xl border border-border"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to organize your code?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Join thousands of developers who trust SnipStash to manage their code snippets.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {user ? (
                <Button asChild size="lg" className="group">
                  <Link to="/snippets">
                    My Snippets
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="group">
                    <Link to="/auth">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/auth?mode=login">Login</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-10 border-t border-border mt-auto">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <Link to="/" className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SnipStash
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Your code, organized. © 2025
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
