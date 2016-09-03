var maillistener = require("mail-listener2");
var config = require("./config.json")
var jeopardy = require("../data/jeopardy_questions.json")
var nodemailer = require('nodemailer');
var natural = require('natural');
var http = require('http');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.username,
    pass: config.password
  },
  tls:{
      rejectUnauthorized: false
  }
});

var mailOptions = {
  from: '"Jeopardy 👥" <' + config.username + '>',
  to: null,
  subject: 'Jeopardy',
  text: null,
}

var mailListener = new maillistener({
  username: config.username,
  password: config.password,
  host: config.imap.host,
  port: config.imap.port,
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  debug: console.log,
  tlsOptions: { rejectUnauthorized: false },
  markSeen: true,
  /*
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
  */
});

var jokeOptions = {
  host: 'api.icndb.com',
  path: '/jokes/random'
};

function sendMail() {
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
        return console.log(err);
    }
    console.log('Message sent: ' + info.response);
  });
}

mailListener.start();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
  /*
  console.log("got a new mail !");
  console.log("emailParsed", mail);
  console.log("from: ", mail.from.address);
  console.log("subject: ", mail.subject.trim());
  */
  mailOptions["to"] = mail.from;
  if (mail.subject.toLowerCase() == "question") {
    var index = Math.floor(Math.random() * jeopardy.length);
    mailOptions["subject"] += " - " + index.toString() + " !";
    var text = "Category: " + jeopardy[index]["category"] + "\nValue: " + jeopardy[index]["value"] + "\nQuestion: " + jeopardy[index]["question"];
    mailOptions["text"] = text;
//    console.log("text content: ", mailOptions["text"]);
    sendMail();
  }
  else if (mail.subject.toLowerCase().startsWith("response")) {
    var index = parseInt(mail.subject.trim().substring(11));
    if (index >= 0 && index < jeopardy.length) {
      console.log("answer: ", jeopardy[index]["answer"])
      console.log("your answer: ", mail.text);
      var distance = natural.JaroWinklerDistance(jeopardy[index]["answer"], mail.text);
      console.log("jarowinkler distance: ", distance);
      if (distance >= 0.85) {
        mailOptions["text"] = "Our threshold on the Jaro Winkler distance between your answer and the right answer decided that you did good at that question !";
      }
      else {
        mailOptions["text"] = "Retry or ask for a new question !";
      }
    }
    else {
      mailOptions["text"] = "You are refering to an out of range question index";
    }
    sendMail();
  }
  else if (mail.subject.toLowerCase().startsWith("surrender")) {
    var index = parseInt(mail.subject.trim().substring(12));
    if (index >= 0 && index < jeopardy.length) {
      mailOptions["text"] = "You decided to surrender, here's the answer: " + jeopardy[index]["answer"];
    }
    else {
      mailOptions["text"] = "You are refering to an out of range question index";
    }
    sendMail();
  }
  else {
    mailOptions["text"] = "I don't get it, are you trying to have a small talk or do you want to play Jeopardy ?";

    http.get(jokeOptions, function(res) {
      var body = '';

      res.on('data', function(chunk) {
          body += chunk;
      });
      res.on('end', function() {
          var joke = JSON.parse(body);
          mailOptions["text"] += "\nHowever, here's a lil joke for you.\n" + joke.value.joke;
          sendMail();
      });
    });
  }
});
