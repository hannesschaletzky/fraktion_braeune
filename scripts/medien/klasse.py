import json, os, sys, re
S = sys.argv[1]; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
v = [i for i in json.load(open(f'{S}/ig/videos.json')) if i['quelle'] == 'stories.html']
nr = json.load(open(f'{S}/ig/nummern.json'))
out = []
for i in sorted(v, key=lambda x: x['datum']):
    id_ = os.path.basename(i['pfad'])[:-4]
    p = f'{S}/ig/ton/{id_}.txt'
    raw = ' '.join(open(p).read().split()) if os.path.exists(p) else ''
    musik = bool(re.search(r'musik|♪|gitarre', raw, re.I))
    crowd = bool(re.search(r'jubel|applaus|singen|klatscht|stimmengewirr|rufen|schrei', raw, re.I))
    text = re.sub(r'\[[^\]]*\]|\([^)]*\)|\*[^*]*\*|♪', '', raw).strip()
    worte = text.split()
    # Sprechchor: wenige verschiedene Wörter, oft wiederholt
    chor = len(worte) >= 6 and len(set(w.lower().strip('!,.') for w in worte)) <= len(worte) * 0.4
    k = 'MUSIK' if musik and not crowd and not chor else ('CHOR' if chor else ('JUBEL' if crowd else ('SPRACHE' if len(worte) > 3 else ('LEER' if i.get('db', -99) < -40 else 'UNKLAR'))))
    out.append({'id': id_, 'nr': nr.get(id_), 'k': k, 'dauer': i['dauer'], 'cap': i['text'][:60], 'ton': text[:140]})
json.dump(out, open(f'{S}/ig/klasse.json', 'w'), ensure_ascii=False, indent=0)
import collections; print(collections.Counter(o['k'] for o in out))
