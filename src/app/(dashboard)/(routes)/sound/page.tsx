import AssemblySound from '@/components/assembly-record'
import RecordSound from '@/components/record-sound'
import React from 'react'

type Props = {}

const SoundPage
 = (props: Props) => {
  return (
    <div className="flex flex-col items-center gap-10">
    SoundPage
    <RecordSound/>
    <AssemblySound/>
    </div>
  )
}

export default SoundPage
