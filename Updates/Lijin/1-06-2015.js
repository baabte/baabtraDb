db.system.js.save({
_id:'fnLoadBatchesByCourse',
"value":function(companyId,courseId){
   var batchList = db.clnCourseBatchMapping.find({fkCourseId:ObjectId(courseId),fkCompanyId:ObjectId(companyId)},{courseTimeline:0,markSheetElements:0,elementOrder:0,syllabus:0}).toArray();
   return batchList;
}});

db.system.js.save({
_id:'fnLoadMenteesByBatch',
"value":function(companyId,batchMappingId){
    var mappingObject = db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId)},{'users.fkUserLoginId':1,'fkCourseId':1});
    var rmIds = [];
    for(var j in mappingObject.users){
     rmIds.push(mappingObject.users[j].fkUserLoginId);
    }
    var mappings=db.clnUserCourseMapping.find({'fkCompanyId':ObjectId(companyId),'fkUserLoginId':{$in:rmIds},'fkCourseId':mappingObject.fkCourseId,'activeFlag':1},{'fkUserLoginId':1}).toArray();
       for(var i in mappings){
           mappings[i].details = db.clnUserDetails.findOne({'fkUserLoginId':mappings[i].fkUserLoginId},{'profile':1,'userName':1,_id:0});
       }
    return mappings;
}});

db.system.js.save({
_id:'fnMoveMenteeToAnotherBatch',
"value":function(companyId,fromBatchMappingId,toBatchMappingId,userMappings){
    for(var i in userMappings){
        userMappings[i]=ObjectId(userMappings[i]);
    }
     
    var fromBatch = db.clnCourseBatchMapping.findOne({_id:ObjectId(fromBatchMappingId)});
    var toBatch = db.clnCourseBatchMapping.findOne({_id:ObjectId(toBatchMappingId)});   
    var userCourseMappings = db.clnUserCourseMapping.find({_id:{$in:userMappings},fkCourseId:fromBatch.fkCourseId,activeFlag:1}).toArray();

    
    for(var index in userCourseMappings){
        var userCourseMapping = userCourseMappings[index];
        
        for(var j in fromBatch.users){
            
            if(fromBatch.users[j].fkUserLoginId.valueOf() == userCourseMapping.fkUserLoginId.valueOf()){
               fromBatch.users.splice(j,1);
               toBatch.users.push({fkUserLoginId:userCourseMapping.fkUserLoginId,fkUserRoleMappingId:userCourseMapping.fkUserRoleMappingId});
               userCourseMapping.fkCourseBatchMappingId = toBatch._id;
               db.clnUserCourseMapping.save(userCourseMapping);
            }
        }
    }
    
    db.clnCourseBatchMapping.save(fromBatch);
    db.clnCourseBatchMapping.save(toBatch);
    
    return {result:'ok'};
    
}});

db.system.js.save({
_id:'fnGetUnallocatedCandidatesByCourse',
"value":function(companyId,courseId){
var orderFormList = db.clnTrainingRequest.find({companyId:ObjectId(companyId),"orderDetails.courseId":courseId,"orderDetails.userInfo.status":{$in:['Approved']}}).toArray();
return {orderFroms:orderFormList};
}});

