const quickDraw = require('../src/quickdraw');
const assert = require('chai').assert;

/*******************************************************************************
                                    TEST
*******************************************************************************/

describe('quickdraw.js tests', function () {
  it('.import', async function () {
    this.timeout(120000);

    var index = Math.floor(Math.random() * quickDraw.categories.length);
    var category = quickDraw.categories[index];

    var amount = Math.round(Math.random() * 1000) + 1;
    var size = Math.round(Math.random() * 1000);

    await quickDraw.import(category, amount, size);

    var result = require(`../src/drawings/${category}.json`).data;

    assert.equal(result.length, amount, 'dataset is not the given size!');
    assert.equal(result[0].length, size ** 2, 'dimensions not correct!');
  });
  it('.set', function () {
    var categories = quickDraw._pickRandom(quickDraw.categories, 5);
    var amount = Math.round(Math.random() * 500);

    var set = quickDraw.set(amount, categories);

    assert.equal(typeof set.input, 'number', 'set.input is not a number!');
    assert.equal(typeof set.output, 'number', 'set.output is not a number!');

    assert.isAtLeast(set.set[0].input.length, 1, 'sample dimension is 0');

    assert.equal(set.set[0].output.length, categories.length, 'output length does not match amount of categories1');
    assert.equal(amount, set.set.length, 'dataset is not the given size!');

    assert.sameMembers(set.set[0].output, [1, 0, 0, 0, 0], 'output is not one-hot encoded!');
  });
});
