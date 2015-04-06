// to register a user 
//modified with assignment mode of course material

db.system.js.save({_id: "fnRegisterUser",
                  value:function (data){
  if(isNaN(data.role.roleId)){
     roleId=ObjectId(data.role.roleId);
     delete data.role;
  }
  else if(!isNaN(data.role.roleId)){
    roleId=data.role.roleId;
    delete data.role;
  }else{
                 roleId=data.role.roleId;
                delete data.role;
            }
    var evaluatorEmails=[];
    var mandatoryData=data.mandatoryData;            
delete data.mandatoryData;
      if(roleId==3){
        if(data.course!=undefined){
  var courseId=ObjectId(data.course._id);
    delete data.course;
     //newly added by arun 
    if(data.coursetype!=undefined){
      var coursetype= data.coursetype;
      delete data.coursetype;
      }
    if(data.materialAssignment!=undefined){
      var materialAssignment= data.materialAssignment;
      delete data.materialAssignment;
      }
    
  var course=db.clnCourses.findOne({_id:courseId},{_id:0,Name:1,courseTimeline:1,Duration:1,Description:1,courseImg:1,totalMark:1,selectedDuration:1,elementOrder:1});
  var UserCourseMappingDataId= new ObjectId();
  //added by vineeth for converting date to iso format--
            if(data.batch != undefined){
                
               data.batch.enrollmentBefore=ISODate(data.batch.enrollmentBefore);
               data.batch.enrollmentAfter=ISODate(data.batch.enrollmentAfter);
               data.batch.startDate=ISODate(data.batch.startDate);
               data.batch.endDate=ISODate(data.batch.endDate); 
                var lowerBound =new Date();
                var upperBound =new Date();
                upperBound.setDate(data.batch.enrollmentAfter.getDate()-1);
                lowerBound.setDate(data.batch.enrollmentBefore.getDate()+1); 
             }
          //------------------------------------------------  
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


if(data._id==undefined || data._id==null){
         
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
 //insertion to clnUserLogin
db.clnUserLogin.insert(UserLoginData);
delete mandatoryData.eMail;
delete mandatoryData.password;

//inserting into user details
UserDetails={fkUserLoginId:userLoginDataId,profile:mandatoryData,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,approvedFlag:0,activeFlag:1};

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



if(data.batch!=undefined || data.batch!=null){
//added by vineeth for inserting batch details
     var batchCourseId = new ObjectId();
    //courseTimeline:course.courseTimeline,
     //elementOrder:course.elementOrder, 

     if(materialAssignment){
      if(materialAssignment=='automatic'){
        var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,
elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
        
      }
      else if(materialAssignment=='cascade'){
        var elementOrder=course.elementOrder[0];
        var keyArray=elementOrder.split('.');
        var tlpoint=keyArray[0];
        var elementType=keyArray[1];
        var outer=keyArray[2];

        

       var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,
elementOrder:course.elementOrder[0],createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
        
      }
      else if(materialAssignment=='manual'){
        var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
        
      }
    }
    else{
      var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
    } 
// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);
    
 var count = db.clnCourseBatchMapping.count({"batchId":ObjectId(data.batchId),fkCourseId:courseId,"enrollmentAfter":{$lt:lowerBound},"enrollmentBefore":{$gt:upperBound}
    }); 
    var user={};
                   var userList=[]
                   user.fkUserLoginId=userLoginDataId;
                   user.fkUserRoleMappingId =UserRoleMappingDataId;
                   userList.push(user);
    if(count==0){
              if(data.evaluator !=undefined){
                  
                for(var index in  data.evaluator){
                  var evaluatorList={};     
                  data.evaluator[index].roleMappingId=ObjectId(data.evaluator[index].roleMappingId);
                 evaluatorList.Name =data.evaluator[index].Name;    
                 evaluatorList.Email= db.clnUserLogin.findOne({roleMappings:{$in:[data.evaluator[index].roleMappingId]}},{_id:0,userName:1}) 
                  evaluatorEmails.push(evaluatorList);      
                }
              }    
                   
                  var Batchdata={_id:batchCourseId,batchId:ObjectId(data.batchId),batchName:data.batch.batchName,batchCode:data.batch.batchCode,batchMode:data.batch.batchMode,courseType:data.batch.courseType,startDate:data.batch.startDate,endDate:data.batch.endDate,startTime:data.batch.startTime,endTime:data.batch.endTime,seats:data.batch.seats,enrollmentBefore:data.batch.enrollmentAfter,enrollmentAfter:data.batch.enrollmentBefore,repeats:data.batch.repeats,courseType:data.batch.courseType,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1,fkCompanyId:companyId,fkCourseId:courseId,users:userList,evaluator:data.evaluator}
                 db.clnCourseBatchMapping.insert(Batchdata); 
   }else{
      var arr_users= db.clnCourseBatchMapping.find( 
                 {fkCourseId:courseId,batchId:ObjectId(data.batchId), users: { $elemMatch: { fkUserRoleMappingId:UserRoleMappingDataId } } },
                 {batchId:1} ).toArray();
        if(arr_users.length==0){        
       db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId),fkCourseId:courseId,"enrollmentAfter":{$lt:lowerBound},"enrollmentBefore":{$gt:upperBound}},{$push:{users:userList[0]}})
     }   
   }               
                }
                 else{

                  if(materialAssignment){
      if(materialAssignment=='automatic'){
        var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,
elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
        
      }
      else if(materialAssignment=='cascade'){
        var elementOrder=course.elementOrder[0];
        var keyArray=elementOrder.split('.');
        var tlpoint=keyArray[0];
        var elementType=keyArray[1];
        var outer=keyArray[2];

        

       var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,
elementOrder:course.elementOrder[0],createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
        
      }
      else if(materialAssignment=='manual'){
        var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
        
      }
    }
    else{
      var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
    }
                
// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);  
                } 
  }
 }
 
resultmsg='new user registered';

}

