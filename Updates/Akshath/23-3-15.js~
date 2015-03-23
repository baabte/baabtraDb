db.system.js.save({
    "_id" : "fnLoadBatchesForView",
    "value" : function(companyId,firstId,type,lastId,searchKey) {
    var batches,resultObj;
    var count=0;
    var first,last;
    resultObj={};
    if(searchKey==""){
    if(type=='initial'){
        batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1}).limit(9).sort({_id:-1}).toArray();
}else if(type=='next'){
	batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}}).limit(9).sort({_id:-1}).toArray();

}else if(type=='prev'){
	batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(firstId)}}).limit(9).sort({_id:1}).toArray();
}

}else{
	batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,$text:{$search:searchKey}}).limit(9).sort({_id:-1}).toArray();

}

         if(batches.length!=0){       
          if(type=='prev'){

               first=batches[batches.length-1]._id;
             last=batches[0]._id;
             batches.reverse();
           }else{

             first=batches[0]._id;
             last=batches[batches.length-1]._id;
          } 
    }else{   
         if(type=='prev'){
          first=ObjectId(firstId);  
          last =ObjectId(lastId);
         }else if(type=='next'){
           first=ObjectId(lastId);  
          last=ObjectId(firstId);   
         }else{
             first=[];
             last=[];
         }   
    }
    while(batches.length>count){
        var batch=db.clnBatches.findOne({_id:batches[count].batchId});
        batches[count].totalJoining=batch.seats-batches[count].seats;
       
        count++;
   }
    //resultObj.batchList=[];
    resultObj.batchList=batches;
    resultObj.firstId=first;
    resultObj.lastId=last;     
    return resultObj;
}
});

/*-------------------------2--------------------------------------*/

db.system.js.save({
    "_id" : "fnLoadMenteesForView",
    "value" : function(companyId,firstId,type,lastId,searchKey) {
   var result;
    var resultObj={};
    var count=0;
    var UserData;
    var first,last;
    
    if(searchKey==''){
                if(type=='initial'){
                    result=db.clnUserCourseMapping.find({fkCompanyId:ObjectId(companyId)},{courseImg:0}).limit(12).sort({_id:-1}).toArray();
                }
                else if(type=='next'){
                    result=db.clnUserCourseMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{courseImg:0}).limit(12).sort({_id:-1}).toArray();
                    }
               else if(type=='prev'){
                    result=db.clnUserCourseMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(firstId)}},{courseImg:0}).limit(12).sort({_id:1}).toArray();
                    }
                   
                    while(result.length>count){
                        var rowRes=result[count];
                        result[count].profile={};
                        result[count].profile=db.clnUserDetails.findOne({fkUserLoginId:rowRes.fkUserLoginId},{profile:1,_id:0});
                        var userName=db.clnUserLogin.findOne({_id:rowRes.fkUserLoginId},{_id:0,userName:1});
                        result[count].username=userName;
                       count++;
                        }
         }
         else{
				result=[];
				users=db.clnUserDetails.find({$text:{$search:searchKey},activeFlag:1}).toArray();
				while(users.length>count){
					var userName=db.clnUserLogin.findOne({_id:users[count].fkUserLoginId},{_id:0,userName:1});
					detail=db.clnUserCourseMapping.findOne({fkUserLoginId:users[count].fkUserLoginId,activeFlag:1},{courseImg:0});
					detail.profile={};
                                        detail.profile.profile=users[count].profile;
                                        detail.username=userName;
                                        result.push(detail);
					count++;
				}

		}
                                                                     if(result.length!=0){       
                      if(type=='prev'){

                           first=result[result.length-1]._id;
                         last=result[0]._id;
                         result.reverse();
                       }else{

                         first=result[0]._id;
                         last=result[result.length-1]._id;
                      } 
                }else{   
                     if(type=='prev'){
                        first=ObjectId(firstId);  
                        last =ObjectId(lastId);
                     }else if(type=='next'){
                        first=ObjectId(lastId);  
                        last=ObjectId(firstId);   
                     }else{
                         first=[];
                         last=[];
                     }   
                }
                
    resultObj.userList=result;
    resultObj.firstId=first;
    resultObj.lastId=last;     
    return resultObj;
}

});

