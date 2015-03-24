db.system.js.save({_id: "fnAddCoursesToBatch",
		value: function (batch) 
{
    batch.createdDate=ISODate();
    batch.updatedDate=ISODate();
    db.clnBatches.save(batch);
    return 'success';

}});

