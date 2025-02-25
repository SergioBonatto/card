const makeCard = require('./make-card');
const pkg = require('../package.json');

test('makeCard generates card text', () => {
  const card = makeCard(pkg);
  expect(card).toHaveProperty('boxenText');
  expect(card.boxenText).toContain('Sergio Bonatto');
});
