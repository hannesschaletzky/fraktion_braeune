import json, os, subprocess, sys, collections
sys.path.insert(0, os.path.dirname(__file__))
from events import event
S = sys.argv[1]
os.chdir('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/assets/insta_export')
v = json.load(open(f'{S}/ig/videos.json'))
v = [i for i in v if i['quelle'] == 'stories.html']
v.sort(key=lambda i: i['datum'])
grp = collections.defaultdict(list)
for i in v: grp[event(i['datum'])].append(i)
os.makedirs(f'{S}/ig/bogen', exist_ok=True); os.makedirs(f'{S}/ig/frames', exist_ok=True)
nr = {}
for k, items in grp.items():
    for n, i in enumerate(items, 1):
        id_ = os.path.basename(i['pfad'])[:-4]; nr[id_] = f'{k}#{n}'
        f = f'{S}/ig/frames/{id_}.jpg'
        if not os.path.exists(f):
            subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss',str(i['dauer']*0.45),'-i',i['pfad'],'-frames:v','1','-vf','scale=150:267:force_original_aspect_ratio=increase,crop=150:267',f])
    print(k, len(items))
json.dump(nr, open(f'{S}/ig/nummern.json','w'))
json.dump({k:[os.path.basename(i['pfad'])[:-4] for i in it] for k,it in grp.items()}, open(f'{S}/ig/gruppen.json','w'))
