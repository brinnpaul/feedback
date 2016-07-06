app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student',
        templateUrl: 'js/views/student/student.html',
        controller: 'StudentCtrl'
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('instructor', {
        url: '/instructor/:lectureId',
        templateUrl: 'js/views/instructor/instructor.html',
        controller: 'InstructorCtrl',
        resolve: {
          curLecture: function(LectureFactory, $stateParams) {
            return LectureFactory.getById($stateParams.lectureId)
            .then(function(lecture) {
              return lecture
            })
          }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary/:lectureId',
        templateUrl: 'js/views/summary/summary.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('lecture', {
        url: '/lecture',
        templateUrl: 'js/views/lecture/lecture.html',
        controller: 'LectureController'
    });
});
