'use client'

import 'react'
import CompetitonSearchItem from "@/components/search/competition-search-item";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import styles from './communityMembers.module.css'

import CompetitionData from '@/models/interfaces/CompetitionData'
import GeneralButton from './general-btn'
import Link from 'next/link'

interface CompetitionListProps {
  competitions: CompetitionData[]
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 flex-shrink w-auto" style={{  justifyContent: 'flex-start'}}>
      {competitions.length > 0 ? (
        competitions.map((competition) => (
          <CompetitonSearchItem key={competition.id} {...competition} />
        ))
      ) : (
        <div className={styles.wrapper} >
          <h1 className='text-3xl flex font-bold font-odibee'>
            No ongoing competitions
          </h1>
        </div>
      )}
    </div>
  )
}

export default CompetitionList
