import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Target, Zap, Shield, Users, TrendingUp, Download, Smartphone, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/owlo-logo.svg" alt="Owlo" className="h-8 w-8" />
              <span className="text-xl font-bold">Owlo</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="relative">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              ✨ Stress-free AI Productivity
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Discover{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Productivity Coach
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your daily workflow with personalized AI recommendations. 
              Get actionable insights tailored to your work patterns and boost your productivity effortlessly.
            </p>

            {/* Floating Elements */}
            <div className="absolute -top-10 left-10 opacity-20 animate-pulse">
              <div className="w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
            </div>
            <div className="absolute top-20 right-16 opacity-30 animate-pulse delay-1000">
              <div className="w-12 h-12 bg-secondary/30 rounded-full blur-lg"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Download className="mr-2 h-5 w-5" />
                Download App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
                <Monitor className="mr-2 h-5 w-5" />
                Try Web Version
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-muted-foreground">Productivity Increase</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">2.5hrs</div>
              <div className="text-muted-foreground">Time Saved Daily</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">50k+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Intelligent Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Owlo analyzes your work patterns and provides personalized recommendations 
              to optimize your productivity workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Smart Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get personalized daily recommendations based on your app usage and work patterns.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Activity Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track your productivity patterns with detailed analytics and weekly summaries.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Instant Actions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Execute productivity tips with one-click actions and copy-paste prompts.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data stays secure with end-to-end encryption and privacy-focused design.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Team Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share productivity insights with your team and collaborate more effectively.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Continuous Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI that learns from your preferences and gets better at helping you over time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Framework Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                🧠 AI Framework
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                A Custom AI Framework That Understands
                <span className="text-primary"> Your Workflow</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Owlo's proprietary AI analyzes your daily app usage, identifies productivity 
                patterns, and delivers actionable recommendations tailored specifically to your work style.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Pattern Recognition</h4>
                    <p className="text-muted-foreground">Identifies your most productive hours and apps</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Actions</h4>
                    <p className="text-muted-foreground">Suggests tools and workflows specific to your needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Continuous Optimization</h4>
                    <p className="text-muted-foreground">Learns and adapts to improve recommendations over time</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-3/4"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Productivity Score: 85%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-primary">2.5hrs</div>
                      <div className="text-sm text-muted-foreground">Time Saved</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-secondary">12</div>
                      <div className="text-sm text-muted-foreground">Actions Today</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Focus Sessions</span>
                      <span className="text-primary">4/5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tasks Completed</span>
                      <span className="text-secondary">8/10</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Recommendations Used</span>
                      <span className="text-accent">5/7</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Boost Your Productivity?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join thousands of professionals who are already using Owlo to optimize 
              their workflow and achieve more with less effort.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <Smartphone className="mr-2 h-5 w-5" />
                Download for Mobile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-12 py-6 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Monitor className="mr-2 h-5 w-5" />
                Try Web App
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              Free to start • No credit card required • Available on all platforms
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/owlo-logo.svg" alt="Owlo" className="h-6 w-6" />
              <span className="font-semibold">Owlo</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Owlo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;