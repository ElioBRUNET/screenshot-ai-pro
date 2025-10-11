import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlassBadge } from "@/components/ui/glass-badge";
import { Input } from "@/components/ui/input";
import DisplayCards from "@/components/ui/display-cards";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import PricingSection from "@/components/ui/pricing-section";
import { DitheringShader } from "@/components/ui/dithering-shader";
import { ArrowRight, BarChart3, Target, Zap, Shield, Users, TrendingUp, Download, Smartphone, Monitor, Play, Star, CheckCircle, Brain, Sparkles, Clock, Award, Home, Info, Download as DownloadIcon, Apple } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const Landing = () => {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  const navItems = [{
    name: 'Features',
    url: '#features',
    external: true
  }, {
    name: 'How it Works',
    url: '#how-it-works',
    external: true
  }, {
    name: 'Download',
    url: '#download',
    external: true,
    icon: DownloadIcon
  }, {
    name: 'Sign In',
    url: '/login'
  }, {
    name: 'Get Started',
    url: '/login'
  }];
  return <div className="min-h-screen bg-background">
      {/* Logo - Static */}
      <div className="absolute top-4 left-12 z-40 flex items-center">
        <img src="/owlo-logo.png" alt="Owlo" className="h-20 w-20 md:h-24 md:w-24" />
      </div>
      
      {/* Navigation */}
      <NavBar items={navItems} className="bg-transparent backdrop-blur-none border-none mt-2" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <DitheringShader 
            shape="wave"
            type="8x8"
            colorBack="#ffffff"
            colorFront="#add8e6"
            pxSize={3}
            speed={0.4}
            className="w-full h-full opacity-40"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <GlassBadge icon={<Sparkles className="w-4 h-4" />} className="mb-8 animate-fade-in">
            AI-Powered Productivity Revolution
          </GlassBadge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-[1.1] animate-fade-up text-foreground">
            Your <span className="px-1.5 py-0.5 rounded-md inline-block -rotate-1" style={{ backgroundColor: 'rgba(255, 130, 56, 0.6)' }}>AI Work Coach</span>{" "}
            for Peak Productivity
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-up [animation-delay:0.2s]">
            Transform your daily workflow with personalized AI recommendations that understand your work patterns and boost productivity by up to 85%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-up [animation-delay:0.4s]">
            <Button size="lg" className="bg-white hover:bg-gray-50 text-blue-600 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl group border-2 border-gray-200" asChild>
              <a href="https://github.com/ElioBRUNET/screenshot-ai-pro/releases/download/v.1.0.0/OWLO-1.0.0-arm64.dmg" download>
                <svg className="mr-3 h-8 w-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Download for Mac
              </a>
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl group" asChild>
              <a href="https://github.com/ElioBRUNET/screenshot-ai-pro/releases/download/v.1.0.0/OWLO.Setup.1.0.0.exe" download>
                <svg className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
                Download for Windows
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          
        </div>
      </section>

      {/* AI Framework Section with Display Cards */}
      <section id="how-it-works" className="pt-24 pb-64 px-6 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <GlassBadge icon={<Brain className="w-4 h-4" />} className="mb-6">
              AI That Understands
            </GlassBadge>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
              AI That Understands
              <br />
              <span className="text-primary">Your Workflow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Owlo's advanced AI analyzes your work patterns and provides personalized recommendations 
              to optimize every aspect of your productivity workflow.
            </p>
          </div>

          <div className="flex justify-center animate-fade-up [animation-delay:0.3s]">
            <DisplayCards cards={[{
            icon: <Target className="size-5 text-primary" />,
            title: "Smart Recommendations",
            description: "Get personalized daily tips and insights",
            date: "Real-time updates",
            iconClassName: "text-primary",
            titleClassName: "text-primary",
            className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 before:z-10"
          }, {
            icon: <BarChart3 className="size-5 text-secondary" />,
            title: "Productivity Patterns",
            description: "Track and analyze your daily work habits",
            iconClassName: "text-secondary",
            titleClassName: "text-secondary",
            className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 before:z-10"
          }, {
            icon: <Zap className="size-5 text-accent" />,
            title: "Quick Actions",
            description: "Boost productivity with one-click shortcuts",
            iconClassName: "text-accent",
            titleClassName: "text-accent",
            className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 before:z-10"
          }, {
            icon: <Shield className="size-5 text-primary" />,
            title: "Privacy Protected",
            description: "Your data stays secure and private",
            iconClassName: "text-primary",
            titleClassName: "text-primary",
            className: "[grid-area:stack] translate-x-36 translate-y-32 hover:translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/70 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 before:z-10"
          }]} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Bento Grid Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <GlassBadge icon={<Sparkles className="w-4 h-4" />} className="mb-6">
              Why Choose Owlo
            </GlassBadge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              Trusted by Thousands of
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Productivity Enthusiasts
              </span>
            </h2>
          </div>
          
          <BentoGrid className="lg:grid-rows-4 max-w-6xl mx-auto">
            <BentoCard name="85% Productivity Boost" className="lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2" background={<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />} Icon={TrendingUp} description="See measurable improvements in your daily workflow and task completion rates." href="#features" cta="Learn more" />
            <BentoCard name="2.5hrs Time Saved Daily" className="lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3" background={<div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent" />} Icon={Clock} description="Reclaim valuable hours every day with AI-powered workflow optimization." href="#features" cta="Learn more" />
            <BentoCard name="50k+ Active Users" className="lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-5" background={<div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />} Icon={Users} description="Join a community of professionals optimizing their productivity." href="#features" cta="Learn more" />
            <BentoCard name="4.9★ User Rating" className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-5" background={<div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent" />} Icon={Star} description="Highly rated by over 10,000+ users for its effectiveness and ease of use." href="#features" cta="Learn more" />
            <BentoCard name="Privacy-First Design" className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3" background={<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />} Icon={Shield} description="Your data stays secure with end-to-end encryption and local processing." href="#features" cta="Learn more" />
            <BentoCard name="Free to Start" className="lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-5" background={<div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />} Icon={CheckCircle} description="Get started today with no credit card required. Upgrade when you're ready." href="#download" cta="Get Started" />
          </BentoGrid>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto animate-fade-up">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Productivity?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Join thousands of professionals who are already using Owlo to optimize 
              their workflow and achieve more with less effort.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button size="lg" className="bg-white hover:bg-gray-50 text-blue-600 text-lg px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl group border-2 border-gray-200" asChild>
                <a href="https://github.com/ElioBRUNET/screenshot-ai-pro/releases/download/v.1.0.0/OWLO-1.0.0-arm64.dmg" download>
                  <svg className="mr-3 h-8 w-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Download for Mac
                </a>
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl group" asChild>
                <a href="https://github.com/ElioBRUNET/screenshot-ai-pro/releases/download/v.1.0.0/OWLO.Setup.1.0.0.exe" download>
                  <svg className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                  Download for Windows
                </a>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-8">
              Free to start • No credit card required • Available on all platforms
            </p>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <Input placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl border-2 border-border/50 focus:border-primary transition-colors" />
                <Button className="btn-premium px-8 py-3 rounded-xl">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Get early access to new features and productivity tips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/owlo-logo.png" alt="Owlo" className="h-24 w-24" />
                
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Transform your productivity with AI-powered insights and personalized recommendations 
                that understand your unique work patterns.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Crafted with</span>
                <span className="text-red-500">♥</span>
                <span>by the Owlo team</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><a href="#download" className="hover:text-foreground transition-colors">Download</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2024 Owlo. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;