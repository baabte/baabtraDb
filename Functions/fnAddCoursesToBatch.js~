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

