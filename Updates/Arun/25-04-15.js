

db.clnUserDetails.find().forEach(function(doc){ 
	if(doc.fkUserLoginId){
	var user='';
	var user=db.clnUserLogin.findOne({_id:doc.fkUserLoginId,activeFlag:1},{userName:1});
	if(user!=null){
		db.clnUserDetails.update({_id:doc._id},{$set:{'userName':user.userName}},{multi:true});
		}
	}
});


//fnFetchUsersToCourseAllocate


db.system.js.save({
    "_id" : "fnFetchUsersToCourseAllocate",
    "value" : function(companyId,firstId,type,lastId,searchKey) {
   var result;
    var resultObj={};
    var count=0;
    var UserData;
    var first,last;
    var msg;
    var userloginIds='';
    if(searchKey==''){
    if(type=='initial'){

        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='initial'+'non Search'
    }
    else if(type=='next'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='next'+'non Search'
        
        }
   else if(type=='prev'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='prev'+'non Search'
        
        }


            if(result.length!=0){       
          if(type=='prev'){

               first=result[result.length-1]._id;
             last=result[0]._id;
             
             
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
       
        while(result.length>count){
            var rowRes=result[count];
            result[count].profile={};
            var profile=db.clnUserDetails.findOne({fkUserLoginId:rowRes.fkUserLoginId},{profile:1,_id:0});
            result[count].profile=profile.profile;
            var userName=db.clnUserLogin.findOne({_id:rowRes.fkUserLoginId},{_id:0,userName:1});
            result[count].userName=userName.userName;
            rowRes.fkUserLoginId=rowRes.fkUserLoginId.valueOf();
            rowRes.userRoleMappingId=rowRes._id.valueOf();
            delete rowRes._id;
           count++;
            }


      
    

         
    }else{
     
     if (firstId!=='') {
     first=ObjectId(firstId);
     }else{
      first=firstId;
     }
     if (lastId!=='') {
     last=ObjectId(lastId);
     }else{
     last=lastId;
     }

     
        userloginIds=db.clnUserRoleMapping.distinct('fkUserLoginId',{fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1})
     
     if(type=='initial'){
        var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();
        for(var index in result){
            result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
            result[index]._id=result[index]._id.valueOf();
        }
        first=ObjectId(result[0]._id);
        last=ObjectId(result[result.length-1]._id);

        msg='initial'+'Search'

    }
    else if(type=='next'){
         var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},activeFlag:1,_id:{$gt:ObjectId(lastId)}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();
        for(var index in result){
            result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
            result[index]._id=result[index]._id.valueOf();
        }
        first=ObjectId(result[0]._id);
        last=ObjectId(result[result.length-1]._id);
              
        msg='next'+' Search'
        
        }
   else if(type=='prev'){
          var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},activeFlag:1,_id:{$lt:ObjectId(firstId)}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();
        for(var index in result){
            result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
            result[index]._id=result[index]._id.valueOf();
        }
        first=ObjectId(result[0]._id);
        last=ObjectId(result[result.length-1]._id);
       
        msg='prev'+'Search'

        }      

    }

    resultObj.userList=result;
    if (first!=='') {
    resultObj.firstId=first.valueOf();        
     }else{
    resultObj.firstId=first
     }
     if (last!=='') {
    resultObj.lastId=last.valueOf();
     }else{
    resultObj.lastId=last;
     }
    resultObj.searchKey=searchKey;
    resultObj.userloginIds=userloginIds;
    resultObj.msg=msg;
  

  
    return resultObj;
}
});


//fnAllocateUsersToCourse

