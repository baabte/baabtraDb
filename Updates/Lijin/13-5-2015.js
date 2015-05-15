db.system.js.save({
    "_id" : "fnGetCourseSyllabus",
    "value" : function(courseId) {
    course=db.clnCourses.findOne({_id:ObjectId(courseId)},{syllabus:1,courseTimeline:1,markSheetElements:1});
  return {syllabus:course.syllabus,courseTimeline:course.courseTimeline,markSheetElements:course.markSheetElements};
}
});

db.system.js.save({_id:'fnSaveMarksheetElements',value:function(courseId,markSheetElements){
  db.clnCourses.update({_id:ObjectId(courseId)},{$set:{markSheetElements:markSheetElements}}); 
}});

db.system.js.save({
    "_id" : "fnGetCandidateDetailsForCertificate",
    "value" : function(rmId,courseId) {
    var tmp;    
    var returnObj={};
    var userCD = fnLoadUserCourseDetails([rmId],courseId)[0];
        returnObj.syllabus=userCD.syllabus;
    var userCourseMapping = db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(rmId),fkCourseId:ObjectId(courseId),activeFlag:1});
    var companyDetails = db.clnCompany.findOne({_id:userCourseMapping.fkCompanyId},{_id:0,appSettings:0,fkuserLoginId:0,activeFlag:0});
        returnObj.companyDetails = companyDetails;
    if(userCourseMapping.batchCourseMappingId){
        returnObj.attendance=db.clnCandidateAttendance.find({fkUserRoleMappingId:ObjectId(rmId),courseId:courseId,batchMappingId:userCourseMapping.batchCourseMappingId.valueOf(),activeFlag:1},{status:1,_id:0}).toArray();
    }
    
    var userDetails = fnLoadUserCardDetail(rmId);
        returnObj.userDetails=userDetails;
    
    return returnObj;
}
});

db.system.js.save({
    "_id" : "fnEvaluateAnswer",
    "value" : function (userCourseMappingId, element, elementOrder) {
    var course = db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseMappingId)});
    var keyArray = elementOrder.split(".");
    var oldElement = course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]];
    var result = "Added";
     if(oldElement.markScored > 0){
                course.markScored = course.markScored - oldElement.markScored;
                result = "Updated"
       }
    if (course.markSheetElements) {
        
        if (course.markSheetElements.indexOf(elementOrder) != -1) {
            var syllabusKeyArray = element.syllabus.key.split(".");
            var syllabusObj = course.syllabus;
            for (var key in syllabusKeyArray) {
                syllabusObj = syllabusObj[syllabusKeyArray[key]];
            }
            
            if(element.markScored){
                    if (!syllabusObj.mark.markScored) {
                syllabusObj.mark.markScored = 0;
            }
            syllabusObj.mark.markScored = syllabusObj.mark.markScored + (element.markScored - oldElement.markScored) / element.totalMark * syllabusObj.mark.maxMark / syllabusObj.element.length;
            }
            
        }
    }
        if(element.markScored){
        course.markScored = course.markScored + element.markScored;
        }
        
        course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]] = element;
        
        db.clnUserCourseMapping.save(course);
        
        return {result:result};
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
