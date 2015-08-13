db.system.js.save({
    "_id" : "fnloadCourses4AssigningCourseMaterialStudent",
    "value" : function (courseId, urmId) {
    var course = db.clnCourses.findOne({_id:ObjectId(courseId)}, {courseTimeline:1, elementOrder:1, Name:1});
    var userCourse = db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(urmId), fkCourseId:ObjectId(courseId), activeFlag:1}, {courseTimeline:1, elementOrder:1});
    return {course:course, userCourse:userCourse};
}
});
