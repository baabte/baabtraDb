db.system.js.save({
    "_id" : "fnEvaluateAnswer",
    "value" : function (userCourseMappingId, element, elementOrder) {
    try {
        var course = db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseMappingId)});
        var keyArray = elementOrder.split(".");
        var oldElement = course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]];
        var result = "Added";
        var temp = {};
        if (oldElement.markScored > 0) {
            course.markScored = course.markScored - oldElement.markScored;
            result = "Updated";
        }
        if (course.markSheetElements) {
            if (course.markSheetElements.indexOf(elementOrder) != -1) {
                var syllabusKeyArray = element.syllabus.key.split(".");
                var syllabusObj = course.syllabus;
                for (var key in syllabusKeyArray) {
                    if (syllabusObj[syllabusKeyArray[key]]) {
                        syllabusObj = syllabusObj[syllabusKeyArray[key]];
                    }
                }
                if (element.markScored) {
                    var markElemCount = 0;
                    for (var elem in syllabusObj.element) {
                        if (course.markSheetElements.indexOf(syllabusObj.element[elem]) != -1) {
                            markElemCount++;
                        }
                    }
                    if (element.markScored == oldElement.markScored) {
                        oldElement.markScored = 0;
                    }
                    if (!syllabusObj.mark.markScored) {
                        syllabusObj.mark.markScored = 0;
                    }
                    syllabusObj.mark.markScored = syllabusObj.mark.markScored + (element.markScored - (oldElement.markScored?oldElement.markScored:0)) / element.totalMark * syllabusObj.mark.maxMark / (markElemCount ? markElemCount : 1);
                }
            }
        }
        if (element.markScored) {
            course.markScored = course.markScored + element.markScored;
        }
        course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]] = element;
        db.clnUserCourseMapping.save(course);
        return {result:result};
    } catch (err) {
        return {result:"Wrong operation"};
    }
}
});


