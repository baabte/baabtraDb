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
	userCourseList[count].avatar=db.clnUserRoleMapping.findOne({_id:userCourseList[count].fkUserRoleMappingId,activeFlag:1},{avatar:1,_id:0})
	//retrieving the company details
	    var company = db.clnCompany.findOne({_id:userCourseList[count].fkCompanyId});
	    var companyDetails ={};
	    companyDetails.companyName = company.companyName;
	    companyDetails.Address = company.Address;
	    companyDetails.Phone = company.Phone;
	    companyDetails.eMail = company.eMail;
	    companyDetails.Fax = company.Fax;
	    companyDetails.companyLogo = company.appSettings.logo;
	    userCourseList[count].companyDetails = companyDetails;
	
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


