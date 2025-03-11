import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Mic, MoreVerticalIcon, Video, Check, MicOff, VideoOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AudioVideoControls = () => {

  const call = useCall()

  if(!call) throw new Error('Use Call must be used within StreamCallComponent')

  const { useMicrophoneState, useCameraState } = useCallStateHooks()

  const { devices: cameras, selectedDevice: selectedCamera } = useCameraState()
  const { devices: microphones, selectedDevice: selectedMicrophone } = useMicrophoneState()
  // const { devices: speakers, selectedDevice: selectedSpeaker } = useSpeakerState()

  const toggleMic = async () => {
    await call.microphone.toggle()
    // const isEnabled = call.microphone.enabled
    // if(isEnabled){
    //   await call.microphone.disable()
    // } else {
    //   await call.microphone.enable()
    // }
  }

  const toggleCamera = async () => {
    const isEnabled = call.camera.enabled
    if(isEnabled){
      await call.camera.disable()
    } else {
      await call.camera.enable()
    }
  }
  return (
    <div className='flex gap-3'>
      {/* MIC */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={toggleMic}>
          {
            call.microphone.enabled ? (
              <Mic color='white' size={20} />
            ) : (
              <MicOff color='white' size={20} />
            )
          }
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='p-2 cursor-pointer'>
              <MoreVerticalIcon color='white' size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-secondary border-none w-[300px] truncate'>
            {
              microphones?.map((mic, index) => (
                <DropdownMenuItem key={index} onClick={() => call.microphone.select(mic.deviceId)} className='hover:!bg-white/20 truncate'>
                  <span className='flex items-center gap-2 text-white'>
                    {
                      mic.deviceId === selectedMicrophone && (
                        <Check size={20} color='#fff' />
                      )
                    }
                    {mic.label}
                  </span>
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* VIDEO */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={toggleCamera}>
          {
            call.camera.enabled ? (
              <Video color='white' size={20} />
            ) : (
              <VideoOff color='white' size={20} />
            )
          }
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='p-2 cursor-pointer'>
              <MoreVerticalIcon color='white' size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-secondary border-none w-[300px] truncate'>
            {
              cameras?.map((camera, index) => (
                <DropdownMenuItem key={index} onClick={() => call.camera.select(camera.deviceId)} className='hover:!bg-white/20 truncate'>
                  <span className='flex items-center gap-2 text-white'>
                    {
                      camera.deviceId === selectedCamera && (
                        <Check size={20} color='#fff' />
                      )
                    }
                    {camera.label}
                  </span>
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default AudioVideoControls