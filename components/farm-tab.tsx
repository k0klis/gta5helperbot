"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, RotateCcw, Settings, Plus, Minus } from "lucide-react"
import { UserStorage } from "@/utils/user-storage"
import { getUserGameData, saveUserGameData } from "@/utils/game-storage"

interface Activity {
  name: string
  icon: string
  maxCount: number
  currentCount: number
  baseBP: number
  isCompleted: boolean
  description: string
}

// Версия структуры данных для миграции
const DATA_VERSION = 2

// Эталонный список активностей (всегда актуальный)
const DEFAULT_ACTIVITIES: Activity[] = [
  {
    name: "Лотерея",
    icon: "🎰",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Купить лотерейный билет. Доступно с 10:00 до 23:50",
  },
  {
    name: "Тир",
    icon: "🎯",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Успешно пройти тренировку в тире (>75% попаданий по целям)",
  },
  {
    name: "Киностудия",
    icon: "🎬",
    maxCount: 0,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Снять киностудию. Цена одиночной с платиновой вип - 2500$",
  },
  {
    name: "Кинотеатр",
    icon: "🍿",
    maxCount: 5,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "5 раз добавить видео в очередь в кинотеатре",
  },
  {
    name: "Гонка",
    icon: "🏁",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Поучавствовать в гонке со ставкой >1000$",
  },
  {
    name: "Арена",
    icon: "🏟️",
    maxCount: 3,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "3 раза победить в любом режиме со ставкой >100$",
  },
  {
    name: "Стройка",
    icon: "🏗️",
    maxCount: 25,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Совершить 25 действий на стройке",
  },
  {
    name: "Порт",
    icon: "🚢",
    maxCount: 25,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Совершить 25 действий в порту",
  },
  {
    name: "Шахта",
    icon: "⛏️",
    maxCount: 25,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Совершить 25 действий на шахте",
  },
  {
    name: "Ферма",
    icon: "🚜",
    maxCount: 10,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Совершить 10 действий на ферме",
  },
  {
    name: "Картинг",
    icon: "🏎️",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Выиграть гонку на картинге. Вход - 500$",
  },
  {
    name: "Сокровище",
    icon: "💎",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Найти сокровище (не хлам/семена) с помощью металоискателя и лопаты",
  },
  {
    name: "Автобус",
    icon: "🚌",
    maxCount: 2,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Проехать 2 любых рейса работая водителем автобуса",
  },
  {
    name: "Почта",
    icon: "✉️",
    maxCount: 10,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Отвезти 10 посылок с почты. К/Д на взятие посылки - 10 мин. Работа доступна с 7 уровня",
  },
  {
    name: "Нули в казино",
    icon: "🎲",
    maxCount: 0,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Выиграть в рулетку поставив на 0 или 00",
  },
  {
    name: "Денс батл",
    icon: "🕺",
    maxCount: 3,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "3 раза выиграть в дэнс батле. Ночной клуб должен быть открыт",
  },
  {
    name: "Тренажерный зал",
    icon: "🏋️",
    maxCount: 20,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Совершить 20 подходов на любом тренажёре в любом тренажёрном зале",
  },
  {
    name: "Тренер. комплекс",
    icon: "💪",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "5 раз победить в любом режиме со ставкой >100$",
  },
  {
    name: "Охота",
    icon: "🦌",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Разделать 5 шкур любых животных (100% прочности)",
  },
  {
    name: "Пожарный",
    icon: "🚒",
    maxCount: 25,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Потушить 25 огоньков. Работа пожарным доступна с наличием военного билета с 10 уровня",
  },
  {
    name: "Дальнобойщик",
    icon: "🚚",
    maxCount: 15,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description:
      "15 раз привезти груз в порт. Работа доступна с 7 уровня с лицензией на управление грузовым транспортом",
  },
  {
    name: "Заказ материалов для бизнеса",
    icon: "📦",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description:
      "Отключить и включить автоматический заказ материалов для своего бизнеса. Только для владельцев бизнеса",
  },
  {
    name: "Смена внешности",
    icon: "💇",
    maxCount: 2,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "2 раза сменить внешность у хирурга в EMS",
  },
  {
    name: "Граффити",
    icon: "🎨",
    maxCount: 7,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Закрасить 7 граффити (банда)",
  },
  {
    name: "Контрабанда",
    icon: "💼",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Сдать 5 контрабанды (мафия)",
  },
  {
    name: "Бизвар",
    icon: "🔫",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Участие в бизваре (мафия)",
  },
  {
    name: "Капт",
    icon: "👥",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Участие в капте (банда)",
  },
  {
    name: "Хаммер с ВЗХ",
    icon: "🚗",
    maxCount: 0,
    currentCount: 0,
    baseBP: 3,
    isCompleted: false,
    description: "Пригнать хаммер на респавн своей фракции на войне за хаммеры (крайм фракции)",
  },
  {
    name: "Медкарты в EMS",
    icon: "🏥",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Выдать 5 медкарт EMS",
  },
  {
    name: "Вызовы в EMS",
    icon: "🚑",
    maxCount: 15,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Закрыть 15 вызовов EMS",
  },
  {
    name: "Зелёная строка WN",
    icon: "📄",
    maxCount: 0,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Сообщения в зелёной строке (WN)",
  },
  {
    name: "Объявления WN",
    icon: "📰",
    maxCount: 40,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Отредактировать 40 объявлений (WN)",
  },
  {
    name: "Ограбления домов",
    icon: "🏠",
    maxCount: 15,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Взломать 15 замков на ограблениях домов или угонах авто (банды)",
  },
  {
    name: "Коды",
    icon: "🔢",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Закрыть 5 кодов (Силовые структуры)",
  },
  {
    name: "Регистрация авто",
    icon: "🚗",
    maxCount: 2,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Поставить на учёт 2 автомобиля (LSPD)",
  },
  {
    name: "Арест",
    icon: "👮",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Произвести 1 арест в КПЗ (LSSD, LSPD)",
  },
  {
    name: "Выкуп с КПЗ",
    icon: "🔓",
    maxCount: 2,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Выкупить 2 человек из КПЗ (Адвокат)",
  },
]

