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