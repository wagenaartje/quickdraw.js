#! /usr/bin/python3

import ndjson

data = None
with open('cat_200.ndjson') as f:
    data = ndjson.load(f)

print(len(data))

for index, item in enumerate(data):
    if index == 0:
        if 'drawing' not in item:
            raise KeyError("Item has no drawing data")
        
        drawing = item.get('drawing')
        print(len(drawing))
        for line in drawing:
            x_ordinates = line[0]
            y_ordinates = line[1]
            if len(x_ordinates) != len(y_ordinates):
                raise ValueError("Unequal number of x and y coordinates")
            for point_index, x_ord in enumerate(x_ordinates):
                if point_index == 0:
                    print('\t<path d = "M', x_ord, y_ordinates[point_index], end='')
                else:
                    print(' L', x_ord, y_ordinates[point_index], end='')
            print('" stroke="black" fill="transparent"/>')



       #     print (x_ordinates)
       #     print (y_ordinates)
