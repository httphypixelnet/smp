"use client";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState<true | false>(true)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    window.localStorage.setItem("darkMode", (!darkMode).toString());
  }
    return (
        <>
            <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
              <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Button
                variant={darkMode ? "ghost" : "g2"}
                size="icon"
                className="fixed top-4 right-4"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                >
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                </Button>
                </div>
                <h1>this page doesn&apos;t do anything lmao</h1>
            </div>
            
        </>
    )
}