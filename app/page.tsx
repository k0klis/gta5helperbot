"use client"

import { useState, useEffect, startTransition } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { TimersTab } from "@/components/timers-tab"
import { GuidesTab } from "@/components/guides-tab"
import { FarmTab } from "@/components/farm-tab"
import { CookingTab } from "@/components/cooking-tab"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UserStorage } from "@/utils/user-storage" // Импортируем UserStorage

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        MainButton: {
          setText: (text: string) => void
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
          }
        }
      }
    }
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("farm")

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp

      // Готовность приложения
      tg.ready()

      // Расширение на весь экран
      tg.expand()

      // Инициализация UserStorage с Telegram ID и initData
      UserStorage.getUserId()
      UserStorage.getTelegramInitData()

      // Скрытие главной кнопки по умолчанию
      tg.MainButton.hide()

      // Применение темы Telegram
      if (tg.themeParams) {
        const root = document.documentElement
        if (tg.themeParams.bg_color) {
          root.style.setProperty("--tg-bg-color", tg.themeParams.bg_color)
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty("--tg-text-color", tg.themeParams.text_color)
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty("--tg-button-color", tg.themeParams.button_color)
        }
      }

      // Инициализация UserStorage с Telegram ID
      UserStorage.getUserId()
    }
  }, [])

  const renderActiveTab = () => {
    switch (activeTab) {
      case "timers":
        return <TimersTab />
      case "guides":
        return <GuidesTab />
      case "farm":
        return <FarmTab />
      case "cooking":
        return <CookingTab />
      default:
        return <FarmTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white telegram-theme">
      <div className="pb-16 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={(tab) => startTransition(() => setActiveTab(tab))} />
    </div>
  )
}
