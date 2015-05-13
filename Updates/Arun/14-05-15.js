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
    	var course = db.clnCourses.findOne({_id:courseId},{_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1,syllabus:1,markSheetElements:1});
    	var UserCourseMappingData = {fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline,syllabus:course.syllabus,markSheetElements:course.markSheetElements, elementOrder:course.elementOrder, createdDate:date, updatedDate:date, crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
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

//fnFetchAllQuestionBundles

db.system.js.save({_id: "fnFetchAllQuestionBundles",
      value: function (data) {
        var result =db.clnQuestionBank.find({companyId:ObjectId(data.companyId),activeFlag:1}).toArray();
        for (var index in result){
            result[index]._id=result[index]._id.valueOf();
        }
        return result;

}});


//fnModifyQuestionBundles

db.system.js.save({_id: "fnModifyQuestionBundles",
      value: function (data) {

        data.companyId=ObjectId(data.companyId);
        loggedusercrmid=ObjectId(data.loggedusercrmid)
        delete data.loggedusercrmid;
        delete data.expandDetails
        if(data._id){
            data._id=ObjectId(data._id);
        }else{
                  data.activeFlag=1;
            }
        data.createdDate=Date();
        data.updatedDate=Date();
        data.crmId=loggedusercrmid;
        data.urmId=loggedusercrmid;
        db.clnQuestionBank.save(data);
        return data;

}});

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
            var course = db.clnCourses.findOne({_id:courseId}, {_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1,syllabus:1,markSheetElements:1});
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
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline,syllabus:course.syllabus,markSheetElements:course.markSheetElements, elementOrder:course.elementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
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
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder,syllabus:course.syllabus,markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark,syllabus:course.syllabus,markSheetElements:course.markSheetElements, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration,syllabus:course.syllabus,markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
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
                             var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId,syllabus:course.syllabus,markSheetElements:course.markSheetElements, fkCourseId:courseId,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, users:userList, evaluator:data.evaluator};
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
                             var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid,syllabus:course.syllabus,markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration,courseTimeline:courseTimeline, elementOrder:newElementOrder, users:userList, evaluator:data.evaluator};
                        } else if (materialAssignment == "manual") {
                            var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore,syllabus:course.syllabus,markSheetElements:course.markSheetElements, repeats:data.batch.repeats, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                        }
                    } else {
                         var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats,syllabus:course.syllabus,markSheetElements:course.markSheetElements, courseType:data.batch.courseType,materialAssignment:data.batch.materialAssignment ,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};                                            
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
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline,syllabus:course.syllabus,markSheetElements:course.markSheetElements, elementOrder:course.elementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
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
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline,syllabus:course.syllabus,markSheetElements:course.markSheetElements, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark,syllabus:course.syllabus,markSheetElements:course.markSheetElements, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration,syllabus:course.syllabus,markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
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
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid,syllabus:course.syllabus,markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
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
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(),syllabus:course.syllabus,markSheetElements:course.markSheetElements, updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        
                    } else if (materialAssignment == "manual") {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark,syllabus:course.syllabus,markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                    }
                } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid,syllabus:course.syllabus,markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
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
                        var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId,syllabus:course.syllabus,markSheetElements:course.markSheetElements, fkCourseId:courseId,selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, users:userList, evaluator:data.evaluator};
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
                        var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId,syllabus:course.syllabus,markSheetElements:course.markSheetElements, fkCourseId:courseId,selectedDuration:course.selectedDuration,courseTimeline:courseTimeline, elementOrder:newElementOrder,users:userList, evaluator:data.evaluator};
                        
                    } else if (materialAssignment == "manual") {
                       var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid,syllabus:course.syllabus,markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                    }
                } else {
                    var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid,syllabus:course.syllabus,markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId,selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                        
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
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, totalMark:course.totalMark,syllabus:course.syllabus,markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
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
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration,syllabus:course.syllabus,markSheetElements:course.markSheetElements, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};

                    } else if (materialAssignment == "manual") {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId,fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description,syllabus:course.syllabus,markSheetElements:course.markSheetElements, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                    }
                } else {
                    var UserCourseMappingData = {fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark,syllabus:course.syllabus,markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
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


//fnSaveTestStartTimeRandomExam
db.system.js.save({_id: "fnSaveTestStartTimeRandomExam",
                  value: function (StartTimeObj) {
                    
          var courseMappingId=ObjectId(StartTimeObj.courseMappingId);
          var userLoginId=ObjectId(StartTimeObj.userLoginId);
          var keyName=StartTimeObj.keyName;
          var tlPointInmins=StartTimeObj.tlPointInmins;
          var outerIndex=StartTimeObj.outerIndex;
          var innerIndex=StartTimeObj.innerIndex;
          var timeObj=StartTimeObj.timeObj;
          var questionBankId=ObjectId(StartTimeObj.questionBankId);
          var noOfQuestion=StartTimeObj.noOfQuestion;

          var resultmsg;

var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});
    
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]){
    course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;  

    var tempArray=db.clnQuestionBank.findOne({_id:questionBankId},{questions:1,_id:0});
    var questionsArray=tempArray.questions;
    var testModel=[];
    while(noOfQuestion>0){
    var index =Math.floor(Math.random()*questionsArray.length);
    testModel.push(questionsArray[index]);
    questionsArray.splice(index,1);    
    noOfQuestion--;
    }

    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.testModel=testModel;
    db.clnUserCourseMapping.save(course);
    resultmsg='test Started';
    }
    else{
        resultmsg='test already started or finished';
    }
return {result:resultmsg,testModel:testModel};
}});


