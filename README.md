# challenge-2021
Back-end developer challenge 2021

## Challenge details
An integration tool that loads data from a CSV file, schedules some email communications, and then executes automated tests to ensure all data and logic was executed correctly.

### Requirements
1. Create a node.js project to loads the above data into a Patients collection in MongoDB. The collection will include all the data stored in the input data file. 
2. Create logic that schedules emails for every patient that has CONSENT=Yes.
    - All emails should be stored in an Emails collection
    - Each email should have an id, name, and scheduled_date
    - Create multiple emails with the following information:
      - Name: "Day 1", scheduled_date: NOW+1 day
      - Name: "Day 2", scheduled_date: NOW+2 days
      - Name: "Day 3", scheduled_date: NOW+3 days
      - Name: "Day 4", scheduled_date: NOW+4 days

## Solution
Parse csv data in stream using stream csv parser and load necessary data to mongo database. This solution provides us an ability to extract, transform and load large csv datasets with little memory footprint.

## How to run it
1. Clone the code
   ```shell
   git clone git@github.com:russellswift/challenge-2021.git
   ```
2. Run the task using `docker-compose`
   ```shell
   docker-compose up
   ```
3. Task will complete. To test it do not stop mongo container and follow the next steps

## How to test
1. Install dependencies
   ```shell
   npm install
   ```
2. Run tests
   ```shell
   npm test
   ```
   or
   ```shell
   npm run test-ci
   ```
   The last one will save report into file: `output/report.xml`
3. Explore test results. You will find extended info about Patient IDs where the first name is missing and Patient IDs where the email address is missing there.
