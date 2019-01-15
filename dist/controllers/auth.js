"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = (req, res) => {
    res.render("auth", { text: "List of users" });
};
exports.create = (req, res) => {
    res.render("auth", { text: "Make user here" });
};
exports.store = (req, res) => {
    res.render("auth", { text: "Your user is being created" });
};
exports.show = (req, res) => {
    res.render("auth", { text: `User ${req.params.id} is being shown.` });
};
exports.edit = (req, res) => {
    res.render("auth", { text: `Edit page for ${req.params.id} user.` });
};
exports.update = (req, res) => {
    res.render("auth", { text: `User ${req.params.id} is being updated.` });
};
exports.destroy = (req, res) => {
    res.render("auth", { text: `You deleted ${req.params.id} user.` });
};
//# sourceMappingURL=auth.js.map