//fnFetchQuestionBankList

db.system.js.save({_id: "fnFetchQuestionBankList",
      value: function (questionBankFetchData) {
    var companyId=ObjectId(questionBankFetchData.fkcompanyId);


    var questionBanklist = db.clnQuestionBank.find({companyId:companyId,activeFlag:1},{_id:1, Name:1,noOfQuestions:1}).toArray();

    for(var index in questionBanklist){
        questionBanklist[index]._id=questionBanklist[index]._id.valueOf();
    }
    return questionBanklist;
}});


db.system.js.save({
    "_id" : "fnAddCourseTimelineElement",
    "value" : function (courseId, courseElement) {
    var keyArray = courseElement.key.split(".");
    var tlPoint = keyArray[0];
    var elemType = keyArray[1];
    var key = "courseTimeline." + courseElement.key;
    var obj = {};
    if(elemType=='Interview'||elemType=='Physical test'){
        courseElement[courseElement.key].evalStatus ='Pending Evaluation';
    }
    
    obj[key] = courseElement[courseElement.key];//Interview
    db.clnCourses.update({_id:courseId}, {$push:obj});
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var elements = courseElement[courseElement.key].elements;
    var innerIndex = course[0].courseTimeline[tlPoint][elemType].length - 1;
    var order = 0;
    var gotOrderFlag = false;
    var lastTraversedOrder = 0;
    if (!course[0].elementOrder) {
        course[0].elementOrder = {};
    } else {
        for (tmpOrder in course[0].elementOrder) {
            var orderKeys = course[0].elementOrder[tmpOrder].split(".");
            orderKeys[0] = parseInt(orderKeys[0]);
            tlPoint = parseInt(tlPoint);
            tmpOrder = parseInt(tmpOrder);
            if (orderKeys[0] == tlPoint) {
                gotOrderFlag = true;
                order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
            }
            if (!gotOrderFlag && orderKeys[0] < tlPoint) {
                order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
            }
        }
    }
    var previousElem = "";
    var traversed = false;
    if (course[0].elementOrder[order]) {
        previousElem = course[0].elementOrder[order];
        for (curOrder in course[0].elementOrder) {
            traversed = true;
            curOrder = parseInt(curOrder);
            if (curOrder >= order) {
                var elemToCopy = previousElem;
                var traversingOrder = parseInt(curOrder + 1);
                previousElem = course[0].elementOrder[traversingOrder];
                if (typeof elemToCopy != "undefined") {
                    var keyArr = elemToCopy.split(".");
                    var tmpTlPoint = keyArr[0];
                    var elementName = keyArr[1];
                    var elemIndex = keyArr[2];
                    course[0].courseTimeline[tmpTlPoint][elementName][elemIndex].order = traversingOrder;
                    course[0].elementOrder[traversingOrder] = elemToCopy;
                }
            }
        }
    }
    var syllabusKeyArray = course[0].courseTimeline[tlPoint][elemType][innerIndex].syllabus.key.split(".");
    var syllabusObj = course[0].syllabus;
    for (var key in syllabusKeyArray) {
        syllabusObj = syllabusObj[syllabusKeyArray[key]];
    }
    if (!syllabusObj.element) {
        syllabusObj.element = [];
    }
    syllabusObj.element.push(tlPoint + "." + elemType + "." + innerIndex);
    course[0].courseTimeline[tlPoint][elemType][innerIndex].order = order;
    course[0].elementOrder[order] = tlPoint + "." + elemType + "." + innerIndex;
    var totalMark = 0;
    var looper = 0;
    var currentMark = 0;
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    if (course[0].totalMark) {
        currentMark = course[0].totalMark;
    }
    for (looper; looper < elements.length; looper++) {
        if (elements[looper] != null) {
            if (elements[looper].type == "question-viewer" ||
                elements[looper].type == "question-group-viewer" ||
                elements[looper].type == "assignment-question-viewer"||
                 elements[looper].type == "random-question-exam-viewer") {
                totalMark = totalMark + elements[looper].value.mark.totalMark;
            }
        }
    }
    course[0].totalMark = currentMark + totalMark;
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
    if(totalMark>0){
    course[0].courseTimeline[tlPoint][elemType][innerIndex].totalMark = totalMark;    
    }
    
    db.clnCourses.save(course[0]);
    return course[0].elementOrder;
}
});


