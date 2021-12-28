import { useEffect, useRef, useState } from 'react'
import { StaticService } from 'storage'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const VideoJS = (props: any) => {
  const videoRef = useRef<any>(null)
  const playerRef = useRef<any>()
  const { options, onReady } = props

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current
      if (!videoElement) return

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log('player is ready')
        onReady && onReady(player)
      }))
    } else {
      // you can update player here [update player through props]
      const player = playerRef.current
      player.src(options.sources)
    }
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player>
      <video ref={videoRef} className='video-js vjs-big-play-centered' />
    </div>
  )
}

interface IProps {
  id: string | null
}
const VideoPlayer = (props: IProps) => {
  const playerRef = useRef<any>(null)
  const [videoJsOptions, setVideoJsOptions] = useState<any>({
    // lookup the options in the docs for more options
    // autoplay: false,
    auto: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: `${StaticService.apiUrl}/archive/${props.id}`,
        type: 'video/mp4'
      }
    ]
  })

  const handlePlayerReady = (player: any) => {
    playerRef.current = player

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting')
    })

    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }

  useEffect(() => {
    setVideoJsOptions({
      // lookup the options in the docs for more options
      // autoplay: false,
      auto: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: `${StaticService.apiUrl}/archive/${props.id}`,
          type: 'video/mp4'
        }
      ]
    })
  }, [props.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return props.id ? (
    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
  ) : null
}
export default VideoPlayer
