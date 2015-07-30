

//fnComRegInsert
db.system.js.save({
    "_id" : "fnComRegInsert",
    "value" : function (data){

 //ids to insert into clnUserRoleMapping,clnUserLogin,clnCompany
 var companyAdminroleId=2;
 var UserRoleMappingDataId= new ObjectId();
 var userLoginDataId= new ObjectId();
 var companyDataId=new ObjectId();
 var companyLogo=companyDataId.valueOf();
 var menu =db.clnRoleMenuMapping.findOne({fkRoleId:companyAdminroleId},{_id:0,menuStructure:1});


 //data to clnUserRoleMapping
 UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:companyAdminroleId,fkUserLoginId:userLoginDataId,fkCompanyId:companyDataId,fkEmployeeId:"",fkConsumerId:"",groups:[],createdDate:Date(),updatedDate:Date(),crmId:data.loggedusercrmid,urmId:data.loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
 db.clnUserRoleMapping.insert(UserRoleMappingData);

//data to clnUserLogin
 UserLoginData={_id: userLoginDataId, userName: data.eMail, password: data.password, roleMappings:[UserRoleMappingDataId],companyId:companyDataId,lastLoggedRoleMapping:UserRoleMappingDataId,createdDate:Date(),updatedDate:Date(),crmId:data.loggedusercrmid,urmId:data.loggedusercrmid,activeFlag:1}
// insertion to clnUserLogin
db.clnUserLogin.insert(UserLoginData);



 usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,companyId:companyDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId : data.loggedusercrmid,urmId : data.loggedusercrmid,"activeFlag" : 1}
            
 db.clnUserMenuMapping.insert(usermenuData)


//data to clnCompany
 companyData={_id:companyDataId,fkuserLoginId: userLoginDataId,companyName: data.companyName,domainName:data.domainName,fkSectorId: data.fksectorId,eMail: data.eMail,alternateEmail: data.alternateEmail,Phone: data.Phone,Mobile: data.Mobile,Fax: data.Fax,webSite: data.webSite,fkCountryId: data.fkcountryId,fkStateId: data.fkstateId,fkDistrictId: data.fkdistrictId,zipCode:data.zipCode,Address: data.Address,facebook: data.Facebook,gplus: data.Google,twitter: data.Twitter,linkedin: data.LinkedIn,tagLine:data.tagLine,companyType:data.companyType,companyLogo:companyLogo,createdDate:Date(),updatedDate:Date(),crmId:data.loggedusercrmid,urmId:data.loggedusercrmid,appSettings:{},activeFlag:1}
 // insertion to clnCompany
db.clnCompany.insert(companyData);
var result={cmail:companyData.eMail,cLogo:companyLogo,companyId:companyDataId};


var globalconfigObj={
    "companyId" :companyDataId.valueOf(),
    "activeFlag" : 1,
    "createdDate" :Date(),
    "updatedDate" :Date(),
    "crmId" : data.loggedusercrmid,
    "urmId" : data.loggedusercrmid,
    "menuColor" : "random",
    "modernView" : "modern",
    "subTitleAndBackColor" : "random",
    "itemCodes" : []
};

db.clnGlobalSettings.insert(globalconfigObj);

return result;

}});



db.system.js.save({_id:"fnFetchCurrentStatus",
"value":function(data){

    var tab=data.tab;
    var userId=ObjectId(data.userId);
    var companyId=ObjectId(data.companyId);
    var result='';
    if((tab=='Account')||(tab=='Job')){
        result=db.clnUserDetails.findOne({fkUserLoginId:userId,activeFlag:1},{status:1,_id:0});
        if(result.status==undefined){
            result.status={};
            result.status[tab]='';

        }

    }else if(tab=='Course'){
        var result=db.clnUserCourseMapping.find({fkUserLoginId:userId,activeFlag:1},{status:1,Name:1,_id:1}).toArray();
        if(result.length>0){
            for(var index in result){
                if(result[index].status==undefined){
                    result[index].status='';
                }
            }
        }


    }



    return result;

}});



//fnSetStatus

