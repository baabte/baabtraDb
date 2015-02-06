/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For edit course element from course timeline
*/

function(courseId, courseElemName, tlPoint, index, rmId) {
	var key = "courseTimeline."+tlPoint+"."+courseElemName;
	var obj = {};
	obj[key] = index;
	db.clnCourses.update({_id:courseId},{$set:obj});
}
