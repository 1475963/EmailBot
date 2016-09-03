# EmailBot
Jeopardy bot<br />
You can play jeopardy by email, just send one that follows the use cases bellow at the address: bob.sanders.belair@gmail.com<br />
You might even learn new chuck norris jokes !<br />

# Host your own server
* Download the jeopardy database (50mo) such file size cannot be (or partially) uploaded on github.<br />
JSON file here: https://www.reddit.com/r/datasets/comments/1uyd0t/200000_jeopardy_questions_in_a_json_file/ <br />
* Place this json under the folder "/data/"<br />
* Edit your own config.json file under "/src/" in such a way:<br />
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
* Retrieve & update the project dependencies: "npm install"
* Run ! "node /src/server.js

# Use cases

