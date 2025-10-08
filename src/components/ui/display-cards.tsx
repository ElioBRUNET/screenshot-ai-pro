"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  showBottom?: boolean;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  showBottom = false,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-56 w-[32rem] -skew-y-[8deg] select-none flex-col justify-start gap-3 rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-6 py-5 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[30rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div className="flex-shrink-0">
        <span className="relative inline-block rounded-full bg-primary/20 p-1">
          {icon}
        </span>
        <p className={cn("text-2xl font-heading font-bold", titleClassName)}>{title}</p>
      </div>
      <p className="text-lg font-medium leading-snug">{description}</p>
      {showBottom && (<p className="mt-auto text-sm text-muted-foreground">{date}</p>)}
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/80 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 before:z-10 [&>*]:relative [&>*]:z-20",
      showBottom: true,
      date: "Always",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-12 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/80 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 before:z-10 [&>*]:relative [&>*]:z-20",
      showBottom: false,
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-8",
      showBottom: false,
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}