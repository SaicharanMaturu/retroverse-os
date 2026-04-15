import { useGameStore } from "../store/useGameStore";

export default function ChallengePanel() {
  const {
    progress,
    currentChallenge,
    hints,
    showChallenge,
    showHint,
    toggleChallengeView
  } = useGameStore();

  if (!currentChallenge) {
    return (
      <div className="p-4 bg-gradient-to-b from-purple-900 to-black border-b border-purple-500">
        <div className="text-center text-green-400 text-lg font-bold">
          🎉 ALL CHALLENGES COMPLETED! 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="border-b-2 border-purple-500 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 transition-all">
      {/* Minimized View */}
      {!showChallenge && (
        <button
          onClick={() => toggleChallengeView(true)}
          className="w-full p-2 text-left text-yellow-300 hover:bg-purple-800 font-bold"
        >
          📊 Challenge {currentChallenge.id} | Level {currentChallenge.level} | XP: {progress.xp}
        </button>
      )}

      {/* Full Challenge View */}
      {showChallenge && (
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-cyan-300">
                Level {currentChallenge.level}: {currentChallenge.title}
              </h3>
              <p className="text-sm text-gray-300">{currentChallenge.description}</p>
            </div>
            <button
              onClick={() => toggleChallengeView(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ─
            </button>
          </div>

          {/* Challenge Details */}
          <div className="bg-gray-800 p-3 rounded border-l-4 border-cyan-500">
            <p className="text-yellow-300 font-semibold mb-1">📋 Objective:</p>
            <p className="text-gray-200 text-sm">{currentChallenge.objective}</p>
          </div>

          {/* Hints */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-green-300 font-semibold">💡 Hints ({hints.length}/{currentChallenge.hints.length})</p>
              {hints.length < currentChallenge.hints.length && (
                <button
                  onClick={showHint}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-sm rounded"
                >
                  Show Hint
                </button>
              )}
            </div>
            {hints.map((hint, i) => (
              <div key={i} className="bg-green-900 bg-opacity-30 p-2 rounded text-green-200 text-sm border-l-2 border-green-500">
                {i + 1}. {hint}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="bg-purple-900 p-2 rounded">
              <p className="text-gray-400 text-xs">LEVEL</p>
              <p className="text-yellow-300 font-bold">{currentChallenge.level}/4</p>
            </div>
            <div className="bg-purple-900 p-2 rounded">
              <p className="text-gray-400 text-xs">DIFFICULTY</p>
              <p className="text-orange-300 font-bold">{currentChallenge.difficulty}</p>
            </div>
            <div className="bg-purple-900 p-2 rounded">
              <p className="text-gray-400 text-xs">REWARD</p>
              <p className="text-green-300 font-bold">+{currentChallenge.xpReward} XP</p>
            </div>
            <div className="bg-purple-900 p-2 rounded">
              <p className="text-gray-400 text-xs">TOTAL XP</p>
              <p className="text-cyan-300 font-bold">{progress.xp}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-full rounded-full"
              style={{
                width: `${(progress.completedChallenges.length / 25) * 100}%`
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            {progress.completedChallenges.length}/25 Challenges Complete
          </p>
        </div>
      )}
    </div>
  );
}
