
f = open("data.json", "r")
data = f.read()
data = data.replace(' ', '')
data = data.replace('\n', '')

ff = open('trtc_line_map.json', "w")
ff.write(data)
