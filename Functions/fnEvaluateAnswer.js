
/*
Updated by Lijin
Date:14-5-2015
purpose:added markcalculation for marksheet


*/





db.system.js.save({
    "_id" : "fnEvaluateAnswer",
    "value" : function (userCourseMappingId, element, elementOrder) {
    var course = db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseMappingId)});
    var keyArray = elementOrder.split(".");
    var oldElement = course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]];
    var result = "Added";
    var temp = "";
    if (oldElement.markScored > 0) {
        course.markScored = course.markScored - oldElement.markScored;
        result = "Updated";
    }
    if (course.markSheetElements) {
        
        if (course.markSheetElements.indexOf(elementOrder) != -1) {
            temp = elementOrder;
            var syllabusKeyArray = element.syllabus.key.split(".");
            var syllabusObj = course.syllabus;
            for (var key in syllabusKeyArray) {
                syllabusObj = syllabusObj[syllabusKeyArray[key]];
            }
            if (element.markScored) {
                var syllabusMarkScoredNew = false;
                if (!syllabusObj.mark.markScored) {
                    syllabusObj.mark.markScored = element.markScored;
                    syllabusMarkScoredNew = true;
                }
                
                //oldElement.markScored = 0;
                
                syllabusObj.mark.markScored = syllabusObj.mark.markScored + (element.markScored - oldElement.markScored) / element.totalMark * syllabusObj.mark.maxMark / (syllabusObj.element.length?syllabusObj.element.length:1);
                
                if (syllabusMarkScoredNew) {
                    syllabusObj.mark.markScored = syllabusObj.mark.markScored - element.markScored;
                }
            }
        }
    }
    if (element.markScored) {
        course.markScored = course.markScored + element.markScored;
    }
    course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]] = element;
    //db.clnUserCourseMapping.save(course);
    return temp;//{result:result};
}
})
