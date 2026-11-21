import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
S, E = sys.argv[1], sys.argv[2]
r = json.load(open(f'{S}/ig/ig.json'))
def find(m):
    for b in (E, '.'):
        p = os.path.join(b, m)
        if os.path.exists(p): return p
items = []
for quelle in ('stories.html', 'reels.html', 'posts_1.html'):
    for i in r[quelle]:
        for m in i['media']:
            if m.endswith('.mp4'):
                items.append({'quelle': quelle, 'datum': i['datum'], 'text': ' '.join(i['text'].split()), 'media': m, 'pfad': find(m)})
def probe(it):
    if not it['pfad']: return it
    o = json.loads(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height','-of','json',it['pfad']],capture_output=True,text=True).stdout)
    it['dauer'] = round(float(o['format']['duration']),1)
    v = [s for s in o['streams'] if s['codec_type']=='video'][0]
    it['wh'] = f"{v['width']}x{v['height']}"
    it['ton'] = any(s['codec_type']=='audio' for s in o['streams'])
    if it['ton']:
        e = subprocess.run(['ffmpeg','-nostdin','-v','info','-i',it['pfad'],'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
        for l in e.splitlines():
            if 'mean_volume' in l: it['db'] = float(l.split(':')[1].split()[0])
    return it
with ThreadPoolExecutor(8) as ex: items = list(ex.map(probe, items))
json.dump(items, open(f'{S}/ig/videos.json','w'), ensure_ascii=False, indent=1)
print(len(items), 'fehlend', sum(1 for i in items if not i['pfad']), 'mit Ton', sum(1 for i in items if i.get('ton')), 'still(<-50dB)', sum(1 for i in items if i.get('db',-99)<-50))
