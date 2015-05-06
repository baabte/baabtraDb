db.system.js.save({
    "_id" : "fnAddCourseTimelineElement",
    "value" : function (courseId, courseElement) {
  
    var keyArray = courseElement.key.split(".");
    var tlPoint = keyArray[0];
    var elemType = keyArray[1];
    var key = "courseTimeline." + courseElement.key;
    var obj = {};
    obj[key] = courseElement[courseElement.key];
    db.clnCourses.update({_id:courseId}, {$push:obj});
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var elements = courseElement[courseElement.key].elements;
    var innerIndex = course[0].courseTimeline[tlPoint][elemType].length - 1;
    var order = 0;
    var gotOrderFlag = false;
    var lastTraversedOrder = 0;

    if (!course[0].elementOrder) {
        course[0].elementOrder = {};
    }
    else{
        for(tmpOrder in course[0].elementOrder){
          var orderKeys = course[0].elementOrder[tmpOrder].split(".");
              orderKeys[0] = parseInt(orderKeys[0]);
              tlPoint = parseInt(tlPoint);
              tmpOrder=parseInt(tmpOrder);
            if(orderKeys[0]==tlPoint){
                gotOrderFlag=true;
                order=tmpOrder+1>order?tmpOrder+1:order;
            }

            if((!gotOrderFlag)&&orderKeys[0]<tlPoint){
                order=tmpOrder+1>order?tmpOrder+1:order;
            }
        }   
    }
    var previousElem='';
    var traversed=false;
    if(course[0].elementOrder[order]){
        previousElem=course[0].elementOrder[order];
    
    
        for (curOrder in course[0].elementOrder) {
            traversed=true;
            curOrder = parseInt(curOrder);
            if(curOrder>=order){
                var elemToCopy = previousElem;
                var traversingOrder=parseInt(curOrder + 1);
                    previousElem=course[0].elementOrder[traversingOrder];
                if (typeof elemToCopy != "undefined") {
                    var keyArr = elemToCopy.split(".");
                    var tmpTlPoint = keyArr[0];
                    var elementName = keyArr[1];
                    var elemIndex = keyArr[2];
                    course[0].courseTimeline[tmpTlPoint][elementName][elemIndex].order = traversingOrder;
                    course[0].elementOrder[traversingOrder] = elemToCopy;
                }
            }
        }
    }

        course[0].courseTimeline[tlPoint][elemType][innerIndex].order = order;
        course[0].elementOrder[order] = tlPoint + "." + elemType + "." + innerIndex;

    
    var totalMark = 0;
    var looper = 0;
    var currentMark = 0;
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    if (course[0].totalMark) {
        currentMark = course[0].totalMark;
    }
    for (looper; looper < elements.length; looper++) {

        if(elements[looper]!=null){
            if (elements[looper].type == "question-viewer" ||
                elements[looper].type == "question-group-viewer") {
                totalMark = totalMark + elements[looper].value.mark.totalMark;
            }    
        }
        
    }
    course[0].totalMark = currentMark + totalMark;
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
    db.clnCourses.save(course[0]);
    return course[0].elementOrder;
}
}); 



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
    var userloginIds='';
    if(searchKey==''){
    if(type=='initial'){

        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='initial non Search'
    }
    else if(type=='next'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='next non Search'
        
        }
   else if(type=='prev'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='prev non Search'
        
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
            var profile=db.clnUserDetails.findOne({fkUserLoginId:rowRes.fkUserLoginId},{userName:1,profile:1});
            if((profile!=null)&&(profile.userName!=null)){
            result[count].profile=profile.profile;
            result[count].userName=profile.userName;
            rowRes.fkUserLoginId=rowRes.fkUserLoginId.valueOf();
            rowRes.userRoleMappingId=rowRes._id.valueOf();
            delete rowRes._id;
            count++;
            }else{
            result.splice(count,1)
            }
           
            }


      
    

         
    }else{
     
     if (firstId!=='') {
     first=ObjectId(firstId);
     }else{
      first=firstId;
     }
     if (lastId!=='') {
     last=ObjectId(lastId);
     }else{
     last=lastId;
     }

     
        userloginIds=db.clnUserRoleMapping.distinct('fkUserLoginId',{fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1})
     
     if(type=='initial'){
        var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},userName:{$ne:null},activeFlag:1},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();        
        msg='initial Search'

    }
    else if(type=='next'){
         var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},userName:{$ne:null},activeFlag:1,_id:{$gt:ObjectId(lastId)}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();                    
        msg='next Search'
        
        }
   else if(type=='prev'){
          var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},userName:{$ne:null},activeFlag:1,_id:{$lt:ObjectId(firstId)}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();       
        msg='prev Search'

        }     

        if(result.length>0){
            for(var index in result){
                result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
                result[index]._id=result[index]._id.valueOf();
            } 
            first=ObjectId(result[0]._id);
            last=ObjectId(result[result.length-1]._id);
        }

    }

    resultObj.userList=result;
    if (first!=='') {
    resultObj.firstId=first.valueOf();        
     }else{
    resultObj.firstId=first
     }
     if (last!=='') {
    resultObj.lastId=last.valueOf();
     }else{
    resultObj.lastId=last;
     }
    resultObj.searchKey=searchKey;
    resultObj.msg=msg;
  

  
    return resultObj;
}
});


