
/*
Created by : Jihin
Created On : 23/03/2015
Purpose    : Add User Nomination

Updated On : 18/APR/2015
Purpose : added customer details to clnCompanyCustomer collection
*/

db.system.js.save({_id: "fnAddUserNomination",
      value:function(orderObject, rmId) {
    
    if(orderObject._id == undefined){
        
        var codeData = {
            'companyId' : orderObject.companyId,
            'item': 'Orders'
            };
        
        var companyCustomerCodeData = {
            'companyId' : orderObject.companyId,
            'item': 'Customers'
            };
        
        var customCompanyCode = fnGetCode(codeData);
            
        var companyCustomerCode = fnGetCode(companyCustomerCodeData);
        
        orderObject.requesteeDetails.companyCustomerCode = companyCustomerCode;
        
        var companyCustomerId = new ObjectId();
            
            var companyCustomerDetails = JSON.parse(JSON.stringify(orderObject.requesteeDetails));
        
            companyCustomerDetails._id = companyCustomerId;
            companyCustomerDetails.companyId = ObjectId(orderObject.companyId);   
            companyCustomerDetails.createdDate = ISODate();
            companyCustomerDetails.updatedDate = ISODate();
            companyCustomerDetails.crmId = ObjectId(rmId);
            companyCustomerDetails.urmId = ObjectId(rmId);
            companyCustomerDetails.activeFlag = 1;
            
            db.clnCompanyCustomer.insert(companyCustomerDetails);
            orderObject.requesteeDetails.companyCustomerId = companyCustomerId.valueOf();
        
         
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
