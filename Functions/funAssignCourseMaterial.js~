db.system.js.save({
    "_id" : "funAssignCourseMaterial",
    "value" : function(courseId,urmId,dataObj){
    var userCourseObj=db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(urmId),fkCourseId:ObjectId(courseId),activeFlag:1},{courseImg:0});
  
    for(var key in dataObj){
        if(userCourseObj.courseTimeline==undefined){
            userCourseObj.courseTimeline={};
        }

        if(userCourseObj.courseTimeline[dataObj[key].tlpoint]==undefined){
            userCourseObj.courseTimeline[dataObj[key].tlpoint]={};
        }
        if(userCourseObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType]==undefined){
            userCourseObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType]=[];
        }
        if(userCourseObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]==undefined){
            userCourseObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]={};
        }
         dataObj[key].courseElement.assignedDate=new Date(); //adding the current date as assigned date	
         userCourseObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]=dataObj[key].courseElement;

         tlPoint = dataObj[key].tlpoint;
        elemOrder =  dataObj[key].tlpoint+'.'+dataObj[key].userCourseElementType+'.'+dataObj[key].innerIndex;
        var totalMark = 0;
        var looper = 0;
        var currentMark = 0;
        var tlPointMark = 0;
       
      if(userCourseObj.courseTimeline[tlPoint].totalMark==undefined){
           userCourseObj.courseTimeline[tlPoint].totalMark=0;
       }
        
         if (userCourseObj.courseTimeline[tlPoint].totalMark) {
            tlPointMark = userCourseObj.courseTimeline[tlPoint].totalMark;
        }
        
        if (userCourseObj.totalMark==undefined) {
            userCourseObj.totalMark = 0;
        }
        
        if (userCourseObj.totalMark) {
            currentMark = userCourseObj.totalMark;
        }
        
         if (!userCourseObj.elementOrder) {
           userCourseObj.elementOrder = {};
        }
        
        elemLength=Object.keys(userCourseObj.elementOrder).length;
        //for (var i in userCourseObj.elementOrder){
            userCourseObj.elementOrder[elemLength]=elemOrder;
        //}
        userCourseObj.totalMark = currentMark + totalMark;
        userCourseObj.courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
        db.clnUserCourseMapping.update({fkUserRoleMappingId:ObjectId(urmId),fkCourseId:ObjectId(courseId),activeFlag:1},{$set:{'courseTimeline':userCourseObj.courseTimeline,'elementOrder':userCourseObj.elementOrder}});
        
    }
        
    return  'success';
    
}
});
