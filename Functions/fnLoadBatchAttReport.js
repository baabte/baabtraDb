
db.system.js.save({
    "_id" : "fnLoadBatchAttReport",
    "value" : function(searchObj) {

    
   var matchObj={};
   if(searchObj.date){
       
        if(searchObj.date.fromDate){
            if(!matchObj.date){
                matchObj.date={};
            }
            
            matchObj.date.$gt=ISODate(searchObj.date.fromDate);
        }
        if(searchObj.date.toDate){
            if(!matchObj.date){
                matchObj.date={};
            }
            matchObj.date.$lt=ISODate(searchObj.date.toDate);
	    matchObj.batchMappingId=searchObj.selectedBatch[0].batchMappingId;
   }
   }
   return db.clnCandidateAttendance.aggregate([
{
    $match:matchObj
},
{
    $group:{
        _id:{
             status:"$status",
	     user:"$profile.firstName+' '+$profile.lastName"
             
         },
        count: { $sum: 1 }
        }
    
},
]).toArray()
}
});
