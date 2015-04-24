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

mapping=db.clnCourseBatchMapping.find().toArray();
count=0;
while(count<mapping.length){
mapping[count].courseName=db.clnCourses.findOne({_id:mapping[count].fkCourseId}).Name;
db.clnCourseBatchMapping.save(mapping[count]);
count++;
} 


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
        
        elemLength=Object.keys(batchObj.elementOrder).length;
        //for (var i in userCourseObj.elementOrder){
            batchObj.elementOrder[elemLength]=elemOrder;
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
                        
                        elemLength=Object.keys(users.elementOrder).length;
                        //for (var i in userCourseObj.elementOrder){
                            users.elementOrder[elemLength]=elemOrder;
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


