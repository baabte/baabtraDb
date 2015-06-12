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