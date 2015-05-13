/*
Modified by:Lijin
Date:19-2-2015
purpose: Added feature for calculating total mark of the course

Modified By: Lijin
Date: 05-03-2015
purpose: For retaining order of element on updation

Modified By: Lijin
Date: 17-04-2015
purpose: bug fix in element order

Modified By: Arun
Date: 21-04-2015
purpose: bug fix in evaluator


Modified By: Lijin
Date: 1-05-2015
purpose: bug fix in adding assignment

Modified By: Arun
Date: 2-04-2015
purpose: returning element order back on element add

Modified By: Lijin
Date: 13-05-2015
purpose: added total marks in element level

*/

db.system.js.save({
    "_id" : "fnAddCourseTimelineElement",
    "value" : function (courseId, courseElement) {
    var keyArray = courseElement.key.split(".");
    var tlPoint = keyArray[0];
    var elemType = keyArray[1];
    var key = "courseTimeline." + courseElement.key;
    var obj = {};
    obj[key] = courseElement[courseElement.key];
    db.clnCourses.update({_id:courseId}, {$push:obj});
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var elements = courseElement[courseElement.key].elements;
    var innerIndex = course[0].courseTimeline[tlPoint][elemType].length - 1;
    var order = 0;
    var gotOrderFlag = false;
    var lastTraversedOrder = 0;
    if (!course[0].elementOrder) {
        course[0].elementOrder = {};
    } else {
        for (tmpOrder in course[0].elementOrder) {
            var orderKeys = course[0].elementOrder[tmpOrder].split(".");
            orderKeys[0] = parseInt(orderKeys[0]);
            tlPoint = parseInt(tlPoint);
            tmpOrder = parseInt(tmpOrder);
            if (orderKeys[0] == tlPoint) {
                gotOrderFlag = true;
                order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
            }
            if (!gotOrderFlag && orderKeys[0] < tlPoint) {
                order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
            }
        }
    }
    var previousElem = "";
    var traversed = false;
    if (course[0].elementOrder[order]) {
        previousElem = course[0].elementOrder[order];
        for (curOrder in course[0].elementOrder) {
            traversed = true;
            curOrder = parseInt(curOrder);
            if (curOrder >= order) {
                var elemToCopy = previousElem;
                var traversingOrder = parseInt(curOrder + 1);
                previousElem = course[0].elementOrder[traversingOrder];
                if (typeof elemToCopy != "undefined") {
                    var keyArr = elemToCopy.split(".");
                    var tmpTlPoint = keyArr[0];
                    var elementName = keyArr[1];
                    var elemIndex = keyArr[2];
                    course[0].courseTimeline[tmpTlPoint][elementName][elemIndex].order = traversingOrder;
                    course[0].elementOrder[traversingOrder] = elemToCopy;
                }
            }
        }
    }
    
    
    
    var syllabusKeyArray = course[0].courseTimeline[tlPoint][elemType][innerIndex].syllabus.key.split('.');
    var syllabusObj=course[0].syllabus;
    for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
       syllabusObj.element.push(tlPoint + "." + elemType + "." + innerIndex);
    
    course[0].courseTimeline[tlPoint][elemType][innerIndex].order = order;
    course[0].elementOrder[order] = tlPoint + "." + elemType + "." + innerIndex;
    var totalMark = 0;
    var looper = 0;
    var currentMark = 0;
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    if (course[0].totalMark) {
        currentMark = course[0].totalMark;
    }
    for (looper; looper < elements.length; looper++) {
        if (elements[looper] != null) {
            if (elements[looper].type == "question-viewer" ||
                elements[looper].type == "question-group-viewer"||elements[looper].type == "assignment-question-viewer") {
                totalMark = totalMark + elements[looper].value.mark.totalMark;
            }
        }
    }
    course[0].totalMark = currentMark + totalMark;
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
    course[0].courseTimeline[tlPoint][elemType][innerIndex].totalMark=totalMark;
    db.clnCourses.save(course[0]);
    return course[0].elementOrder;
}
});