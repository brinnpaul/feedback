app.factory('LectureFactory', function ($http) {
	var LectureFactory = {};

	LectureFactory.setStart = function () {
		return $http.post('api/lecture/start',{name: "Demo Lecture", lecturer: "Omri", startTime: Math.floor(Date.now()/1000)})
		.then(function(res) {
			return res.data
		})
	}

	LectureFactory.setEnd = function () {
		return $http.post('api/lecture/end')
	}

	return LectureFactory
})
