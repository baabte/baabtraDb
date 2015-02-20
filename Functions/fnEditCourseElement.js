/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For edit course element from course timeline

Modified By: Lijin
Date: 19-2-2015
purpose: For re-calculating marks on updation

*/

db.system.js.save({_id: "fnEditCourseElement",
		value: function(courseId, courseElemName, tlPoint,courseObj, rmId) {
  var key = "courseTimeline."+tlPoint+"."+courseElemName;
  var obj = {};
  obj[key] = courseObj;
  //db.clnCourses.update({_id:courseId},{$set:obj});
        
        var course = db.clnCourses.find({_id:courseId}).toArray();
        var totalMark=0;
        var oldTotalMark=0;
        var newTotalMark=0;
        var oldElements=course[0].courseTimeline[tlPoint][courseElemName];
    var looper=0;
    if(course[0].totalMark){
      totalMark=course[0].totalMark;
    }
    for(index in oldElements){
    for(looper=0;looper<oldElements[index].elements.length;looper++){
        if(oldElements[index].elements[looper].type=='question-viewer'){
            oldTotalMark=oldTotalMark+oldElements[index].elements[looper].value.mark.totalMark;
        }
     }    
    }

    for(index in courseObj){
    for(looper=0;looper<courseObj[index].elements.length;looper++){
        if(courseObj[index].elements[looper].type=='question-viewer'){
            newTotalMark=newTotalMark+courseObj[index].elements[looper].value.mark.totalMark;
        }
     }    
    }
   var tlPointMark=0;
    if(course[0].courseTimeline[tlPoint].totalMark){
        tlPointMark=course[0].courseTimeline[tlPoint].totalMark;
    }
     
     course[0].courseTimeline[tlPoint][courseElemName]=courseObj;
     course[0].totalMark=totalMark+(newTotalMark-oldTotalMark);
     course[0].courseTimeline[tlPoint].totalMark=tlPointMark+(newTotalMark-oldTotalMark);
     db.clnCourses.save(course[0]);
        
return course
}});
