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
    <div style={
      {
      width:'auto',
    }}>
<h1 className="text-3xl flex font-bold font-odibee text-white pb-5">
        {competitions.length > 0 ? 'Ongoing competitions' : 'No ongoing competitions'}
      </h1>
<div 
     style={{ 
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '20px',
     }}>
     
  {competitions.length > 0 && (
    competitions.map((competition) => (
      <CompetitonSearchItem key={competition.id} {...competition} />
    ))
  ) }
</div>
</div>
  )
}

export default CompetitionList
