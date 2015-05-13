/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For remove course element from course timeline

Modified by:Lijin
Date:20-2-2015
purpose: Added feature for re-calculating total mark of the course

Modified By: Lijin
Date: 05-03-2015
purpose: For retaining order of element on updation

Modified By: Arun
Date: 04-05-2015
purpose: for returning the element order back to front end 

Modified By: Lijin
Date: 13-05-2015
purpose: added assignment-question-viewer

Modified By: Jihin
Date: 13-05-2015
purpose:  Added syllabus in element level

Modified By: Arun
Date: 14-05-2015
purpose:  total mark calculation in element delete

*/

db.system.js.save({
    "_id" : "fnRemoveCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, index, rmId) {
    var key = "courseTimeline." + tlPoint + "." + courseElemName;
    var obj = {};
    obj[key] = index;
    var objProjection = {};
    objProjection[key] = 1;
    objProjection['syllabus'] = 1;
    objProjection._id = 0;
    var oldCourse = db.clnCourses.findOne({_id:courseId}, objProjection);
    var removedOrder = oldCourse.courseTimeline[tlPoint][courseElemName][index].order * 1;
    var oldElements = oldCourse.courseTimeline[tlPoint][courseElemName][index].elements;
    var markToDeduct = 0;
    for (indexKey in oldElements) {
        if (oldElements[indexKey].type == "question-viewer" ||
            oldElements[indexKey].type == "question-group-viewer" ||
            oldElements[indexKey].type == "assignment-question-viewer"||
            oldElements[indexKey].type == "random-question-exam-viewer") {
            markToDeduct = markToDeduct + oldElements[indexKey].value.mark.totalMark;
        }
    }
    
    var syllabusKeyArray = oldCourse.courseTimeline[tlPoint][courseElemName][index].syllabus.key.split('.');
    
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
    
      
      syllabusObj=course.syllabus;
        for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
        
      for(var indx in syllabusObj.element){
          if(syllabusObj.element[indx]==tlPoint+'.'+courseElemName+'.'+index){
             syllabusObj.element.splice(indx,1);
          }
         }
    
    db.clnCourses.save(course);
    return course.elementOrder;
}
});
