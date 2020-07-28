# Lit Grid Layout

Grid Layout for Lit Element

[[Demo](https://lit-grid-layout.netlify.app/)]

[![npm version](https://badge.fury.io/js/lit-grid-layout.svg)](https://badge.fury.io/js/lit-grid-layout) ![Build](https://github.com/zsarnett/Lit-Grid-Layout/workflows/Build/badge.svg) [![Known Vulnerabilities](https://snyk.io/test/github/zsarnett/Lit-Grid-Layout/badge.svg?targetFile=package.json)](https://snyk.io/test/github/zsarnett/Lit-Grid-Layout?targetFile=package.json) ![Dependencies](https://david-dm.org/zsarnett/lit-grid-layout.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/0a099815e11e9780102d/maintainability)](https://codeclimate.com/github/zsarnett/Lit-Grid-Layout/maintainability)

### Todo

- [x] Create Layout algorithm that takes a layout array [{width, height, x, y}] and sorts its, and places it in the DOM without going over bounds, etc
- [x] Ability to drag the Grid Items around the DOM and regenerate the layout when it is moved.
- [x] Ability to resize the Grid Items and regenerate the layout when moved
- [ ] Ability to specify an element for the drag handle
- [ ] Fix Mobile resizing
- [ ] Test the code, review the code, make sure we are production ready
  - [ ] Add edge cases, only update if we need to, checks in place to not break
