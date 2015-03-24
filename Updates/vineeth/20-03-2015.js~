db.clnUserLogin.createIndex({roleMappings: 1})
db.clnCourses.ensureIndex( { Designation: 1 } )
db.clnCourses.dropIndex("Name_text_Technologies_text_Domains_text_Tags_text_Branches_text")
db.clnCourses.ensureIndex(//for adding text index
                           {
                             Name: "text",
                             Technologies:"text",
                             Domains:"text",
                             Tags:"text" ,
                             Branches:"text" ,
                             Designation:"text"  
                           }
                         )
db.system.js.save({_id: "fun_load_publishedCourses",
		value: function (companyId,searchKey,lastId,type,firstId) 
{
 if (searchKey !=''){
     if(type!=''){
          switch(type){
              case 'Domains':  
                 courses= db.clnCourses.find({Domains:searchKey,
                          companyId:ObjectId(companyId),
                          draftFlag:1, 
                          activeFlag:1
                           },
                           {Name:1,courseImg:1,courseDetails:1}).                           limit(12).sort({_id:-1}).toArray();
              break;
              case 'Technologies':  
                 courses= db.clnCourses.find({'Technologies':searchKey,
                          companyId:ObjectId(companyId),
                          draftFlag:1, 
                          activeFlag:1},    
                           {Name:1,courseImg:1,courseDetails:1}).                           limit(12).sort({_id:-1}).toArray();
             break;
             case 'Branches':  
                courses= db.clnCourses.find({'Branches':searchKey,
                         companyId:ObjectId(companyId),
                         draftFlag:1, 
                         activeFlag:1
                         },
                         {Name:1,courseImg:1,courseDetails:1}).                         limit(12).sort({_id:-1}).toArray();
             break;   
             case 'Designation':  
                courses= db.clnCourses.find({'Designation':searchKey,
                         companyId:ObjectId(companyId),
                         draftFlag:1, 
                         activeFlag:1
                         },
                         {Name:1,courseImg:1,courseDetails:1}).                         limit(12).sort({_id:-1}).toArray();
             break;               
            case 'Tags' :
               courses= db.clnCourses.find({'Tags':searchKey,
                        companyId:ObjectId(companyId),
                        draftFlag:1, 
                        activeFlag:1
                        },
                        {Name:1,courseImg:1,courseDetails:1}).limit                        (12).sort({_id:-1}).toArray();
            break; 
           case 'Delivery':
             if( searchKey=='online'){
                  courses= db.clnCourses.find({'Delivery.online':                           true,
                           companyId:ObjectId(companyId),
                           draftFlag:1, 
                           activeFlag:1
                           },
                           {Name:1,courseImg:1,courseDetails:1}).                           limit(12).sort({_id:-1}).toArray();
             }else{
                 courses= db.clnCourses.find({'Delivery.offline':                          true,
                          companyId:ObjectId(companyId),
                          draftFlag:1, 
                          activeFlag:1},
                          {Name:1,courseImg:1,courseDetails:1}).                          limit(12).sort({_id:-1}).toArray();
            } 
            break; 
  
        }//switch ends  
     
     }else{ 
             courses= db.clnCourses.find({$text:{$search:searchKey},
                      companyId:ObjectId(companyId),
                      draftFlag:1, 
                      activeFlag:1},
                      {Name:1,courseImg:1,courseDetails:1}).limit(12                      ).sort({_id:-1}).toArray(); 
         }    
 }else{
         if(type=='next'){
              courses= db.clnCourses.find({
                       companyId:ObjectId(companyId),
                       draftFlag:1, 
                       activeFlag:1,   
                      _id:{$lt:ObjectId(lastId)}},
                       {Name:1,courseImg:1,courseDetails:1}).limit(                       12).sort({_id:-1}).toArray(); 
         }else if(type=='prev'){
              courses= db.clnCourses.find({
                       companyId:ObjectId(companyId),
                       draftFlag:1, 
                       activeFlag:1,   
                       _id:{$gt:ObjectId(firstId)},
                      },
                       {Name:1,courseImg:1,courseDetails:1}).limit(                       12).sort({_id:1}).toArray();  
                 
        }else{
               courses= db.clnCourses.find({
                        companyId:ObjectId(companyId),
                       draftFlag:1, 
                       activeFlag:1   
                       },
                       {Name:1,courseImg:1,courseDetails:1}).limit(                        12).sort({_id:-1}).toArray();
       
      
        } 
  }  
   
   
   if(courses.length!=0){       
          if(type=='prev'){
             lastItem=courses[0]._id;
             firstItem=courses[courses.length-1]._id;  
             courses.reverse();
           }else{
             lastItem=courses[courses.length-1]._id;      
            firstItem=courses[0]._id;
          } 
    }else{   
         if(type=='prev'){
          firstItem=ObjectId(firstId);  
          lastItem =ObjectId(lastId);
         }else if(type=='next'){
           firstItem=ObjectId(lastId);  
          lastItem =ObjectId(firstId);   
         }else{
             firstItem=[];
             lastItem=[];
         }   
    }
    return {courses:courses,lastId:lastItem,firstId:firstItem,courseLength:courses.length}

}});
//--------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnAddNewBatches",
		value: function (batchObj) 
{
    // write your code here
    batchObj.createdDate=ISODate();
    batchObj.updatedDate=ISODate();
    //if(batchObj.repeats.startDate!=undefined){
    batchObj.startDate=ISODate(batchObj.startDate);
    batchObj.endDate=ISODate(batchObj.endDate);
   if (batchObj.instructorLead == true &&  batchObj.offline == true ) {//checking whether the object is exist 
       delete batchObj.instructorLead;
       delete batchObj.offline;
          batchObj.courseType="instructorLead"
        result= db.clnBatches.insert(batchObj);
         batchObj.courseType="offline"
        result= db.clnBatches.insert(batchObj);
   } else if(batchObj.instructorLead == true){
        delete batchObj.instructorLead;
       delete batchObj.offline;
       batchObj.courseType="instructorLead"
      result= db.clnBatches.insert(batchObj);
   } else if(batchObj.offline == true){
       delete batchObj.instructorLead;
       delete batchObj.offline;
      batchObj.courseType="offline"
    result= db.clnBatches.insert(batchObj);
   }
    return result;
}});

