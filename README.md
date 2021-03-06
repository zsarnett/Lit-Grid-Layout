[![npm version](https://badge.fury.io/js/lit-grid-layout.svg)](https://badge.fury.io/js/lit-grid-layout) ![Build](https://github.com/zsarnett/Lit-Grid-Layout/workflows/Build/badge.svg) [![Known Vulnerabilities](https://snyk.io/test/github/zsarnett/Lit-Grid-Layout/badge.svg?targetFile=package.json)](https://snyk.io/test/github/zsarnett/Lit-Grid-Layout?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/0a099815e11e9780102d/maintainability)](https://codeclimate.com/github/zsarnett/Lit-Grid-Layout/maintainability)

# Lit Grid Layout

Draggable and Resizable Grid Layout for Lit Element

![31bb22ab7750bf9292e982d0cab4a2ea](https://user-images.githubusercontent.com/18730868/88720705-e7512180-d0ea-11ea-9437-5269c2017920.gif)
[[Demo](https://lit-grid-layout.netlify.app/)]

### Todo

- [x] Create Layout algorithm that takes a layout array [{width, height, x, y}] and sorts its, and places it in the DOM without going over bounds, etc
- [x] Ability to drag the Grid Items around the DOM and regenerate the layout when it is moved.
- [x] Ability to resize the Grid Items and regenerate the layout when moved
- [x] Ability to specify an element for the drag handle
- [ ] Ability to specify an element for the drag handle through a shadowroot
- [x] Fix Mobile resizing
- [ ] Test the code, review the code, make sure we are production ready
  - [ ] Add edge cases, only update if we need to, checks in place to not break

### Note

This library has not been fully released. I will not be including any breaking changes or release notes as this is being actively developed. Please star the repo and set up watch for releases. I will release the main version as 1.2. This will be after I fully integrate and finalize the implementaion into Home Assistant

Please consider sponsoring me via Github Sponsors to show support for this repo.
