# the_recipe_book

[Click here](https://the-recipe-book-heroku-app.herokuapp.com/) to view the website hosted on Heroku.


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
     - `npm install`
  5. Create a `.env` file in the root directory and populate it with all the variables found in `.env.example` (you'll need to replace all the 'TODO' valued variables. You'll need to decide the values they need to be.)
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
4) After pushing to github, you may encounter a **build error**. These build errors can be caused by Failing [Tests](#what-and-where-are-the-tests) OR [linter](#what-is-a-linter) errors. To see a human-readable reason for what went wrong, run the following command locally: `npm run verify`. That command will run the linter and run the tests and tell you if which of those steps failed, and why. In the event that it is linter issues, you can run the command `npm run fix-lint` to automagically resolve many (not always every) linter issue. Then you will need to manually fix the remaining ones and go back through steps (2) and (3).

### Descriptions of Useful Git Commands

#### Git Stash
If you have many changes locally and you want to get rid of them ALL (but save them away just-in-case)
  - `git stash`

If you recently ran `git stash` but you now regret that decision and want the stuff back
  - `git stash pop`


### What is a linter
A dependency called eslint is used in this repository. Its single purpose is to enforce code formatting (i.e. tabs should be 4 spaces, not 2) and simple coding best-practices (i.e. no unused variables).

These "lint rules" are then ran to analyze the code during the CI/CD build and if ANY lint rules are broken (i.e. a file contains used 2 spaces instead of 4 for its indentation), the entire build will be marked as failing.

You can run these "lint rules" against your code locally manually to see if you have broken any using the command `npm run lint`. That command will generate human-readable messages that tell you exactly whcih lint rules were broken and where. If that command runs and no text is displayed describing the errors, that means you don't have any ????.

### What and Where are the Tests
This repo contains many tests which all live in the folder named `test` (pretty logical eh?). The tests in this folder mimick much of the `application` folder structure. To manually run all of the tests locally, execute the command `npm run test`. That command will then execute every test in the `test` folder, and give a human-readable-ish explaination of which tests failed or passed. If any tests fail, you will need to investigate which of your code changes caused the test to fail.
