"use client"

import { API_PATH } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import DifficultyToggle from "@/components/ui/shared/difficulty-toggle"
import { CreateLobbyResponse } from "@/types/api";

export default function Home() {
  const router = useRouter()

  function onCreate() {
    fetch(`${API_PATH}/create`, {
      method: "POST"
    }).then((res) => {
      return res.json()
    }
    ).then((data: CreateLobbyResponse) => {
      router.push(data.url)
    })
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 text-white" style={{backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>

      <main className="container mx-auto pt-20 px-4 text-center">
        <h2 className="text-8xl italic font-extrabold mb-6 text-[#FFCE19]" style={{textShadow: '2px 3px 8px black'}}>Quick Play</h2>
        <p className="text-2xl mb-8 max-w-xl italic font-black mx-auto" style={{textShadow: '1px 2px 2px black'}}>
          Listen to radio transmissions and guess their country of origin!
        </p>

        <div className="flex flex-col items-center space-y-20 mt-10">
          <DifficultyToggle />

          <Button onClick={onCreate} className="bg-primary hover:bg-hover text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-300">
            Create Lobby
          </Button>
        </div>
      </main>

      <footer className="container mx-auto mt-16 py-6 px-4 text-center text-gray-400">
        <p>&copy; 2024 RadioGuessr. All rights reserved.</p>
      </footer>
    </div>
  )
}
