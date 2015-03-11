//to update current user course mapping 

var courses=db.clnUserCourseMapping.find({activeFlag:1}).toArray();
for(var index in courses){
    UserRoleMappingCheck=db.clnUserRoleMapping.findOne({fkUserLoginId:courses[index].fkUserLoginId,fkRoleId:3,activeFlag:1},{_id:1});
    courses[index].fkUserRoleMappingId=UserRoleMappingCheck._id;
    db.clnUserCourseMapping.save(courses[index]);
}







// to register a user 
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
         
//ids to insert into clnUserRoleMapping,clnUserLogin,clnCompany
var UserRoleMappingDataId= new ObjectId();
var userLoginDataId= new ObjectId();
var menu =db.clnRoleMenuMapping.findOne({fkRoleId:roleId},{_id:0,menuStructure:1});
if(menu==null){
	menu={};
	menu.menuStructure=[];
}

 
//data to clnUserLogin
UserLoginData={_id: userLoginDataId, userName: mandatoryData.eMail, password: mandatoryData.password, roleMappings:[UserRoleMappingDataId],lastLoggedRoleMapping:UserRoleMappingDataId,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
// insertion to clnUserLogin
db.clnUserLogin.insert(UserLoginData);

delete mandatoryData.eMail;
delete mandatoryData.password;
//inserting into user details
UserDetails={fkUserLoginId:userLoginDataId,profile:mandatoryData,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1};

db.clnUserDetails.insert(UserDetails);

//setting menu for user
usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};
            
db.clnUserMenuMapping.insert(usermenuData);



//data to clnUserRoleMapping
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userLoginDataId,fkCompanyId:companyId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:data,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
db.clnUserRoleMapping.insert(UserRoleMappingData);

if(roleId==3){
	if(course!=undefined){
//data to clnUserCourseMapping
var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};

// insertion to clnUserCourseMapping
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

var UserRoleMappingCheck=db.clnUserRoleMapping.findOne({fkUserLoginId:userId.fkUserLoginId,fkRoleId:roleId,activeFlag:1},{_id:1});
if(UserRoleMappingCheck!=null){
var roleMappingsId=UserRoleMappingCheck._id;
	var set={};
 set.updatedDate=Date();
 set.urmId=loggedusercrmid;
 data.fkCompanyId=companyId;

db.clnUserRoleMapping.update({_id:roleMappingsId},{'$pull':{'profile':{fkCompanyId:companyId}}});

 //update to clnUserRoleMappingprofile.fkCompanyId
db.clnUserRoleMapping.update({_id:roleMappingsId},{'$set':set,'$push':{'profile':data}});
resultmsg='exsisting user exsisting role update';
}
else{

var UserRoleMappingDataId= new ObjectId();
var menu =db.clnRoleMenuMapping.findOne({fkRoleId:roleId},{_id:0,menuStructure:1});
if(menu==null){
	menu={};
	menu.menuStructure=[];
}
//setting menu for user
usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};
            
db.clnUserMenuMapping.insert(usermenuData);

data.fkCompanyId=companyId;
//data to clnUserRoleMapping
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userId.fkUserLoginId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:[data],createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
db.clnUserRoleMapping.insert(UserRoleMappingData);
resultmsg='exsisting user new role';

}
 

if(roleId==3){
//data to clnUserCourseMapping
var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
// setting all active same course as inactive
db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId,fkCourseId:courseId,activeFlag:1},{$set:{activeFlag:0}});

// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);
resultmsg='exsisting mentee new course';
}


}

var result={result:resultmsg};
return result;

}  });

