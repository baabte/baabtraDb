/*
Created by : Jihin
Created On : 18/APR/2015
Purpose : Load Company Customer Details
*/

db.system.js.save({_id: "fnLoadCompanyCustomerDetails",
      value:function(eMailId, companyId, type) {
    return db.clnCompanyCustomer.findOne({eMail:eMailId, companyId:ObjectId(companyId), type:type});
}});
