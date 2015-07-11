
db.system.js.save(
{
    "_id" : "fnRegisterUser",
    "value" : function (data) {
    if (isNaN(data.role.roleId)) {
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
    var mandatoryData = data.mandatoryData;
    delete data.mandatoryData;
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
            var course = db.clnCourses.findOne({_id:courseId}, {_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, type:1, elementOrder:1, syllabus:1, markSheetElements:1});
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
    var check = fnUserNameValid({eMail:mandatoryData.eMail, fetch:"data"});
    if (check.userCheck == 1) {
        data._id = check.UserDetails._id.valueOf();
    }
    if (data._id == undefined || data._id == null) {
        var UserRoleMappingDataId = new ObjectId;
        var userLoginDataId = new ObjectId;
        var menu = db.clnRoleMenuMapping.findOne({fkRoleId:roleId}, {_id:0, menuStructure:1});
        if (menu == null) {
            menu = {};
            menu.menuStructure = [];
        }
        if (mandatoryData.userId == undefined) {
            mandatoryData.userId = "";
        }
        UserLoginData = {_id:userLoginDataId, userName:mandatoryData.eMail, password:mandatoryData.password, userId:mandatoryData.userId,companyId:companyId, roleMappings:[UserRoleMappingDataId], lastLoggedRoleMapping:UserRoleMappingDataId, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
        db.clnUserLogin.insert(UserLoginData);
        delete mandatoryData.eMail;
        delete mandatoryData.password;
        UserDetails = {fkUserLoginId:userLoginDataId, userName:UserLoginData.userName, profile:mandatoryData,companyId:companyId, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, approvedFlag:0, activeFlag:1};
        db.clnUserDetails.insert(UserDetails);
        usermenuData = {fkUserRoleMappingId:UserRoleMappingDataId,companyId:companyId, menuStructure:menu.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
        db.clnUserMenuMapping.insert(usermenuData);
        data.fkCompanyId = companyId;
        UserRoleMappingData = {_id:UserRoleMappingDataId, fkRoleId:roleId, fkUserLoginId:userLoginDataId,companyId:companyId, fkEmployeeId:"", fkConsumerId:"", groups:[], profile:[data], createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
        db.clnUserRoleMapping.insert(UserRoleMappingData);
        if (roleId == 3) {
            if (course != undefined) {
                if (data.batch != undefined || data.batch != null) {
                    var batchCourseId = new ObjectId;
                    if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, syllabus:course.syllabus, markSheetElements:course.markSheetElements, elementOrder:course.elementOrder,type:course.type, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline = {};
                            courseTimeline[tlpoint] = course.courseTimeline[tlpoint];
                            if (courseTimeline[tlpoint].totalMark) {
                                var totalMark = courseTimeline[tlpoint].totalMark;
                            } else {
                                var totalMark = 0;
                            }
                            var newElementOrder = {};
                            for (var key in course.elementOrder) {
                                var orderArray = course.elementOrder[key].split(".");
                                if (orderArray[0] == tlpoint) {
                                    newElementOrder[key] = course.elementOrder[key];
                                }
                            }
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, syllabus:course.syllabus, markSheetElements:course.markSheetElements,type:course.type, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, syllabus:course.syllabus, markSheetElements:course.markSheetElements, selectedDuration:course.selectedDuration,type:course.type, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, syllabus:course.syllabus, markSheetElements:course.markSheetElements, createdDate:Date(), type:course.type, updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                    }
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
                                var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, syllabus:course.syllabus, markSheetElements:course.markSheetElements, fkCourseId:courseId, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, users:userList, evaluator:data.evaluator};
                            } else if (materialAssignment == "cascade") {
                                var elementOrder = course.elementOrder[0];
                                var keyArray = elementOrder.split(".");
                                var tlpoint = keyArray[0];
                                var courseTimeline = {};
                                courseTimeline[tlpoint] = course.courseTimeline[tlpoint];
                                if (courseTimeline[tlpoint].totalMark) {
                                    var totalMark = courseTimeline[tlpoint].totalMark;
                                } else {
                                    var totalMark = 0;
                                }
                                var newElementOrder = {};
                                for (var key in course.elementOrder) {
                                    var orderArray = course.elementOrder[key].split(".");
                                    if (orderArray[0] == tlpoint) {
                                        newElementOrder[key] = course.elementOrder[key];
                                    }
                                }
                                var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, syllabus:course.syllabus, markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, users:userList, evaluator:data.evaluator};
                            } else if (materialAssignment == "manual") {
                                var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, syllabus:course.syllabus, markSheetElements:course.markSheetElements, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId, selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                            }
                        } else {
                            var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, syllabus:course.syllabus, markSheetElements:course.markSheetElements, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId, selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                        }
                        db.clnCourseBatchMapping.insert(Batchdata);
                    } else {
                        var arr_users = db.clnCourseBatchMapping.find({fkCourseId:courseId, batchId:ObjectId(data.batchId), users:{$elemMatch:{fkUserRoleMappingId:UserRoleMappingDataId}}}, {batchId:1}).toArray();
                        if (arr_users.length == 0) {
                            db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}}, {$push:{users:userList[0]}});
                            var clnCourseBatchObj = db.clnCourseBatchMapping.findOne({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}}, {_id:1});
                            UserCourseMappingData.batchCourseMappingId = clnCourseBatchObj._id;
                        }
                    }
                    db.clnUserCourseMapping.insert(UserCourseMappingData);
                } else {
                    if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, syllabus:course.syllabus, markSheetElements:course.markSheetElements, elementOrder:course.elementOrder,type:course.type, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline = {};
                            courseTimeline[tlpoint] = course.courseTimeline[tlpoint];
                            if (courseTimeline[tlpoint].totalMark) {
                                var totalMark = courseTimeline[tlpoint].totalMark;
                            } else {
                                var totalMark = 0;
                            }
                            var newElementOrder = {};
                            for (var key in course.elementOrder) {
                                var orderArray = course.elementOrder[key].split(".");
                                if (orderArray[0] == tlpoint) {
                                    newElementOrder[key] = course.elementOrder[key];
                                }
                            }
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, syllabus:course.syllabus, markSheetElements:course.markSheetElements,type:course.type, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark,type:course.type, syllabus:course.syllabus, markSheetElements:course.markSheetElements, selectedDuration:course.selectedDuration, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userLoginDataId, fkUserRoleMappingId:UserRoleMappingDataId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration,type:course.type, syllabus:course.syllabus, markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
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
        var userLoginDataId = userId.fkUserLoginId;
        delete data._id;
        delete mandatoryData.eMail;
        delete mandatoryData.password;
        var setUserDetalis = {};
        setUserDetalis.profile = mandatoryData;
        setUserDetalis.updatedDate = Date();
        setUserDetalis.urmId = loggedusercrmid;
        setUserDetalis.companyId=companyId;
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
            usermenuData = {fkUserRoleMappingId:roleMappingsId,companyId:companyId, menuStructure:menu.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
            db.clnUserMenuMapping.insert(usermenuData);
            data.fkCompanyId = companyId;
            UserRoleMappingData = {_id:roleMappingsId, fkRoleId:roleId, fkUserLoginId:userId.fkUserLoginId,companyId:companyId, fkEmployeeId:"", fkConsumerId:"", groups:[], profile:[data], createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1};
            db.clnUserRoleMapping.insert(UserRoleMappingData);
            resultmsg = "exsisting user new role";
        }
        if (roleId == 3) {
            if (course != undefined) {
                if (data.batch != undefined || data.batch != null) {
                    var batchCourseId = new ObjectId;
                    if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder,type:course.type, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, syllabus:course.syllabus, markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline = {};
                            courseTimeline[tlpoint] = course.courseTimeline[tlpoint];
                            if (courseTimeline[tlpoint].totalMark) {
                                var totalMark = courseTimeline[tlpoint].totalMark;
                            } else {
                                var totalMark = 0;
                            }
                            var newElementOrder = {};
                            for (var key in course.elementOrder) {
                                var orderArray = course.elementOrder[key].split(".");
                                if (orderArray[0] == tlpoint) {
                                    newElementOrder[key] = course.elementOrder[key];
                                }
                            }
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:totalMark, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), syllabus:course.syllabus,type:course.type, markSheetElements:course.markSheetElements, updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, syllabus:course.syllabus,type:course.type, markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                        }
                    } else {
                        var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration, totalMark:course.totalMark, type:course.type, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, syllabus:course.syllabus, markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, markScored:0, batchCourseMappingId:batchCourseId};
                    }
                    db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId, fkCourseId:courseId, activeFlag:1}, {$set:{activeFlag:0}});
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
                        if (materialAssignment) {
                            if (materialAssignment == "automatic") {
                                var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, syllabus:course.syllabus, markSheetElements:course.markSheetElements, fkCourseId:courseId, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, users:userList, evaluator:data.evaluator};
                            } else if (materialAssignment == "cascade") {
                                var elementOrder = course.elementOrder[0];
                                var keyArray = elementOrder.split(".");
                                var tlpoint = keyArray[0];
                                var courseTimeline = {};
                                courseTimeline[tlpoint] = course.courseTimeline[tlpoint];
                                if (courseTimeline[tlpoint].totalMark) {
                                    var totalMark = courseTimeline[tlpoint].totalMark;
                                } else {
                                    var totalMark = 0;
                                }
                                var newElementOrder = {};
                                for (var key in course.elementOrder) {
                                    var orderArray = course.elementOrder[key].split(".");
                                    if (orderArray[0] == tlpoint) {
                                        newElementOrder[key] = course.elementOrder[key];
                                    }
                                }
                                var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, syllabus:course.syllabus, markSheetElements:course.markSheetElements, fkCourseId:courseId, selectedDuration:course.selectedDuration, courseTimeline:courseTimeline, elementOrder:newElementOrder, users:userList, evaluator:data.evaluator};
                            } else if (materialAssignment == "manual") {
                                var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, syllabus:course.syllabus, markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId, selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                            }
                        } else {
                            var Batchdata = {_id:batchCourseId, batchId:ObjectId(data.batchId), batchName:data.batch.batchName, batchCode:data.batch.batchCode, batchMode:data.batch.batchMode, courseType:data.batch.courseType, startDate:data.batch.startDate, endDate:data.batch.endDate, startTime:data.batch.startTime, endTime:data.batch.endTime, seats:data.batch.seats, enrollmentBefore:data.batch.enrollmentAfter, enrollmentAfter:data.batch.enrollmentBefore, repeats:data.batch.repeats, courseType:data.batch.courseType, materialAssignment:data.batch.materialAssignment, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, syllabus:course.syllabus, markSheetElements:course.markSheetElements, urmId:loggedusercrmid, activeFlag:1, fkCompanyId:companyId, fkCourseId:courseId, selectedDuration:course.selectedDuration, users:userList, evaluator:data.evaluator};
                        }
                        db.clnCourseBatchMapping.insert(Batchdata);
                    } else {
                        var arr_users = db.clnCourseBatchMapping.find({fkCourseId:courseId, batchId:ObjectId(data.batchId), users:{$elemMatch:{fkUserRoleMappingId:roleMappingsId}}}, {batchId:1}).toArray();
                        if (arr_users.length == 0) {
                            db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}}, {$push:{users:userList[0]}});
                            var clnCourseBatchObj = db.clnCourseBatchMapping.findOne({batchId:ObjectId(data.batchId), fkCourseId:courseId, enrollmentAfter:{$lt:lowerBound}, enrollmentBefore:{$gt:upperBound}}, {_id:1});
                            UserCourseMappingData.batchCourseMappingId = clnCourseBatchObj._id;
                            UserCourseMappingData.batchCourseMappingId = clnCourseBatchObj._id;
                        }
                    }
                    db.clnUserCourseMapping.insert(UserCourseMappingData);
                } else {
                    if (materialAssignment) {
                        if (materialAssignment == "automatic") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, selectedDuration:course.selectedDuration,type:course.type,  courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, totalMark:course.totalMark, syllabus:course.syllabus, markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline = {};
                            courseTimeline[tlpoint] = course.courseTimeline[tlpoint];
                            if (courseTimeline[tlpoint].totalMark) {
                                var totalMark = courseTimeline[tlpoint].totalMark;
                            } else {
                                var totalMark = 0;
                            }
                            var newElementOrder = {};
                            for (var key in course.elementOrder) {
                                var orderArray = course.elementOrder[key].split(".");
                                if (orderArray[0] == tlpoint) {
                                    newElementOrder[key] = course.elementOrder[key];
                                }
                            }
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg,type:course.type,  totalMark:totalMark, selectedDuration:course.selectedDuration, syllabus:course.syllabus, markSheetElements:course.markSheetElements, courseTimeline:courseTimeline, elementOrder:newElementOrder, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        } else if (materialAssignment == "manual") {
                            var UserCourseMappingData = {_id:UserCourseMappingDataId, fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, syllabus:course.syllabus, markSheetElements:course.markSheetElements, courseImg:course.courseImg, selectedDuration:course.selectedDuration,type:course.type,  totalMark:course.totalMark, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                        }
                    } else {
                        var UserCourseMappingData = {fkUserLoginId:userId.fkUserLoginId, fkUserRoleMappingId:roleMappingsId, fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg,type:course.type,  selectedDuration:course.selectedDuration, totalMark:course.totalMark, syllabus:course.syllabus, markSheetElements:course.markSheetElements, createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
                    }
                    db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId, fkCourseId:courseId, activeFlag:1}, {$set:{activeFlag:0}});
                    db.clnUserCourseMapping.insert(UserCourseMappingData);
                }
                resultmsg = "exsisting mentee new course";
            }
        }
    }
    var result = {result:resultmsg, evaluatorEmailLIst:evaluatorEmails, userId:userLoginDataId};
    return result;
}
});




//fnRegisterCollege

db.system.js.save({
    "_id" : "fnRegisterCollege",
    "value" : function (data) {
        var college=JSON.parse(JSON.stringify(data.college));
        var result=fnRegisterUser(college);
        var collegeData={fkUserLoginId:result.userId,Courses:data.college.mandatoryData.Courses,address:data.college.mandatoryData.address,collegeName:data.college.mandatoryData.collegeName,contactPersons:data.college.mandatoryData.contactPersons,departments:data.college.mandatoryData.departments,eMail:data.college.mandatoryData.eMail,location:data.college.mandatoryData.location,companyId:ObjectId(data.college.companyId),crmId:ObjectId(data.college.loggedusercrmid),urmId:ObjectId(data.college.loggedusercrmid),createdDate:Date(),updatedDate:Date(),activeFlag:1};
        db.clnCollege.save(collegeData);
    
    return result;
}});