
/*
Created by : Jihin
Created On : 23/03/2015
Purpose    : Add User Nomination
*/

db.system.js.save({_id: "fnAddUserNomination",
      value:function(orderObject, rmId) {
    
    if(orderObject._id == undefined){
        
        var codeData = {
            'companyId' : orderObject.companyId,
            'item': 'Orders'
            };
        
        var customCompanyCode = fnGetCode(codeData);       
        
        
        orderObject.companyId = ObjectId(orderObject.companyId);
        orderObject.customCompanyCode = customCompanyCode;
        orderObject.status = "Pending approval";    
        orderObject.createdDate = ISODate();
        orderObject.updatedDate = ISODate();
        orderObject.crmId = ObjectId(rmId);
        orderObject.urmId = ObjectId(rmId);
        orderObject.activeFlag = 0;
        db.clnTrainingRequest.insert(orderObject);
           
    }
    else{
        db.clnTrainingRequest.update({ _id: ObjectId(orderObject._id)},{$set:{orderDetails: orderObject.orderDetails, updatedDate:ISODate(), urmId:ObjectId(rmId)}});
    }
    

    
    return db.clnTrainingRequest.findOne({orderFormId:orderObject.orderFormId});
}});
