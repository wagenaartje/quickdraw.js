#! /usr/bin/python3

import ndjson

data = None
with open('cat_200.ndjson') as f:
    data = ndjson.load(f)

print(len(data))

for index, item in enumerate(data):
    if 'drawing' not in item:
        raise KeyError("Item has no drawing data")
        
    outfilename = 'cat_{:04d}.svg'.format(index)
    with open(outfilename, 'w') as f:
        drawing = item.get('drawing')
        f.write('<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">\n')
        for line in drawing:
            x_ordinates = line[0]
            y_ordinates = line[1]
            if len(x_ordinates) != len(y_ordinates):
                raise ValueError("Unequal number of x and y coordinates")

            for point_index, x_ord in enumerate(x_ordinates):
                if point_index == 0:
                    f.write('\t<path d = "M {:d} {:d}'.format(x_ord, y_ordinates[point_index]))
                else:
                    f.write(' L {:d} {:d}'.format(x_ord, y_ordinates[point_index]))
            f.write('" stroke="black" fill="transparent"/>\n')

        f.write('</svg>')