/*--------------------------------3-------------------------------------*/


db.system.js.save({
    "_id" : "fnloadCourses4AssigningCourseMaterial",
    "value" : function(companyId,urmId){
        var result;
        result=db.clnUserCourseMapping.find({fkUserRoleMappingId:ObjectId(urmId),fkCompanyId:ObjectId(companyId),activeFlag:1},{Name:1,_id:1,fkCourseId:1}).toArray();
        var existingCourseObj=db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(urmId),fkCompanyId:ObjectId(companyId),activeFlag:1},{courseImg:0});
        userDetails={};
        userDetails.profile=db.clnUserDetails.findOne({fkUserLoginId:existingCourseObj.fkUserLoginId,activeFlag:1},{profile:1,_id:0});
        userDetails.username=db.clnUserLogin.findOne({_id:existingCourseObj.fkUserLoginId,activeFlag:1},{userName:1,_id:0});
        userDetails.Name=existingCourseObj.Name;
        return {courseList:result,courseObj:existingCourseObj,profile:userDetails};
}
});

/*----------------------4----------------------------------------*/



db.system.js.save({
    "_id" : "fnLoadCourseMaterialsById",
    "value" : function(courseId,urmId) {
    var courseDetails = db.clnCourses.findOne({_id:courseId,activeFlag:1},{courseImg:0});
    currentCourseTimeLine=db.clnCourses.findOne({_id:courseId,activeFlag:1},{courseTimeline:1,_id:0});
    existingTimeLine=db.clnUserCourseMapping.findOne({fkCourseId:courseId,fkUserRoleMappingId:urmId,activeFlag:1},{courseTimeline:1,_id:0});
    m=[];  
    var j=0;
    userCourseElementlist=[];
    temp={};
        //looping through the coursetimeline of a user
        for(var Etlpoint in existingTimeLine.courseTimeline){
     	   for(var EuserCourseElementType in existingTimeLine.courseTimeline[Etlpoint]){
                if(typeof existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType]=='object'){
                    for(var EinnerIndex in existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType]){
                        if(existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].code!=null){
                            userCourseElementlist.push(currentCourseTimeLine.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].code)
                            
                            
                        }
                    }
                }
             }
     	}
        //looping through the current course time line
        for(var tlpoint in currentCourseTimeLine.courseTimeline){
     	   for(var userCourseElementType in currentCourseTimeLine.courseTimeline[tlpoint]){
                if(typeof currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType]=='object'){
                    for(var innerIndex in currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType]){
                        if(currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType][innerIndex].code!=null){
                           
                            if(userCourseElementlist.indexOf(currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType][innerIndex].code) == -1){
                              
                                    temp[tlpoint]=currentCourseTimeLine.courseTimeline[tlpoint]; //.courseTimeline[tlpoint]
                              
                            }
                        }
                    }
                }
             }
     	}
        delete courseDetails.courseTimeline; //deleting existing object
        courseDetails.courseTimeline={};
        courseDetails['courseTimeline']=temp; //copying the current object which contain tlpoint along with course material which is not exist in user timeline
    return courseDetails;
}
});


/*------------------5-----------------------------*/

db.system.js.save({
    "_id" : "fnloadCourses4AssigningCourseMaterial",
    "value" : function(companyId,urmId){
        var result;
        result=db.clnUserCourseMapping.find({fkUserRoleMappingId:ObjectId(urmId),fkCompanyId:ObjectId(companyId),activeFlag:1},{Name:1,_id:1,fkCourseId:1}).toArray();
        var existingCourseObj=db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(urmId),fkCompanyId:ObjectId(companyId),activeFlag:1},{courseImg:0});
        userDetails={};
        userDetails.profile=db.clnUserDetails.findOne({fkUserLoginId:existingCourseObj.fkUserLoginId,activeFlag:1},{profile:1,_id:0});
        userDetails.username=db.clnUserLogin.findOne({_id:existingCourseObj.fkUserLoginId,activeFlag:1},{userName:1,_id:0});
        userDetails.Name=existingCourseObj.Name;
        return {courseList:result,courseObj:existingCourseObj,profile:userDetails};
}
});




