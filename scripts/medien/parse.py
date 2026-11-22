import re, json, sys, html, os
from datetime import datetime
base = sys.argv[1]; out = sys.argv[2]
def datum(d):
    M={'Jan':'Jan','Feb':'Feb','März':'Mar','Apr':'Apr','Mai':'May','Juni':'Jun','Juli':'Jul','Aug':'Aug','Sept':'Sep','Sep':'Sep','Okt':'Oct','Nov':'Nov','Dez':'Dec'}
    mo=d.split(' ')[0].rstrip('.')
    if mo in M: d=M[mo]+' '+' '.join(d.split(' ')[1:])
    try: return datetime.strptime(d.replace('Sept.','Sep.').replace('.',''), '%b %d, %Y %I:%M %p').strftime('%Y-%m-%d %H:%M')
    except Exception:
        try: return datetime.strptime(d, '%b %d, %Y %I:%M %p').strftime('%Y-%m-%d %H:%M')
        except Exception: return d
res = {}
for f in ['posts_1.html','posts.html','profile_photos.html','reels.html','stories.html','other_content.html','reposts.html']:
    s = open(os.path.join(base, f), encoding='utf-8').read()
    blocks = s.split('<div class="pam _3-95 _2ph- _a6-g uiBoxWhite noborder">')[1:]
    items = []
    for b in blocks:
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', b, re.S)
        cap = html.unescape(re.sub(r'<[^>]+>', '', h2.group(1))).strip() if h2 else ''
        media = sorted(set(re.findall(r'(?:src|href)="(media/[^"]+)"', b)))
        dates = re.findall(r'<div class="_3-94 _a6-o">([^<]+)</div>', b)
        iso = datum(dates[-1] if dates else '')
        items.append({'datum': iso, 'text': cap, 'media': media})
    if f == 'posts.html':
        # Detail-Format mit den Titelbildern, die in posts_1.html fehlen. Die Daten darin sind nicht eindeutig
        # zuzuordnen, deshalb Datum über den Beitragstext (bzw. den Dateinamen) aus posts_1.html holen.
        norm = lambda t: re.sub(r'\W+', '', t)[:80]
        nachText = {norm(e['text']): e['datum'] for e in res['posts_1.html'] if e['text']}
        nachDatei = {os.path.basename(m): e['datum'] for e in res['posts_1.html'] for m in e['media']}
        items = []
        for m in re.finditer(r'href="(media/[^"]+)"', s):
            text = re.search(r'</a><div>(.*?)</div>', s[m.end():m.end() + 5000], re.S)
            text = html.unescape(re.sub(r'<[^>]+>', '', text.group(1))).strip() if text else ''
            d = nachText.get(norm(text)) or nachDatei.get(os.path.basename(m.group(1)), '')
            items.append({'datum': d, 'text': text, 'media': [m.group(1)]})
    res[f] = items
json.dump(res, open(out,'w'), ensure_ascii=False, indent=1)
for k,v in res.items(): print(k, len(v), sum(len(i['media']) for i in v), 'unparsed dates:', sum(1 for i in v if not i['datum'][:2]=='20'))
