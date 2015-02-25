/*
Modified by:Lijin
Date:19-2-2015
purpose: Added feature for calculating total mark of the course
*/

db.system.js.save({_id: "fnAddCourseTimelineElement",
      value:function(courseId, courseElement) {
    var keyArray=courseElement.key.split('.');
    var tlPoint=keyArray[0];
    var key="courseTimeline."+courseElement.key;
    var obj={};
    obj[key]=courseElement[courseElement.key];
    db.clnCourses.update({_id:courseId},{$push:obj});
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var elements=courseElement[courseElement.key].elements;
    var totalMark=0;
    var looper=0;
    var currentMark=0;
    var tlPointMark=0;
    if(course[0].courseTimeline[tlPoint].totalMark){
        tlPointMark=course[0].courseTimeline[tlPoint].totalMark;
    }
    if(course[0].totalMark){
      currentMark=course[0].totalMark;
    }
    for(looper;looper<elements.length;looper++){
        if(elements[looper].type=='question-viewer'){
            totalMark=totalMark+elements[looper].value.mark.totalMark;
        }
     }
     
     course[0].totalMark=currentMark+totalMark;
     course[0].courseTimeline[tlPoint].totalMark=tlPointMark+totalMark;
     db.clnCourses.save(course[0]);
     
     return course;

    
}});