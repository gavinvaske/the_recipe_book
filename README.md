# the_recipe_book


## Getting Started

Follow the steps below to get this repo running on your own machine!

**Prerequisite:** Download the IDE of your choice. A good choice is [visual studio code](https://code.visualstudio.com/), you can download it by visiting their website.

Steps
  1. open a terminal and `cd` into the location you wish to download this repo
  2. clone the repo using:
     - `git clone https://github.com/gavinvaske/the_recipe_book.git`
  3. to run the application `cd` into the downloaded folder using: 
     - `cd the_recipe_book`
  4. Install Dependencies using:
     - `npm run install`
  5. start the application using:
     - `npm run start`
  6. open a browser window and enter the url: 
     - `http://localhost:8080/`
  7. Tada, your done. You can open the cloned repo in the IDE of your choice and make whatever changes you want. Then make sure to run `npm run start` just like in step 4 to see the changes you make


## Developer Development Guide

Any work done locally, must be added to a branch before being pushed, the steps below describe how to create a branch and push that branch to github

0) Ensure you are on the `main branch` AND that it is up to date with what is on github (**NOTE:** If an error occurs during these steps, running `git stash` BEFORE them may help, but beware [what the command will do](#git-stash))
  - `git checkout main`
  - `git pull`
1) checkout a new branch
  - `git checkout -b your-super-cool-branch-name`
2) make any changes you need locally and then commit those to your branch
  - `git add .`
  - `git commit -m "maybe you changed the readme, or did something else? type a summary of what you did here"`
3) push your branch up to github
  - `git push`

### Descriptions of Useful Git Commands

#### Git Stash
If you have many changes locally and you want to get rid of them ALL (but save them away just-in-case)
  - `git stash`

If you recently ran `git stash` but you now regret that decision and want the stuff back
  - `git stash pop`
