/*
Created by Lijin
Created Date:13-5-2015
Purpose: to pull syllabus of course using course Id

*/


db.system.js.save({
    "_id" : "fnGetCourseSyllabus",
    "value" : function(courseId) {
    course=db.clnCourses.findOne({_id:ObjectId(courseId)},{syllabus:1,courseTimeline:1,markSheetElements:1});
  return {syllabus:course.syllabus,courseTimeline:course.courseTimeline,markSheetElements:course.markSheetElements};
}
})