db.system.js.save({
    "_id" : "fnEditCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, elemObjToSave, rmId) {
    
    var innerIndex = elemObjToSave.index;
    var courseObj = elemObjToSave.element;
    
    
    var key = "courseTimeline." + tlPoint + "." + courseElemName;
    var obj = {};
    obj[key] = courseObj;
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var order = course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order;
    var totalMark = 0;
    var oldTotalMark = 0;
    var newTotalMark = 0;
    var oldElements = course[0].courseTimeline[tlPoint][courseElemName];
    var looper = 0;
    if (course[0].totalMark) {
        totalMark = course[0].totalMark;
    }
    for (index in oldElements) {
        for (looper = 0; looper < oldElements[index].elements.length; looper++) {
            if(oldElements[index].elements[looper] != null){
                if (oldElements[index].elements[looper].type == "question-viewer" ||
                    oldElements[index].elements[looper].type == "question-group-viewer" || oldElements[index].elements[looper].type == "assignment-question-viewer"|| oldElements[index].elements[looper].type == "random-question-exam-viewer") {
                    oldTotalMark = oldTotalMark + oldElements[index].elements[looper].value.mark.totalMark;
                }
            }
        }
    }
    for (looper = 0; looper < courseObj.elements.length; looper++) {
        if(oldElements[index].elements[looper] != null){
            if (courseObj.elements[looper].type == "question-viewer" ||
                courseObj.elements[looper].type == "question-group-viewer" || courseObj.elements[looper].type == "assignment-question-viewer"|| courseObj.elements[looper].type == "random-question-exam-viewer") {
                newTotalMark = newTotalMark + courseObj.elements[looper].value.mark.totalMark;
            }
        }
    }
    
    //course[0].courseTimeline[tlPoint][courseElemName][innerIndex]
    var syllabusKeyArray = courseObj.syllabus.key.split('.');
    var syllabusObj=course[0].syllabus;
    for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
    syllabusObj.element.push(tlPoint + "." + courseElemName + "." + innerIndex);
      
     syllabusKeyArray = course[0].courseTimeline[tlPoint][courseElemName][innerIndex].syllabus.key.split('.');
      syllabusObj=course[0].syllabus;
    for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
        
      for(var index in syllabusObj.element){
          if(syllabusObj.element[index]==tlPoint+'.'+courseElemName+'.'+innerIndex){
             syllabusObj.element.splice(index,1);
          }
         }
    
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex] = courseObj;
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order = order;
    course[0].courseTimeline[tlPoint][courseElemName][innerIndex].totalMark=newTotalMark;
    course[0].totalMark = totalMark + (newTotalMark - oldTotalMark);
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + (newTotalMark - oldTotalMark);
    db.clnCourses.save(course[0]);
    return course;
}});


