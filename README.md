![](http://i.imgur.com/ap9FKr7.png)

### Quick, draw! JS

<a href="https://www.npmjs.com/package/quickdraw.js"><img src="https://img.shields.io/npm/v/quickdraw.js.svg?style=flat-square"></a>

<hr>

This library allows you to import any of the millions of drawings from the
[Google Quick Draw dataset](https://github.com/googlecreativelab/quickdraw-dataset)
and to use them with JavaScript machine learning libraries like
[Synaptic](https://github.com/cazala/synaptic) and
[Neataptic](https://github.com/wagenaartje/neataptic). At this moment, this
library is not supported by the browser due to size issues.

**Example usage** (using Neataptic)

```js
const dataSet = quickDraw.set(100, ['car', 'airplane']);
const network = new neataptic.architect.Perceptron(dataSet.input, 20, dataSet.output);

network.train(dataSet.set, {
  iterations: 100,
  log: 1,
  rate: 0.1
});
```

This example will teach a neural network to distinguish if a drawing is either
a car or a plane, using a dataset size of 100.

## Getting started
Installing `quickdraw.js` is easy with `npm`, just run:

```batch
npm install quickdraw.js
```

There is a high chance you will have a problem during the installation of the
`canvas` library, which is a dependency. Please follow the steps
[here](https://github.com/Automattic/node-canvas/wiki) and it should fix any
problems.

Then, in your `Node.js` script, require the library:

```js
var quickDraw = require('quickdraw.js');
```

## Usage
Usage is fairly easy, but keep in mind that the Google Quick Draw dataset is
a very large dataset. So before going mayhem on downloading, take into account
that each _sample_ is a little more than `2kb` (for 28x28).

With about 100000 samples for each of the 345 categories, that would take
gigabytes of space.

_[dev note] i'm looking into compressing and decompressing :)_

### quickDraw.set
This allows you to get a dataset that is compatible with Synaptic and Neataptic.
Default usage:

```js
quickDraw.set(size, categories)
```

* `size` is the total amount of samples you want in your dataset. The amount
of samples will be distributed among the categories the best way possible.
* `categories` is optional. If none is given, samples of each
category will be present. When given, it should be an array containing the
names of the categories you want to include.
[See the full list here](https://github.com/googlecreativelab/quickdraw-dataset/blob/master/categories.txt). All given categories should have the same sample dimensions!



Example:

```js
var set = quickDraw.set(600, ['car', 'airplane', 'bicycle'])
```

This example will return a dataset with 600 samples, containing 200 samples from
each of the 3 given categories.

The set function returns an object which is built up like this:

```js
{
  set: [
    { input: [0, 0, 0, 0.418, 0...], output: [1, 0, 0]},
    { input: [0.156, 0, 0, 0.163, // one object for every sample
  ],
  output: 3, // amount of categories
  input: 784 // dimension of samples (28 x 28)
}
```

The `.set` property should be passed to Synaptic or Neataptic as the dataset.
The `input` and `output` parameters are useful for setting up the input/output
size of the neural network.

### quickDraw.importAll <sup>async<sup>
By default, this library comes with 100 samples of each category. Each of these
samples is a 784 (28x28 image) array containing values in the range of `0-1`,
where `1` indicates 'fully drawn'.

If you want to change the amount of samples per category, or the dimensions
of the dataset, use this function the following way:

```js
quickDraw.importAll(samplesPerCategory, dimension);
```

So for example, calling:

```js
quickDraw.importAll(250, 64);
```

Would download, convert and save 250 samples per category as a 64x64 greyscale
array.

### quickDraw.import <sup>async<sup>
This is similar to `quickDraw.importAll`, but this function will just update
the samples of óne category. The usage is fairly simple:

```js
quickDraw.import(category, amount, size);
```

* The `category` parameter is the string name of the category that you want
to update. [See the full list here](https://github.com/googlecreativelab/quickdraw-dataset/blob/master/categories.txt).
* The `amount` parameter is the amount of samples that should be downloaded for
the given category.
* The `size` parameter is optional, the default is `28` (28x28).

Example:

```js
quickDraw.import('broccoli', 400);
```

Will download, convert and save 400 28x28 samples from the `brocolli` category.

## Contributing
Feel free to contribute! Keep in mind that this project is fairly new, and I
have some things in my head that I want to implement. So before you create a PR
to work on a new feature, create an issue so we can discuss the feature first.

You can also participate in the discussions at the [issues
section](https://github.com/wagenaartje/stocks.js/issues), every opinion we can
get is useful.

## Further notices
This data made available by Google, Inc. under the Creative Commons Attribution 4.0 International license.
https://creativecommons.org/licenses/by/4.0/

<hr>

You made it all the way down! If you appreciate this repo and want to support the development of it, please consider donating :thumbsup:
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CXS3G8NHBYEZE)
