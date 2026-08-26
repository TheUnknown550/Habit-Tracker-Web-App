import useLocalStorage from './hooks/useLocalStorage';
import AddHabitForm from './components/AddHabitForm';
import HabitList from './components/HabitList';
import ProgressBar from './components/ProgressBar';
import CalendarView from './components/CalendarView';
import StatisticsDashboard from './components/StatisticsDashboard';
import DataExport from './components/DataExport';

function App() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [completions, setCompletions] = useLocalStorage('completions', {});
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'habits');

  const today = new Date().toISOString().split('T')[0];

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
      color: getRandomColor(),
      icon: getRandomIcon(),
    };
    setHabits([...habits, habit]);
  };

  const editHabit = (id, updatedHabit) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updatedHabit } : h));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    const newCompletions = { ...completions };
    delete newCompletions[id];
    setCompletions(newCompletions);
  };

  const toggleComplete = (id) => {
    const habitCompletions = completions[id] || [];
    const isCompleted = habitCompletions.includes(today);
    if (isCompleted) {
      setCompletions({
        ...completions,
        [id]: habitCompletions.filter(date => date !== today),
      });
    } else {
      setCompletions({
        ...completions,
        [id]: [...habitCompletions, today],
      });
    }
  };

  const completedToday = habits.filter(habit => (completions[habit.id] || []).includes(today)).length;

  const getMotivationalMessage = () => {
    const percentage = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
    if (percentage === 100 && habits.length > 0) return "🎉 Amazing! All habits completed today!";
    if (percentage >= 75) return "🚀 Great progress! Keep it up!";
    if (percentage >= 50) return "💪 You're doing well! Stay consistent!";
    if (percentage >= 25) return "🌟 Good start! Every step counts!";
    return "🌱 Every journey begins with a single step!";
  };

  const tabs = [
    { id: 'habits', label: 'Habits', icon: '🎯' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'statistics', label: 'Statistics', icon: '📊' },
    { id: 'data', label: 'Data', icon: '💾' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🌟 Habit Tracker
          </h1>
          <p className="text-gray-600 text-lg">{getMotivationalMessage()}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-2 border border-gray-100">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {activeTab === 'habits' && (
            <>
              <AddHabitForm onAddHabit={addHabit} />
              <ProgressBar completed={completedToday} total={habits.length} />
              <HabitList
                habits={habits}
                completions={completions}
                onToggleComplete={toggleComplete}
                onEditHabit={editHabit}
                onDeleteHabit={deleteHabit}
              />
            </>
          )}

          {activeTab === 'calendar' && (
            <CalendarView completions={completions} habits={habits} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsDashboard habits={habits} completions={completions} />
          )}

          {activeTab === 'data' && (
            <DataExport habits={habits} completions={completions} />
          )}
        </div>

        {habits.length === 0 && activeTab === 'habits' && (
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-6xl mb-4 animate-pulse-gentle">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to build better habits?</h3>
            <p className="text-gray-500">Start by adding your first habit above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getRandomColor() {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomIcon() {
  const icons = ['💧', '🏃', '📚', '🎵', '🍎', '🧘', '💻', '🎨', '🏋️', '🛏️'];
  return icons[Math.floor(Math.random() * icons.length)];
}

export default App;