db.system.js.save({
    "_id" : "fnLoadBatchMenteeList",
    "value" : function(companyId,batchMappingId) {
    var count=0;
    var batchObj=db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId),fkCompanyId:ObjectId(companyId),activeFlag:1});
    var urmIds=db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId",{_id:ObjectId(batchMappingId),fkCompanyId:ObjectId(companyId),activeFlag:1}); //to get the userRolemappingids list to track the batch mentees 
    var userCourseList=db.clnUserCourseMapping.find({fkCourseId:batchObj.fkCourseId,fkUserRoleMappingId:{$in:urmIds},activeFlag:1},{courseImg:0}).toArray(); //
    while(userCourseList.length>count){
        userCourseList[count].profile={};
        userCourseList[count].profile=db.clnUserDetails.findOne({fkUserLoginId:userCourseList[count].fkUserLoginId,activeFlag:1},{profile:1,_id:0});
        //userCourseList[count].userName={};
        userCourseList[count].userName=db.clnUserLogin.findOne({_id:userCourseList[count].fkUserLoginId,activeFlag:1},{userName:1,_id:0})
        count++;
    }
    //var courseObj=db.clnBatchCourseMapping.findOne({batchId:ObjectId(batchId),activeFlag:1});
    if(batchObj.courseTimeline==undefined){
        batchObj.courseTimeline={};
        batchObj.elementOrder={};
    }
    return {batchList:batchObj,userDetails:userCourseList,userList:urmIds}; 
}
});



db.system.js.save({
    "_id" : "fnLoadCourseMaterials4Batch",
    "value" : function(batchMappingId) {
    var batchList=db.clnCourseBatchMapping.findOne({_id:batchMappingId,activeFlag:1});
    var courseDetails = db.clnCourses.findOne({_id:batchList.fkCourseId,activeFlag:1},{courseImg:0});
    currentCourseTimeLine=db.clnCourses.findOne({_id:batchList.fkCourseId,activeFlag:1},{courseTimeline:1,_id:0});
    //existingTimeLine=db.clnUserCourseMapping.findOne({fkCourseId:batchList.fkCourseId,fkUserRoleMappingId:urmId,activeFlag:1});
    if(batchList.courseTimeline==undefined){
        courseDetails.courseTimeline={};
        courseDetails['courseTimeline']=currentCourseTimeLine.courseTimeline;
        return courseDetails;
    }
    m=[];  
    var j=0;
    userCourseElementlist=[];
    temp={};
        //looping through the coursetimeline of a user
        for(var Etlpoint in batchList.courseTimeline){
     	   for(var EuserCourseElementType in batchList.courseTimeline[Etlpoint]){
                if(typeof batchList.courseTimeline[Etlpoint][EuserCourseElementType]=='object'){
                    for(var EinnerIndex in batchList.courseTimeline[Etlpoint][EuserCourseElementType]){
                        if(batchList.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].code!=null){
                            userCourseElementlist.push(currentCourseTimeLine.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].code)
                            
                            
                        }
                    }
                }
             }
     	}
        //looping through the current course time line
        for(var tlpoint in currentCourseTimeLine.courseTimeline){
     	   for(var userCourseElementType in currentCourseTimeLine.courseTimeline[tlpoint]){
                if(typeof currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType]=='object'){
                    for(var innerIndex in currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType]){
                        if(currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType][innerIndex].code!=null){
                           
                            if(userCourseElementlist.indexOf(currentCourseTimeLine.courseTimeline[tlpoint][userCourseElementType][innerIndex].code) == -1){
                              
                                    temp[tlpoint]=currentCourseTimeLine.courseTimeline[tlpoint]; //.courseTimeline[tlpoint]
                              
                            }
                        }
                    }
                }
             }
     	}
        delete courseDetails.courseTimeline; //deleting existing object
        courseDetails.courseTimeline={};
        courseDetails['courseTimeline']=temp; //copying the current object which contain tlpoint along with course material which is not exist in user timeline
        return batchList.courseTimeline;
}
});


