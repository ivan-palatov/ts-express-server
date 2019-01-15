import slug = require("limax");
import _ = require("lodash");

/**
 * Creates a regular expression to find all possible matches to a given string's slug
 * @param {string} str - string for which slug needs to be created
 */
export const slugRegexp = (str: string): RegExp => {
  return new RegExp(`${slug(str, { separateNumbers: false })}(-[0-9]+)?`, "i");
};

export const makeUniqueSlug = (str: string, results: string[]): string => {
  // TODO: check if results is empty, check if val doesnt match the regexp, cause it doesnt have _[0-9] at the end
  const newSlug = slug(str, { separateNumbers: false });
  let numbers: number[];
  results.map(val => {
    numbers.push(Number(/([a-zA-Z0-9-_])+_([0-9]+)/.exec(val)[1]));
  });
  const nextVal = _.max(numbers) + 1;
  return `${newSlug}_${nextVal}`;
};
