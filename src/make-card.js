"use strict";

const boxen = require("boxen");
const chalk = require("chalk");
const get = require("lodash.get");
const cardStyle = require("./style.js");
const colorMarks = require("./color-marks");

module.exports = makeCard;

function makeCard(pkg) {
  const myCard = pkg.myCard;
  const info = { _packageName: pkg.name, ...myCard.info };
  const data = myCard.data;

  const processString = str => str.replace(/{{([^}]+)}}/g, (a, b) => get(info, b, ""));

  const maxLens = data.reduce(
    (a, x) => {
      if (typeof x === "string" || !x.label) return a;
      a.label = Math.max(a.label, colorMarks.remove(x.label).length);
      a.text = Math.max(a.text, colorMarks.remove(x.text).length);
      return a;
    },
    { label: 0, text: 0 }
  );

  const defaultStyle = { label: x => x, text: x => x, ...cardStyle._default };

  const cardLines = data.reduce((a, x) => {
    if (x.when && !processString(x.when).trim()) return a;

    if (!x.label && x.text) x = x.text || "";

    if (typeof x === "string") {
      a.push(defaultStyle.text(colorMarks.format(processString(x))));
    } else {
      const xLabel = processString(x.label);
      const xText = processString(x.text);
      const label = colorMarks.remove(xLabel);
      const style = { ...defaultStyle, ...cardStyle[label] || cardStyle[label.toLowerCase()] };
      const pad = x.pad || " ".repeat(maxLens.label - label.length);
      a.push(pad + style.label(colorMarks.format(xLabel)) + style.text(colorMarks.format(xText), x._link));
    }

    return a;
  }, []);

  const cardText = cardLines.join("\n");
  const boxenStyle = cardStyle._boxen || { padding: 1, margin: 1, borderColor: "green", borderStyle: "round" };
  const boxenText = boxen(cardText, boxenStyle);

  return { cardLines, cardText, boxenText };
}
