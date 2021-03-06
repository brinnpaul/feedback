app.directive('question', function($state, QuestionFactory, LectureFactory) {

    return {
        restrict: 'E',
        scope: {
            admin: '@'
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope, element, attrs) {
            scope.lecture = scope.$parent.curLecture

            QuestionFactory.getAllByLectureId(scope.lecture.id)
            .then(function(questions) {
                scope.questions = questions.filter(function(q) { return q.status === 'open' }).reverse()
            })

            scope.submit = submit;
            scope.delete = deleteQuestion;
            scope.close = close;
            scope.move = emitMove;
            scope.vote = vote;
            scope.saveResponse = saveResponse;

            // event listeners

            socket.on('addQuestion', renderAddQuestion);
            socket.on('deleteQuestion', renderDeleteQuestion);
            socket.on('voting', renderVote);
            socket.on('moving', renderMoveQuestion);
            socket.on('answering', renderQuestionAnswer);

            // scope-related function declarations

            function vote(question, n) {
                question.hasUpvoted = !question.hasUpvoted;
                return QuestionFactory.update(question.id, { upvotes: question.upvotes + n });
            }

            function close(question) { return QuestionFactory.update(question.id, { status: 'closed'}) };
            
            function emitMove(question, n) { socket.emit('move', question, n) };
            
            function deleteQuestion(question) {
                return QuestionFactory.delete(question) 
            };

            function saveResponse(question) {
                question.showResponse = false;
                return QuestionFactory.update(question.id, { answer: question.answer });
            };
            
            function submit() {
                if (scope.newQuestion) {
                    var question = { text: scope.newQuestion, submitTime: Date.now(), upvotes: 0, lectureId: scope.lecture.id };
                    return QuestionFactory.store(question).then(function(q) {
                        scope.newQuestion = null;
                    })
                }
            }

            // helper functions
            function findIndex(question) {
                for (var i = 0; i < scope.questions.length; i++) {
                    if (scope.questions[i].text === question.text) {
                        return i;
                    }
                }
                return -1;
            }

            // event-listener function declarations

            function rerender() { scope.$evalAsync() };
            
            function renderMoveQuestion(question, n) {
                if (question.lectureId === scope.lecture.id) {
                    var index = findIndex(question);
                    if (index+n > -1 && index+n < scope.questions.length) {
                        scope.questions.splice(index, 1);
                        scope.questions.splice(index+n, 0, question);
                    }
                    rerender();
                }
            };

            function renderVote(question) {
                if (question.lectureId === scope.lecture.id) {
                    var index = findIndex(question);
                    scope.questions[index].upvotes = question.upvotes;
                    rerender();
                }
            }

            function renderDeleteQuestion(question) {
                if (question.lectureId === scope.lecture.id) {
                    scope.questions.splice(index, 1);
                    var index = findIndex(question);
                    rerender();
                }
            }

            function renderAddQuestion(question) {
                if (question.lectureId === scope.lecture.id) {
                    scope.questions.unshift(question);
                    if (scope.admin) {
                        var newNotification = new Notification("New Question", {body: question.text, tag: "question"});
                        setTimeout(newNotification.close.bind(newNotification), 2000);
                    }
                    rerender();
                }
            }

            function renderQuestionAnswer(question) {
                if (question.lectureId === scope.lecture.id) {
                    var index = findIndex(question);
                    scope.questions[index].answer = question.answer;
                    rerender();
                }
            }

        }
    }
});