db.system.js.save({_id: "fnLoadCourseData",
        value: function (courseId,userLoginId,roleid) {if(roleid==3){
        courses = db.clnUserCourseMapping.findOne({"fkUserLoginId" : ObjectId(userLoginId),"fkCourseId":ObjectId(courseId),"activeFlag" : 1},{courseTimeline:1,Duration:1,markScored:1,totalMark:1,selectedDuration:1,elementOrder:1});
    return courses;
        }
        else{
            courses = db.clnCourses.findOne({"_id" : ObjectId(courseId),"activeFlag" : 1});
            return courses;
            
            }}});


db.system.js.save({_id:'fnRemoveCourseElement',
value:function(courseId, courseElemName, tlPoint, index, rmId) {
    
    var key="courseTimeline."+tlPoint+"."+courseElemName;
    var obj={};
    obj[key]=index;
    var objProjection={};
        objProjection[key]=1;
        objProjection['_id']=0;
    var oldCourse=db.clnCourses.findOne({_id:courseId},objProjection);
    var removedOrder=oldCourse.courseTimeline[tlPoint][courseElemName][index].order*1;
    
    var oldElements=oldCourse.courseTimeline[tlPoint][courseElemName][index].elements;
    var markToDeduct=0;
    for(indexKey in oldElements){
        if(oldElements[indexKey].type=='question-viewer' || oldElements[indexKey].type == "question-group-viewer"){
         markToDeduct=markToDeduct+oldElements[indexKey].value.mark.totalMark;
        }
    }
    db.clnCourses.update({_id:courseId},{$pop:obj});
    var a =db.clnCourses.findOne({_id:courseId});
    if(!a.courseTimeline[tlPoint][courseElemName].length){
        b = a.courseTimeline[tlPoint][courseElemName];
        var unset={};
        unset[key]=1;
        db.clnCourses.update({_id:courseId},{$unset:unset});
        a = db.clnCourses.findOne({_id:courseId});
        if(Object.keys(a.courseTimeline[tlPoint]).length == 0){
            unset={};
            unset["courseTimeline."+tlPoint]=1;
            db.clnCourses.update({_id:courseId},{$unset:unset});
            b=unset;
        }
    }
    var course=db.clnCourses.findOne({_id:courseId});
        course.totalMark=course.totalMark-markToDeduct;
        course.courseTimeline[tlPoint].totalMark=course.courseTimeline[tlPoint].totalMark-markToDeduct;
    
    for(order in course.elementOrder){
        order=(order*1);
     if(order>removedOrder){
            
            {
            if(course.elementOrder[order]){
                     var keyArr=course.elementOrder[order].split('.');
                     var tmpTlPoint=keyArr[0];
                     var elementName=keyArr[1];
                     var innerIndex=keyArr[2];
                      if(removedOrder!=order){
                         course.courseTimeline[tmpTlPoint][elementName][innerIndex].order=order-1;
                         course.elementOrder[order-1]=course.elementOrder[order];    
                      }
                      
                      delete course.elementOrder[order];
                  }
              }
     }    
    }
    
    
    
        db.clnCourses.save(course);
    return course.elementOrder;
  }});
