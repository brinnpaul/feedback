'use strict';
var router = require('express').Router();
var db = require('../../database');
var Lecture = db.model('lecture');

router.param('lectureId', function(req, res, next, id) {
  Lecture.findById(id).then(function(lecture) {
    if (!lecture) res.sendStatus(404)
    req.lecture = lecture;
    next()
  }).catch(next);
})

router.get('/', function (req, res, next) {
  Lecture.findAll()
  .then(function(result){
      res.json(result);
  }).catch(next);
});

router.get('/instructor', function (req, res, next) {
  Lecture.findAll({
    where: {
      userId: req.user.id
    }
  }).then(function(lectures) {
    res.json(lectures)
  }).catch(next);
})

router.get('/current', function (req, res, next) {
  res.json(req.session.lecture)
});

router.get('/:lectureId', function (req, res, next) {
  res.json(req.lecture)
});


router.post('/', function(req, res, next) {
  req.body.userId = req.user.id;
  Lecture.create(req.body)
  .then(function(result){
      var io = req.app.get('socketio');    
      io.emit('lectureChange');
      req.session.lecture = result;
      res.json(result);
  }).catch(next);
});

router.put('/:lectureId', function(req, res, next) {
  var io = req.app.get('socketio');
  req.lecture.update(req.body)
  .then(function(updatedLecture) {
    if (req.body.startTime) {
      io.emit('startLecture', updatedLecture);
    }
    else if (req.body.endTime) {
      io.emit('endLecture', updatedLecture);
    }
    res.status(201).json(updatedLecture)
  }).catch(next);
});

router.delete('/:lectureId', function (req, res, next) {
  req.lecture.destroy()
  .then(() => {
    var io = req.app.get('socketio');
    io.emit('lectureChange');
    res.sendStatus(204);
  }).catch(next);
});

module.exports = router;
