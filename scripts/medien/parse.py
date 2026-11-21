import re, json, sys, html, os
from datetime import datetime
base = sys.argv[1]; out = sys.argv[2]
res = {}
for f in ['posts_1.html','reels.html','stories.html','other_content.html','reposts.html']:
    s = open(os.path.join(base, f), encoding='utf-8').read()
    blocks = s.split('<div class="pam _3-95 _2ph- _a6-g uiBoxWhite noborder">')[1:]
    items = []
    for b in blocks:
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', b, re.S)
        cap = html.unescape(re.sub(r'<[^>]+>', '', h2.group(1))).strip() if h2 else ''
        media = sorted(set(re.findall(r'(?:src|href)="(media/[^"]+)"', b)))
        dates = re.findall(r'<div class="_3-94 _a6-o">([^<]+)</div>', b)
        d = dates[-1] if dates else ''
        M={'Jan':'Jan','Feb':'Feb','März':'Mar','Apr':'Apr','Mai':'May','Juni':'Jun','Juli':'Jul','Aug':'Aug','Sept':'Sep','Sep':'Sep','Okt':'Oct','Nov':'Nov','Dez':'Dec'}
        mo=d.split(' ')[0].rstrip('.')
        if mo in M: d=M[mo]+' '+' '.join(d.split(' ')[1:])
        try: iso = datetime.strptime(d.replace('Sept.','Sep.').replace('.',''), '%b %d, %Y %I:%M %p').strftime('%Y-%m-%d %H:%M')
        except Exception:
            try: iso = datetime.strptime(d, '%b %d, %Y %I:%M %p').strftime('%Y-%m-%d %H:%M')
            except Exception: iso = d
        items.append({'datum': iso, 'text': cap, 'media': media})
    res[f] = items
json.dump(res, open(out,'w'), ensure_ascii=False, indent=1)
for k,v in res.items(): print(k, len(v), sum(len(i['media']) for i in v), 'unparsed dates:', sum(1 for i in v if not i['datum'][:2]=='20'))
