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
