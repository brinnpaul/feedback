'use strict';
var router = require('express').Router();
var db = require('../../database')
var Question = db.model('question')
module.exports = router;

router.param('questionId', function(req, res, next, id) {
	Question.findById(id).then(function(question) {
		if (!question) res.sendStatus(404)
		req.question = question;
		next()
	}).catch(next)
})

router.get('/', function(req, res, next) {
	Question.findAll().then(function(questions){
		res.json(questions);
	}).catch(next)
});

router.post('/', function(req, res, next) {
	Question.create(req.body).then(function(question){
		res.status(201).json(question);
	}).catch(next)
});

router.get('/lecture/:lectureId', function(req, res) {
	Question.findAll({
		where: {
			lectureId: req.params.lectureId
		}
	}).then(function(questions) {
		res.json(req.question);	
	})
});

router.get('/:questionId', function(req, res) {
	res.json(req.question);
});

router.put('/:questionId', function(req, res, next) {
	req.question.update(req.body).then(function(question){
		res.status(200).json(question);
	}).catch(next)
});

router.delete('/:questionId', function(req, res, next) {
	req.question.destroy().then(function(){
		res.sendStatus(204);
	}).catch(next)
});
