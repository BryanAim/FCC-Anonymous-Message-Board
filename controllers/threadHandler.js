const ObjectId = require('mongodb').ObjectID;

function ThreadHandler() {
  this.newThread = function(req, res) {
    const db = app.locals.db // mongodb
    const board = req.params.board;

    let thread  = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      delete_password: req.body.delete_password,
      reported: false,
      replies: []
    };

    db.collection('board').insertOne(thread, (err, data) => {
      if (!err) {
        res.redirect('/b/'+board+'/')
      }
    })
  }

  this.threadList = function(req, res) {
    const db = req.app.locals.db //mongodb
    let board = req.params.board;
    let project = {
      delete_password: 0,
      reported: 0,
      'replies.delete_password': 0,
      'replies.reported': 0
    };

    db.collection('board')
    .find({})
    .project(project)
    .sort({bumped_on: -1})
    .limit(10)
    .toArray((err, data)=> {
      if (!err) {
        for (const index in data) {
          data[index].replycount = data[index].replies.length;
          if (data[index].replies.length>3) {
            data[index].replies = data[index].replies.slice(0, 3); // limit 3 replies
            
          }
        }
        res.json(data)
      }
    });
  }

  this.reportThread = function(req, res) {
    const db = req.app.locals.db;
    let id = req.body.thread_id;
    let board = req.params.board;

    db.collection('board')
    .findOneAndUpdate(
      {_id: ObjectId(id)},
      {$set: {reported: true}},
      (err, doc) => {
        (err) ? res.send('report failed') : res.send('success')
      }
    )
  }

  this.deleteThread = async function (req, res) {
    const db = req.app.locals.db;
    let board = req.params.board;
    let password = req.body.delete_password;
    let id = req.body.thread_id;

    let response = await db.collection('board').deleteOne({_id: ObjectId(id), delete_password: password});

    if (response) {
      if (response.deletedCount > 0) {
        res.send('success');
      } else {
      res.send('incorrect password')
    }
   }
  }

}

module.exports = ThreadHandler;