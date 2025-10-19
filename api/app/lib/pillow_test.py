import random
from PIL import ImageFilter
import sys
from PIL import Image, ImageDraw

def sequences():
    variants = [1, 2, 3, 4, 5]
    print("Random 10 samples:", random.choices(variants, k=10))
    print("Random 8 samples:", random.sample(variants, k=4))
    random.shuffle(variants)
    print("Shuffling the sequence:", variants)

def main():
    print(random.randint(8, 9))
    print(random.randrange(8, 9))

def imaging():
    bg = Image.new("RGB", (400, 400), color="white")
    tool = ImageDraw.Draw(bg)

    # tool.circle((200, 200), radius=80, outline="blue", width=3, fill="cyan")
    tool.text((150, 250), "A random text", fill="black")

    # tool.line((0, 0, 400, 200), fill="black", width=3)
    # tool.polygon(((50, 50), (200, 150), (300, 100), (400, 150)), width=2, outline="black")
    tool.arc((150, 150, 300, 300), start=-180, end=0, width=3, fill="black")

    bg.show()




if __name__ == "__main__":
    imaging()