db.system.js.save({
    "_id" : "fnRemoveCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, index, rmId) {
    var key = "courseTimeline." + tlPoint + "." + courseElemName;
    var obj = {};
    obj[key] = index;
    var objProjection = {};
    objProjection[key] = 1;
    objProjection['syllabus'] = 1;
    objProjection._id = 0;
    var oldCourse = db.clnCourses.findOne({_id:courseId}, objProjection);
    var removedOrder = oldCourse.courseTimeline[tlPoint][courseElemName][index].order * 1;
    var oldElements = oldCourse.courseTimeline[tlPoint][courseElemName][index].elements;
    var markToDeduct = 0;
    for (indexKey in oldElements) {
        if (oldElements[indexKey].type == "question-viewer" ||
            oldElements[indexKey].type == "question-group-viewer" ||
            oldElements[indexKey].type == "assignment-question-viewer"||
            oldElements[indexKey].type == "random-question-exam-viewer") {
            markToDeduct = markToDeduct + oldElements[indexKey].value.mark.totalMark;
        }
    }
    
    var syllabusKeyArray = oldCourse.courseTimeline[tlPoint][courseElemName][index].syllabus.key.split('.');
    
    db.clnCourses.update({_id:courseId}, {$pop:obj});
    var a = db.clnCourses.findOne({_id:courseId});
    if (!a.courseTimeline[tlPoint][courseElemName].length) {
        b = a.courseTimeline[tlPoint][courseElemName];
        var unset = {};
        unset[key] = 1;
        db.clnCourses.update({_id:courseId}, {$unset:unset});
        a = db.clnCourses.findOne({_id:courseId});
        if (Object.keys(a.courseTimeline[tlPoint]).length == 0) {
            unset = {};
            unset["courseTimeline." + tlPoint] = 1;
            db.clnCourses.update({_id:courseId}, {$unset:unset});
            b = unset;
        }
    }
    var course = db.clnCourses.findOne({_id:courseId});
    delete course.elementOrder[removedOrder];
    course.totalMark = course.totalMark - markToDeduct;
    course.courseTimeline[tlPoint].totalMark = course.courseTimeline[tlPoint].totalMark - markToDeduct;
    for (order in course.elementOrder) {
        order = order * 1;
        if (order > removedOrder) {
            if (course.elementOrder[order]) {
                var keyArr = course.elementOrder[order].split(".");
                var tmpTlPoint = keyArr[0];
                var elementName = keyArr[1];
                var innerIndex = keyArr[2];
                if (removedOrder != order) {
                    course.courseTimeline[tmpTlPoint][elementName][innerIndex].order = order - 1;
                    course.elementOrder[order - 1] = course.elementOrder[order];
                }
                delete course.elementOrder[order];
            }
        }
    }
    
      
      syllabusObj=course.syllabus;
        for(var key in syllabusKeyArray){
            syllabusObj=syllabusObj[syllabusKeyArray[key]];
        }
       if(!syllabusObj.element){
            syllabusObj.element=[];
       }
        
      for(var indx in syllabusObj.element){
          if(syllabusObj.element[indx]==tlPoint+'.'+courseElemName+'.'+index){
             syllabusObj.element.splice(indx,1);
          }
         }
    
    db.clnCourses.save(course);
    return course.elementOrder;
}
});