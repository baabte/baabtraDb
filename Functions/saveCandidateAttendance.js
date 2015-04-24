db.system.js.save({
    "_id" : "saveCandidateAttendance",
    "value" : function (dataObj) {
        var userArray=[];
        userArray=dataObj.userList;
        for(index in userArray){
  
            userArray[index].batchMappingId=dataObj.batchMappingId;
            userArray[index].courseId=dataObj.courseId;
            userArray[index].companyId=dataObj.companyId;
            userArray[index].createdDate=dataObj.createdDate;
            userArray[index].updatedDate=dataObj.updatedDate;
            userArray[index].urmId=ObjectId(dataObj.urmId);
            userArray[index].crmId=ObjectId(dataObj.crmId);
            userArray[index].fkUserLoginId=ObjectId(userArray[index].fkUserLoginId);
            userArray[index].fkUserRoleMappingId=ObjectId(userArray[index].fkUserRoleMappingId);
            userArray[index].date=new Date(dataObj.date);
            userArray[index].activeFlag=1;
            
            db.clnCandidateAttendance.insert(userArray[index]);
        }
     return 'ok';
  }
});