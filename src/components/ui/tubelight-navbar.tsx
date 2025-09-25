"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon?: LucideIcon
  external?: boolean
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  logo?: React.ReactNode
  rightContent?: React.ReactNode
}

export function NavBar({ items, className, logo, rightContent }: NavBarProps) {
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleTabClick = (itemName: string) => {
    setActiveTab(itemName)
  }

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50",
      className,
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {logo && (
            <div className="flex items-center gap-3">
              {logo}
            </div>
          )}
          
          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-2 py-1 px-1 rounded-full">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                if (item.external) {
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      onClick={() => handleTabClick(item.name)}
                      className={cn(
                        "relative cursor-pointer text-sm font-semibold font-manrope px-6 py-2 rounded-full transition-colors",
                        "text-muted-foreground hover:text-foreground",
                        isActive && "text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon size={16} strokeWidth={2.5} />}
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="lamp"
                          className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                            <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                            <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                            <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                          </div>
                        </motion.div>
                      )}
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => handleTabClick(item.name)}
                    className={cn(
                      "relative cursor-pointer text-sm font-semibold font-manrope px-6 py-2 rounded-full transition-colors",
                      "text-muted-foreground hover:text-foreground",
                      isActive && "text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon size={16} strokeWidth={2.5} />}
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="lamp"
                        className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                          <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Content */}
          {rightContent && (
            <div className="flex items-center gap-4">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}