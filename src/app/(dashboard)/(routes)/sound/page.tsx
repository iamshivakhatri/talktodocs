import AssemblySound from '@/components/record-and-play-audio'
import RecordAndPlayAudio from '@/components/new-record'
import RecordSound from '@/components/record-sound'
import React from 'react'

type Props = {}

const SoundPage
 = (props: Props) => {
  return (
    <div className="flex flex-col items-center gap-10">
    
    {/* <RecordSound/> */}
    <AssemblySound/>
    {/* <RecordAndPlayAudio/> */}
    </div>
  )
}

export default SoundPage