db.system.js.save({_id:"fnSetStatus",
"value":function(data){
var tab=data.tab;
var userId=ObjectId(data.userId);
var companyId=ObjectId(data.companyId);
var status=data.status;
var rm_id=data.rm_id;
var result='';
var previousStatus='';

if((tab=='Account')||(tab=='Job')){
        var UserDetails=db.clnUserDetails.findOne({fkUserLoginId:userId,activeFlag:1});
        
        if(UserDetails.status==undefined){
            UserDetails.status={};
            previousStatus='';
        }else{
        previousStatus=UserDetails.status[tab];
        }
        UserDetails.status[tab]=status[tab];
        UserDetails.updatedDate=Date(),
        UserDetails.urmId=ObjectId(rm_id)
        

        var statusObj={statusChangedOn:Date(),previousStatus:previousStatus,statusChangedby:rm_id,statusChangedTo:status[tab]}
        if(UserDetails.statusHistory==undefined){
            UserDetails.statusHistory={};
        }
        if(UserDetails.statusHistory[tab]==undefined){
            UserDetails.statusHistory[tab]=[];
        }
        UserDetails.statusHistory[tab].push(statusObj);
        db.clnUserDetails.save(UserDetails);
        

    }else if(tab=='Course'){
        var course=db.clnUserCourseMapping.findOne({_id:ObjectId(status[tab]._id)},{status:1,statusHistory:1})
        if(course.status==undefined){
            course.status={};
            previousStatus='';
        }else{
        previousStatus=course.status;
        }

        var statusObj={statusChangedOn:Date(),previousStatus:previousStatus,statusChangedby:rm_id,statusChangedTo:status[tab].status}
        if(course.statusHistory==undefined){
            course.statusHistory=[];
        }       
        course.statusHistory.push(statusObj);

        db.clnUserCourseMapping.update({_id:ObjectId(status[tab]._id)},{$set:{status:status[tab].status,statusHistory:course.statusHistory, updatedDate:Date(),urmId:ObjectId(rm_id)}});

    }

return {"tab":tab,"userId":userId,"companyId":companyId,"status":status,"result":result};

}});


db.system.js.save({
    "_id" : "fnfetchUserResultReport",
    "value" : function(companyId,searchKey,course,date) {
   var result;
    var resultObj={};


    function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    // Create an ObjectId with that hex timestamp
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId
    }


// Find all documents created after midnight on May 25th, 1980
// db.mycollection.find({ _id: { $gt: objectIdWithTimestamp('1980/05/25') } });

    if((date.fromDate!=undefined)&&(date.toDate!=undefined)){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate),$lt: objectIdWithTimestamp(date.toDate)  },fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
    }else if (date.fromDate!=undefined){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
    }else if (date.toDate!=undefined){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $lt: objectIdWithTimestamp(date.toDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});                
    }else{
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
    }

    
     

        result=db.clnUserDetails.find({"profile.CollegeName":{$regex:new RegExp(searchKey,'i')},"fkUserLoginId":{$in:userloginIds}},{profile:1,fkUserLoginId:1,userName:1}).sort({_id:-1}).toArray();   

        if(result.length!=0){  
            var resultArray=[];
            for(var i in result){
                var user=result[i];
                var tempArray=[];
            fields=['firstName','lastName','CollegeName','YearOfPassing','course','branch','mobile','District','Location','PreferredWorkingLocations']
                for(index in fields){
                    if(user.profile[fields[index]]==undefined){
                        user.profile[fields[index]]=""
                    }
                }
                var tempuserCourse=db.clnUserCourseMapping.findOne({fkCourseId:ObjectId(course._id),fkUserLoginId:user.fkUserLoginId},{totalMark:1,markScored:1,_id:0});
                user.totalMark=tempuserCourse.totalMark;
                user.markScored=tempuserCourse.markScored;
                tempArray=[user.profile.firstName+' '+user.profile.lastName,user.profile.CollegeName,user.markScored+'/'+user.totalMark,user.profile.YearOfPassing,user.profile.course,user.profile.branch,user.profile.mobile,user.profile.District,user.profile.Location,user.profile.PreferredWorkingLocations];
                resultArray.push(tempArray);

            }
        }

    
    resultObj.userList=resultArray;
    resultObj.searchKey=searchKey;
    resultObj.selectedTest=[course];
    resultObj.date=date;  

    return resultObj;
}
});