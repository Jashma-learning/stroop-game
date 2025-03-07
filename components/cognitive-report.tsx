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
  metrics?: {
    stroop?: any
    hanoi?: any
    pattern?: any
    maze?: any
    memory?: any
    word?: any
  }
}

export default function CognitiveReport({ scores, userData, metrics }: CognitiveReportProps) {
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

      <div className="space-y-2 mb-6">
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

      {metrics?.stroop && (
        <div className="mb-4 p-4 bg-[#F3F4F6] rounded-lg">
          <h3 className="text-lg font-semibold text-[#6D28D9] mb-2">Stroop Task Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">Total Trials:</p>
              <p>{metrics.stroop.totalTrials}</p>
            </div>
            <div>
              <p className="font-medium">Correct Responses:</p>
              <p>{metrics.stroop.correctResponses}</p>
            </div>
            <div>
              <p className="font-medium">Incorrect Responses:</p>
              <p>{metrics.stroop.incorrectResponses}</p>
            </div>
            <div>
              <p className="font-medium">Best Streak:</p>
              <p>{metrics.stroop.bestStreak}</p>
            </div>
            <div>
              <p className="font-medium">Avg Reaction Time:</p>
              <p>{Math.round(metrics.stroop.avgReactionTime)} ms</p>
            </div>
            <div>
              <p className="font-medium">Error Rate:</p>
              <p>{(metrics.stroop.errorRate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium">Congruent Trials:</p>
              <p>{metrics.stroop.congruentTrials.count}</p>
            </div>
            <div>
              <p className="font-medium">Incongruent Trials:</p>
              <p>{metrics.stroop.incongruentTrials.count}</p>
            </div>
            <div>
              <p className="font-medium">Interference Effect:</p>
              <p>{Math.round(metrics.stroop.interferenceEffect)} ms</p>
            </div>
          </div>
        </div>
      )}

      {metrics?.hanoi && (
        <div className="mb-4 p-4 bg-[#F3F4F6] rounded-lg">
          <h3 className="text-lg font-semibold text-[#6D28D9] mb-2">Tower of Hanoi Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">Total Moves:</p>
              <p>{metrics.hanoi.totalMoves}</p>
            </div>
            <div>
              <p className="font-medium">Optimal Moves:</p>
              <p>{metrics.hanoi.optimalMoves}</p>
            </div>
            <div>
              <p className="font-medium">Move Efficiency:</p>
              <p>{(metrics.hanoi.moveEfficiency * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium">Invalid Moves:</p>
              <p>{metrics.hanoi.invalidMoves}</p>
            </div>
            <div>
              <p className="font-medium">Planning Time:</p>
              <p>{(metrics.hanoi.planningTime / 1000).toFixed(2)}s</p>
            </div>
            <div>
              <p className="font-medium">Avg Time per Move:</p>
              <p>{Math.round(metrics.hanoi.averageTimePerMove)}ms</p>
            </div>
            <div>
              <p className="font-medium">Move Pattern:</p>
              <p className="text-sm">
                1→2: {metrics.hanoi.movePattern.tower1to2}<br />
                1→3: {metrics.hanoi.movePattern.tower1to3}<br />
                2→1: {metrics.hanoi.movePattern.tower2to1}<br />
                2→3: {metrics.hanoi.movePattern.tower2to3}<br />
                3→1: {metrics.hanoi.movePattern.tower3to1}<br />
                3→2: {metrics.hanoi.movePattern.tower3to2}
              </p>
            </div>
            <div>
              <p className="font-medium">Learning Progress:</p>
              <p>
                {(
                  (metrics.hanoi.performanceOverTime.secondHalf.accuracy - 
                  metrics.hanoi.performanceOverTime.firstHalf.accuracy) * 100
                ).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {metrics?.maze && (
        <div className="mb-4 p-4 bg-[#F3F4F6] rounded-lg">
          <h3 className="text-lg font-semibold text-[#6D28D9] mb-2">Maze Navigation Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">Completion Time:</p>
              <p>{metrics.maze.completionTime ? (metrics.maze.completionTime / 1000).toFixed(2) : 'N/A'}s</p>
            </div>
            <div>
              <p className="font-medium">Total Moves:</p>
              <p>{metrics.maze.totalMoves || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Wall Collisions:</p>
              <p>{metrics.maze.wallCollisions || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Backtracks:</p>
              <p>{metrics.maze.backtrackCount || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Optimal Path Length:</p>
              <p>{metrics.maze.optimalPath?.length || 'N/A'} steps</p>
            </div>
            <div>
              <p className="font-medium">Actual Path Length:</p>
              <p>{metrics.maze.actualPath?.length || 'N/A'} steps</p>
            </div>
            <div>
              <p className="font-medium">Path Deviation:</p>
              <p>{metrics.maze.pathDeviation || 'N/A'} steps</p>
            </div>
            <div>
              <p className="font-medium">Path Efficiency:</p>
              <p>{metrics.maze.pathEfficiency ? (metrics.maze.pathEfficiency * 100).toFixed(1) : 'N/A'}%</p>
            </div>
            <div>
              <p className="font-medium">Avg Time per Move:</p>
              <p>{metrics.maze.averageTimePerMove ? Math.round(metrics.maze.averageTimePerMove) : 'N/A'}ms</p>
            </div>
            <div>
              <p className="font-medium">Movement Pattern:</p>
              <p>
                {metrics.maze.movementPatterns ? (
                  <>
                    ↑{metrics.maze.movementPatterns.up} 
                    ↓{metrics.maze.movementPatterns.down} 
                    ←{metrics.maze.movementPatterns.left} 
                    →{metrics.maze.movementPatterns.right}
                  </>
                ) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="font-medium">Learning Progress:</p>
              <p>{metrics.maze.performanceOverTime ? (
                (metrics.maze.performanceOverTime.secondHalf.accuracy - 
                metrics.maze.performanceOverTime.firstHalf.accuracy) * 100
              ).toFixed(1) : 'N/A'}%</p>
            </div>
          </div>
        </div>
      )}

      {metrics?.memory && (
        <div className="mb-4 p-4 bg-[#F3F4F6] rounded-lg">
          <h3 className="text-lg font-semibold text-[#6D28D9] mb-2">Memory Game Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">Total Time:</p>
              <p>{(metrics.memory.totalTime / 1000).toFixed(2)}s</p>
            </div>
            <div>
              <p className="font-medium">Memorization Time:</p>
              <p>{(metrics.memory.memorizeTime / 1000).toFixed(2)}s</p>
            </div>
            <div>
              <p className="font-medium">Total Moves:</p>
              <p>{metrics.memory.totalMoves}</p>
            </div>
            <div>
              <p className="font-medium">Correct Matches:</p>
              <p>{metrics.memory.correctMatches}</p>
            </div>
            <div>
              <p className="font-medium">Incorrect Attempts:</p>
              <p>{metrics.memory.incorrectAttempts}</p>
            </div>
            <div>
              <p className="font-medium">Match Accuracy:</p>
              <p>{(metrics.memory.matchAccuracy * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium">Avg Time per Move:</p>
              <p>{Math.round(metrics.memory.averageTimePerMove)}ms</p>
            </div>
            <div>
              <p className="font-medium">Memory Effectiveness:</p>
              <p>{(metrics.memory.memorizeEffectiveness * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium">First Half Performance:</p>
              <p>
                Accuracy: {(metrics.memory.performanceOverTime.firstHalf.accuracy * 100).toFixed(1)}%<br />
                Speed: {Math.round(metrics.memory.performanceOverTime.firstHalf.speed)}ms
              </p>
            </div>
            <div>
              <p className="font-medium">Second Half Performance:</p>
              <p>
                Accuracy: {(metrics.memory.performanceOverTime.secondHalf.accuracy * 100).toFixed(1)}%<br />
                Speed: {Math.round(metrics.memory.performanceOverTime.secondHalf.speed)}ms
              </p>
            </div>
          </div>
        </div>
      )}

      {metrics?.word && (
        <div className="mb-4 p-4 bg-[#F3F4F6] rounded-lg">
          <h3 className="text-lg font-semibold text-[#6D28D9] mb-2">Word Puzzle Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">Total Time:</p>
              <p>{(metrics.word.totalTime / 1000).toFixed(2)}s</p>
            </div>
            <div>
              <p className="font-medium">Words Attempted:</p>
              <p>{metrics.word.wordsAttempted}</p>
            </div>
            <div>
              <p className="font-medium">Words Completed:</p>
              <p>{metrics.word.wordsCompleted}</p>
            </div>
            <div>
              <p className="font-medium">Incorrect Attempts:</p>
              <p>{metrics.word.incorrectAttempts}</p>
            </div>
            <div>
              <p className="font-medium">Accuracy:</p>
              <p>{(metrics.word.accuracy * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium">Avg Time per Word:</p>
              <p>{Math.round(metrics.word.averageTimePerWord)}ms</p>
            </div>
            <div>
              <p className="font-medium">Longest Streak:</p>
              <p>{metrics.word.longestStreak}</p>
            </div>
            <div>
              <p className="font-medium">Final Streak:</p>
              <p>{metrics.word.currentStreak}</p>
            </div>
            <div>
              <p className="font-medium">First Half Performance:</p>
              <p>
                Accuracy: {(metrics.word.performanceOverTime.firstHalf.accuracy * 100).toFixed(1)}%<br />
                Speed: {Math.round(metrics.word.performanceOverTime.firstHalf.speed)}ms
              </p>
            </div>
            <div>
              <p className="font-medium">Second Half Performance:</p>
              <p>
                Accuracy: {(metrics.word.performanceOverTime.secondHalf.accuracy * 100).toFixed(1)}%<br />
                Speed: {Math.round(metrics.word.performanceOverTime.secondHalf.speed)}ms
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          This report provides a general assessment of cognitive abilities based on game performance. For a
          comprehensive evaluation, please consult with a qualified professional.
        </p>
      </div>
    </Card>
  )
}

