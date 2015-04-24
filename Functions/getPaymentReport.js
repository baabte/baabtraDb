//Function for geting payment report
/*
Created by: Lijin
Created on: 21-4-2015
*/
db.system.js.save({
    "_id" : "getPaymentReport",
    "value" : function(searchObj) {

    
   var matchObj=searchObj.searchObj;
   if(searchObj.date){
       
        if(searchObj.date.fromDate){
            if(!matchObj.createdDate){
                matchObj.createdDate={};
            }
            
            matchObj.createdDate.$gt=ISODate(searchObj.date.fromDate);
        }
        if(searchObj.date.toDate){
            if(!matchObj.createdDate){
                matchObj.createdDate={};
            }
            matchObj.createdDate.$lt=ISODate(searchObj.date.toDate);
   }
   }
   return db.clnActTransactions.aggregate([
{
    $match:matchObj
},
{
    $group:{
        _id:{
             courseId:"$transactionFor.courseId",
             courseName:"$transactionFor.courseName",
             orderFormId:"$orderFormId",
             actHead:"$actHead.name",
             currency:"$credit.currency"
         },
        credit:{$sum:"$credit.amount"},
        debit:{$sum:"$debit.amount"},
        }
    
},
]).toArray()
}
});