# Turnier-Zeiträume, an denen wir dabei waren: aus termine.json (Sortierfenster = offizielle Tage ± Puffer)
import json, os
_T = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'termine.json'), encoding='utf-8'))
EVENTS = [(t['key'], t['fenster'][0], t['fenster'][1], f"{t['ort']} {t['jahr']}") for t in _T if 'key' in t]
def event(datum):
    d = datum[:10]
    for k, a, b, n in EVENTS:
        if a <= d <= b: return k
    return 'sonstiges'
