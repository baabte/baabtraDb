

db.system.js.save({_id: "fnFetchCandidateReport",
      value:function (data) {
    courseCount = [];
    var courses = fnfetchCourseList(data);
    courses.forEach(function (course) {courseCount.push({candidateCount:db.clnUserCourseMapping.find({fkCourseId:course._id}).count(), courseName:course.Name});});
    return courseCount;
}
  });