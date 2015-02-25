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
	var courseId=ObjectId(data.course._id);
    delete data.course;
	var course=db.clnCourses.findOne({_id:courseId},{_id:0,Name:1,courseTimeline:1,Duration:1,Description:1,courseImg:1,totalMark:1});
	var UserCourseMappingDataId= new ObjectId();
}
var loggedusercrmid= ObjectId(data.loggedusercrmid);
delete data.loggedusercrmid;
var companyId=ObjectId(data.companyId);
delete data.companyId;
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
//data to clnUserCourseMapping
var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};

// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);
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
 
 //update to clnUserRoleMapping
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
//setting menu for user
usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};
            
db.clnUserMenuMapping.insert(usermenuData);

//data to clnUserRoleMapping
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userId.fkUserLoginId,fkCompanyId:companyId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:data,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
db.clnUserRoleMapping.insert(UserRoleMappingData);
resultmsg='exsisting user new role';

}
 

if(roleId==3){
//data to clnUserCourseMapping
var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
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


db.system.js.save({_id: "fnUserNameValid",
                  value: function (data) {
var  userId = db.clnUserLogin.findOne({userName:data.eMail},{_id:1});
     
    if (userId == null) {
        result = {userCheck:0,result:'no user'};
    }
    else if ((userId != null)&&(data.fetch=='')) {
        result = {userCheck:1,result:'exsisting user profile not fetched'};
    }
    else if ((userId != null)&&(data.fetch=='data')) {
        var UserDetails = db.clnUserDetails.findOne({     fkUserLoginId:userId._id},{_id:1,profile:1});
    if (UserDetails!=null){
    	if (UserDetails.profile != undefined) {
        UserDetails.profile.eMail = data.eMail;
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user profile fetched'};
    	}
    	else if (UserDetails.profile == undefined) {
        UserDetails.profile.eMail = data.eMail;
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user profle not created'};
    	}
    }       
    }
    
    return result;
}});

db.system.js.save({_id: "fnFetchSpecificCustomForm",
      value: function (FetchSpecificFormObj){
        var resultmsg;
        
      var roleSchema=db.clnUserCustomForms.findOne({fkcompanyId:ObjectId(FetchSpecificFormObj.companyId),formName:FetchSpecificFormObj.fetchFormName},{_id:0,roleSchema:1});
  resultmsg='specific form fetch company for rolebased forms';
var result={'result':resultmsg,roleSchema:roleSchema}
    return result;
}
}); 