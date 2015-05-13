/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For edit course element from course timeline

Modified By: Lijin
Date: 19-2-2015
purpose: For re-calculating marks on updation

Modified By: Lijin
Date: 05-03-2015
purpose: For retaining order of element on updation

Modified By: Arun
Date: 21-04-2015
purpose: bug fix in evaluator

Modified By: Lijin
Date: 13-05-2015
purpose: Added totalMark in element level

Modified By: Jihin
Date: 13-05-2015
purpose: Added syllabus in element level

*/

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
                    oldElements[index].elements[looper].type == "question-group-viewer" || oldElements[index].elements[looper].type == "assignment-question-viewer") {
                    oldTotalMark = oldTotalMark + oldElements[index].elements[looper].value.mark.totalMark;
                }
            }
        }
    }
    for (looper = 0; looper < courseObj.elements.length; looper++) {
        if(oldElements[index].elements[looper] != null){
            if (courseObj.elements[looper].type == "question-viewer" ||
                courseObj.elements[looper].type == "question-group-viewer" || courseObj.elements[looper].type == "assignment-question-viewer") {
                newTotalMark = newTotalMark + courseObj.elements[looper].value.mark.totalMark;
            }
        }
    }
    
    //course[0].courseTimeline[tlPoint][courseElemName][innerIndex]
    var syllabusKeyArray = courseObj.syllabus.key.split('.');
    var syllabusObj=course[0].syllabus;
    for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
    syllabusObj.element.push(tlPoint + "." + courseElemName + "." + innerIndex);
      
     syllabusKeyArray = course[0].courseTimeline[tlPoint][courseElemName][innerIndex].syllabus.key.split('.');
      syllabusObj=course[0].syllabus;
    for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
        
      for(var index in syllabusObj.element){
          if(syllabusObj.element[index]==tlPoint+'.'+courseElemName+'.'+innerIndex){
             syllabusObj.element.splice(index,1);
          }
         }
    
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex] = courseObj;
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order = order;
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex].totalMark=newTotalMark;
    course[0].totalMark = totalMark + (newTotalMark - oldTotalMark);
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + (newTotalMark - oldTotalMark);
    db.clnCourses.save(course[0]);
    return course;
}});
