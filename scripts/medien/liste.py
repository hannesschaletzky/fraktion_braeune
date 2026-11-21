import json, os, sys, re
S = sys.argv[1]; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from events import event
v = [i for i in json.load(open(f'{S}/ig/videos.json')) if i['quelle'] == 'stories.html']
nr = json.load(open(f'{S}/ig/nummern.json'))
rows = []
for i in sorted(v, key=lambda x: x['datum']):
    id_ = os.path.basename(i['pfad'])[:-4]
    t = ''
    p = f'{S}/ig/ton/{id_}.txt'
    if os.path.exists(p): t = ' '.join(open(p).read().split())
    t = re.sub(r'\[[^\]]*\]|\([^)]*\)|\*[^*]*\*', '', t).strip()
    rows.append((nr.get(id_, '?'), i['dauer'], i.get('db', -99), i['text'][:50], t[:150]))
ev = sys.argv[2] if len(sys.argv) > 2 else None
for r in rows:
    if ev and not r[0].startswith(ev + '#'): continue
    print(f'{r[0]:<20} {r[1]:>5}s {r[2]:>6} | {r[3]:<50} | {r[4]}')