db.system.js.save({
    "_id" : "fnAllocateUsersToCourse",
    "value" : function(courseAllocate) {
    	var loggedusercrmid=ObjectId(courseAllocate.loggedusercrmid);
    	var companyId=ObjectId(courseAllocate.companyId);
    	var date=courseAllocate.date;
    	delete courseAllocate.date;
    	var courseId=ObjectId(courseAllocate.selectedCourse._id)
    	delete courseAllocate.selectedCourse;
    	var course = db.clnCourses.findOne({_id:courseId},{_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1});
    	var UserCourseMappingData = {fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, createdDate:date, updatedDate:date, crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
    	for(var key in courseAllocate.selectedUsers){
			UserCourseMappingData.fkUserLoginId=ObjectId(key);
            var UserRoleMappingId=db.clnUserRoleMapping.findOne({fkUserLoginId:UserCourseMappingData.fkUserLoginId,fkRoleId:3,"profile.fkCompanyId":companyId,activeFlag:1},{_id:1});
			UserCourseMappingData.fkUserRoleMappingId=UserRoleMappingId._id;

			db.clnUserCourseMapping.update({fkUserLoginId:UserCourseMappingData.fkUserLoginId,fkUserRoleMappingId:UserCourseMappingData.fkUserRoleMappingId, fkCourseId:courseId, activeFlag:1},{$set:{activeFlag:0}});
                db.clnUserCourseMapping.insert(UserCourseMappingData);

		    }
    	return UserCourseMappingData;
}
});



db.system.js.save(
{
    "_id" : "fnRegisterUser",
    "value" : function (data) {
    if (isNaN(data.role.roleId)) {//checking the role the user is to registered ,id kept in roleId and role details deleted from the object 
        roleId = ObjectId(data.role.roleId);
        delete data.role;
    } else if (!isNaN(data.role.roleId)) {
        roleId = data.role.roleId;
        delete data.role;
    } else {
        roleId = data.role.roleId;
        delete data.role;
    }
    var evaluatorEmails = [];
    var mandatoryData = data.mandatoryData;  //mandatory data of user is kept in an object 
    delete data.mandatoryData;
    //if user check for course batch and 
    if (roleId == 3) {  
        if (data.course != undefined) {
            var courseId = ObjectId(data.course._id);
            delete data.course;
            if (data.coursetype != undefined) {
                var coursetype = data.coursetype;
                delete data.coursetype;
            }
            if (data.materialAssignment != undefined) {
                var materialAssignment = data.materialAssignment;
                delete data.materialAssignment;
            }
            var course = db.clnCourses.findOne({_id:courseId}, {_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1});
            var UserCourseMappingDataId = new ObjectId;
            if (data.batch != undefined) {
                data.batch.enrollmentBefore = ISODate(data.batch.enrollmentBefore);
                data.batch.enrollmentAfter = ISODate(data.batch.enrollmentAfter);
                data.batch.startDate = ISODate(data.batch.startDate);
                data.batch.endDate = ISODate(data.batch.endDate);
                var lowerBound = new Date;
                var upperBound = new Date;
                upperBound.setDate(data.batch.enrollmentAfter.getDate() - 1);
                lowerBound.setDate(data.batch.enrollmentBefore.getDate() + 1);
                if (data.batch.materialAssignment != undefined) {
                    var materialAssignment = data.batch.materialAssignment;
                   
                }
            }
        }
    }
    //user role mapping kept in variable
    if (data.loggedusercrmid != undefined) { 
        var loggedusercrmid = ObjectId(data.loggedusercrmid);
        delete data.loggedusercrmid;
    } else {
        var SAdminRmid = db.clnUserRoleMapping.findOne({fkRoleId:1}, {_id:1});
        var loggedusercrmid = SAdminRmid._id;
    }
    if (data.companyId != undefined) {
        var companyId = ObjectId(data.companyId);
        delete data.companyId;
    } else {
        var companyId = "";
    }
    var resultmsg;
    if (data._id == undefined || data._id == null) {
        var UserRoleMappingDataId = new ObjectId;
        var userLoginDataId = new ObjectId;
        var menu = db.clnRoleMenuMapping.findOne({fkRoleId:roleId}, {_id:0, menuStructure:1});
        if (menu == null) {
            menu = {};
            menu.menuStructure = [];
        }
        UserLoginData = {_id:userLoginDataId, userName:mandatoryData.eMail, password:mandatoryData.password, roleMappings:[UserRoleMappingDataId], lastLoggedRoleMapping:UserRoleMappingDataId, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
        db.clnUserLogin.insert(UserLoginData);
        delete mandatoryData.eMail;
        delete mandatoryData.password;
        UserDetails = {fkUserLoginId:userLoginDataId,userName:UserLoginData.userName,profile:mandatoryData, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, approvedFlag:0, activeFlag:1};
        db.clnUserDetails.insert(UserDetails);
        usermenuData = {fkUserRoleMappingId:UserRoleMappingDataId, menuStructure:menu.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
        db.clnUserMenuMapping.insert(usermenuData);
        data.fkCompanyId = companyId;
        UserRoleMappingData = {_id:UserRoleMappingDataId, fkRoleId:roleId, fkUserLoginId:userLoginDataId, fkEmployeeId:"", fkConsumerId:"", groups:[], profile:[data], createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
        db.clnUserRoleMapping.insert(UserRoleMappingData);
        if (roleId == 3) {
            if (course != undefined) {
                if (data.batch != undefined || data.batch != null) {
                    var batchCourseId = new ObjectId;
                    if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                    }
                    db.clnUserCourseMapping.insert(UserCourseMappingData);
                    var count = db.clnCourseBatchMapping.count({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}});
                    var user = {};
                    var userList = [];
                    user.fkUserLoginId = userLoginDataId;
                    user.fkUserRoleMappingId = UserRoleMappingDataId;
                    userList.push(user);
                    if (count == 0) {
                        if (data.evaluator != undefined) {
                            for (var index in data.evaluator) {
                                var evaluatorList = {};
                                data.evaluator[index].roleMappingId = ObjectId(data.evaluator[index].roleMappingId);
                                evaluatorList.Name = data.evaluator[index].Name;
                                evaluatorList.Email = db.clnUserLogin.findOne({roleMappings:{$in:[data.evaluator[index].roleMappingId]}}, {_id:0, userName:1});
                                evaluatorEmails.push(evaluatorList);
                            }
                        }
                        if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                             var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, users:userList, evaluator:data.evaluator};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }
                             var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration,courseTimeline:courseTimeline, elementOrder:newElementOrder, users:userList, evaluator:data.evaluator};
                        } else if (materialAssignment == "manual") {
                            var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                        }
                    } else {
                         var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};                                            
                    }
                       
                        db.clnCourseBatchMapping.insert(Batchdata);
                    } else {
                        var arr_users = db.clnCourseBatchMapping.find({fkCourseId:courseId, batchId:ObjectId(data.batchId), users:{$elemMatch:{fkUserRoleMappingId:UserRoleMappingDataId}}}, {batchId:1}).toArray();
                        if (arr_users.length == 0) {
                            db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}}, {$push:{users:userList[0]}});
                        }
                    }
                } else {
                    if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                    }
                    db.clnUserCourseMapping.insert(UserCourseMappingData);
                }
            }
        }
        resultmsg = "new user registered";
    }
    if (data._id != undefined || data._id != null) {
        var userDetalisId = ObjectId(data._id);
        var userId = db.clnUserDetails.findOne({_id:userDetalisId}, {_id:0, fkUserLoginId:1});
        delete data._id;
        delete mandatoryData.eMail;
        delete mandatoryData.password;
        var setUserDetalis = {};
        setUserDetalis.profile = mandatoryData;
        setUserDetalis.updatedDate = Date();
        setUserDetalis.urmId = loggedusercrmid;
        db.clnUserDetails.update({_id:userDetalisId}, {$set:setUserDetalis});
        var UserRoleMappingCheck = db.clnUserRoleMapping.findOne({fkUserLoginId:userId.fkUserLoginId, fkRoleId:roleId, activeFlag:1}, {_id:1});
        if (UserRoleMappingCheck != null) {
            var roleMappingsId = UserRoleMappingCheck._id;
            var set = {};
            set.updatedDate = Date();
            set.urmId = loggedusercrmid;
            data.fkCompanyId = companyId;
            db.clnUserRoleMapping.update({_id:roleMappingsId}, {$pull:{profile:{fkCompanyId:companyId}}});
            db.clnUserRoleMapping.update({_id:roleMappingsId}, {$set:set, $push:{profile:data}});
            resultmsg = "exsisting user exsisting role update";
        } else {
            var roleMappingsId = new ObjectId;
            var menu = db.clnRoleMenuMapping.findOne({fkRoleId:roleId}, {_id:0, menuStructure:1});
            if (menu == null) {
                menu = {};
                menu.menuStructure = [];
            }
            usermenuData = {fkUserRoleMappingId:roleMappingsId, menuStructure:menu.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
            db.clnUserMenuMapping.insert(usermenuData);
            data.fkCompanyId = companyId;
            UserRoleMappingData = {_id:roleMappingsId, fkRoleId:roleId, fkUserLoginId:userId.fkUserLoginId, fkEmployeeId:"", fkConsumerId:"", groups:[], profile:[data], createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
            db.clnUserRoleMapping.insert(UserRoleMappingData);
            resultmsg = "exsisting user new role";
        }
        if (roleId == 3) { //user is mentee
            if (data.batch != undefined || data.batch != null) { //have a batch
                var batchCourseId = new ObjectId;
                if (materialAssignment) {  //material assignment method
                    if (materialAssignment == "automatic") {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                    } else if (materialAssignment == "cascade") {
                        var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        
                    } else if (materialAssignment == "manual") {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                    }
                } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                }
                db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId, fkCourseId:courseId, activeFlag:1}, {$set:{activeFlag:0}});
                db.clnUserCourseMapping.insert(UserCourseMappingData);
                var count = db.clnCourseBatchMapping.count({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lte:lowerBound}, enrollmentBefore:{$gt:upperBound}});
                var user = {};
                var userList = [];
                user.fkUserLoginId = userId.fkUserLoginId;
                user.fkUserRoleMappingId = roleMappingsId;
                userList.push(user);
                if (count == 0) {
                    if (data.evaluator != undefined) {
                        for (var index in data.evaluator) {
                            var evaluatorList = {};
                            data.evaluator[index].roleMappingId = ObjectId(data.evaluator[index].roleMappingId);
                            evaluatorList.Name = data.evaluator[index].Name;
                            evaluatorList.Email = db.clnUserLogin.findOne({roleMappings:{$in:[data.evaluator[index].roleMappingId]}}, {_id:0, userName:1});
                            evaluatorEmails.push(evaluatorList);
                        }
                    }
                    if (materialAssignment) {  //material assignment method
                    if (materialAssignment == "automatic") {
                        var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, users:userList, evaluator:data.evaluator};
                    } else if (materialAssignment == "cascade") {
                        var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }
                        var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration,courseTimeline:courseTimeline, elementOrder:newElementOrder,users:userList, evaluator:data.evaluator};
                        
                    } else if (materialAssignment == "manual") {
                       var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                    }
                } else {
                    var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                        
                }
                    
                    db.clnCourseBatchMapping.insert(Batchdata);
                } else {
                    var arr_users = db.clnCourseBatchMapping.find({fkCourseId:courseId, batchId:ObjectId(data.batchId), users:{$elemMatch:{fkUserRoleMappingId:roleMappingsId}}}, {batchId:1}).toArray();
                    if (arr_users.length == 0) {
                        db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}}, {$push:{users:userList[0]}});
                    }
                }
            } else {
                if (materialAssignment) {
                    if (materialAssignment == "automatic") {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                    } else if (materialAssignment == "cascade") {
                        var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};

                    } else if (materialAssignment == "manual") {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                    }
                } else {
                    var UserCourseMappingData = {fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                }
                db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId, fkCourseId:courseId, activeFlag:1}, {$set:{activeFlag:0}});
                db.clnUserCourseMapping.insert(UserCourseMappingData);
            }
            resultmsg = "exsisting mentee new course";
        }
    }
    var result = {result:resultmsg, evaluatorEmailLIst:evaluatorEmails};
    return result;
}
});


