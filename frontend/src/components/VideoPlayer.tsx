import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Slider, 
  Typography, 
  Paper,
  Dialog,
  DialogContent,
  Alert,
  Button,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Close,
  ContentCopy,
  Download,
  SmartDisplay
} from '@mui/icons-material';

interface VideoPlayerProps {
  url: string;
  title: string;
  open: boolean;
  onClose: () => void;
  poster?: string;
}

export function VideoPlayer({ url, title, open, onClose, poster }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [vlcAttempted, setVlcAttempted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('VideoPlayer - URL:', url);
    console.log('VideoPlayer - Open:', open);
  }, [url, open]);

  // Detect if user agent supports VLC protocol
  const canTryVlcProtocol = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return !userAgent.includes('mobile') && !userAgent.includes('android') && !userAgent.includes('iphone');
  };

  // Try to open VLC with protocol handler
  const handleOpenInVLC = async () => {
    console.log('Attempting to open in VLC:', url);
    setVlcAttempted(true);
    
    // Method 1: Try to execute VLC directly (Linux-specific)
    if (navigator.userAgent.toLowerCase().includes('linux')) {
      try {
        // Create a temporary link that tries to execute VLC
        const vlcCommand = `vlc "${url}"`;
        console.log('Trying to open VLC with command:', vlcCommand);
        
        // Try using xdg-open to launch VLC
        const xdgUrl = `vlc://${url}`;
        window.location.href = xdgUrl;
        
        // Also try creating a shell command file
        setTimeout(() => {
          const shellCommand = `#!/bin/bash\nvlc "${url}"`;
          const blob = new Blob([shellCommand], { type: 'text/plain' });
          const downloadUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `play_${title.replace(/[^a-z0-9]/gi, '_')}.sh`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          
          console.log('Downloaded shell script - make it executable and run it');
        }, 1000);
        
      } catch (e) {
        console.log('Linux VLC launch failed:', e);
      }
    }
    
    // Method 2: Try standard VLC protocol
    try {
      const vlcUrl = `vlc://${url}`;
      console.log('Trying VLC protocol:', vlcUrl);
      window.location.href = vlcUrl;
    } catch (e) {
      console.log('VLC protocol failed:', e);
    }
    
    // Method 3: Show instructions for manual launch
    setTimeout(() => {
      console.log('If VLC did not open automatically, use the other buttons or run: vlc "' + url + '"');
    }, 2000);
  };

  // Download M3U playlist file
  const handleDownloadM3U = () => {
    try {
      const playlistContent = `#EXTM3U
#EXTINF:-1,${title}
${url}`;
      
      const blob = new Blob([playlistContent], { type: 'audio/x-mpegurl' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title.replace(/[^a-z0-9\s]/gi, '_')}.m3u`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      console.log('Downloaded M3U playlist');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (e) {
      console.error('Failed to create playlist:', e);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  // Download a .strm file (stream file that VLC can open)
  const handleDownloadStreamFile = () => {
    try {
      const blob = new Blob([url], { type: 'application/octet-stream' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title.replace(/[^a-z0-9\s]/gi, '_')}.strm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('Failed to create stream file:', e);
    }
  };

  const handleCopyVlcCommand = async () => {
    console.log('Copying VLC command for URL:', url);
    
    if (!url) {
      console.error('No URL available to copy');
      setError('No stream URL available');
      return;
    }
    
    const command = `vlc "${url}"`;
    console.log('VLC command:', command);
    
    try {
      await navigator.clipboard.writeText(command);
      console.log('Copied VLC command to clipboard');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy command:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = command;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setError('Failed to play video. This might be due to unsupported format or CORS issues.');
        });
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    setMuted(false);
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleSeekChange = (value: number) => {
    if (videoRef.current && !seeking) {
      const newTime = (value / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (value: number) => {
    setSeeking(false);
    if (videoRef.current) {
      const newTime = (value / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (!fullscreen && playerContainerRef.current) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setFullscreen(!fullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !seeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
    }
  };

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);
  
  const handleError = (e: any) => {
    console.error('Video error:', e);
    setError('Video format not supported by browser. Use the buttons below to open in VLC.');
  };

  const handleLoadStart = () => {
    console.log('Video loading started...');
    setError(null);
  };

  const handleCanPlay = () => {
    console.log('Video can play');
    setError(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'black',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1000,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <Close />
          </IconButton>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box ref={playerContainerRef} sx={{ position: 'relative', width: '100%', minHeight: '60vh' }}>
            <video
              ref={videoRef}
              width="100%"
              height="60vh"
              poster={poster}
              preload="metadata"
              crossOrigin="anonymous"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onError={handleError}
              onLoadStart={handleLoadStart}
              onCanPlay={handleCanPlay}
              style={{
                width: '100%',
                height: '60vh',
                backgroundColor: 'black'
              }}
            >
              <source src={url} type="video/mp4" />
              <source src={url} type="video/webm" />
              <source src={url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Controls */}
            <Paper
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0,0,0,0.8)',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                {playing ? <Pause /> : <PlayArrow />}
              </IconButton>

              <Typography variant="body2" sx={{ color: 'white', minWidth: '60px' }}>
                {formatTime(currentTime)}
              </Typography>

              <Slider
                value={duration > 0 ? (currentTime / duration) * 100 : 0}
                onChange={(_, value) => handleSeekChange(value as number)}
                onMouseDown={handleSeekMouseDown}
                onChangeCommitted={(_, value) => handleSeekMouseUp(value as number)}
                sx={{ 
                  flexGrow: 1,
                  '& .MuiSlider-thumb': {
                    color: 'primary.main',
                  },
                  '& .MuiSlider-track': {
                    color: 'primary.main',
                  },
                  '& .MuiSlider-rail': {
                    color: 'rgba(255,255,255,0.3)',
                  }
                }}
                min={0}
                max={100}
                step={0.1}
              />

              <Typography variant="body2" sx={{ color: 'white', minWidth: '60px' }}>
                {formatTime(duration)}
              </Typography>

              <IconButton onClick={handleMute} sx={{ color: 'white' }}>
                {muted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>

              <Slider
                value={volume * 100}
                onChange={(_, value) => handleVolumeChange((value as number) / 100)}
                sx={{ 
                  width: 100,
                  '& .MuiSlider-thumb': {
                    color: 'primary.main',
                  },
                  '& .MuiSlider-track': {
                    color: 'primary.main',
                  },
                }}
                min={0}
                max={100}
                step={1}
              />

              <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
                {fullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Paper>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="text.primary">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, wordBreak: 'break-all' }}>
              Stream URL: {url}
            </Typography>
            
            {/* VLC Control Panel */}
            <Paper sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.primary" gutterBottom>
                🎬 Play in VLC Media Player
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Tooltip title="Try to launch VLC directly">
                  <Button 
                    onClick={handleOpenInVLC}
                    variant="contained"
                    size="small"
                    startIcon={<SmartDisplay />}
                    disabled={!url}
                  >
                    Launch VLC
                  </Button>
                </Tooltip>
                
                <Tooltip title="Copy terminal command (Linux/Mac)">
                  <Button 
                    onClick={handleCopyVlcCommand}
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopy />}
                    color="secondary"
                    disabled={!url}
                  >
                    Copy Command
                  </Button>
                </Tooltip>
                
                <Tooltip title="Download playlist file - double-click to open in VLC">
                  <Button 
                    onClick={handleDownloadM3U}
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    disabled={!url}
                  >
                    Download M3U
                  </Button>
                </Tooltip>
                
                <Tooltip title="Copy URL to paste in VLC: Media → Open Network Stream">
                  <Button 
                    onClick={handleCopyUrl}
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopy />}
                    disabled={!url}
                  >
                    Copy URL
                  </Button>
                </Tooltip>
              </Box>

              <Typography variant="body2" color="text.secondary">
                <strong>Current Stream URL:</strong><br/>
                <code style={{ backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8em', wordBreak: 'break-all' }}>
                  {url || 'Loading...'}
                </code>
                <br/><br/>
                <strong>Linux Terminal method:</strong><br/>
                1. Click "Copy Command" above<br/>
                2. Open terminal (Ctrl+Alt+T)<br/>
                3. Paste and press Enter<br/>
                <br/>
                <strong>Manual VLC method:</strong><br/>
                1. Open VLC Media Player<br/>
                2. Media → Open Network Stream (Ctrl+N)<br/>
                3. Copy the URL above and paste it, then click Play
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success notification */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Action completed! Check downloads or clipboard."
      />
    </>
  );
} 