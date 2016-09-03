# EmailBot
Jeopardy bot<br />
You can play jeopardy by email, just send one that follows the use cases bellow at the address: bob.sanders.belair@gmail.com<br />
You might even learn new chuck norris jokes !<br />

# Host your own server
* Download the jeopardy database (50mb) such file size cannot be (or partially) uploaded on github.<br />
JSON file here: https://www.reddit.com/r/datasets/comments/1uyd0t/200000_jeopardy_questions_in_a_json_file/ <br />
* Place this json under the folder "/data/"<br />
* Add and edit your own config.json file at the repository root in such a way:<br />
```javascript
{
    "name": "xxx",
    "email": "xxx@gmail.com",
    "username": "xxx@gmail.com",
    "password": "yyy",
    "imap": {
        "host": "imap.gmail.com",
        "port": 993,
        "secure": true
    },
    "smtp": {
        "host": "smtp.gmail.com",
        "ssl": true
    }
}
```
* Retrieve & update the project dependencies: "npm install"<br />
* Run ! "node app.js"<br />

# Use cases
* Say something, whatever -> The bot reminds you that its purpose is to play Jeopardy and tells you a joke !<br />
* Ask for a question, Subject: Question, Body: whatever -> The bot sends you one of his 200k+ questions from any category.<br />
* Answer to a question, Subject: Response - #ID, #ID being an id (between 0 and 200k+) sent in the subject of the bot's previous mail, Body: a question from jeopardy with its category and value in dollars.<br />
* Surrender a question, Subject: Response - #ID, #ID being an id (between 0 and 200k+) sent in the subject of the bot's previous mail, Body: the answer to the question refered by the #ID.<br />

# Future work & improvements
* Handle multi-client and session save with MongoDB.<br />
* Score memory, still need a database such as MongoDB.<br />
