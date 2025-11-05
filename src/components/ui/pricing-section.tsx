"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { useRef } from "react";

const plans = [
  {
    name: "Free Demo",
    description:
      "Test Owlo for free for one day and discover how AI can transform your productivity",
    buttonText: "Start Free Demo",
    buttonVariant: "default" as const,
    buttonLink: "https://calendly.com/novaflowmedia/30min?month=2025-11",
    popular: true,
    features: [
      { text: "Personalized onboarding call", icon: <Briefcase size={20} /> },
      { text: "Full app access for 24 hours", icon: <Database size={20} /> },
      { text: "Feedback session on AI implementation", icon: <Server size={20} /> },
    ],
    includes: [
      "What you get:",
      "One-on-one onboarding",
      "Complete feature access",
      "Data-driven AI recommendations",
      "Implementation strategy",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Implement AI in your team's workflow with full support and continuous optimization",
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    buttonLink: "https://calendly.com/novaflowmedia/30min?month=2025-11",
    features: [
      { text: "Full access anytime", icon: <Briefcase size={20} /> },
      { text: "Dedicated support team", icon: <Database size={20} /> },
      { text: "Daily recommendations & weekly reports", icon: <Server size={20} /> },
    ],
    includes: [
      "Enterprise includes:",
      "AI tailored to your workflow",
      "Unlimited team members",
      "Priority support",
      "Team-wide analytics",
    ],
  },
];

export default function PricingSection() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div className="px-4 pt-20 pb-20 min-h-screen mx-auto relative bg-background" ref={pricingRef}>
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)`,
          opacity: 0.15,
          mixBlendMode: "normal",
        }}
      />

      <div className="text-center mb-6 max-w-3xl mx-auto relative z-10">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-6xl sm:text-4xl text-3xl font-medium text-foreground mb-4"
        >
          Plans that work best for your{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="border-2 border-dashed border-primary px-2 py-1 rounded-xl bg-primary/10 capitalize inline-block"
          >
            productivity
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-base text-sm text-muted-foreground sm:w-[70%] w-[80%] mx-auto"
        >
          Trusted by thousands, we help individuals and teams stay focused and productive. Explore which option is right for you.
        </TimelineContent>
      </div>

      <div className="grid md:grid-cols-2 max-w-5xl gap-6 py-6 mx-auto relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={3 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative border ${
                plan.popular ? "ring-2 ring-primary bg-primary/5 shadow-lg shadow-primary/20" : "bg-card"
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {plan.buttonLink ? (
                  <a 
                    href={plan.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full mb-6 p-4 text-xl rounded-xl transition-all block text-center ${
                      plan.popular
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 border border-primary"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {plan.buttonText}
                  </a>
                ) : (
                  <button
                    className={`w-full mb-6 p-4 text-xl rounded-xl transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 border border-primary"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                )}
                <ul className="space-y-2 font-semibold py-5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-foreground grid place-content-center mt-0.5 mr-3">
                        {feature.icon}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-medium text-base text-foreground mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="h-6 w-6 bg-primary/10 border border-primary rounded-full grid place-content-center mt-0.5 mr-3">
                          <CheckCheck className="h-4 w-4 text-primary" />
                        </span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
