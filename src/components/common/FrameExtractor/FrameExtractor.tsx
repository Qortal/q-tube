import React, { useEffect, useRef, useState, useMemo } from 'react';

export const FrameExtractor = ({ videoFile, onFramesExtracted }) => {
    const videoRef = useRef(null);
    const [durations, setDurations] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        video.addEventListener('loadedmetadata', () => {
            const duration = video.duration;
            if (isFinite(duration)) {
                // Proceed with your logic
          
            console.log('duration', duration)
            const section = duration / 4;
            let timestamps = [];

            for (let i = 0; i < 4; i++) {
                const randomTime = Math.random() * section + i * section;
                timestamps.push(randomTime);
            }

            setDurations(timestamps);
        } else {
            onFramesExtracted([])
        }
        });
    }, [videoFile]);

    console.log({durations})

    useEffect(() => {
        if (durations.length === 4) {
            extractFrames();
        }
    }, [durations]);

    const fileUrl = useMemo(() => {
        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    const extractFrames = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
    
        let frameData = [];
    
        for (const time of durations) {
            await new Promise<void>((resolve) => {
                video.currentTime = time;
                const onSeeked = () => {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => {
                        frameData.push(blob);
                        resolve();
                    }, 'image/png');
                    video.removeEventListener('seeked', onSeeked);
                };
                video.addEventListener('seeked', onSeeked, { once: true });
            });
        }
    
        onFramesExtracted(frameData);
    };
    

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} src={fileUrl}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};
