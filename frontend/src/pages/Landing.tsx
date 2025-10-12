import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Globe, Mail, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

// ==================================================
// 👨‍💻 Developer Profile Card Component
// ==================================================
const DeveloperProfileCard = ({ developer }: { developer: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-80 [perspective:1000px]" onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <Card className="w-full h-full flex flex-col items-center justify-center p-6 border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <img
              src={developer.photo}
              alt={developer.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary/20"
            />
            <h3 className="text-xl font-semibold">{developer.name}</h3>
          </Card>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Card className="w-full h-full flex flex-col items-center justify-center p-6 border-2 border-primary/50">
            <h3 className="text-2xl font-bold mb-4">{developer.name}</h3>
            <div className="flex flex-col gap-4 items-center">
              <a
                href={`mailto:${developer.email}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevents card from flipping back
              >
                <Mail className="h-5 w-5" />
                <span>{developer.email}</span>
              </a>
              <a
                href={developer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevents card from flipping back
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};


const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "AI-Powered Verification",
      description: "Advanced algorithms analyze claims across multiple sources in real-time"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get verification results in seconds with detailed reasoning chains"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Detect misinformation in multiple languages and dialects"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Submit",
      description: "Paste a claim or upload voice/text content"
    },
    {
      number: "02",
      title: "Analyze",
      description: "AI agents gather evidence from trusted sources"
    },
    {
      number: "03",
      title: "Verify",
      description: "Get a detailed verdict with confidence scores"
    },
    {
      number: "04",
      title: "Share",
      description: "Export verified facts with traceable proof"
    }
  ];
  
  // Developer data for the new section
  const developers = [
    {
      name: "Prasad A M",
      photo: "https://placehold.co/200x200/7c3aed/ffffff?text=AJ",
      email: "amprasad18@gmail.com",
      linkedin: "https://linkedin.com/in/amprasad18"
    },
    {
      name: "Ningaraju H S",
      photo: "https://placehold.co/200x200/db2777/ffffff?text=MG",
      email: "maria.g@verisense.dev",
      linkedin: "https://linkedin.com/in/mariagarcia"
    },
    {
      name: "Tarun D",
      photo: "https://placehold.co/200x200/16a34a/ffffff?text=SC",
      email: "sam.c@verisense.dev",
      linkedin: "https://linkedin.com/in/samchen"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              VeriSense
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-6 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              AI that protects truth in the{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                age of misinformation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              VeriSense uses advanced AI to detect, analyze, and explain misinformation across news, 
              social media, and voice inputs with unprecedented accuracy.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8">
                  Try Demo
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-4xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Claims Verified</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-4xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose VeriSense?</h2>
            <p className="text-xl text-muted-foreground">Built for accuracy, transparency, and trust</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-8">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, fast, and transparent</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Fight Misinformation?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who trust VeriSense to verify facts and protect truth.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Verifying Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section -- NEW */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-muted-foreground">The minds behind the mission</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {developers.map((dev, index) => (
               <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <DeveloperProfileCard developer={dev} />
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">VeriSense</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ for truth and transparency
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
