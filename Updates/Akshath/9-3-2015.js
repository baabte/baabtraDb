db.system.js.save(
{
    "_id" : "fnLoadCompnayUsers",
    "value" : function(companyId,firstId,type,lastId) {
   var result;
    var resultObj={};
    var count=0;
    var UserData;
    var first,last;
    
    if(type=='initial'){
        result=db.clnUserCourseMapping.find({fkCompanyId:ObjectId(companyId)},{courseImg:0}).limit(9).sort({_id:-1}).toArray();
    }
    else if(type=='next'){
        result=db.clnUserCourseMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{courseImg:0}).limit(9).sort({_id:-1}).toArray();
        }
   else if(type=='prev'){
        result=db.clnUserCourseMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(firstId)}},{courseImg:0}).limit(9).sort({_id:1}).toArray();
        }
         if(result.length!=0){       
          if(type=='prev'){

               first=result[result.length-1]._id;
             last=result[0]._id;
             result.reverse();
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
            result[count].profile=db.clnUserDetails.findOne({fkUserLoginId:rowRes.fkUserLoginId},{profile:1,_id:0});
            var userName=db.clnUserLogin.findOne({_id:rowRes.fkUserLoginId},{_id:0,userName:1});
            result[count].username=userName;
           count++;
            }
    resultObj.userList=result;
    resultObj.firstId=first;
    resultObj.lastId=last;     
    return resultObj;
}
})
