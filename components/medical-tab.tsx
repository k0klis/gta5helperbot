import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

export function MedicalTab() {
  const conditions = [
    { name: "Артериальное кровотечение", color: "bg-red-600", icon: "🩸" },
    { name: "Венозное кровотечение", color: "bg-red-500", icon: "🩸" },
    { name: "Огнестрел", color: "bg-red-700", icon: "🔫" },
    { name: "Ожог кислотой", color: "bg-yellow-600", icon: "🧪" },
    { name: "Ожог щелочью", color: "bg-yellow-500", icon: "🧪" },
    { name: "Ожог термический", color: "bg-orange-600", icon: "🔥" },
    { name: "Обморожение", color: "bg-blue-500", icon: "❄️" },
    { name: "Недостаточность", color: "bg-gray-600", icon: "💊" },
    { name: "Перелом", color: "bg-blue-600", icon: "🦴" },
    { name: "Растяжение", color: "bg-blue-400", icon: "💪" },
    { name: "Ушиб", color: "bg-purple-600", icon: "🤕" },
    { name: "Вывих", color: "bg-blue-700", icon: "🦴" },
  ]

  const treatments = [
    { name: "Жгут выше раны", icon: "🩹" },
    { name: "Жгут ниже раны", icon: "🩹" },
    { name: "Повязка антисептическая", icon: "🏥" },
    { name: "Щелочной раствор", icon: "🧪" },
    { name: "Кислый раствор", icon: "🧪" },
    { name: "Холодный компресс", icon: "🧊" },
    { name: "Тепло", icon: "🔥" },
    { name: "Таблетки", icon: "💊" },
    { name: "Наложить шину", icon: "🦴" },
    { name: "Тугая повязка", icon: "🩹" },
    { name: "Лед/Холод. компресс", icon: "🧊" },
    { name: "Наложить шину", icon: "🦴" },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Реанимация</h1>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Карты таро</h2>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <Button
              key={index}
              className={`${condition.color} hover:opacity-80 w-full justify-start text-left h-auto py-3 px-4`}
            >
              <span className="mr-2">{condition.icon}</span>
              <span className="text-sm">{condition.name}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {treatments.map((treatment, index) => (
            <Button
              key={index}
              variant="outline"
              className="bg-gray-800 border-gray-600 hover:bg-gray-700 w-full justify-start text-left h-auto py-3 px-4"
            >
              <span className="mr-2">{treatment.icon}</span>
              <span className="text-sm">{treatment.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