db.system.js.save({
    "_id" : "fnAssignCourseMaterials4Batch",
    "value" : function(batchMappingId,courseObj,companyId) {
  //var urmIds=db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId",{batchId:ObjectId(batchId),fkCompanyId:ObjectId(companyId),activeFlag:1}); 

    var batchObj=db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId),fkCompanyId:ObjectId(companyId),activeFlag:1})

    if(batchObj.courseTimeline==undefined){
       batchObj.courseTimeline={};
       batchObj.courseTimeline=courseObj.courseTimeline;
       batchObj.elementOrder=courseObj.elementOrder;
       db.clnCourseBatchMapping.save(batchObj);
   
        } else{
        db.clnCourseBatchMapping.update({_id:ObjectId(batchMappingId),activeFlag:1},{$set:{'courseTimeline':courseObj.courseTimeline,'elementOrder':courseObj.elementOrder}},{$upsert:true});
        }

  
    return 'success';
}
});


db.system.js.save({
    "_id" : "fnloadCoursesMaterials4menteeAtt",
    "value" : function(userCourseId,urmId) {
    var courseId=db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseId),activeFlag:1}).fkCourseId;

    urmId=ObjectId(urmId);
    var courseDetails = db.clnCourses.findOne({_id:courseId,activeFlag:1},{courseImg:0});

    currentCourseTimeLine=db.clnCourses.findOne({_id:courseId,activeFlag:1},{courseTimeline:1,_id:0});
    existingTimeLine=db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseId),activeFlag:1});
    if(existingTimeLine.courseTimeline==undefined || existingTimeLine.courseTimeline==null){ //checking for timeline object exist or not. ie if the mentee under batch and he had not login still then his course timeline object will be undefined.
        batchList=db.clnCourseBatchMapping.findOne({fkCourseId:courseId,users:{$elemMatch:{fkUserRoleMappingId:urmId}},activeFlag:1});
        if(batchList.courseTimeline==undefined || batchList.courseTimeline==null){ //chceking for batch coursetimlenie object undefined or not
                return 'notfound'; 
            }
         /*for loop to check the user is black listed which is done through exclude list under each material*/
        for(var tlpoint in batchList.courseTimeline){
     	   for(var userCourseElementType in batchList.courseTimeline[tlpoint]){
                if(typeof batchList.courseTimeline[tlpoint][userCourseElementType]=='object'){
                    for(var innerIndex in batchList.courseTimeline[tlpoint][userCourseElementType]){
                        if(batchList.courseTimeline[tlpoint][userCourseElementType][innerIndex].excludeList!=undefined){ //condition to check exclude list undefined

                            if(batchList.courseTimeline[tlpoint][userCourseElementType][innerIndex].excludeList.indexOf(urmId.valueOf())>-1){
                                removedOrder=batchList.courseTimeline[tlpoint][userCourseElementType][innerIndex].order * 1; //takes the element order which to delete
                                batchList.courseTimeline[tlpoint][userCourseElementType].splice(innerIndex,1);
                                if(batchList.courseTimeline[tlpoint][userCourseElementType].length==0){
                                    delete batchList.courseTimeline[tlpoint][userCourseElementType];
                                }
                                
                                        //loop to delete the element order from the object.
                                        for (order in batchList.elementOrder) {
                                        order = order * 1;
                                        if (order >= removedOrder) {
                                                if (batchList.elementOrder[order]) {
                                                    var keyArr = batchList.elementOrder[order].split(".");
                                                    var tmpTlPoint = keyArr[0];
                                                    var elementName = keyArr[1];
                                                    var innerIndex = keyArr[2];
                                                    if (removedOrder != order) {
                                                        batchList.courseTimeline[tmpTlPoint][elementName][innerIndex].order = order - 1;
                                                        batchList.elementOrder[order - 1] = batchList.elementOrder[order];
                                                    }
                                                    delete batchList.elementOrder[order];
                                                }
                                          }
                                      }
                                
                            }
                        }
                    } //innerindex loop ends 
                } //condition to check type ends.
             }//element order ends.
     	} //tlpoint end.

            
            
       db.clnUserCourseMapping.update({_id:ObjectId(userCourseId),activeFlag:1},{$set:{'courseTimeline':batchList.courseTimeline,'elementOrder':batchList.elementOrder}}); //updating the user course mapping by including courseTimeline object and element order
        existingTimeLine=db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseId),activeFlag:1});
        
    }
 
    
   userCourseElementlist=[];
    temp={};
        //looping through the coursetimeline of a user
        for(var Etlpoint in existingTimeLine.courseTimeline){
     	   for(var EuserCourseElementType in existingTimeLine.courseTimeline[Etlpoint]){
                if(typeof existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType]=='object'){
                    for(var EinnerIndex in existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType]){
                        if(existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].attendenceTrack==true){
                            
                        userCourseElementlist.push({tlpoint:Etlpoint, userCourseElementType:EuserCourseElementType,Name:existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].elements[0].value, innerIndex:EinnerIndex, courseElement:existingTimeLine.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex]});
                            
                        }
                    }
                }
             }
     	}
        

       
    return {userCourseObj:existingTimeLine,userCourseElementlist:userCourseElementlist};
    
}
});


