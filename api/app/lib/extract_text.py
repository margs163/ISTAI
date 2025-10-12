from bs4 import BeautifulSoup

text_content = None

with open("./app/data/html/cookie.html", "r") as f:
    html_content = f.read()
    soup = BeautifulSoup(html_content, 'html.parser')
    text_content = soup.get_text()

with open("./app/data/html/cookie.txt", "w") as f:
    f.write(text_content)