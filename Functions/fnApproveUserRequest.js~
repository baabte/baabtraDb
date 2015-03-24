
db.system.js.save({_id:'fnApproveUserRequest',
value:function(userIds, orderFormId, courseKey, statusType, rmId, companyId) {
    var orderForm = db.clnTrainingRequest.findOne({companyId:ObjectId(companyId), orderFormId:orderFormId});
    
    for(var userCount = 0; orderForm.orderDetails[courseKey].userInfo.length > userCount; userCount++){
     
        if(userIds.indexOf(orderForm.orderDetails[courseKey].userInfo[userCount].userId) != -1){
            orderForm.orderDetails[courseKey].userInfo[userCount].status = statusType;
        }
    }
    db.clnTrainingRequest.update({companyId:ObjectId(companyId), orderFormId:orderFormId},{$set:{orderDetails:orderForm.orderDetails}});
    
    return orderForm;
}});