export function FarmTab() {
  const [totalBP, setTotalBP] = useState(0)
  const [isVIP, setIsVIP] = useState(false)
  const [isX2, setIsX2] = useState(false)
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null)
  const [counterValue, setCounterValue] = useState(0)
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES)

  // Функция для миграции и синхронизаци�� активностей
  const migrateActivities = (savedActivities: Activity[]): Activity[] => {
    const migratedActivities = DEFAULT_ACTIVITIES.map((defaultActivity) => {
      // Ищем соответствующую активность в сохраненных данных
      const savedActivity = savedActivities.find((saved) => saved.name === defaultActivity.name)

      if (savedActivity) {
        // Если активность найдена, сохраняем пользовательские данные, но обновляем структуру
        return {
          ...defaultActivity, // Берем актуальную структуру
          currentCount: savedActivity.currentCount || 0,
          isCompleted: savedActivity.isCompleted || false,
        }
      } else {
        // Если активность новая, используем значения по умолчанию
        return defaultActivity
      }
    })

    return migratedActivities
  }

  // Функция для сохранения текущего состояния фарма
  const saveCurrentFarmData = async (
    currentTotalBP: number,
    currentIsVIP: boolean,
    currentIsX2: boolean,
    currentActivities: Activity[],
    currentCounterValue: number,
  ) => {
    const userId = UserStorage.getUserId()
    const initData = UserStorage.getTelegramInitData()
    if (userId && initData) {
      const dataToSave = {
        version: DATA_VERSION,
        totalBP: currentTotalBP,
        isVIP: currentIsVIP,
        isX2: currentIsX2,
        activities: currentActivities,
        counterValue: currentCounterValue,
      }
      const currentFullData = (await getUserGameData(userId, initData)) || {}
      await saveUserGameData(userId, { ...currentFullData, farmData: dataToSave }, initData)
    }
  }

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    const loadFarmData = async () => {
      const userId = UserStorage.getUserId()
      const initData = UserStorage.getTelegramInitData()
      if (userId && initData) {
        const savedData = await getUserGameData(userId, initData)
        if (savedData && savedData.farmData) {
          setTotalBP(savedData.farmData.totalBP || 0)
          setIsVIP(savedData.farmData.isVIP || false)
          setIsX2(savedData.farmData.isX2 || false)
          setCounterValue(savedData.farmData.counterValue || 0)

          // Проверяем версию данных и мигрируем при необходимости
          if (savedData.farmData.activities) {
            if (!savedData.farmData.version || savedData.farmData.version < DATA_VERSION) {
              // Нужна миграция
              const migratedActivities = migrateActivities(savedData.farmData.activities)
              setActivities(migratedActivities)
              // Сохраняем мигрированные данные
              saveCurrentFarmData(
                savedData.farmData.totalBP || 0,
                savedData.farmData.isVIP || false,
                savedData.farmData.isX2 || false,
                migratedActivities,
                savedData.farmData.counterValue || 0,
              )
            } else {
              // Данные актуальны, но все равно проверяем на новые активности
              const migratedActivities = migrateActivities(savedData.farmData.activities)
              setActivities(migratedActivities)
            }
          }
        }
      }
    }
    loadFarmData()
  }, [])

  const getMultiplier = () => {
    let multiplier = 1
    if (isVIP) multiplier *= 2
    if (isX2) multiplier *= 2
    return multiplier
  }

  const updateMultiplier = (type: "vip" | "x2") => {
    const oldMultiplier = getMultiplier()
    let newIsVIP = isVIP
    let newIsX2 = isX2

    if (type === "vip") {
      newIsVIP = !isVIP
      setIsVIP(newIsVIP)
    } else {
      newIsX2 = !isX2
      setIsX2(newIsX2)
    }

    // Пересчитываем totalBP с новым множителем
    setTimeout(() => {
      const newMultiplier =
        type === "vip"
          ? newIsVIP
            ? oldMultiplier * 2
            : oldMultiplier / 2
          : newIsX2
            ? oldMultiplier * 2
            : oldMultiplier / 2

      const updatedTotalBP = Math.floor((totalBP * newMultiplier) / oldMultiplier)
      setTotalBP(updatedTotalBP)
      saveCurrentFarmData(updatedTotalBP, newIsVIP, newIsX2, activities, counterValue)
    }, 0)
  }

  const increaseCount = (index: number) => {
    setActivities((prev) => {
      const newActivities = prev.map((activity, i) => {
        if (i === index && activity.currentCount < activity.maxCount && !activity.isCompleted) {
          const newCount = activity.currentCount + 1
          const updatedActivity = { ...activity, currentCount: newCount }

          // Автоматически выполняем задание при достижении максимума
          if (newCount === activity.maxCount && activity.maxCount > 0) {
            const finalBP = activity.baseBP * getMultiplier()
            setTotalBP((prevBP) => {
              const updatedBP = prevBP + finalBP
              saveCurrentFarmData(updatedBP, isVIP, isX2, newActivities, counterValue)
              return updatedBP
            })
            updatedActivity.isCompleted = true
          }
          return updatedActivity
        }
        return activity
      })
      saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
      return newActivities
    })
  }

  const decreaseCount = (index: number) => {
    setActivities((prev) => {
      const newActivities = prev.map((activity, i) => {
        if (i === index && activity.currentCount > 0 && !activity.isCompleted) {
          return { ...activity, currentCount: activity.currentCount - 1 }
        }
        return activity
      })
      saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
      return newActivities
    })
  }

  const completeTaskWithoutLimit = (index: number) => {
    setActivities((prev) => {
      const newActivities = prev.map((activity, i) => {
        if (i === index && !activity.isCompleted && activity.maxCount === 0) {
          const finalBP = activity.baseBP * getMultiplier()
          setTotalBP((prevBP) => {
            const updatedBP = prevBP + finalBP
            saveCurrentFarmData(updatedBP, isVIP, isX2, newActivities, counterValue)
            return updatedBP
          })
          return { ...activity, isCompleted: true }
        }
        return activity
      })
      saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
      return newActivities
    })
  }

  const updateCounter = (increment: boolean) => {
    const newValue = increment ? counterValue + 1 : Math.max(0, counterValue - 1)
    setCounterValue(newValue)

    // Вычисляем BP: за каждые 3 единицы счётчика даём +2 BP
    const bpFromCounter = Math.floor(newValue / 3) * 2 * getMultiplier()
    const oldBpFromCounter = Math.floor(counterValue / 3) * 2 * getMultiplier()
    const bpDifference = bpFromCounter - oldBpFromCounter

    if (bpDifference !== 0) {
      setTotalBP((prevBP) => {
        const updatedBP = prevBP + bpDifference
        saveCurrentFarmData(updatedBP, isVIP, isX2, activities, newValue)
        return updatedBP
      })
    } else {
      saveCurrentFarmData(totalBP, isVIP, isX2, activities, newValue)
    }
  }

  const resetProgress = async () => {
    setTotalBP(0)
    setCounterValue(0)
    const resetActivities = activities.map((activity) => ({ ...activity, currentCount: 0, isCompleted: false }))
    setActivities(resetActivities)
    saveCurrentFarmData(0, false, false, resetActivities, 0)
  }

  const toggleActivityExpansion = (index: number) => {
    setExpandedActivity(expandedActivity === index ? null : index)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-orange-500">😊</span>
          <h1 className="text-lg font-semibold">Фарм</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Календарь фарма</span>
          <span className="text-yellow-500">💰</span>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-500">😊</span>
          <span className="text-sm transition-all duration-200 ease-out">Получено: {totalBP} BP</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isX2 ? "default" : "outline"}
              onClick={() => updateMultiplier("x2")}
              className={isX2 ? "bg-orange-600 transition-colors" : "transition-colors"}
            >
              X2 Сервер
            </Button>
            <Button
              size="sm"
              variant={isVIP ? "default" : "outline"}
              onClick={() => updateMultiplier("vip")}
              className={isVIP ? "bg-yellow-600 transition-colors" : "transition-colors"}
            >
              VIP GoldPlat
            </Button>
          </div>
          <span className="text-sm text-gray-400">Множитель: x{getMultiplier()}</span>
        </div>
      </div>

      {/* Счётчик */}
      <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔢</span>
            <div>
              <span className="text-sm font-semibold">Счётчик</span>
              <p className="text-xs text-gray-400">За каждые 3 часа = +2 BP</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-colors"
              onClick={() => updateCounter(false)}
              disabled={counterValue === 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold w-12 text-center">{counterValue}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-colors"
              onClick={() => updateCounter(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <div className="ml-2 text-center">
              <span className="text-xs text-gray-400">+{Math.floor(counterValue / 3) * 2 * getMultiplier()} BP</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        {activities.map((activity, index) => {
          const finalBP = activity.baseBP * getMultiplier()

          return (
            <div key={index}>
              <Card
                className={`border-gray-700 p-3 cursor-pointer hover:bg-gray-700 transition-colors hover:scale-[1.01] duration-200 ease-out ${
                  activity.isCompleted ? "bg-green-900/20 border-green-700" : "bg-gray-800"
                }`}
                onClick={() => toggleActivityExpansion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{activity.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm break-words">{activity.name}</span>
                      {activity.isCompleted && <span className="text-green-500 text-xs ml-2">✓ Выполнено</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {activity.maxCount > 0 ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            decreaseCount(index)
                          }}
                          disabled={activity.currentCount === 0 || activity.isCompleted}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-6 text-center text-orange-500">{activity.maxCount}</span>
                        <span className="text-sm w-6 text-center">{activity.currentCount}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            increaseCount(index)
                          }}
                          disabled={activity.currentCount >= activity.maxCount || activity.isCompleted}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <div className="w-12 text-center">
                          {activity.isCompleted ? (
                            <span className="text-green-500 text-xs">✓</span>
                          ) : (
                            <span className="text-xs text-gray-400">+{finalBP}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        disabled={activity.isCompleted}
                        onClick={(e) => {
                          e.stopPropagation()
                          completeTaskWithoutLimit(index)
                        }}
                        className={`text-xs w-12 ${
                          activity.isCompleted ? "bg-green-600" : "bg-orange-600 hover:bg-orange-700"
                        }`}
                      >
                        {activity.isCompleted ? "✓" : `+${finalBP}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Выпадающее пояснение */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedActivity === index ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Card className="bg-gray-700 border-gray-600 p-3 mt-1 ml-4">
                  <p className="text-sm text-gray-300 break-words whitespace-pre-wrap leading-relaxed text-center">
                    {activity.description}
                  </p>
                  {activity.maxCount > 0 && (
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      <div>Лимит: {activity.maxCount}</div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <Button
          onClick={resetProgress}
          className="w-full bg-orange-600 hover:bg-orange-700 border border-orange-500 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Сбросить прогресс выполнения заданий
        </Button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-gray-500">ID: {UserStorage.getCurrentUserId().slice(-8)}</span>
      </div>
    </div>
  )
}
