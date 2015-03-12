db.system.js.save({_id: "fnSubmitTest",
                  value: function (SubmitTestObj) {
          var courseMappingId=ObjectId(SubmitTestObj.courseMappingId);
          var userLoginId=ObjectId(SubmitTestObj.userLoginId);
          var keyName=SubmitTestObj.keyName;
          var tlPointInmins=SubmitTestObj.tlPointInmins;
          var outerIndex=SubmitTestObj.outerIndex;
          var innerIndex=SubmitTestObj.innerIndex;
          var timeObj=SubmitTestObj.timeObj;
          var userAnswers=SubmitTestObj.userAnswers;
          var totalMarkScored=SubmitTestObj.totalMarkScored;
          var resultmsg;
var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});  
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=0;  
    }
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored+totalMarkScored;
    if(!course.courseTimeline[tlPointInmins].markScored){
    course.courseTimeline[tlPointInmins].markScored=0;  
    }
    course.courseTimeline[tlPointInmins].markScored=course.courseTimeline[tlPointInmins].markScored+totalMarkScored;
    if(!course.markScored){
    course.markScored=0;  
    }  
    course.markScored=course.markScored+totalMarkScored;
     course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;  
    for(var index in userAnswers){
    	for(var key in userAnswers[index]){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.testModel[index][key]=userAnswers[index][key];
        }
    }
db.clnUserCourseMapping.save(course);
return course;
}});


//fnSaveTestStartTime
db.system.js.save({_id: "fnSaveTestStartTime",
                  value: function (StartTimeObj) {                  
          var courseMappingId=ObjectId(StartTimeObj.courseMappingId);
          var userLoginId=ObjectId(StartTimeObj.userLoginId);
          var keyName=StartTimeObj.keyName;
          var tlPointInmins=StartTimeObj.tlPointInmins;
          var outerIndex=StartTimeObj.outerIndex;
          var innerIndex=StartTimeObj.innerIndex;
          var timeObj=StartTimeObj.timeObj;
          var resultmsg;
var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]){
    course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;  
    db.clnUserCourseMapping.save(course);
    resultmsg='test Started';
    }
    else{
      resultmsg='test already started or finished';
    }
return {result:resultmsg};
}});



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
var UserRoleMappingDataId= new ObjectId();
var userLoginDataId= new ObjectId();
var menu =db.clnRoleMenuMapping.findOne({fkRoleId:roleId},{_id:0,menuStructure:1});
if(menu==null){
  menu={};
  menu.menuStructure=[];
}
UserLoginData={_id: userLoginDataId, userName: mandatoryData.eMail, password: mandatoryData.password, roleMappings:[UserRoleMappingDataId],lastLoggedRoleMapping:UserRoleMappingDataId,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1};
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
var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
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
usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};
db.clnUserMenuMapping.insert(usermenuData);
data.fkCompanyId=companyId;
UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:roleId,fkUserLoginId:userId.fkUserLoginId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:[data],createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
db.clnUserRoleMapping.insert(UserRoleMappingData);
resultmsg='exsisting user new role';
}
if(roleId==3){
var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId,fkCourseId:courseId,activeFlag:1},{$set:{activeFlag:0}});
db.clnUserCourseMapping.insert(UserCourseMappingData);
resultmsg='exsisting mentee new course';
}
}
var result={result:resultmsg};
return result;
}});




//to update current user course mapping 

var courses=db.clnUserCourseMapping.find({activeFlag:1}).toArray();
for(var index in courses){
    UserRoleMappingCheck=db.clnUserRoleMapping.findOne({fkUserLoginId:courses[index].fkUserLoginId,fkRoleId:3,activeFlag:1},{_id:1});
    courses[index].fkUserRoleMappingId=UserRoleMappingCheck._id;
    db.clnUserCourseMapping.save(courses[index]);
}

