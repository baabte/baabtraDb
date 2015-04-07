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

