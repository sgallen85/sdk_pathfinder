# SDK Wayfinder with ReactJS

https://nwager-mp.github.io/sdk_wayfinder/

## Local Environment Setup

1. After cloning or pulling the repo, run `npm install` to install the required packages (or `yarn install`).

2. Once that's done, run `yarn start` and go to `localhost:3000` (it'll probably open automatically). The website should be running.

## Deploying to GH Pages

When you want to update the website, run `npm run deploy`. This should deploy the site (link above) with the most recent changes from your local repo.

## Notes

* The dropdown menu doesn't sort sweeps at all now because it introduced some annoying performance issues with React. Looking in to solutions or alternatives.

* The sdk directory `bundle/` needs to be in the `public/` directory because webpack won't serve `showcase.html` otherwise. This means that asset ins't minimized or processed before being deployed, which isn't entirely optimal. I'm not sure how to fix the webpack stuff at the moment :(

* If something breaks after you pull from remote, try `npm install`. New dependencies might have been added that you haven't installed yet.
