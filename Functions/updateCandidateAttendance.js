db.system.js.save({
    "_id" : "updateCandidateAttendance",
    "value" : function (dataObj) {
        var menteeArrayForUpdate=[];
        menteeArrayForUpdate=dataObj.userList;
        for(key in menteeArrayForUpdate){
            menteeArrayForUpdate[key]._id = ObjectId(menteeArrayForUpdate[key]._id);
            menteeArrayForUpdate[key].fkUserRoleMappingId = ObjectId(menteeArrayForUpdate[key].fkUserRoleMappingId);
            menteeArrayForUpdate[key].fkUserLoginId = ObjectId(menteeArrayForUpdate[key].fkUserLoginId);
            menteeArrayForUpdate[key].crmId=ObjectId(menteeArrayForUpdate[key].crmId);
            menteeArrayForUpdate[key].urmId=ObjectId(menteeArrayForUpdate[key].urmId);
            menteeArrayForUpdate[key].date = new Date(menteeArrayForUpdate[key].date);
            
            db.clnCandidateAttendance.save(menteeArrayForUpdate[key]);
        }
     return 'ok';
  }
});