
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart3, Calendar, ClipboardList, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    {
      icon: <ClipboardList className="h-10 w-10 text-primary" />,
      title: "Task Management",
      description: "Assign and track tasks with ease, ensuring deadlines are met and priorities are clear."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Team Organization",
      description: "Manage your team structure, roles, and responsibilities all in one place."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Work Logging",
      description: "Track daily activities, time spent, and progress on assigned tasks."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Performance Analytics",
      description: "Gain insights into productivity, project status, and team performance."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent={!scrolled} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Saavik
              <span className="text-primary block mt-2">Where Team is a Family</span>
            </motion.h1>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button size="lg" className="px-8">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8">
                  {isAuthenticated ? "View Work Logs" : "Sign In"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 mx-auto">
          {/* <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Features Designed for Productivity
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage your team's work efficiently in one place.
            </p>
          </motion.div> */}

          {/* <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                variants={item}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          {/* <motion.div
            className="max-w-4xl mx-auto text-center bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to boost your team's productivity?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who use WorkLog to streamline their workflow and achieve more together.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
              </Button>
            </Link>
          </motion.div> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white mr-2">
                S
              </div>
              <span className="font-semibold">Saavik</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Saavik. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
