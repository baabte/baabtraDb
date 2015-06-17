db.system.js.save({
    "_id" : "fnLoadBatchesForView",
    "value" : function(companyId,firstId,type,lastId,searchKey) {
    var batches,resultObj;
    var count=0;
    var first,last;
    resultObj={};
    if(searchKey==""){
    if(type=='initial'){
        batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1},{courseTimeline:0,syllabus:0}).limit(9).sort({_id:-1}).toArray();
}else if(type=='next'){
	batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$lt:ObjectId(lastId)}},{courseTimeline:0,syllabus:0}).limit(9).sort({_id:-1}).toArray();

}else if(type=='prev'){
	batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,_id:{$gt:ObjectId(firstId)}},{courseTimeline:0,syllabus:0}).limit(9).sort({_id:1}).toArray();
}

}else{
	batches=db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1,$text:{$search:searchKey}},{courseTimeline:0,syllabus:0}).limit(9).sort({_id:-1}).toArray();

}

         if(batches.length!=0){       
          if(type=='prev'){

               first=batches[batches.length-1]._id;
             last=batches[0]._id;
             batches.reverse();
           }else{

             first=batches[0]._id;
             last=batches[batches.length-1]._id;
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
    while(batches.length>count){
        var batch=db.clnBatches.findOne({_id:batches[count].batchId});
        batches[count].totalJoining=batches[count].users.length;
       
        count++;
   }
    //resultObj.batchList=[];
    resultObj.batchList=batches;
    resultObj.firstId=first;
    resultObj.lastId=last;     
    return resultObj;
}});


