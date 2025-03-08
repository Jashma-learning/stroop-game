"use client"

import { useState } from "react"
import UserForm from "@/components/user-form"
import GameSeries from "@/components/game-series"
import { Button } from "@/components/ui/button"
import { Brain, Trophy, Clock, Sparkles } from "lucide-react"

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] via-[#6D28D9] to-[#1E3A8A]">
      {!showForm ? (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Cognitive Challenge Series
            </h1>
            <p className="text-xl text-[#F3F4F6] mb-8">
              Test and improve your cognitive abilities through engaging games
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-[#14B8A6] text-white hover:bg-[#14B8A6]/90 text-lg px-8 py-6"
            >
              Start Your Journey
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard 
              icon={Brain}
              title="Cognitive Enhancement"
              description="Improve memory, attention, and problem-solving skills"
            />
            <FeatureCard 
              icon={Trophy}
              title="Track Progress"
              description="Monitor your performance with detailed metrics"
            />
            <FeatureCard 
              icon={Clock}
              title="Quick Sessions"
              description="Complete engaging challenges in minutes"
            />
            <FeatureCard 
              icon={Sparkles}
              title="Scientific Approach"
              description="Based on established cognitive testing methods"
            />
          </div>

          <div className="bg-[#1E3A8A]/20 rounded-lg p-8 backdrop-blur-sm border border-white/10">
            <h2 className="text-2xl font-bold text-[#14B8A6] mb-4">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GamePreview
                number="01"
                title="Stroop Challenge"
                description="Test your attention and processing speed"
              />
              <GamePreview
                number="02"
                title="Tower of Hanoi"
                description="Challenge your problem-solving abilities"
              />
              <GamePreview
                number="03"
                title="Pattern Puzzler"
                description="Enhance your pattern recognition skills"
              />
              <GamePreview
                number="04"
                title="Maze Navigator"
                description="Improve your spatial reasoning"
              />
              <GamePreview
                number="05"
                title="Memory Match"
                description="Boost your visual memory"
              />
              <GamePreview
                number="06"
                title="Word Puzzle"
                description="Develop your verbal cognitive skills"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          {showForm && <GameSeries />}
        </div>
      )}
    </div>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#1E3A8A]/20 rounded-lg p-6 backdrop-blur-sm border border-white/10 hover:bg-[#1E3A8A]/30 transition-colors">
      <Icon className="w-12 h-12 text-[#14B8A6] mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-[#F3F4F6]">{description}</p>
    </div>
  )
}

function GamePreview({ 
  number, 
  title, 
  description 
}: { 
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#1E3A8A]/30 rounded-lg p-4 border border-white/10 hover:bg-[#1E3A8A]/40 transition-colors">
      <div className="text-sm text-[#14B8A6] mb-2">Game {number}</div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-[#F3F4F6] text-sm">{description}</p>
    </div>
  )
}

