from phonemizer import phonemize
from pprint import pprint
from phonemizer.separator import Separator

text = "God damn son this bitch gon hit it\n Let's try some normal sentences"
text = [line.strip() for line in text.split('\n') if line]

phn = phonemize(
    text,
    language='en-us',
    backend='festival',
    separator=Separator(phone=None, word=' ', syllable='|'),
    strip=True,
    preserve_punctuation=True,
    njobs=4)

pprint(phn)