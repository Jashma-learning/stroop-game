import { Card } from "@/components/ui/card"

interface CognitiveReportProps {
  scores: {
    stroop: number
    hanoi: number
    pattern: number
    maze: number
    memory: number
    word: number
  }
  userData: {
    name: string
    age: number
    education: string
  } | null
}

export default function CognitiveReport({ scores, userData }: CognitiveReportProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const maxPossibleScore = 6000 // Assuming each game has a max score of 1000

  const getCognitiveLevel = (score: number) => {
    const percentage = (score / maxPossibleScore) * 100
    if (percentage >= 90) return "Exceptional"
    if (percentage >= 80) return "Advanced"
    if (percentage >= 70) return "Above Average"
    if (percentage >= 50) return "Average"
    if (percentage >= 30) return "Below Average"
    return "Needs Improvement"
  }

  const getAreaStrength = (score: number, maxScore = 1000) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "Strong"
    if (percentage >= 60) return "Good"
    if (percentage >= 40) return "Average"
    return "Needs Improvement"
  }

  return (
    <Card className="w-full p-6 bg-white border-t-4 border-[#1E3A8A]">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4">Cognitive Assessment Report</h2>

      {userData && (
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Age:</strong> {userData.age}
          </p>
          <p>
            <strong>Education:</strong> {userData.education}
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-[#6D28D9]">Overall Cognitive Level</h3>
        <p className="text-lg font-bold">{getCognitiveLevel(totalScore)}</p>
        <p>
          Total Score: {totalScore} / {maxPossibleScore}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#6D28D9]">Cognitive Areas</h3>
        <p>
          <strong>Attention and Processing Speed (Stroop):</strong> {getAreaStrength(scores.stroop)}
        </p>
        <p>
          <strong>Problem Solving (Tower of Hanoi):</strong> {getAreaStrength(scores.hanoi)}
        </p>
        <p>
          <strong>Visual Memory (Pattern Puzzler):</strong> {getAreaStrength(scores.pattern)}
        </p>
        <p>
          <strong>Spatial Reasoning (Maze Navigator):</strong> {getAreaStrength(scores.maze)}
        </p>
        <p>
          <strong>Visual Recognition and Memory (Memory Match):</strong> {getAreaStrength(scores.memory)}
        </p>
        <p>
          <strong>Verbal Skills (Word Puzzle):</strong> {getAreaStrength(scores.word)}
        </p>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          This report provides a general assessment of cognitive abilities based on game performance. For a
          comprehensive evaluation, please consult with a qualified professional.
        </p>
      </div>
    </Card>
  )
}

