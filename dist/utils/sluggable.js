"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slug = require("limax");
const _ = require("lodash");
/**
 * Creates a regular expression to find all possible matches to a given string's slug
 * @param {string} str - string for which slug needs to be created
 */
exports.slugRegexp = (str) => {
    return new RegExp(`${slug(str, { separateNumbers: false })}(-[0-9]+)?`, "i");
};
exports.makeUniqueSlug = (str, results) => {
    // TODO: check if results is empty, check if val doesnt match the regexp, cause it doesnt have _[0-9] at the end
    const newSlug = slug(str, { separateNumbers: false });
    let numbers;
    results.map(val => {
        numbers.push(Number(/([a-zA-Z0-9-_])+_([0-9]+)/.exec(val)[1]));
    });
    const nextVal = _.max(numbers) + 1;
    return `${newSlug}_${nextVal}`;
};
//# sourceMappingURL=sluggable.js.map