/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For edit course element from course timeline
*/

db.system.js.save({_id: "fnEditCourseElement",
		value: function(courseId, courseElemName, tlPoint,courseObj, rmId) {
	var key = "courseTimeline."+tlPoint+"."+courseElemName;
	var obj = {};
	obj[key] = courseObj;
	db.clnCourses.update({_id:courseId},{$set:obj});
        return db.clnCourses.find({_id:courseId}).toArray();
}});
