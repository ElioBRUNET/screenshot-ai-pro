import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DisplayCards from "@/components/ui/display-cards";
import { ArrowRight, BarChart3, Target, Zap, Shield, Users, TrendingUp, Download, Smartphone, Monitor, Play, Star, CheckCircle, Brain, Sparkles, Clock, Award, Home, Info, Download as DownloadIcon } from "lucide-react";
import { Link } from "react-router-dom";
const Landing = () => {
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
  }];
  const logo = <>
      <img src="/owlo-logo.svg" alt="Owlo" className="h-12 w-12" />
      
    </>;
  const rightContent = <>
      <Button variant="ghost" asChild className="hidden sm:inline-flex">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild className="btn-premium">
        <Link to="/login">Get Started</Link>
      </Button>
    </>;
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 pb-24 px-6 overflow-hidden">
        {/* Navigation integrated in hero */}
        <div className="container mx-auto relative z-20">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {logo}
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <a 
                  key={index} 
                  href={item.url} 
                  className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              {rightContent}
            </div>
          </nav>
        </div>
        {/* 3D Spline Animation Background */}
        <div className="absolute inset-0 z-0 scale-150">
          <iframe 
            src='https://my.spline.design/celestialflowabstractdigitalform-uWbPCWegovhjYb6E3H9IUBL9/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full"
          />
          {/* Watermark cover */}
          <div className="absolute bottom-0 right-0 w-48 h-20 bg-background"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-32 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl float animate-float opacity-30 z-[2]"></div>
        <div className="absolute top-48 right-16 w-24 h-24 bg-secondary/10 rounded-full blur-2xl float animate-float-slow opacity-40 z-[2]"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-accent/10 rounded-full blur-xl float animate-float opacity-35 z-[2]"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 px-6 py-2 text-sm font-medium animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Productivity Revolution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-[0.9] animate-fade-up" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.5)' }}>
            Unlock Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
              Peak Productivity
            </span>
            <br />
            with AI Insights
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-up [animation-delay:0.2s] backdrop-blur-sm bg-background/30 py-4 px-6 rounded-2xl" style={{ textShadow: '0 1px 10px rgba(255,255,255,0.8)' }}>
            Transform your daily workflow with personalized AI recommendations that understand your work patterns and boost productivity by up to 85%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-up [animation-delay:0.4s]">
            <Button size="lg" className="btn-premium text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl group">
              <Download className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Download Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="btn-premium-outline text-lg px-10 py-6 rounded-2xl group">
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-up [animation-delay:0.6s]">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold">4.9/5</span>
              <span>from 10,000+ users</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Free to start</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Privacy-first design</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{
            value: "85%",
            label: "Productivity Boost",
            icon: TrendingUp
          }, {
            value: "2.5hrs",
            label: "Time Saved Daily",
            icon: Clock
          }, {
            value: "50k+",
            label: "Active Users",
            icon: Users
          }, {
            value: "4.9★",
            label: "User Rating",
            icon: Award
          }].map((stat, index) => <div key={index} className="premium-card p-8 text-center rounded-2xl animate-fade-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      

      {/* AI Framework Section with Display Cards */}
      <section id="how-it-works" className="pt-24 pb-32 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-up">
            <Badge className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 px-6 py-2">
              <Brain className="w-4 h-4 mr-2" />
              AI That Understands
            </Badge>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
              AI That Understands
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Your Workflow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Owlo's advanced AI analyzes your work patterns and provides personalized recommendations 
              to optimize every aspect of your productivity workflow.
            </p>
          </div>

          <div className="flex justify-center animate-fade-up [animation-delay:0.3s]">
            <DisplayCards cards={[{
            icon: <Target className="size-4 text-primary" />,
            title: "Smart Recommendations",
            description: "Personalized daily tips",
            date: "Real-time",
            iconClassName: "text-primary",
            titleClassName: "text-primary",
            className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
          }, {
            icon: <BarChart3 className="size-4 text-secondary" />,
            title: "Activity Analytics",
            description: "Track productivity patterns",
            date: "Daily",
            iconClassName: "text-secondary",
            titleClassName: "text-secondary",
            className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
          }, {
            icon: <Zap className="size-4 text-accent" />,
            title: "Instant Actions",
            description: "One-click productivity boosts",
            date: "Instant",
            iconClassName: "text-accent",
            titleClassName: "text-accent",
            className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
          }, {
            icon: <Shield className="size-4 text-primary" />,
            title: "Privacy First",
            description: "Your data stays secure",
            date: "Always",
            iconClassName: "text-primary",
            titleClassName: "text-primary",
            className: "[grid-area:stack] translate-x-36 translate-y-32 hover:translate-y-20"
          }]} />
          </div>
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
              <Button size="lg" className="btn-premium text-lg px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl group">
                <Smartphone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Download for Mobile
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="btn-premium-outline text-lg px-12 py-6 rounded-2xl group">
                <Monitor className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Try Web App
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
                <img src="/owlo-logo.svg" alt="Owlo" className="h-8 w-8" />
                
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