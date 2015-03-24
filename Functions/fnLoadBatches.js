db.system.js.save({_id: "fnLoadBatches",
		value: function (cmpId) 
{
   result= db.clnBatches.find({companyId:ObjectId(cmpId),
                            activeFlag:1,                     
                           }
                          ).toArray()                 
// write your code here
      return {result:result};
}});

