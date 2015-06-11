/*
Created by : Lijin
Date: 6-3-2015
Purpose: for loading current course element for candidate course full view

Edited by Anoop on 22nd April 2015 for returning the course assigned date too



*/


db.system.js.save({"_id" : "fnGetCurrentCourseElement",
value:function (userLoginId, courseMappingId, direction) {
    var course = db.clnUserCourseMapping.findOne({_id:ObjectId(courseMappingId), fkUserLoginId:ObjectId(userLoginId), activeFlag:1});
    var lastViewedOrder = 0;
    var elemArray = [];
    var element = {};
    var lastElement = false;
    var totalMark = 0;
    var markScored = 0;
    var tlPoint = "";
    var selectedDuration = 0;
    var courseAssignedDate = "";
    if (course != null) {
        totalMark = course.totalMark;
        //added by Anoop
        courseAssignedDate = course.createdDate;
        selectedDuration = course.selectedDuration;
        if (course.markScored) {
            markScored = course.markScored;
        }
        if (course.lastViewedOrder) {
            lastViewedOrder = course.lastViewedOrder;
        }
        switch (direction) {
          case "":
            lastViewedOrder = lastViewedOrder;
            break;
          case "next":
            lastViewedOrder = lastViewedOrder + 1;
            break;
          case "previous":
            lastViewedOrder = lastViewedOrder - 1;
            break;
          default:;
        }
        course.lastViewedOrder = lastViewedOrder;
        db.clnUserCourseMapping.save(course);
        if (course.elementOrder[lastViewedOrder]) {
            elemArray = course.elementOrder[lastViewedOrder].split(".");
            tlPoint = elemArray[0];
            var elemType = elemArray[1];
            var innerIndex = elemArray[2];
            element = course.courseTimeline[tlPoint][elemType][innerIndex];
        } else {
            lastElement = true;
        }
        return {tlPoint:tlPoint, selectedDuration:selectedDuration, totalMark:totalMark, markScored:markScored, element:element, courseId:course.fkCourseId, lastViewedOrder:lastViewedOrder, lastElement:lastElement, courseAssignedDate: courseAssignedDate };
    } else {
        return "error";
    }
}});