//-----------------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnLoadBatches",
		value: function (cmpId) 
{
   result= db.clnBatches.find({companyId:ObjectId(cmpId),
                            activeFlag:1,                     
                           }
                          ).toArray()                 
// write your code here
      return {result:result};
}});
//--------------------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnAddCoursesToBatch",
		value: function (batch) 
{
    batch.createdDate=ISODate();
    batch.updatedDate=ISODate();
    db.clnBatches.save(batch);
    return 'success';

}});
//-----------------------------------------------------------------------------------------------------------------

db.system.js.save({_id: "fnLoadCourseRelatedBatches",
		value: function (cmpId,courseId,joining_date,Type) 
{
  var results=[];
    
     joining_date=ISODate(joining_date)     
    
    //joining_date=ISODate(joining_date)
    //var selectedDuration=db.clnCourses.find("_id":ObjectId(courseId))
    db.clnBatches.find({companyId:ObjectId(cmpId),
                    course:{$elemMatch:{_id:courseId}},
                            activeFlag:1,
                            courseType:Type,
                    endDate:{$gt:joining_date}
                }).forEach( function(batch) { 
                    var lowerBound=new Date();
                    var upperBound= new Date(); 
                    var start=new Date();
                    var end=new Date(); 
                    if(batch.batchMode=="onetime"){ //checking the batchMode
                       batch.enrollmentBefore =new Date();
                       batch.enrollmentAfter =new Date(); 
                       lowerBound=new Date(batch.startDate.getTime()- batch.Admission.beforeDaysCount*24*60*60*1000);
                       upperBound=new Date(batch.startDate.getTime()+ batch.Admission.afterDaysCount*24*60*60*1000);
                        var timediff_onetime=Math.abs(batch.endDate.getTime()-batch.startDate.getTime());
                        var diffDays_onetime = Math.ceil(timediff_onetime / (1000 * 3600 * 24)); //calculating the date difference in 
                       if(joining_date >=lowerBound && joining_date<=upperBound){
                           batch.duration=diffDays_onetime;
                           batch.enrollmentBefore=lowerBound;
                           batch.enrollmentAfter=upperBound;
                           batch.end=batch.endDate; 
                           batch.start=batch.startDate;
                           var lower =new Date();
                           var upper =new Date();
                            upper=new Date(batch.enrollmentAfter.getTime()-1*24*60*60*1000);
                            lower=new Date(batch.enrollmentBefore.getTime()+1*24*60*60*1000);
                          var Batch = db.clnCourseBatchMapping.findOne({"batchId":batch._id,fkCourseId:ObjectId(courseId),"enrollmentAfter":{$lt:lower},"enrollmentBefore":{$gt:upper}},{users:1}) 
                         if(Batch!=null){ 
                          if(Batch.users.length!=0){
                                  batch.seat= batch.seats-Batch.users.length;
                            }else{
                                batch.seat=batch.seats;
                            }
                        }else{
                             batch.seat=batch.seats;
                             }  
                          if(batch.seat!=0){ 
                           results.push(batch);
                          }    
                       }
                    }else{
                        var timeDiff = Math.abs(batch.startDate.getTime()-joining_date.getTime());//claculating the time difference between batch start date and joining date
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); //calculating the date difference in days                         
                        lowerBound=batch.Admission.beforeDaysCount; //days before taken admission
                        upperBound=batch.Admission.afterDaysCount;  //days after taken admission
                        var diff =diffDays%batch.repeats.repeatsAfter;//calculating the modulo divison of difference in days with batch repeating days
                        var currentBatchStartDate=new Date();
                        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];                     
                        var dayname="";
                        
                        if(diffDays<=lowerBound){
                            
                             currentBatchStartDate=batch.startDate;//new Date(joining_date.getTime() - diff*24*60*60*1000)
                             dayname= days[currentBatchStartDate.getDay()];//to get day name                       
                            if (typeof batch.repeats.excludedDaysRepeat != "undefined") {//checking whether the object is exist or not   
                            if(batch.repeats.excludedDaysRepeat.indexOf(dayname)!=-1){
                                 batch.start=new Date(currentBatchStartDate.getTime()+1*24*60*60*1000);                            
                             }
                           }  
                            //batch.end =new Date();
                            batch.enrollmentBefore =new Date();
                            batch.enrollmentAfter =new Date();
                            batch.start = currentBatchStartDate;//to get the batch start date
                            batch.end= new Date(batch.start.getTime() + batch.repeats.repeatsAfter*24*60*60*1000);//to get the batch end date
                            batch.enrollmentBefore=new Date(batch.start.getTime() - batch.Admission.beforeDaysCount*24*60*60*1000);//to get the enrollment before date
                            batch.enrollmentAfter=new Date(batch.start.getTime() + batch.Admission.afterDaysCount*24*60*60*1000);//to get the enrollment after days   
                             var lower =new Date();
                             var upper =new Date();
                            upper =new Date(batch.enrollmentAfter.getTime()-1*24*60*60*1000);
                            lower =new Date(batch.enrollmentBefore.getTime()+1*24*60*60*1000);
                            var Batch = db.clnCourseBatchMapping.findOne({"batchId":batch._id,fkCourseId:ObjectId(courseId),"enrollmentAfter":{$lt: lower},enrollmentBefore:{$gt:upper}},{users:1}) 
                          if(Batch!=null){ 
                            if(Batch.users.length!=0){
                                  batch.seat=batch.seats- Batch.users.length;
                            }else{
                               batch.seat=batch.seats
                                }
                          }else{
                             batch.seat=batch.seats;
                             }  
                            if(batch.seat!=0){ 
                              results.push(batch);
                            }              
                        }else{
                           
                         //var repeats_diff= batch.repeats.repeatsAfter-diffDays;
                           // currentBatchStartDate=new Date(joining_date.getTime() + repeats_diff*24*60*60*1000);  
                             currentBatchStartDate=new Date(joining_date.getTime() - diff*24*60*60*1000);  
                              batch.start=currentBatchStartDate;
                            dayname=days[currentBatchStartDate.getDay()];     
                            if(Math.abs(diff)<=upperBound){
                              if (typeof batch.repeats.excludedDaysRepeat != "undefined") {//checking whether the object is exist or not   
                                if(batch.repeats.excludedDaysRepeat.indexOf(dayname)!=-1){
                                 batch.start=new Date(batch.start.getTime()+1*24*60*60*1000);                            
                              }  
                           }  
                             
                             // batch.end =new Date();
                              batch.enrollmentBefore =new Date();
                              batch.enrollmentAfter =new Date();
                            //batch.endDate.setDate(batch.startDate.getDate() + batch.repeats.repeatsAfter);//to get the batch end date
                           batch.end=new Date(batch.start.getTime()+batch.repeats.repeatsAfter*24*60*60*1000) 
                           //print(batch.endDate)                            
                           //batch.enrollmentBefore.setDate(batch.startDate.getDate() - batch.Admission.beforeDaysCount);//to get the enrollment before date
                            batch.enrollmentBefore=new Date(batch.start.getTime()-batch.Admission.beforeDaysCount*24*60*60*1000)
                           //batch.enrollmentAfter.setDate(batch.startDate.getDate() + batch.Admission.afterDaysCount);//to get the enrollment after days
                            batch.enrollmentAfter=new Date(batch.start.getTime() + batch.Admission.afterDaysCount*24*60*60*1000);//to get the enrollment after days  
                           var lower =new Date();
                             var upper =new Date();
                            upper = new Date(batch.enrollmentAfter.getTime()-1*24*60*60*1000);
                            lower = new Date(batch.enrollmentBefore.getTime()+1*24*60*60*1000);
                             var Batch = db.clnCourseBatchMapping.findOne({"batchId":batch._id,fkCourseId:ObjectId(courseId),"enrollmentAfter":{$lt:lower},"enrollmentBefore":{$gt:upper}},{users:1}) 
                          if(Batch!=null){ 
                             if(Batch.users.length!=0){
                                  batch.seat=batch.seats- Batch.users.length;
                            }else{
                                batch.seat=batch.seats;
                                }
                         }else{
                             batch.seat=batch.seats;
                             } 
                          if(batch.seat!=0){ 
                           results.push(batch);
                          }   
                              
                          }  
                        }                 
                       
                    } 
                    
                 }) 
      //print(results)
        return results        
}});
//-----------------------------------------------------------------------------------------------------------------

