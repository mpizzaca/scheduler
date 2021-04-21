# Interview Scheduler

[![CircleCI](https://circleci.com/gh/mpizzaca/scheduler.svg?style=shield)](https://circleci.com/gh/mpizzaca/scheduler)
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="182" height="20" role="img" aria-label="Coverage:statements: 96.82%"><title>Coverage:statements: 96.82%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="182" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="129" height="20" fill="#555"/><rect x="129" width="53" height="20" fill="#4c1"/><rect width="182" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="655" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="1190">Coverage:statements</text><text x="655" y="140" transform="scale(.1)" fill="#fff" textLength="1190">Coverage:statements</text><text aria-hidden="true" x="1545" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="430">96.82%</text><text x="1545" y="140" transform="scale(.1)" fill="#fff" textLength="430">96.82%</text></g></svg>

## Demo
[Live Demo on Netlify!](https://trusting-boyd-6fff97.netlify.app/) Please allow ~30s for Heroku to wake up to display the appointments.

## Description

Allows users to schedule interviews on a date/time and with an interviewer of their choice. Uses websockets to update real-time as other users book or cancel their interviews.

Fully automated testing and deployment with CircleCI and Netlify.




## Setup

Install dependencies with `npm install`.

Requires [Interview Scheduler API](https://github.com/lighthouse-labs/scheduler-api) backend server.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Cypress End-to-End Test Framework

```sh
npm run cypress
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
