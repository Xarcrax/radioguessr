"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation"
import Globe from "./Globe";
import { Country } from "@/types/country";
import { Radio } from "./Radio";
import CountryFlag from "../../../../components/ui/CountryFlag";
import PollLeaderboard from "./PollLeaderboard";
import { Countdown } from "./Countdown";
import RadioContext from "@/utils/RadioContext";
import socket from "@/utils/socket";
import { PollsMessageServer, VoteMessageClient } from "@/types/api";

function GamePage() {
    const router = useParams();
    const radioInfo = useContext(RadioContext)

    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [leaderboard, setLeaderboard] = useState<Record<string, number>>({
        'US': 10,
        'CA': 8,
        'MX': 6,
        'BR': 2,
    });

    useEffect(() => {
      if (!radioInfo) return;
      socket.on('POLLS', (res: PollsMessageServer) => {
        setLeaderboard(res.votes)
      })
    }, [radioInfo])

    if (radioInfo == null) {
      return <p>Waiting for radio info</p>
    }

    function onVote(country: string) {
      const req: VoteMessageClient = { country, lobby: router.namespace as string };
      socket.emit('VOTE', req)
    }

    function selectCountry(country: Country) {
      onVote(country.alpha2)
      setSelectedCountry(country)
    }

    return (
        <div className="flex flex-col overflow-y-hidden h-[100vh] relative">
            <div className="absolute p-4 top-0 left-0">
                <CountryFlag alpha2={selectedCountry?.alpha2} />
            </div>
            <div className="absolute p-4 top-0 right-0">
                <div className="max-w-48">
                    <PollLeaderboard leaderboard={leaderboard} alpha2={selectedCountry?.alpha2} />
                </div>
            </div>
            <Globe onSelectCountry={selectCountry} />
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex gap-x-2 relative">
                    <div className="flex-1 h-fit my-auto">
                        <Radio urls={radioInfo.radios} start={radioInfo.start} />
                    </div>
                    <Countdown duration={100} />
                </div>
            </div>
        </div>
    )
}

export default GamePage
