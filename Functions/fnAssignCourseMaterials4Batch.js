/*

  Created by : Akshath

  Modified by : Lijin
  Date : 8-6-2015
  Purpose:Fix in element order generation

*/


db.system.js.save({
    "_id" : "fnAssignCourseMaterials4Batch",
    "value" : function(batchMappingId,dataObj) {
  //var urmIds=db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId",{batchId:ObjectId(batchId),fkCompanyId:ObjectId(companyId),activeFlag:1}); 

    var batchObj=db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId),activeFlag:1});
    var urmIds=db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId",{_id:ObjectId(batchMappingId),activeFlag:1}); //to get the userRolemappingids list to track the batch mentees 
     for(var key in dataObj){
        if(batchObj.courseTimeline==undefined){
            batchObj.courseTimeline={};
        }

        if(batchObj.courseTimeline[dataObj[key].tlpoint]==undefined){
            batchObj.courseTimeline[dataObj[key].tlpoint]={};
        }
        if(batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType]==undefined){
            batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType]=[];
        }
        if(batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]==undefined){
            batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]={};
        }
	dataObj[key].courseElement.assignedDate=new Date(); //adding the current date as assigned date	
         batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]=dataObj[key].courseElement;

         tlPoint = dataObj[key].tlpoint;
        elemOrder =  dataObj[key].tlpoint+'.'+dataObj[key].userCourseElementType+'.'+dataObj[key].innerIndex;
        var totalMark = 0;
        var looper = 0;
        var currentMark = 0;
        var tlPointMark = 0;
       
      if(batchObj.courseTimeline[tlPoint].totalMark==undefined){
           batchObj.courseTimeline[tlPoint].totalMark=0;
       }
        
         if (batchObj.courseTimeline[tlPoint].totalMark) {
            tlPointMark = batchObj.courseTimeline[tlPoint].totalMark;
        }
        
        if (batchObj.totalMark==undefined) {
            batchObj.totalMark = 0;
        }
        
        if (batchObj.totalMark) {
            currentMark = userCourseObj.totalMark;
        }
        
         if (!batchObj.elementOrder) {
          batchObj.elementOrder = {};
        }
        
        //elemLength=Object.keys(batchObj.elementOrder).length;
        //for (var i in userCourseObj.elementOrder){
            batchObj.elementOrder[dataObj[key].courseElement.order]=elemOrder;
        //}
        batchObj.totalMark = currentMark + totalMark;
        batchObj.courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
        db.clnCourseBatchMapping.update({_id:ObjectId(batchMappingId),activeFlag:1},{$set:{'courseTimeline':batchObj.courseTimeline,'elementOrder':batchObj.elementOrder}});
        //for each user under this batch
        if(batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex].excludeList!=undefined){
          for(var keyNew in urmIds){ //looping through batch users to update timeline obj
              var users= db.clnUserCourseMapping.findOne({fkUserRoleMappingId:urmIds[keyNew],fkCourseId:batchObj.fkCourseId,activeFlag:1});
              var elementInner=batchObj.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex];
                if(elementInner.excludeList.indexOf(urmIds[keyNew].valueOf())==-1){
                    
                    if(users.courseTimeline==undefined){
                        users.courseTimeline={};
                    }

                    if(users.courseTimeline[dataObj[key].tlpoint]==undefined){
                        users.courseTimeline[dataObj[key].tlpoint]={};
                    }
                    if(users.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType]==undefined){
                        users.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType]=[];
                    }
                    if(users.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]==undefined){
                        users.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]={};
                    }
		    dataObj[key].courseElement.assignedDate=new Date(); //adding the current date as assigned date
                    users.courseTimeline[dataObj[key].tlpoint][dataObj[key].userCourseElementType][dataObj[key].innerIndex]=dataObj[key].courseElement;
        
                      if(users.courseTimeline[tlPoint].totalMark==undefined){
                           users.courseTimeline[tlPoint].totalMark=0;
                       }
                        
                         if (users.courseTimeline[tlPoint].totalMark) {
                            users = batchObj.courseTimeline[tlPoint].totalMark;
                        }
                        
                        if (users.totalMark==undefined) {
                            users.totalMark = 0;
                        }
                        
                        if (users.totalMark) {
                            currentMark = users.totalMark;
                        }
                        
                         if (!users.elementOrder) {
                          users.elementOrder = {};
                        }
                        
                        //elemLength=Object.keys(users.elementOrder).length;
                        //for (var i in userCourseObj.elementOrder){
                            users.elementOrder[dataObj[key].courseElement.order]=elemOrder;
                        //}
                        users.totalMark = currentMark + totalMark;
                        users.courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;

                        db.clnUserCourseMapping.update({fkUserRoleMappingId:urmIds[keyNew],fkCourseId:batchObj.fkCourseId,activeFlag:1},{$set:{'courseTimeline':users.courseTimeline,'elementOrder':users.elementOrder}});
                
                }
            }  
        } //if ends here
        
    }
    
    
  
    return 'success';
}
});

