db.system.js.save({_id: "fnEvaluateAnswer",
    value: function (userCourseMappingId, element, elementOrder) {
    var course = db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseMappingId)});
    var keyArray = elementOrder.split(".");
    var oldElement = course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]];
    var result = "Added";
    if (oldElement.markScored > 0) {
        course.markScored = course.markScored - oldElement.markScored;
        result = "Updated";
    }
    if (course.markSheetElements) {
        if (course.markSheetElements.indexOf(elementOrder) != -1) {
            var syllabusKeyArray = element.syllabus.key.split(".");
            var syllabusObj = course.syllabus;
            for (var key in syllabusKeyArray) {
                syllabusObj = syllabusObj[syllabusKeyArray[key]];
            }
            if (element.markScored) {
                if (!syllabusObj.mark.markScored) {
                    syllabusObj.mark.markScored = 0;
                }
                syllabusObj.mark.markScored = syllabusObj.mark.markScored + (element.markScored - oldElement.markScored) / element.totalMark * syllabusObj.mark.maxMark / syllabusObj.element.length;
            }
        }
    }
    if (element.markScored) {
        course.markScored = course.markScored + element.markScored;
    }
    course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]] = element;
    db.clnUserCourseMapping.save(course);
    return {result:result};
}});
