/*
Modified by:Lijin
Date:19-2-2015
purpose: Added feature for calculating total mark of the course

Modified By: Lijin
Date: 05-03-2015
purpose: For retaining order of element on updation
*/

db.system.js.save({_id:'fnAddCourseTimelineElement',
value:function (courseId, courseElement) {
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
    var order = -1;
  

  for(tmpOrder in course[0].elementOrder){
    var orderKeys=course[0].elementOrder[tmpOrder].split('.');
    if(orderKeys[0]==tlPoint){
      order=tmpOrder>order?tmpOrder:order;  
    }
    
  }
  order=(order*1);
  var previousElem = tlPoint+'.'+elemType+'.'+innerIndex;
  for(curOrder in course[0].elementOrder){
    curOrder=(curOrder*1);
     if(curOrder>=order){

             var elemToCopy=previousElem;
             previousElem=course[0].elementOrder[curOrder+1];
                     
                     
                      if(typeof elemToCopy != 'undefined'){
                         var keyArr=elemToCopy.split('.');
                       var tmpTlPoint=keyArr[0];
                       var elementName=keyArr[1];
                       var elemIndex=keyArr[2];
                         course[0].courseTimeline[tmpTlPoint][elementName][elemIndex].order=curOrder+1;
                         course[0].elementOrder[curOrder+1]=elemToCopy;    
                      }
     }    
    }

    if (!course[0].elementOrder) {
        course[0].elementOrder = {};
    }

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
        if (elements[looper].type == "question-viewer" || elements[looper].type == "question-group-viewer") {
            totalMark = totalMark + elements[looper].value.mark.totalMark;
        }
    }
    course[0].totalMark = currentMark + totalMark;
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
    db.clnCourses.save(course[0]);
    return course;}});