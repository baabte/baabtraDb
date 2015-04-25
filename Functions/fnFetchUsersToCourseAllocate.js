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
        msg='initial'+'non Search'
    }
    else if(type=='next'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
        msg='next'+'non Search'
        
        }
   else if(type=='prev'){
       
        result=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(lastId)}},{createdDate:0,updatedDate:0,activeFlag:0,crmId:0,urmId:0}).limit(9).sort({_id:-1}).toArray();
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
            result[count].userName=userName.userName;
            rowRes.fkUserLoginId=rowRes.fkUserLoginId.valueOf();
            rowRes.userRoleMappingId=rowRes._id.valueOf();
            delete rowRes._id;
           count++;
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
        var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();
        for(var index in result){
            result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
            result[index]._id=result[index]._id.valueOf();
        }
        first=ObjectId(result[0]._id);
        last=ObjectId(result[result.length-1]._id);

        msg='initial'+'Search'

    }
    else if(type=='next'){
         var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},activeFlag:1,_id:{$gt:ObjectId(lastId)}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();
        for(var index in result){
            result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
            result[index]._id=result[index]._id.valueOf();
        }
        first=ObjectId(result[0]._id);
        last=ObjectId(result[result.length-1]._id);
              
        msg='next'+' Search'
        
        }
   else if(type=='prev'){
          var result=db.clnUserDetails.find({ $or:[{"profile.firstName" :{$regex:new RegExp(searchKey,'i')}},{"profile.lastName" :{$regex:new RegExp(searchKey,'i')}},{"userName" :{$regex:new RegExp(searchKey,'i')}}],fkUserLoginId:{$in:userloginIds},activeFlag:1,_id:{$lt:ObjectId(firstId)}},{fkUserLoginId:1,_id:1,userName:1,profile:1}).limit(9).toArray();
        for(var index in result){
            result[index].fkUserLoginId=result[index].fkUserLoginId.valueOf();
            result[index]._id=result[index]._id.valueOf();
        }
        first=ObjectId(result[0]._id);
        last=ObjectId(result[result.length-1]._id);
       
        msg='prev'+'Search'

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
    resultObj.userloginIds=userloginIds;
    resultObj.msg=msg;
  

  
    return resultObj;
}
});