if (data._id!=undefined || data._id!=null){ 

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

var roleMappingsId= new ObjectId();
var menu =db.clnRoleMenuMapping.findOne({fkRoleId:roleId},{_id:0,menuStructure:1});
if(menu==null){
  menu={};
  menu.menuStructure=[];
}
//setting menu for user
usermenuData={fkUserRoleMappingId :roleMappingsId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId :loggedusercrmid,urmId :loggedusercrmid,activeFlag : 1};
            
db.clnUserMenuMapping.insert(usermenuData);

data.fkCompanyId=companyId;
//data to clnUserRoleMapping
UserRoleMappingData={_id:roleMappingsId,fkRoleId:roleId,fkUserLoginId:userId.fkUserLoginId,fkEmployeeId:"",fkConsumerId:"",groups:[],profile:[data],createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
db.clnUserRoleMapping.insert(UserRoleMappingData);
resultmsg='exsisting user new role';

}
 

if(roleId==3){

//added by vineeth for updating the batch details of already existing user
          if(data.batch!=undefined || data.batch!=null){//added by vineeth for inserting batch details
               var batchCourseId = new ObjectId();

               if(materialAssignment){
      if(materialAssignment=='automatic'){
        var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,
elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
        
      }
      else if(materialAssignment=='cascade'){
        var elementOrder=course.elementOrder[0];
        var keyArray=elementOrder.split('.');
        var tlpoint=keyArray[0];
        var elementType=keyArray[1];
        var outer=keyArray[2];

        

       var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,
elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};

       var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
        
      }
      else if(materialAssignment=='manual'){
         var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
        
      }
    }
    else{
      var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
    }
             
// setting all active same course as inactive
db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId,fkCourseId:courseId,activeFlag:1},{$set:{activeFlag:0}});

// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);   
              var count = db.clnCourseBatchMapping.count({"batchId":ObjectId(data.batchId),fkCourseId:courseId,"enrollmentAfter":{$lte:lowerBound},"enrollmentBefore":{$gt:upperBound}
    }); 
    var user={};
                   var userList=[]
                   user.fkUserLoginId=userId.fkUserLoginId;
                   user.fkUserRoleMappingId =roleMappingsId;
                   userList.push(user);
    if(count==0){  
                 if(data.evaluator !=undefined){
               
                for(var index in  data.evaluator){
                   var evaluatorList={};          
                  data.evaluator[index].roleMappingId=ObjectId(data.evaluator[index].roleMappingId);
                 evaluatorList.Name =data.evaluator[index].Name;    
                 evaluatorList.Email= db.clnUserLogin.findOne({roleMappings:{$in:[data.evaluator[index].roleMappingId]}},{_id:0,userName:1}) 
                  evaluatorEmails.push(evaluatorList);      
                }
              }    
                  var Batchdata={_id:batchCourseId,batchId:ObjectId(data.batchId),batchName:data.batch.batchName,batchCode:data.batch.batchCode,batchMode:data.batch.batchMode,courseType:data.batch.courseType,startDate:data.batch.startDate,endDate:data.batch.endDate,startTime:data.batch.startTime,endTime:data.batch.endTime,seats:data.batch.seats,enrollmentBefore:data.batch.enrollmentAfter,enrollmentAfter:data.batch.enrollmentBefore,repeats:data.batch.repeats,courseType:data.batch.courseType,createdDate:Date(), updatedDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1,fkCompanyId:companyId,fkCourseId:courseId,users:userList,evaluator:data.evaluator}
                db.clnCourseBatchMapping.insert(Batchdata); 
   }else{
        var arr_users= db.clnCourseBatchMapping.find( 
                 {fkCourseId:courseId,batchId:ObjectId(data.batchId), users: { $elemMatch: { fkUserRoleMappingId:roleMappingsId } } },
                 {batchId:1} ).toArray();
     if(arr_users.length==0){                     
       db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId),fkCourseId:courseId,"enrollmentAfter":{$lt:lowerBound},"enrollmentBefore":{$gt:upperBound}},{$push:{users:userList[0]}})
   } 
   }    
          }else{//if batch is not added then insert element order and timeline into clnUserCourseMapping
                //courseTimeline:course.courseTimeline,
              //elementOrder:course.elementOrder,
            //data to clnUserCourseMapping
            if(materialAssignment){
      if(materialAssignment=='automatic'){
        var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,elementOrder:course.elementOrder,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
        
      }
      else if(materialAssignment=='cascade'){
        var elementOrder=course.elementOrder[0];
        var keyArray=elementOrder.split('.');
        var tlpoint=keyArray[0];
        var elementType=keyArray[1];
        var outer=keyArray[2];

        

 var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,courseTimeline:course.courseTimeline,elementOrder:course.elementOrder,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
        
      }
      else if(materialAssignment=='manual'){
        var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
        
      }
    }
    else{
     var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
    }
// setting all active same course as inactive
db.clnUserCourseMapping.update({fkUserLoginId:userId.fkUserLoginId,fkCourseId:courseId,activeFlag:1},{$set:{activeFlag:0}});

// insertion to clnUserCourseMapping
db.clnUserCourseMapping.insert(UserCourseMappingData);  
              
          }
            
        //-----------------------------------------------    
resultmsg='exsisting mentee new course';

}


}

var result={result:resultmsg,evaluatorEmailLIst:evaluatorEmails};
return result;      
  
  
}
});
