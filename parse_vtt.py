import re

def time_to_sec(t_str):
    # Format typically: HH:MM:SS.mmm or HH:MM:SS,mmm
    t_str = t_str.replace(',', '.')
    parts = t_str.split(':')
    if len(parts) == 3:
        h, m, s_ms = parts
    else:
        h = 0
        m, s_ms = parts
    
    if '.' in s_ms:
        s, ms = s_ms.split('.', 1)
    else:
        s, ms = s_ms, 0
    return int(h)*3600 + int(m)*60 + int(s) + int(ms)/1000

filename = "Webinar Datawalt + SAP Business One [Fptm-Eq9vN4].es.vtt"
try:
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_sec = 2360 # 39:20
    end_sec = 3683   # 1:01:23
    
    text = []
    
    for i, line in enumerate(lines):
        if '-->' in line:
            times = line.strip().split(' --> ')
            try:
                t_start = time_to_sec(times[0])
                if t_start >= start_sec and t_start <= end_sec:
                    # Get the next line which is the text
                    if i + 1 < len(lines):
                        content = lines[i+1].strip()
                        # VTT format can have <c> tags and duplicates
                        content = re.sub(r'<[^>]+>', '', content)
                        if content and content not in text[-3:]: 
                            text.append(content)
            except Exception as e:
                pass
                
    with open('transcript_segment.txt', 'w', encoding='utf-8') as f:
        f.write(' '.join(text))
    print("Parsed successfully. Wrote to transcript_segment.txt")
except Exception as e:
    print(f"Error: {e}")
