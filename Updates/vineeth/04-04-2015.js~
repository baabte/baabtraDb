db.system.js.save({_id: "fnDeleteBatch",
		value: function (id,cmpId) 
{
  // write your code here
    db.clnBatches.update({_id:ObjectId(id)}, {$set:{activeFlag:0}});
    result= db.clnBatches.find({companyId:ObjectId(cmpId),
                            activeFlag:1,                     
                           }
                          ).toArray()                 
      return {result:result};
}});
//--------------------------------------------------

db.system.js.save({_id: "fnUpdateBatch",
		value: function (batchObj) 
{
   // write your code here
    batchObj.createdDate=ISODate();
    batchObj.updatedDate=ISODate();
    batchObj.startDate=ISODate(batchObj.startDate);
    batchObj.endDate=ISODate(batchObj.endDate);
    if (batchObj.instructorLead == true &&  batchObj.offline == true ) {//checking whether the object is exist 
       delete batchObj.instructorLead;
       delete batchObj.offline;
       batchObj.courseType="instructorLead"
       result= db.clnBatches.save(batchObj);
       delete batchObj._id; 
       batchObj.courseType="offline"
       result= db.clnBatches.insert(batchObj);
    }else if(batchObj.instructorLead == true){
        delete batchObj.instructorLead;
       delete batchObj.offline;
       batchObj.courseType="instructorLead"
      result=  db.clnBatches.save(batchObj);
   } else if(batchObj.offline == true){
       delete batchObj.instructorLead;
       delete batchObj.offline;
      batchObj.courseType="offline"
    result= db.clnBatches.save(batchObj);
   }
    return result;
}});
//------------------------------------------------------
db.system.js.save({_id: "fnAddCoursesToBatch",
		value: function (batch) 
{
   // write your code here
    batch.createdDate=ISODate();
    batch.updatedDate=ISODate();
    batch.startDate=ISODate(batch.startDate)
    batch.endDate=ISODate(batch.endDate);
    db.clnBatches.save(batch);
    return 'success';
}});
//------------------------------------------------------
