"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Clock, Settings, Home } from "lucide-react"
import { UserStorage } from "@/utils/user-storage"
import { getUserGameData, saveUserGameData } from "@/utils/game-storage"

interface Timer {
  name: string
  totalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  startTime?: number // Время начала таймера
}

export function TimersTab() {
  const [timers, setTimers] = useState<Timer[]>([
    { name: "Почта", totalSeconds: 600, remainingSeconds: 600, isRunning: false },
    { name: "Организация", totalSeconds: 7200, remainingSeconds: 7200, isRunning: false },
    { name: "Автогон", totalSeconds: 5400, remainingSeconds: 5400, isRunning: false },
    { name: "Сутенерка", totalSeconds: 5400, remainingSeconds: 5400, isRunning: false },
    { name: "Автобус", totalSeconds: 5, remainingSeconds: 5, isRunning: false }, // Укороченный таймер для теста
    { name: "Задание клуба", totalSeconds: 7200, remainingSeconds: 7200, isRunning: false },
    { name: "Тир", totalSeconds: 5400, remainingSeconds: 5400, isRunning: false },
    { name: "Швейка(Деморган)", totalSeconds: 87, remainingSeconds: 87, isRunning: false },
    { name: "Коробки(Деморган)", totalSeconds: 67, remainingSeconds: 67, isRunning: false },
  ])

  const audioRef = useRef<HTMLAudioElement | null>(null) // Теперь этот реф для основного звука уведомления
  const animationFrameRef = useRef<number>(null)

  // Функция для сохранения текущего состояния таймеров
  const saveCurrentTimers = async (currentTimers: Timer[]) => {
    const userId = UserStorage.getUserId()
    const initData = UserStorage.getTelegramInitData()
    if (userId && initData) {
      const currentFullData = (await getUserGameData(userId, initData)) || {}
      await saveUserGameData(userId, { ...currentFullData, timersData: currentTimers }, initData)
    }
  }

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    console.log("DEBUG: TimersTab mounted. Loading timers...")
    const loadTimers = async () => {
      const userId = UserStorage.getUserId()
      const initData = UserStorage.getTelegramInitData()
      if (userId && initData) {
        const savedData = await getUserGameData(userId, initData)
        if (savedData && savedData.timersData) {
          setTimers(savedData.timersData)
        }
      }
    }
    loadTimers()
  }, [])

  // Инициализация единого аудио-объекта для уведомлений
  useEffect(() => {
    const audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uvedomlenit-biGPvKwx6r1JRT7vh2YslzhMnFFusq.mp3")
    audio.volume = 0.5
    audioRef.current = audio
  }, [])

  // Основной таймер с использованием requestAnimationFrame для точности
  useEffect(() => {
    const updateTimers = () => {
      setTimers((prevTimers) => {
        const currentTime = Date.now()

        const nextTimers = prevTimers.map((timer) => {
          if (timer.isRunning && timer.startTime) {
            const elapsed = Math.floor((currentTime - timer.startTime) / 1000)
            const newRemaining = Math.max(0, timer.totalSeconds - elapsed)

            if (newRemaining === 0 && timer.remainingSeconds > 0) {
              console.log(`DEBUG: Timer "${timer.name}" reached 0. Attempting to play notification sound.`)
              if (audioRef.current) {
                // пытаемся воспроизвести предварительно загруженный объект
                audioRef.current.currentTime = 0
                audioRef.current.play().catch(() => {
                  // если ещё не готов или произошла ошибка – создаём новый объект на лету
                  new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uvedomlenit-biGPvKwx6r1JRT7vh2YslzhMnFFusq.mp3").play().catch(console.error)
                })
              } else {
                // запасной вариант (теоретически не должен понадобиться)
                new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uvedomlenit-biGPvKwx6r1JRT7vh2YslzhMnFFusq.mp3").play().catch(console.error)
              }

              return { ...timer, remainingSeconds: 0, isRunning: false }
            }
            if (newRemaining !== timer.remainingSeconds) {
              return { ...timer, remainingSeconds: newRemaining }
            }
          }
          return timer
        })
        // Сохраняем состояние таймеров после их обновления
        saveCurrentTimers(nextTimers)
        return nextTimers
      })

      animationFrameRef.current = requestAnimationFrame(updateTimers)
    }

    console.log("DEBUG: Starting requestAnimationFrame loop.")
    animationFrameRef.current = requestAnimationFrame(updateTimers)

    return () => {
      console.log("DEBUG: Cleaning up requestAnimationFrame loop.")
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, []) // Пустой массив зависимостей, так как цикл управляется requestAnimationFrame

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = (index: number) => {
    setTimers((prevTimers) => {
      const newTimers = prevTimers.map((timer, i) => {
        if (i === index) {
          if (timer.isRunning) {
            // Останавливаем таймер
            return { ...timer, isRunning: false, startTime: undefined }
          } else {
            // Запускаем таймер
            const currentTime = Date.now()
            const elapsedSeconds = timer.totalSeconds - timer.remainingSeconds
            return {
              ...timer,
              isRunning: true,
              startTime: currentTime - elapsedSeconds * 1000,
            }
          }
        }
        return timer
      })
      saveCurrentTimers(newTimers) // Сохраняем после действия пользователя
      return newTimers
    })
  }

  const resetTimer = (index: number) => {
    setTimers((prevTimers) => {
      const newTimers = prevTimers.map((timer, i) =>
        i === index
          ? { ...timer, remainingSeconds: timer.totalSeconds, isRunning: false, startTime: undefined }
          : timer,
      )
      saveCurrentTimers(newTimers) // Сохраняем после действия пользователя
      return newTimers
    })
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Таймеры</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {timers.map((timer, index) => (
          <Card
            key={index}
            className="bg-gray-800 border-gray-700 p-4 transition-transform duration-200 ease-out hover:scale-[1.02]"
          >
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm">{timer.name}</p>
              <p className={`text-lg font-mono ${timer.remainingSeconds === 0 ? "text-green-500" : "text-white"}`}>
                {formatTime(timer.remainingSeconds)}
              </p>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white h-8 w-8 transition-colors"
                  onClick={() => toggleTimer(index)}
                  disabled={timer.remainingSeconds === 0}
                >
                  {timer.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white h-8 w-8 transition-colors"
                  onClick={() => resetTimer(index)}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-gray-500">ID: {UserStorage.getCurrentUserId().slice(-8)}</span>
      </div>
    </div>
  )
}
