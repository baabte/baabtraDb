db.system.js.save({
    "_id" : "fnUpdateOrderFormStatus4Verify",
    "value" : function(obj,crmId) {
    var orderForm=db.clnTrainingRequest.findOne({_id:ObjectId(obj.orderFormId)});
    var statusHistory={
    "statusChangedOn" : ISODate(),
    "previousStatus" : "Pending Approval",
    "statusChangedby" : crmId,
    "statusChangedTo" : "Verified"
    }
    var i=0;
    while(i<orderForm.orderDetails.length){
        if(orderForm.orderDetails[i].courseId==obj.courseObj.courseId){ //updating the status of user
            orderForm.orderDetails[i].userInfo[obj.index].status="Verified";
            if(orderForm.orderDetails[i].userInfo[obj.index].statusHistory==undefined){
                orderForm.orderDetails[i].userInfo[obj.index].statusHistory=[];
                orderForm.orderDetails[i].userInfo[obj.index].statusHistory.push(statusHistory);

             }else{
                 orderForm.orderDetails[i].userInfo[obj.index].statusHistory.push(statusHistory);
             }
        }
        i++;
    }
    //updating the status history list
    if(orderForm.statusHistory==undefined){
        orderForm.statusHistory=[];
        orderForm.statusHistory.push(statusHistory);
    }else{
         orderForm.statusHistory.push(statusHistory);
     }
    orderForm.updatedDate=ISODate();
    orderForm.urmId=ObjectId(crmId);
    db.clnTrainingRequest.save(orderForm);
    return orderForm;
}
})