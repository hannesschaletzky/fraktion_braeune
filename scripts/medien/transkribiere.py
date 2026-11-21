import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
S = sys.argv[1]
os.chdir('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/assets/insta_export')
os.makedirs(f'{S}/ig/ton', exist_ok=True); os.makedirs(f'{S}/ig/wav', exist_ok=True)
modell = f'{S}/whisper/ggml-small.bin'
if not os.path.exists(modell):
    # Modell ist nicht versioniert (465 MB): bei Bedarf von Hugging Face holen
    os.makedirs(os.path.dirname(modell), exist_ok=True)
    subprocess.run(['curl', '-sfL', '-o', modell, 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin'], check=True)
pfade = sorted({i['pfad'] for i in json.load(open(f'{S}/ig/videos.json')) if i.get('ton')})
def lauf(p):
    id_ = os.path.basename(p)[:-4]; out = f'{S}/ig/ton/{id_}'
    if os.path.exists(out + '.txt'): return
    w = f'{S}/ig/wav/{id_}.wav'
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',p,'-ar','16000','-ac','1',w])
    subprocess.run(['whisper-cli','-m',modell,'-l','de','-t','3','-np','-otxt','-of',out,w], capture_output=True)
    os.remove(w)
with ThreadPoolExecutor(4) as ex: list(ex.map(lauf, pfade))
print('fertig', len(os.listdir(f'{S}/ig/ton')), 'von', len(pfade))
