"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import Image from "next/image"
import { UserStorage } from "@/utils/user-storage"
import { getUserGameData, saveUserGameData } from "@/utils/game-storage"

export function GuidesTab() {
  const [currentView, setCurrentView] = useState<"main" | "tarot">("main")

  // Функция для сохранения текущего состояния гайдов
  const saveCurrentGuidesState = async (view: string) => {
    const userId = UserStorage.getUserId()
    const initData = UserStorage.getTelegramInitData()
    if (userId && initData) {
      const currentFullData = (await getUserGameData(userId, initData)) || {}
      await saveUserGameData(userId, { ...currentFullData, guidesView: view }, initData)
    }
  }

  // Загрузка состояния при инициализации
  useEffect(() => {
    const loadGuidesView = async () => {
      const userId = UserStorage.getUserId()
      const initData = UserStorage.getTelegramInitData()
      if (userId && initData) {
        const savedData = await getUserGameData(userId, initData)
        if (savedData && savedData.guidesView) {
          setCurrentView(savedData.guidesView)
        }
      }
    }
    loadGuidesView()
  }, [])

  // Сохранение состояния при изменениях currentView
  useEffect(() => {
    saveCurrentGuidesState(currentView)
  }, [currentView])

  const medicalPairs = [
    {
      condition: {
        name: "Артериальное кровотечение",
        color: "bg-red-600",
        image: "/images/guides/arterial-bleeding.png",
      },
      treatment: {
        name: "Жгут выше раны",
        image: "/images/guides/tourniquet-above.png",
      },
    },
    {
      condition: {
        name: "Венозное кровотечение",
        color: "bg-red-500",
        image: "/images/guides/venous-bleeding.png",
      },
      treatment: {
        name: "Жгут ниже раны",
        image: "/images/guides/tourniquet-below.png",
      },
    },
    {
      condition: {
        name: "Огнестрел",
        color: "bg-red-700",
        image: "/images/guides/gunshot.png",
      },
      treatment: {
        name: "Повязка антисептическая",
        image: "/images/guides/antiseptic-bandage.png",
      },
    },
    
    {
      condition: {
        name: "Ожог кислотой",
        color: "bg-yellow-600",
        image: "/images/guides/acid-burn.png",
      },
      treatment: {
        name: "Щелочной раствор",
        image: "/images/guides/alkaline-solution.png",
      },
    },
    {
      condition: {
        name: "Ожог щелочью",
        color: "bg-yellow-500",
        image: "/images/guides/alkali-burn.png",
      },
      treatment: {
        name: "Кислый раствор",
        image: "/images/guides/acid-solution.png",
      },
    },
    {
      condition: {
        name: "Ожог термический",
        color: "bg-orange-600",
        image: "/images/guides/thermal-burn.png",
      },
      treatment: {
        name: "Холодный компресс",
        image: "/images/guides/cold-compress.png",
      },
    },
    {
      condition: {
        name: "Обморожение",
        color: "bg-blue-500",
        image: "/images/guides/frostbite.png",
      },
      treatment: {
        name: "Тепло",
        image: "/images/guides/heat.png",
      },
    },
    {
      condition: {
        name: "Недостаточность",
        color: "bg-gray-600",
        image: "/images/guides/insufficiency.png",
      },
      treatment: {
        name: "Таблетки",
        image: "/images/guides/pills.png",
      },
    },
    {
      condition: {
        name: "Перелом",
        color: "bg-blue-600",
        image: "/images/guides/fracture.png",
      },
      treatment: {
        name: "Наложить шину",
        image: "/images/guides/splint.png",
      },
    },
    {
      condition: {
        name: "Растяжение",
        color: "bg-blue-400",
        image: "/images/guides/sprain.png",
      },
      treatment: {
        name: "Тугая повязка",
        image: "/images/guides/tight-bandage.png",
      },
    },
    {
      condition: {
        name: "Ушиб",
        color: "bg-purple-600",
        image: "/images/guides/bruise.png",
      },
      treatment: {
        name: "Лед/Холод. компресс",
        image: "/images/guides/ice-compress.png",
      },
    },
    {
      condition: {
        name: "Вывих",
        color: "bg-blue-700",
        image: "/images/guides/dislocation.png",
      },
      treatment: {
        name: "Наложить шину",
        image: "/images/guides/splint-2.png",
      },
    },
  ]

  const cards = [
    {
      name: "0",
      title: 'Несколько минут будет проигрываться смех "повара"',
      image: "/images/taro/image.png?height=200&width=120",
    },
    {
      name: "1",
      title: "Все персонажи вашего пола поблизости копируют вашу внешность и одежду",
      image: "/images/taro/image copy.png?height=200&width=120",
    },
    {
      name: "2",
      title: "У персонажа начинается кровотечение",
      image: "/images/taro/image copy 2.png?height=200&width=120",
    },
    {
      name: "3",
      title: 'Включается "Женская походка"',
      image: "/images/taro/image copy 3.png?height=200&width=120",
    },
    {
      name: "4",
      title: 'Включается походка "Раскидывать руками"',
      image: "/images/taro/image copy 4.png?height=200&width=120",
    },
    {
      name: "5",
      title: "Восстанавливает здоровье до максимума, но настроение и сытость падают до 0",
      image: "/images/taro/image copy 5.png?height=200&width=120",
    },
    {
      name: "6",
      title:
        "Камера фокусируется на персонажах противоположного пола, пока вы не поцелуетесь или не обниметесь с одним (одной) из них",
      image: "/images/taro/image copy 6.png?height=200&width=120",
    },
    {
      name: "7",
      title: "Ненадолго ускоряет бег персонажа",
      image: "/images/taro/image copy 7.png?height=200&width=120",
    },
    {
      name: "8",
      title: "+50 очков навыка сила",
      image: "/images/taro/image copy 8.png?height=200&width=120",
    },
    {
      name: "9",
      title: "Х2 зарплата на функциональных работах в течении часа",
      image: "/images/taro/image copy 9.png?height=200&width=120",
    },
    {
      name: "10",
      title: "Сбрасывается счетчик колеса удачи, можно сразу крутить",
      image: "/images/taro/image copy 10.png?height=200&width=120",
    },
    {
      name: "11",
      title: "+1 доллар",
      image: "/images/taro/image copy 11.png?height=200&width=120",
    },
    {
      name: "12",
      title: "Тело персонажа станет прозрачным, останется лишь в голова в петле",
      image: "/images/taro/image copy 12.png?height=200&width=120",
    },
    {
      name: "13",
      title: "Персонажу становится плохо и он умирает",
      image: "/images/taro/image copy 13.png?height=200&width=120",
    },
    {
      name: "14",
      title: "Здоровье падает до минимума, но настроение и сытость становятся 100%",
      image: "/images/taro/image copy 14.png?height=200&width=120",
    },
    {
      name: "15",
      title: "Персонаж начинает гореть, но не получает урона",
      image: "/images/taro/image copy 15.png?height=200&width=120",
    },
    {
      name: "16",
      title: "Наличные деньги исчезают и возвращаются",
      image: "/images/taro/image copy 16.png?height=200&width=120",
    },
    {
      name: "17",
      title: "Подкидывает персонажа в воздух",
      image: "/images/taro/image copy 17.png?height=200&width=120",
    },
    {
      name: "18",
      title: "Делает кожу персонажа белой, если был темнокожим",
      image: "/images/taro/image copy 18.png?height=200&width=120",
    },
    {
      name: "19",
      title: "Делает кожу персонажа чёрной, если был светлокожим",
      image: "/images/taro/image copy 19.png?height=200&width=120",
    },
    {
      name: "20",
      title: "Персонаж получает 2-3 звезды розыска на 2 минуты. В истории госников не сохраняется",
      image: "/images/taro/image copy 20.png?height=200&width=120",
    },
    {
      name: "21",
      title: "Персонажа телепортирует в случайные места на карте",
      image: "/images/taro/image copy 21.png?height=200&width=120",
    },
  ]

  const renderMedical = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Реанимация</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("tarot")}>
            Карты таро
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {medicalPairs.map((pair, index) => (
          <Card
            key={index}
            className="bg-gray-800 border-gray-700 p-3 transition-transform duration-200 ease-out hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between gap-0">
              <Button
                className={`${pair.condition.color} hover:opacity-80 flex-1 justify-start text-left h-auto py-3 px-4 min-w-0 transition-opacity`}
              >
                <div className="w-8 h-8 relative mr-0 flex-shrink-0">
                  <Image
                    src={pair.condition.image || "/placeholder.svg?height=96&width=96"}
                    alt={pair.condition.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <span className="text-sm break-words whitespace-pre-wrap leading-relaxed">{pair.condition.name}</span>
              </Button>

              <div className="text-gray-400 mx-2 flex-shrink-0">→</div>

              <Button
                variant="outline"
                className="bg-gray-700 border-gray-600 hover:bg-gray-600 flex-1 justify-start text-left h-auto py-3 px-4 min-w-0 transition-colors"
              >
                <div className="w-12 h-12 relative mr-2 flex-shrink-0">
                  <Image
                    src={pair.treatment.image || "/placeholder.svg?height=36&width=36"}
                    alt={pair.treatment.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <span className="text-sm break-words whitespace-pre-wrap leading-relaxed">{pair.treatment.name}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTarot = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")}>
            Реанимация
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Карты таро</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="bg-gray-800 border-gray-700 overflow-hidden transition-transform duration-200 ease-out hover:scale-[1.01]"
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={card.image || "/placeholder.svg?height=200&width=120"}
                alt={card.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1 break-words whitespace-pre-wrap leading-relaxed">
                {index}. {card.title}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  return currentView === "tarot" ? renderTarot() : renderMedical()
}
