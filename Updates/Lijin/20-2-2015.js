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
     
     return course;}});

db.system.js.save({_id: "fnRemoveCourseElement",
      value:function(courseId, courseElemName, tlPoint, index, rmId) {
    
    var key="courseTimeline."+tlPoint+"."+courseElemName;
    var obj={};
    obj[key]=index;
    var objProjection={};
        objProjection[key]=1;
        objProjection['_id']=0;
    var oldCourse=db.clnCourses.findOne({_id:courseId},objProjection);
    var oldElements=oldCourse.courseTimeline[tlPoint][courseElemName][index].elements;
    var markToDeduct=0;
    for(indexKey in oldElements){
        if(oldElements[indexKey].type=='question-viewer'){
         markToDeduct=markToDeduct+oldElements[indexKey].value.mark.totalMark;
        }
    }
    db.clnCourses.update({_id:courseId},{$pop:obj});
    var a =db.clnCourses.findOne({_id:courseId});
    if(!a.courseTimeline[tlPoint][courseElemName].length){
        b = a.courseTimeline[tlPoint][courseElemName];
        var unset={};
        unset[key]=1;
        db.clnCourses.update({_id:courseId},{$unset:unset});
        a = db.clnCourses.findOne({_id:courseId});
        if(Object.keys(a.courseTimeline[tlPoint]).length == 0){
            unset={};
            unset["courseTimeline."+tlPoint]=1;
            db.clnCourses.update({_id:courseId},{$unset:unset});
            b=unset;
        }
    }
    var course=db.clnCourses.findOne({_id:courseId});
        course.totalMark=course.totalMark-markToDeduct;
        course.courseTimeline[tlPoint].totalMark=course.courseTimeline[tlPoint].totalMark-markToDeduct;
        db.clnCourses.save(course);
    return "courseTimeline."+tlPoint;}});

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
        
return course}});


db.system.js.save({_id: "fnLoadCourseData",
    value: function (courseId,userLoginId,roleid) {if(roleid==3){
        courses = db.clnUserCourseMapping.findOne({"fkUserLoginId" : ObjectId(userLoginId),"fkCourseId":ObjectId(courseId),"activeFlag" : 1},{courseTimeline:1,Duration:1,markScored:1,totalMark:1});
    return courses;
        }
        else{
            courses = db.clnCourses.findOne({"_id" : ObjectId(courseId),"activeFlag" : 1});
            return courses;}}});