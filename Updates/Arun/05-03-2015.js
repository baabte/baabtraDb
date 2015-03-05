db.system.js.save({_id: "fnRegisterUser",
                  value:function (data){
	if(isNaN(data.role.roleId)){
		 roleId=ObjectId(data.role.roleId);
                delete data.role;
            }
        else{
                 roleId=data.role.roleId;
                delete data.role;
            }
var mandatoryData=data.mandatoryData;            
delete data.mandatoryData;
      if(roleId==3){
      	if(data.course!=undefined){
	var courseId=ObjectId(data.course._id);
    delete data.course;
	var course=db.clnCourses.findOne({_id:courseId},{_id:0,Name:1,courseTimeline:1,Duration:1,Description:1,courseImg:1,totalMark:1,selectedDuration:1,elementOrder:1});
	var UserCourseMappingDataId= new ObjectId();
	}
}
if(data.loggedusercrmid!=undefined){
var loggedusercrmid= ObjectId(data.loggedusercrmid);
delete data.loggedusercrmid;
}
else{
var SAdminRmid=db.clnUserRoleMapping.findOne({fkRoleId:1},{_id:1});
 var loggedusercrmid=SAdminRmid._id;
}
if(data.companyId!=undefined){
var companyId=ObjectId(data.companyId);
delete data.companyId;
}
else{
	var companyId='';
}
var resultmsg;
      if(data._id==undefined){
var UserRoleMappingDataId= new ObjectId();
var userLoginDataId= new ObjectId();
var menu =db.clnRoleMenuMapping.findOne({fkRoleId:roleId},{_id:0,menuStructure:1});
if(menu==null){
	menu={};
	menu.menuStructure=[];
}
UserLoginData={_id: userLoginDataId, userName: mandatoryData.eMail, password: mandatoryData.password, roleMappings:[UserRoleMappingDataId],lastLoggedRoleMapping:UserRoleMappingDataId,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
db.clnUserLogin.insert(UserLoginData);
delete mandatoryData.eMail;
delete mandatoryData.password;
UserDetails={fkUserLoginId:userLoginDataId,profile:mandatoryData,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1};
db.clnUserDetails.insert(UserDetails);
usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};            
db.clnUserMenuMapping.insert(usermenuData);
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userLoginDataId,fkCompanyId:companyId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:data,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
db.clnUserRoleMapping.insert(UserRoleMappingData);
if(roleId==3){
	if(course!=undefined){
var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
db.clnUserCourseMapping.insert(UserCourseMappingData);
	}
 }
resultmsg='new user registered';
}
if (data._id!=undefined){ 
var userDetalisId=ObjectId(data._id);
var userId=db.clnUserDetails.findOne({_id:userDetalisId},{_id:0,fkUserLoginId:1}) 
delete data._id;
delete mandatoryData.eMail;
delete mandatoryData.password;
var setUserDetalis={};
 setUserDetalis.profile=mandatoryData;
 setUserDetalis.updatedDate=Date();
 setUserDetalis.urmId=loggedusercrmid;
db.clnUserDetails.update({_id:userDetalisId},{'$set':setUserDetalis});
var UserRoleMappingCheck=db.clnUserRoleMapping.findOne({fkUserLoginId:userId.fkUserLoginId,fkRoleId:roleId,fkCompanyId:companyId},{_id:1});
if(UserRoleMappingCheck!=null){
var roleMappingsId=UserRoleMappingCheck._id;
	var set={};
 set.profile=data;
 set.updatedDate=Date();
 set.urmId=loggedusercrmid;
db.clnUserRoleMapping.update({_id:roleMappingsId},{'$set':set});
resultmsg='exsisting user exsisting role update';
}
else{
var UserRoleMappingDataId= new ObjectId();
var menu =db.clnRoleMenuMapping.findOne({fkRoleId:roleId},{_id:0,menuStructure:1});
if(menu==null){
	menu={};
	menu.menuStructure=[];
}
usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};            
db.clnUserMenuMapping.insert(usermenuData);
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userId.fkUserLoginId,fkCompanyId:companyId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:data,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
db.clnUserRoleMapping.insert(UserRoleMappingData);
resultmsg='exsisting user new role';
}
if(roleId==3){
var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId,fkCourseId:courseId,activeFlag:1},{$set:{activeFlag:0}});
db.clnUserCourseMapping.insert(UserCourseMappingData);
resultmsg='exsisting mentee new course';
}
}
var result={result:resultmsg};
return result;
}});