db.system.js.save({
    "_id" : "fnloadCourseMaterials4batchAtt",
    "value" : function(batchMappingId) {
    batchMappingId=ObjectId(batchMappingId);
   
    batchCourseObj=db.clnCourseBatchMapping.findOne({_id:batchMappingId,activeFlag:1});
    if(batchCourseObj.courseTimeline==undefined){ //checking for the timeline object exist or not
        course=db.clnCourses.findOne({_id:batchCourseObj.fkCourseId,activeFlag:1},{courseTimeline:1,_id:0});
        //db.clnCourseBatchMapping.update({_id:batchMappingId,activeFlag:1},{$set:{'courseTimeline':course.courseTimeline,'elementOrder':course.elementOrder}});
        return {result:'notfound',courseBatchObj:batchCourseObj};
    }
    //getting the batch mentees
     var urmIds=db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId",{_id:batchMappingId,activeFlag:1}); 
     var userCourseList=db.clnUserCourseMapping.find({fkCourseId:batchCourseObj.fkCourseId,fkUserRoleMappingId:{$in:urmIds},activeFlag:1},{courseImg:0}).toArray(); //
    var count=0;
    while(userCourseList.length>count){
        userCourseList[count].profile={};
        userCourseList[count].profile=db.clnUserDetails.findOne({fkUserLoginId:userCourseList[count].fkUserLoginId,activeFlag:1},{profile:1,_id:0});
        //userCourseList[count].userName={};
        userCourseList[count].userName=db.clnUserLogin.findOne({_id:userCourseList[count].fkUserLoginId,activeFlag:1},{userName:1,_id:0})
        count++;
    }
        userCourseElementlist=[];
        //looping through the coursetimeline of a user
        for(var Etlpoint in batchCourseObj.courseTimeline){
     	   for(var EuserCourseElementType in batchCourseObj.courseTimeline[Etlpoint]){
                if(typeof batchCourseObj.courseTimeline[Etlpoint][EuserCourseElementType]=='object'){
                    for(var EinnerIndex in batchCourseObj.courseTimeline[Etlpoint][EuserCourseElementType]){
                        if(batchCourseObj.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].attendenceTrack==true){
                            
                        userCourseElementlist.push({tlpoint:Etlpoint, userCourseElementType:EuserCourseElementType,Name:batchCourseObj.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex].elements[0].value, innerIndex:EinnerIndex, courseElement:batchCourseObj.courseTimeline[Etlpoint][EuserCourseElementType][EinnerIndex],userList:userCourseList});
                            
                        }
                    }
                }
             }
     	}

    //var courseObj=db.clnBatchCourseMapping.findOne({batchId:ObjectId(batchId),activeFlag:1});

    return {result:'found',courseBatchObj:batchCourseObj,userCourseElementlist:userCourseElementlist};
}
});



