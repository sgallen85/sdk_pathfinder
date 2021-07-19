# SDK Pathfinder with ReactJS

https://nwager-mp.github.io/sdk_pathfinder/

## Local Environment Setup

1. After cloning the repo, run `npm install` to install the required packages (or `yarn install`).

2. Once that's done, run `yarn start` and go to `localhost:3000` (it'll probably open automatically). The website should be running.

## Deploying to GH Pages

When you want to update the website, run `npm run deploy`. This should deploy the site (link above) with the most recent changes from your local repo.

## Notes

* The sdk directory `bundle/` needs to be in the `public/` directory because webpack won't serve `showcase.html` otherwise. This means that asset ins't minimized or processed before being deployed, which isn't entirely optimal. I'm not sure how to fix the webpack stuff at the moment :(
