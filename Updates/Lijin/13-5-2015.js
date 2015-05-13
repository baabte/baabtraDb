db.system.js.save({
    "_id" : "fnGetCourseSyllabus",
    "value" : function(courseId) {
    course=db.clnCourses.findOne({_id:ObjectId(courseId)},{syllabus:1,courseTimeline:1});
  return {syllabus:course.syllabus,courseTimeline:course.courseTimeline};
}
});


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

db.system.js.save({
    "_id" : "fnEditCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, elemObjToSave, rmId) {
    
    var innerIndex = elemObjToSave.index;
    var courseObj = elemObjToSave.element;
    
    
    var key = "courseTimeline." + tlPoint + "." + courseElemName;
    var obj = {};
    obj[key] = courseObj;
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var order = course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order;
    var totalMark = 0;
    var oldTotalMark = 0;
    var newTotalMark = 0;
    var oldElements = course[0].courseTimeline[tlPoint][courseElemName];
    var looper = 0;
    if (course[0].totalMark) {
        totalMark = course[0].totalMark;
    }
    for (index in oldElements) {
        for (looper = 0; looper < oldElements[index].elements.length; looper++) {
            if(oldElements[index].elements[looper] != null){
                if (oldElements[index].elements[looper].type == "question-viewer" ||
                    oldElements[index].elements[looper].type == "question-group-viewer"||oldElements[index].elements[looper].type == "assignment-question-viewer") {
                    oldTotalMark = oldTotalMark + oldElements[index].elements[looper].value.mark.totalMark;
                }
            }
        }
    }
    for (looper = 0; looper < courseObj.elements.length; looper++) {
        if(oldElements[index].elements[looper] != null){
            if (courseObj.elements[looper].type == "question-viewer" ||
                courseObj.elements[looper].type == "question-group-viewer"||courseObj.elements[looper].type == "assignment-question-viewer") {
                newTotalMark = newTotalMark + courseObj.elements[looper].value.mark.totalMark;
            }
        }
    }
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex] = courseObj;
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order = order;
    course[0].totalMark = totalMark + (newTotalMark - oldTotalMark);
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + (newTotalMark - oldTotalMark);
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex].totalMark=newTotalMark;
    db.clnCourses.save(course[0]);
    return course;
}
});


db.system.js.save({
    "_id" : "fnRemoveCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, index, rmId) {
    var key = "courseTimeline." + tlPoint + "." + courseElemName;
    var obj = {};
    obj[key] = index;
    var objProjection = {};
    objProjection[key] = 1;
    objProjection._id = 0;
    var oldCourse = db.clnCourses.findOne({_id:courseId}, objProjection);
    var removedOrder = oldCourse.courseTimeline[tlPoint][courseElemName][index].order * 1;
    var oldElements = oldCourse.courseTimeline[tlPoint][courseElemName][index].elements;
    var markToDeduct = 0;
    for (indexKey in oldElements) {
        if (oldElements[indexKey].type == "question-viewer" ||
            oldElements[indexKey].type == "question-group-viewer" || oldElements[indexKey].type == "assignment-question-viewer") {
            markToDeduct = markToDeduct + oldElements[indexKey].value.mark.totalMark;
        }
    }
    db.clnCourses.update({_id:courseId}, {$pop:obj});
    var a = db.clnCourses.findOne({_id:courseId});
    if (!a.courseTimeline[tlPoint][courseElemName].length) {
        b = a.courseTimeline[tlPoint][courseElemName];
        var unset = {};
        unset[key] = 1;
        db.clnCourses.update({_id:courseId}, {$unset:unset});
        a = db.clnCourses.findOne({_id:courseId});
        if (Object.keys(a.courseTimeline[tlPoint]).length == 0) {
            unset = {};
            unset["courseTimeline." + tlPoint] = 1;
            db.clnCourses.update({_id:courseId}, {$unset:unset});
            b = unset;
        }
    }
    var course = db.clnCourses.findOne({_id:courseId});
    delete course.elementOrder[removedOrder];
    course.totalMark = course.totalMark - markToDeduct;
    course.courseTimeline[tlPoint].totalMark = course.courseTimeline[tlPoint].totalMark - markToDeduct;
    for (order in course.elementOrder) {
        order = order * 1;
        if (order > removedOrder) {
            if (course.elementOrder[order]) {
                var keyArr = course.elementOrder[order].split(".");
                var tmpTlPoint = keyArr[0];
                var elementName = keyArr[1];
                var innerIndex = keyArr[2];
                if (removedOrder != order) {
                    course.courseTimeline[tmpTlPoint][elementName][innerIndex].order = order - 1;
                    course.elementOrder[order - 1] = course.elementOrder[order];
                }
                delete course.elementOrder[order];
            }
        }
    }
    db.clnCourses.save(course);
    return course.elementOrder;
}
});