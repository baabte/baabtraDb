/*
Created by : Lijin
Date: 6-3-2015
Purpose: for loading current course element for candidate course full view

Edited by Anoop on 22nd April 2015 for returning the course assigned date too

Edited by Arun on 10th June 2015 to fix error when manual material assignment

Edited by Jihin on 17th June 2015 to fix error when element order undefined
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
            lastViewedOrder = parseInt(course.lastViewedOrder);
        }else{
           var keyArray= Object.keys(course.elementOrder);
           lastViewedOrder=keyArray[0]*1;
        }
        switch (direction) {
          case "":
            lastViewedOrder = lastViewedOrder;
            break;
          case "next":
            lastViewedOrder = parseInt(lastViewedOrder);
            if (course.elementOrder[lastViewedOrder + 1] == undefined) {
                var elementOrderArray = Object.keySet(course.elementOrder);
                elementOrderArray = elementOrderArray.sort(function(a, b){return a-b});
                var indexOfElementOrder = elementOrderArray.indexOf(lastViewedOrder+'')+1;
                lastViewedOrder =  elementOrderArray[indexOfElementOrder];
            }
            else{
                lastViewedOrder = parseInt(lastViewedOrder) + 1;
            }
            break;
          case "previous":
            lastViewedOrder = parseInt(lastViewedOrder);
            if (course.elementOrder[lastViewedOrder - 1] == undefined) {
                var elementOrderArray = Object.keySet(course.elementOrder);
                elementOrderArray = elementOrderArray.sort(function(a, b){return a-b});
                var indexOfElementOrder = elementOrderArray.indexOf(lastViewedOrder+'')-1;
                lastViewedOrder =  elementOrderArray[indexOfElementOrder];
            }
            else{
                lastViewedOrder = parseInt(lastViewedOrder) - 1;
            }
            break;
          default:;
        }
        course.lastViewedOrder = parseInt(lastViewedOrder);
        if (course.elementOrder[lastViewedOrder]) {
            elemArray = course.elementOrder[lastViewedOrder].split(".");
            tlPoint = elemArray[0];
            var elemType = elemArray[1];
            var innerIndex = elemArray[2];
            element = course.courseTimeline[tlPoint][elemType][innerIndex];
            db.clnUserCourseMapping.save(course);

        } else {
            lastElement = true;
        }
        return {tlPoint:tlPoint, selectedDuration:selectedDuration, totalMark:totalMark, markScored:markScored, element:element, courseId:course.fkCourseId, lastViewedOrder:lastViewedOrder, lastElement:lastElement, courseAssignedDate: courseAssignedDate };
    } else {
        return "error";
    }
}});