db.system.js.save({_id: "fnRegisterUser",
		value: function (data) 
{

	 if(isNaN(data.role.roleId)){
		 roleId=ObjectId(data.role.roleId);
                delete data.role;
            }else if(!isNaN(data.role.roleId)){
            roleId=data.role.roleId
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
UserDetails={fkUserLoginId:userLoginDataId,profile:mandatoryData,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,status:"requested",approvedFlag:0,activeFlag:1};

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

if(data.batch!=undefined || data.batch!=null){//added by vineeth for inserting batch details
     var batchCourseId = new ObjectId();
    var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
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
                }else{
                  //data to clnUserCourseMapping
var UserCourseMappingData={_id:UserCourseMappingDataId,fkUserLoginId:userLoginDataId,fkUserRoleMappingId:UserRoleMappingDataId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,totalMark:course.totalMark,selectedDuration:course.selectedDuration,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};

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
             var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0,batchCourseMappingId:batchCourseId};
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
                 {fkCourseId:courseId,batchId:ObjectId(data.batchId), users: { $elemMatch: { fkUserRoleMappingId:UserRoleMappingDataId } } },
                 {batchId:1} ).toArray();
     if(arr_users.length==0){                     
       db.clnCourseBatchMapping.update({batchId:ObjectId(data.batchId),fkCourseId:courseId,"enrollmentAfter":{$lt:lowerBound},"enrollmentBefore":{$gt:upperBound}},{$push:{users:userList[0]}})
   } 
   }    
          }else{//if batch is not added then insert element order and timeline into clnUserCourseMapping
            //data to clnUserCourseMapping
var UserCourseMappingData={fkUserLoginId:userId.fkUserLoginId,fkUserRoleMappingId:roleMappingsId,fkCompanyId:companyId,fkCourseId:courseId,Name:course.Name,courseTimeline:course.courseTimeline,Duration:course.Duration,Description:course.Description,courseImg:course.courseImg,selectedDuration:course.selectedDuration,totalMark:course.totalMark,elementOrder:course.elementOrder,createdDate:Date(),updatedDate:Date(),crmId:loggedusercrmid,urmId:loggedusercrmid,activeFlag:1,markScored:0};
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
	
}});

//---------------------------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnLoadMenuNames",
		value: function () 
{
var results=  db.clnMenuMaster.find({},{MenuName:1,actions:1,MenuLink:1}).toArray();
  
  return results;

}});
//--------------------------------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnLoadMenuStates",
		value: function (id) 
{
var results= db.clnMenuMaster.find({_id:ObjectId(id)},{actions:1}).toArray();
    return results;

}});
//--------------------------------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnSaveTemplates",
		value: function (template) 
{
   template.createdDate= ISODate();
    template.updatedDate= ISODate();
    db.clnEmailSmsTemplateConfig.insert(template);
    return "success";
}});
//----------------------------------------------------------------------------------------------------------------------------
db.system.js.save({_id: "fnLoadTemplates",
		value: function () 
{
 var result= db.clnEmailSmsTemplateConfig.find().toArray()
   return result; 
}});




