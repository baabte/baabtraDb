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
data.fkCompanyId=companyId;
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userLoginDataId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:[data],createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
db.clnUserRoleMapping.insert(UserRoleMappingData);

if(roleId==3){
	if(course!=undefined){
//data to clnUserCourseMapping
var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};

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
var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
// setting all active same course as inactive
db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId,fkCourseId:courseId,activeFlag:1},{$set:{activeFlag:0}});

// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);
resultmsg='exsisting mentee new course';
}


}

var result={result:resultmsg};
return result;

}});











db.system.js.save({_id: "GetAuthUserData",
		value:function (data,ip_address) {
    
            ReturnData = {};
		    ip_addresses=[];
		    login_data = db.clnUserLogin.find(data, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
		    role_id = db.clnUserRoleMapping.find({_id:login_data[0].lastLoggedRoleMapping}).toArray();
		    ReturnData.ActiveUserDataId = new ObjectId;
		    var user = {};
		    user._id = ReturnData.ActiveUserDataId;
		    user.userLoginId = login_data[0]._id;
		    user.roleMappingId = login_data[0].lastLoggedRoleMapping;
		    user.roleMappingObj = role_id[0];
		    ip_addresses.push(ip_address);
                    user.ip_address=ip_addresses;
                    user.loginDate=new Date();
		    ReturnData.result = "true";
		    ReturnData.userLoginId = login_data[0]._id.valueOf();
                    ReturnData.ActiveUserData = user;
		     if(role_id[0].fkRoleId==2){
		    	var userinfo= db.clnCompany.findOne({"_id" : role_id[0].fkCompanyId},{"companyName":1,"eMail":1, "appSettings":1}); 
		        ReturnData.ActiveUserData.username =userinfo.companyName;
                        ReturnData.ActiveUserData.eMail = data.userName;
                        ReturnData.ActiveUserData.appSettings = userinfo.appSettings;
                        user.username=userinfo.companyName;
                        user.eMail=userinfo.eMail;
		    }
                    else if(role_id[0].fkRoleId==3){
                         var userdata=db.clnUserDetails.findOne({"fkUserLoginId": ObjectId(ReturnData.userLoginId)},{"profile":1,"activeFlag" : 1});
                        var username=userdata.profile.firstName.concat(" "+userdata.profile.lastName);
                        var email=data.userName;
                        ReturnData.ActiveUserData.username=username;
		    	ReturnData.ActiveUserData.eMail =email;
		    	user.username=username;
                        user.eMail=email;
		    }
		    else if(role_id[0].fkRoleId==4){
		    	var userinfo=db.clnReseller.findOne({fkuserLoginId:login_data[0]._id},{resellerName:1,email:1});
		    	ReturnData.ActiveUserData.username =userinfo.resellerName;
                        ReturnData.ActiveUserData.eMail =userinfo.email;
                        user.username=userinfo.resellerName;
                        user.eMail=userinfo.email;

		    }
                    else{
                        LogUserData = db.clnUserLogin.find({_id:ObjectId(ReturnData.userLoginId)}).limit(1).toArray();
                        ReturnData.ActiveUserData.username = LogUserData[0].userName;
                        user.username=LogUserData[0].userName;
                    }
		    userExistsOrNot=db.clnActiveUserData.find({"userLoginId":user.userLoginId}).limit(1).count();
		    if(userExistsOrNot==0){
		    	db.clnActiveUserData.insert(user);
                        db.clnLoginHistory.insert(user);
		    }
		    else{
		    	db.clnActiveUserData.update({"userLoginId":user.userLoginId},{ $push: { "ip_address": ip_address } });
                        db.clnLoginHistory.insert(user);
		    	ActiveUserDataId=db.clnActiveUserData.find({"userLoginId":user.userLoginId},{ "_id":1 }).limit(1).toArray();
		    	ReturnData.ActiveUserDataId=ActiveUserDataId[0]._id;
		    	ReturnData.ActiveUserData._id=ActiveUserDataId[0]._id;


		    }
		    
		    return ReturnData;
}});