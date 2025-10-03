"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Free",
    description:
      "Perfect for individuals getting started with Owlo's AI-powered focus tools",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Up to 5 focus sessions daily", icon: <Briefcase size={20} /> },
      { text: "Basic distraction blocking", icon: <Database size={20} /> },
      { text: "Simple analytics", icon: <Server size={20} /> },
    ],
    includes: [
      "Free includes:",
      "AI-powered recommendations",
      "Custom focus modes",
      "Cross-device sync",
    ],
  },
  {
    name: "Pro",
    description:
      "Best for professionals who want unlimited focus power and advanced features",
    price: 9,
    yearlyPrice: 89,
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Unlimited focus sessions", icon: <Briefcase size={20} /> },
      { text: "Advanced distraction blocking", icon: <Database size={20} /> },
      { text: "Detailed analytics & insights", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Free, plus:",
      "Priority AI suggestions",
      "Advanced scheduling",
      "Team collaboration",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Custom solutions for teams with enhanced security and dedicated support",
    price: 29,
    yearlyPrice: 289,
    buttonText: "Contact sales",
    buttonVariant: "outline" as const,
    features: [
      { text: "Unlimited team members", icon: <Briefcase size={20} /> },
      { text: "Advanced team analytics", icon: <Database size={20} /> },
      { text: "Custom integrations", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Pro, plus:",
      "Dedicated account manager",
      "Custom AI training",
      "SLA & priority support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-background/50 backdrop-blur-sm border border-border p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0"
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-2 border-primary bg-primary shadow-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1"
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-2 border-primary bg-primary shadow-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
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

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

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

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </TimelineContent>

      <div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={4 + index}
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
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold text-foreground">
                    $
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-semibold"
                    />
                  </span>
                  <span className="text-muted-foreground ml-1">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  className={`w-full mb-6 p-4 text-xl rounded-xl transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 border border-primary"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  {plan.buttonText}
                </button>
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
