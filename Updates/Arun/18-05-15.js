/* commit with changes in user nomination user code added in userinfo */

db.system.js.save({_id: "fnAddUserNomination",
      value:function (orderObject, rmId) {
        var companyId=''

    if (orderObject._id == undefined) {
        orderObject._id=new ObjectId();
        var codeData = {companyId:orderObject.companyId, item:"Orders"};
        var companyCustomerCodeData = {companyId:orderObject.companyId, item:"Customers"};
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
        companyId=orderObject.companyId;
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
    else {
        db.clnTrainingRequest.update({_id:ObjectId(orderObject._id)}, {$set:{draftFlag:orderObject.draftFlag,orderDetails:orderObject.orderDetails, updatedDate:ISODate(), urmId:ObjectId(rmId)}});
    }

     if(orderObject.draftFlag==1){
      var orderObject=db.clnTrainingRequest.findOne({orderFormId:orderObject.orderFormId});


        var companyId=orderObject.companyId.valueOf();


        var loggedusercrmid=rmId;
        for (var course in orderObject.orderDetails){

            for(var user in orderObject.orderDetails[course].userInfo){
                var codeData = {companyId:companyId, item:"Mentee"};
                var uniqueCode=fnGetCode(codeData);
                
                var mandatoryData=JSON.parse(JSON.stringify(orderObject.orderDetails[course].userInfo[user]));
                delete mandatoryData.userId;
                delete mandatoryData.status;
                mandatoryData.userCode=uniqueCode;
                mandatoryData.orderFormId=orderObject._id.valueOf();
                var role={roleId: 3};

                var userId=fnRegisterUser({companyId:companyId,loggedusercrmid:loggedusercrmid,mandatoryData:mandatoryData,role:role});

                orderObject.orderDetails[course].userInfo[user].userLoginId=userId.userId.valueOf();
                orderObject.orderDetails[course].userInfo[user].userCode=uniqueCode;

            }

        }

        db.clnTrainingRequest.update({_id:orderObject._id},{$set:{draftFlag:orderObject.draftFlag,orderDetails:orderObject.orderDetails, updatedDate:ISODate(),urmId:orderObject.urmId}});
    
    }


    return db.clnTrainingRequest.findOne({orderFormId:orderObject.orderFormId});

}
});
