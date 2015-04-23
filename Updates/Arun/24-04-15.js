//fnFetchUsersToCourseAllocate


db.system.js.save({
    "_id" : "fnFetchUsersToCourseAllocate",
    "value" : function(companyId,firstId,type,lastId,searchKey) {
   var result;
    var resultObj={};
    var count=0;
    var UserData;
    var first,last;
    var msg;
    if(searchKey==''){
    if(type=='initial'){

        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1},{createdDate:0,updatedDate:0,activeFlag:0}).limit(9).sort({_id:-1}).toArray();
        msg='initial'+'non Search'
    }
    else if(type=='next'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0}).limit(9).sort({_id:-1}).toArray();
        msg='next'+'non Search'
        
        }
   else if(type=='prev'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0}).limit(9).sort({_id:-1}).toArray();
        msg='prev'+'non Search'
        
        }


            if(result.length!=0){       
          if(type=='prev'){

               first=result[result.length-1]._id;
             last=result[0]._id;
             
             
           }else{

             first=result[0]._id;
             last=result[result.length-1]._id;
          } 
    }else{   
         if(type=='prev'){
          first=ObjectId(firstId);  
          last =ObjectId(lastId);
         }else if(type=='next'){
           first=ObjectId(lastId);  
          last=ObjectId(firstId);   
         }else{
             first=[];
             last=[];
         }   
    }
       
        while(result.length>count){
            var rowRes=result[count];
            result[count].profile={};
            var profile=db.clnUserDetails.findOne({fkUserLoginId:rowRes.fkUserLoginId},{profile:1,_id:0});
            result[count].profile=profile.profile;
            var userName=db.clnUserLogin.findOne({_id:rowRes.fkUserLoginId},{_id:0,userName:1});
            result[count].username=userName.userName;
            rowRes.fkUserLoginId=rowRes.fkUserLoginId.valueOf();
            rowRes.userRoleMappingId=rowRes._id.valueOf();
            delete rowRes._id;
           count++;
            }

         
    }else{
     var regex='/^'+searchKey+'/i';
     
     if(type=='initial'){
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1},{createdDate:0,updatedDate:0,activeFlag:0}).limit(9).sort({_id:-1}).toArray();
        msg='initial'+'Search'

    }
    else if(type=='next'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0}).limit(9).sort({_id:-1}).toArray();
        msg='next'+' Search'
        
        }
   else if(type=='prev'){
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0}).limit(9).sort({_id:-1}).toArray();
        msg='prev'+'Search'

        
        }


        if(result.length!=0){       
          if(type=='prev'){

               first=result[result.length-1]._id;
             last=result[0]._id;

             
           }else{

             first=result[0]._id;
             last=result[result.length-1]._id;
          } 
    	}else{   
         if(type=='prev'){
          first=ObjectId(firstId);  
          last =ObjectId(lastId);
         }else if(type=='next'){
           first=ObjectId(lastId);  
          last=ObjectId(firstId);   
         }else{
             first=[];
             last=[];
         }   
    	}
       
        while(result.length>count){
            var rowRes=result[count];
            result[count].profile={};
            var profile=db.clnUserDetails.findOne({fkUserLoginId:rowRes.fkUserLoginId},{profile:1,_id:0});
            result[count].profile=profile.profile;
            var userName=db.clnUserLogin.findOne({_id:rowRes.fkUserLoginId},{_id:0,userName:1});
            result[count].username=userName.userName;
            rowRes.fkUserLoginId=rowRes.fkUserLoginId.valueOf();
            rowRes.userRoleMappingId=rowRes._id.valueOf();
            delete rowRes._id;
           count++;
            }



    }


  


    resultObj.userList=result;
    resultObj.firstId=first.valueOf();
    resultObj.lastId=last.valueOf();
    resultObj.searchKey=searchKey;
    resultObj.msg=msg;
    resultObj.regex=regex;
    return resultObj;
}
});


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
        var course = db.clnCourses.findOne({_id:courseId},{_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1});
        var UserCourseMappingData = {fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline, elementOrder:course.elementOrder, createdDate:date, updatedDate:date, crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};
        for(var key in courseAllocate.selectedUsers){
            UserCourseMappingData.fkUserLoginId=ObjectId(courseAllocate.selectedUsers[key].fkUserLoginId);
            UserCourseMappingData.fkUserRoleMappingId=ObjectId(key);

            db.clnUserCourseMapping.update({fkUserLoginId:UserCourseMappingData.fkUserLoginId,fkUserRoleMappingId:UserCourseMappingData.fkUserRoleMappingId, fkCourseId:courseId, activeFlag:1},{$set:{activeFlag:0}});
                db.clnUserCourseMapping.insert(UserCourseMappingData);

            }
        return UserCourseMappingData;
}
});