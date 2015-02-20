db.system.js.save({_id: "fnLoadCourseData",
		value: function (courseId,userLoginIdId) {
    courses = db.clnUserCourseMapping.findOne({"fkUserLoginId" : ObjectId(userLoginId),"fkCourseId":ObjectId(courseId),"activeFlag" : 1},{courseTimeline:1,Duration:1});
    return courses;
}});