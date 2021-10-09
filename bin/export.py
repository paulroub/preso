import io;
from bs4 import BeautifulSoup;

file = io.open('views/index.liquid')
html = file.read()

soup = BeautifulSoup(html, 'html.parser')
notes = soup.find_all(class_='notes')
for note in notes:
    note.extract()

script = soup.find('script')
share_script = soup.new_tag('script', attrs = {
    'src': 'scripts/slides.js'
})
script.replace_with(share_script)

link = soup.find('link')

link.replace_with(soup.new_tag('link', attrs={
    'rel': 'stylesheet',
    'href': 'style.css'
}))

images = soup.find_all('img')

for image in images:
    src = image['src']
    image['src'] = src.replace('/images', 'images')

clocks = soup.find_all(class_='showaclock')
for clock in clocks:
    newframe = soup.new_tag('iframe', attrs={
        'src': 'tddmash/demo.html'
    })
    clock.replace_with(newframe)

print(soup)
