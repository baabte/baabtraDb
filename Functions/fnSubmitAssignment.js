db.system.js.save({_id: "fnSubmitAssignment",
		value:function (objToBeSaved) {
    var objDetails = objToBeSaved.objDetails;
    var courseMapping = db.clnUserCourseMapping.findOne({_id:ObjectId(objToBeSaved.courseMappingId)});
    var courseElement = courseMapping.courseTimeline[objDetails.tlPointInMinute][objDetails.Name][objDetails.index];
    if (courseElement.markScored == undefined) {
        courseElement.markScored = 0;
    }
    if (objToBeSaved.markScored == undefined) {
        objToBeSaved.markScored = 0;
    }
    var effectiveMark = parseInt(objToBeSaved.markScored) - parseInt(courseElement.markScored);
    courseElement.markScored = parseInt(courseElement.markScored) + effectiveMark;
    if (courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored == undefined) {
        courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored = 0;
    }
    courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored = parseInt(courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored) + effectiveMark;
    if (courseMapping.markScored == undefined) {
        courseMapping.markScored = 0;
    }
    courseMapping.markScored = parseInt(courseMapping.markScored) + effectiveMark;
    courseElement.status = objToBeSaved.status;
    if (objToBeSaved.status == "submitted") {
        courseElement.evalStatus = "Pending Evaluation";
        courseElement.submittedOn = (new Date()).getTime();
    } else {
        courseElement.evalStatus = "";
    }
    courseElement.statusHistory = objToBeSaved.statusHistory;
    courseElement.penaltyHistory = objToBeSaved.penaltyHistory;
    courseElement.lastUpdatedBy = objToBeSaved.lastUpdatedBy;
    db.clnUserCourseMapping.save(courseMapping);
    return {result:"success"};
}});
     
