"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  BarChart,
  Layers,
  IceCream,
  Book,
  Download,
  Rocket,
  Calendar,
  Mail,
  Puzzle,
  Clock,
  Lock,
  Cloud,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Scissors, Brain, Printer, BookOpen, LineChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { MousePointer, FileText, Play, Check } from "lucide-react";





const steps = [
  {
    icon: "MousePointer",
    title: "Design Your Flow",
    description:
      "Drag and drop triggers, actions, and conditions to create your perfect workflow.",
    color: "bg-studio-600",
    iconColor: "text-white",
  },
  {
    icon: "FileText",
    title: "Connect Your Apps",
    description:
      "Choose from over 200 app integrations and connect them with a few clicks.",
    color: "bg-flow-500",
  },
  {
    icon: "Play",
    title: "Activate and Run",
    description:
      "Turn on your automation and let StudioFlow handle the rest. It's that simple.",
    color: "bg-studio-600",
  },
  {
    icon: "Check",
    title: "Monitor Results",
    description:
      "Track performance, get notifications, and optimize your workflows over time.",
    color: "bg-flow-500",
  },
];

// Dynamically render icon components by name
import { LucideIcon } from "lucide-react";

// Dynamically render icon components by name
const getIconComponent = (name: string) => {
  // Create a mapping with proper Lucide icon typing
  const iconMapping: Record<string, LucideIcon> = {
    MousePointer: MousePointer,
    FileText: FileText,
    Play: Play,
    Check: Check,
    Zap: Zap,
    Mail: Mail,
    Calendar: Calendar,
  };

  const Icon = iconMapping[name];

  if (!Icon) {
    console.error(`Icon ${name} not found`);
    return null;
  }

  return <Icon className="w-6 h-6 " />;
};
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentYear = new Date().getFullYear();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

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
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-studio-500" />,
      title: "No-Code Automation",
      description:
        "Build complex automation flows without writing a single line of code. Perfect for teams of all technical levels.",
    },
    {
      icon: <Puzzle className="w-6 h-6 text-studio-500" />,
      title: "200+ App Integrations",
      description:
        "Connect with your favorite tools and services. From CRMs to email marketing, we've got you covered.",
    },
    {
      icon: <Clock className="w-6 h-6 text-flow-500" />,
      title: "Save Hours Weekly",
      description:
        "Eliminate repetitive tasks and let StudioFlow handle them automatically, giving you back your valuable time.",
    },
    {
      icon: <Lock className="w-6 h-6 text-flow-500" />,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security protocols keep your data and workflows protected at all times.",
    },
    {
      icon: <Cloud className="w-6 h-6 text-studio-500" />,
      title: "Cloud-Based Platform",
      description:
        "Access your workflows from anywhere. No installations required, just log in and start building.",
    },
    {
      icon: <Layers className="w-6 h-6 text-flow-500" />,
      title: "Powerful Logic Controls",
      description:
        "Create conditional logic, loops, and advanced workflows to handle complex business processes.",
    },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col ml-5">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              S
            </div>
            <span>StudioFlow</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>

            {/* <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            /> */}

            {/* Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link> */}
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className=" cursor-pointer rounded-full"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {status === "authenticated" ? (
              <>
                <Link href="/profile" className="flex items-center gap-2">
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    {session.user?.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSignIn}
                  className="cursor-pointer rounded-full"
                >
                  Log in
                  <ChevronRight className="ml-1 size-4" />
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="cursor-pointer rounded-full"
                >
                  Get Started
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link
                  href="#"
                  className="py-2 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Button className="rounded-full">
                  Get Started
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        <section className="w-full py-10 md:py-10 lg:py-20 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className=" max-w-3xl  mb-12"
            >
              {/* <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Launching Soon
              </Badge> */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
                <span className="gradient-text block animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Automate Your Tasks
                </span>{" "}
                <span className="inline-block animate-slide-in-delay text-gray-800">
                  With Visual Flows
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 animate-fade-in-up delay-150 mt-15">
                Drag. Drop. Automate. No code. <br />
                Connect apps, automate workflows, and save time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300 mt-15">
                <Button  onClick = {handleSignUp} className=" cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-white text-lg h-12 px-6 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
                  Get Started for Free
                </Button>
                <Button
                  variant="outline"
                  className="text-lg h-12 px-6 rounded-full border-muted shadow-sm hover:scale-105 hover:shadow-md transition-transform duration-300"
                >
                  Watch Demo
                </Button>
              </div>

              {/* <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Cancel anytime</span>
                </div> 

              </div> */}
            </motion.div>
          </div>
        </section>

        {/* Logos Section
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by innovative companies worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={`/placeholder-logo.svg`}
                    alt={`Company logo ${i}`}
                    width={120}
                    height={60}
                    className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Flow Demo Section */}
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-10 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
              {/* Trigger Node */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 shadow-md">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Trigger</div>
                  <div className="text-xs text-gray-500">
                    New Email Received
                  </div>
                </div>
              </div>

              {/* Flow Connector 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-full h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-yellow-400 rounded-full relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">
                    Flow Initiated
                  </div>
                </div>
              </div>

              {/* Process Node */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-2 shadow-md">
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Process</div>
                  <div className="text-xs text-gray-500">
                    Extract Relevant Data
                  </div>
                </div>
              </div>

              {/* Flow Connector 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-green-400 to-green-600 rounded-full relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium whitespace-nowrap">
                    Processing Complete
                  </div>
                </div>
              </div>

              {/* Action Node */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2 shadow-md">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Action</div>
                  <div className="text-xs text-gray-500">
                    Create Calendar Event
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section
          id="features"
          className="section bg-gray-50 relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-studio-100/50 rounded-full blur-3xl -z-10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to{" "}
                <span className="gradient-text">Automate Your Work</span>
              </h2>
              <p className="text-gray-600">
                StudioFlow combines powerful features with an intuitive
                interface, making workflow automation accessible to everyone.
              </p>

              {/* Down Arrow Animation */}
              <div className="flex justify-center mt-6 animate-bounce-slow">
                <ChevronDown className="w-6 h-6 text-studio-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 card-hover transition-transform transform hover:-translate-y-1 hover:shadow-lg duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* How it works Section */}
        <section id="how-it-works" className="section mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">How StudioFlow Works</span>
              </h2>
              <p className="text-gray-600">
                Getting started with StudioFlow is easy. Follow these simple
                steps to create your first automation in minutes.
              </p>
            </div>

            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 hidden md:block z-0"></div>

              <div className="space-y-16 relative z-10">
                {steps.map((step, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={index}
                      className={`md:flex items-center ${
                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                      } relative`}
                    >
                      <div
                        className={`md:w-1/2 px-4 flex items-center gap-4 ${
                          isEven
                            ? "justify-end text-right"
                            : "justify-start text-left"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-full bg-studio-600 flex items-center justify-center shadow-md relative`}
                        >
                          {getIconComponent(step.icon)}
                          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-studio-600 flex items-center justify-center font-bold border-2 border-studio-600 text-xs">
                            {index + 1}
                          </span>
                        </div>
                        <div className="max-w-sm">
                          <h3 className="text-xl font-semibold mb-1">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        {/* <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Loved by Parents Worldwide
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Don't just take our word for it. See what our customers have to
                say about their experience.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "SaaSify has transformed how we manage our projects. The automation features have saved us countless hours of manual work.",
                  author: "Sarah Johnson",
                  role: "Project Manager, TechCorp",
                  rating: 5,
                },
                {
                  quote:
                    "The analytics dashboard provides insights we never had access to before. It's helped us make data-driven decisions that have improved our ROI.",
                  author: "Michael Chen",
                  role: "Marketing Director, GrowthLabs",
                  rating: 5,
                },
                {
                  quote:
                    "Customer support is exceptional. Any time we've had an issue, the team has been quick to respond and resolve it. Couldn't ask for better service.",
                  author: "Emily Rodriguez",
                  role: "Operations Lead, StartupX",
                  rating: 5,
                },
                {
                  quote:
                    "We've tried several similar solutions, but none compare to the ease of use and comprehensive features of SaaSify. It's been a game-changer.",
                  author: "David Kim",
                  role: "CEO, InnovateNow",
                  rating: 5,
                },
                {
                  quote:
                    "The collaboration tools have made remote work so much easier for our team. We're more productive than ever despite being spread across different time zones.",
                  author: "Lisa Patel",
                  role: "HR Director, RemoteFirst",
                  rating: 5,
                },
                {
                  quote:
                    "Implementation was seamless, and the ROI was almost immediate. We've reduced our operational costs by 30% since switching to SaaSify.",
                  author: "James Wilson",
                  role: "COO, ScaleUp Inc",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex mb-4">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, j) => (
                            <Star
                              key={j}
                              className="size-4 text-yellow-500 fill-yellow-500"
                            />
                          ))}
                      </div>
                      <p className="text-lg mb-6 flex-grow">
                        {testimonial.quote}
                      </p>
                      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section
          id="pricing"
          className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Choose the plan that's right for your business. All plans
                include a 14-day free trial.
              </p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="monthly" className="rounded-full px-6">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="annually" className="rounded-full px-6">
                      Annually (Save 20%)
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Starter",
                        price: "$29",
                        description: "Perfect for small teams and startups.",
                        features: [
                          "Up to 5 team members",
                          "Basic analytics",
                          "5GB storage",
                          "Email support",
                        ],
                        cta: "Start Free Trial",
                      },
                      {
                        name: "Professional",
                        price: "$79",
                        description: "Ideal for growing businesses.",
                        features: [
                          "Up to 20 team members",
                          "Advanced analytics",
                          "25GB storage",
                          "Priority email support",
                          "API access",
                        ],
                        cta: "Start Free Trial",
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$199",
                        description:
                          "For large organizations with complex needs.",
                        features: [
                          "Unlimited team members",
                          "Custom analytics",
                          "Unlimited storage",
                          "24/7 phone & email support",
                          "Advanced API access",
                          "Custom integrations",
                        ],
                        cta: "Contact Sales",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${
                            plan.popular
                              ? "border-primary shadow-lg"
                              : "border-border/40 shadow-md"
                          } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">
                                {plan.price}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                /month
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {plan.description}
                            </p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${
                                plan.popular
                                  ? "bg-primary hover:bg-primary/90"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annually">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Starter",
                        price: "$23",
                        description: "Perfect for small teams and startups.",
                        features: [
                          "Up to 5 team members",
                          "Basic analytics",
                          "5GB storage",
                          "Email support",
                        ],
                        cta: "Start Free Trial",
                      },
                      {
                        name: "Professional",
                        price: "$63",
                        description: "Ideal for growing businesses.",
                        features: [
                          "Up to 20 team members",
                          "Advanced analytics",
                          "25GB storage",
                          "Priority email support",
                          "API access",
                        ],
                        cta: "Start Free Trial",
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$159",
                        description:
                          "For large organizations with complex needs.",
                        features: [
                          "Unlimited team members",
                          "Custom analytics",
                          "Unlimited storage",
                          "24/7 phone & email support",
                          "Advanced API access",
                          "Custom integrations",
                        ],
                        cta: "Contact Sales",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${
                            plan.popular
                              ? "border-primary shadow-lg"
                              : "border-border/40 shadow-md"
                          } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">
                                {plan.price}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                /month
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {plan.description}
                            </p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${
                                plan.popular
                                  ? "bg-primary hover:bg-primary/90"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section> */}

        {/* <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about our platform.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question:
                      "What age group are these worksheets suitable for?",
                    answer:
                      "Our materials are designed for children aged 3-12 years old, with activities categorized into preschool (3-5), early elementary (6-8), and upper elementary (9-12) levels. Each worksheet clearly displays recommended age ranges.",
                  },
                  {
                    question: "How do I access purchased worksheets?",
                    answer:
                      "Immediately after purchase, you'll receive a PDF download link and access through your account dashboard. Worksheets are print-ready and can be reused for multiple children in your family.",
                  },
                  {
                    question: "Can I share worksheets with other parents?",
                    answer:
                      "Your purchase is licensed for single-family use. We offer classroom licenses for educators and group discounts for parenting communities. Please contact us for bulk licensing options.",
                  },
                  {
                    question:
                      "Are these worksheets aligned with educational standards?",
                    answer:
                      "All materials are developed by certified educators and aligned with Common Core standards. We include skill development indicators on each worksheet for easy progress tracking.",
                  },
                  {
                    question:
                      "What if my child finds the activities too challenging?",
                    answer:
                      "We provide multiple difficulty levels for most activities and offer free adaptation suggestions in our parenting guides. Our blog also features tips for modifying activities based on your child's needs.",
                  },
                  {
                    question: "Do you offer refunds?",
                    answer:
                      "We offer a 100% satisfaction guarantee within 14 days of purchase. If any worksheet doesn't meet your expectations, we'll happily provide a replacement or refund.",
                  },
                  {
                    question: "How often do you add new content?",
                    answer:
                      "We release new worksheet packs weekly and seasonal activities monthly. Subscribers get automatic access to all new content through their membership.",
                  },
                  {
                    question: "Are the materials screen-free friendly?",
                    answer:
                      "Yes! All worksheets are designed for hands-on learning. We intentionally create activities that encourage offline engagement and real-world skill development.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${i}`}
                      className="border-b border-border/40 py-2"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section> */}

        {/* <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Transform Your Child?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join thousands of satisfied customers who have streamlined their
                processes and boosted productivity with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full h-12 px-8 text-base"
                >
                  View Demo
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4">
                No credit card required. Lifetime Access.
              </p>
            </motion.div>
          </div>
        </section>*/}
      </main>
      {/* <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                  K
                </div>
                <span>Kinovo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform your kid with printable worksheets
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Kinovo. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div> 
        </div>
      </footer> */}
      <footer className="bg-gray-900 text-white pt-12 pb-6 mt-20">
        {" "}
        {/* Added mt-20 for spacing */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 gradient-text">
                StudioFlow
              </h3>
              <p className="text-gray-400 mb-4 max-w-sm">
                Simplifying workflow automation for teams of all sizes.
              </p>
              <div className="flex items-center space-x-3">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} StudioFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
