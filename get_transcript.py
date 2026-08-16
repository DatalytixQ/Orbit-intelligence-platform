from youtube_transcript_api import YouTubeTranscriptApi
import json
import sys

video_id = "Fptm-Eq9vN4"
try:
    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['es', 'en'])
    # Filter between 39:20 (2360s) and 1:01:23 (3683s)
    start_time = (39 * 60) + 20
    end_time = (61 * 60) + 23
    
    text = []
    for t in transcript:
        if t['start'] >= start_time and t['start'] <= end_time:
            text.append(f"[{int(t['start'])//60:02d}:{int(t['start'])%60:02d}] {t['text']}")
            
    with open('transcript.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(text))
    print("Transcript saved.")
except Exception as e:
    print(f"Error: {e}")
