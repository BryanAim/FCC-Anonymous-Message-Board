const ObjectId = require('mongodb').ObjectID;

function RepliesHandler() {
  this.addReply = function(req, res) {
    const db =req.app.locals.db;
    const board = req.params.board;
    const id = req.body.thread_id;

    let replies = {
      _id: new ObjectId(),
      text: req.body.text,
      created_on: new Date(),
      delete_password: req.body.delete_password,
      reported: false
    }

    db.collection('board').findOneAndUpdate(
      {_id: ObjectId(id)},
      {$push: {replies}, $set: {bumped_on: new Date()}},
      {returnNewDocument: true},
      (err, data) => {
        if (!err) {
          res.redirect('/b/'+board+'/'+id)
        }
      }
    )
  }

  this.replyList = function (req, res) {
    const db = req.app.locals.db; //mongodb
    const board = req.params.board;
    const id = req.query.thread_id;
    let project = {
      delete_password: 0,
      reported: 0,
      'replies.delete_password': 0,
      'replies.reported': 0
    }

    db.collection('board').find({_id: ObjectId(id)})
    .project(project)
    .toArray((err, doc)=> {
      if (!err) {
        res.json(doc[0])
      }
    });
  }

  this.reportReply = async function (req, res) {
    const db = req.app.locals.db;
    let board = req.params.board;
    let threadId = req.body.thread_id;
    let replyId = req.body.reply_id;

    db.collection('board').findOneAndUpdate(
      {
        _id: ObjectId(threadId),
        'replies._id': ObjectId(replyId)
      },
      {$set: {'replies.$.reported': true}},
      (err, doc) => {
        (err) ? res.send('report unsuccessful') : res.send('success');
      }
    )
    
  }

  this.deleteReply = function (req, res) {
    const db = req.app.locals.db;
    let board = req.params.board;
    let password =req.body.delete_password;
    let threadId = req.params.thread_id;
    let replyId = req.body.reply_id;

    db.collection('board').findOneAndUpdate(
      {_id: ObjectId(threadId),
      replies: {$elemMatch: {_id: ObjectId(replyId), delete_password: password}}
      },
      {$set: {'replies.$.text': '[deleted]'}},
      {returnNewDocument: true}
    )
    .then((docs)=> {
      if (docs.value === null) {
        res.send('incorrect password')
      } else {
        res.send('success!')
      }
    }).catch(err=>console.log(err)
    )
  }
}

module.exports = RepliesHandler;