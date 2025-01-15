'use client'

import CompetitionData from '@/models/interfaces/CompetitionData'
import { competitionTypeEnum } from '@/models/interfaces/competitionTypeEnum'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

async function fetchGameName(gameId: string): Promise<string | null> {
  const response = await fetch(`/api/game?gameId=${gameId}`)
  if (!response.ok) return null
  return response.json().then((data) => data.game_name)
}

export default function CompetitionSearchItem(competition: CompetitionData) {
  const [gameName, setGameName] = useState<string | null>(null)

  useEffect(() => {
    const loadGameName = async () => {
      try {
        const fetchedGameName = await fetchGameName(competition.game_id)
        if (!fetchedGameName) {
          console.error(
            `Failed to fetch game name for competition: ${competition.competition_name} with game id: ${competition.game_id}`
          )
        }
        setGameName(fetchedGameName || 'Unknown Game')
      } catch (error) {
        console.error('Error fetching game name:', error)
        setGameName('Unknown Game')
      }
    }

    loadGameName()
  }, [competition.game_id])

  const dbUrl = process.env.NEXT_PUBLIC_DB_CONN_STR
  
  return (
    <Link href={`/competition/${competition.id}`} passHref>
      <div style={{ cursor: 'pointer' }} className="flex flex-none flex-col h-[400px] w-[300px] rounded-[1.2rem] bg-gradient-to-br from-[#4E35BE] to-[#241958] transform transition-transform duration-300 hover:scale-105">
        <div
          className='flex flex-none items-center justify-center rounded-t-[1.2rem] bg-[#D9D9D9] h-[173px]'
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <Image
            src={
              competition.competition_image_path
                ? `${dbUrl}/competitions/${competition.id}/image`
                : '/comp.jpg'
            }
            alt='Competition image'
            className='fit'
            fill={true}
            sizes='50vw'
            style={{
              objectFit: 'cover'
            }
            }
          />
        </div>
        <div className='item-container flex flex-col text-[16px] font-outfit p-4' style={{ height: '100%' }}>
          <span className="flex items-center text-[24px] truncate font-odibee"
            style={{
              lineHeight: '1.2',
              textAlign: 'start',
              display: 'inline-block',
              maxWidth: '100%',
              color: 'white',
            }}>
            {competition.competition_name}
          </span>
          <span className='flex items-center' style={{ color: 'white' }}>
            <Image
              src='/controller.svg'
              alt='controller'
              className='h-10 w-10'
              width={50}
              height={50}

            />
            {gameName || 'Loading...'}
          </span>
          <span className='flex items-center' style={{ color: 'white' }}>
            <Image
              src='/customer.svg'
              alt='customer'
              className='h-10 w-10'
              width={50}
              height={50}
            />
            {competition.participants} participants
          </span>
          <span className='flex items-center' style={{ color: 'white' }}>
            <Image
              src='/calendar.svg'
              alt='calendar'
              className='h-10 w-10'
              width={50}
              height={50}
            />
            Begins {formatDate(competition.competition_start_date)}
          </span>
          <span className='flex items-center' style={{ color: 'white' }}>
            <Image
              src={competition.competition_type === 0 ? '/classic_mode_icon.svg' : (competition.competition_type === 1 ? '/tournament.svg' : '/rival_mode_icon.svg')}
              alt='mode'
              className='h-10 w-10 p-1.5'
              width={20}
              height={20}

            />
            {competitionTypeEnum[competition.competition_type]}
          </span>
        </div>
      </div>
    </Link>
  )
}
