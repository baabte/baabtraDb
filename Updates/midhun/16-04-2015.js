

db.system.js.save({_id: "fnsetOrderFormConfOrNot",
      value:function (data) {
    var setOrderFormConfOrNot = db.clnGlobalSettings.findOne({companyId:data.companyId}, {orderFormConfigurable:1});
    if (setOrderFormConfOrNot) {
        db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{orderFormConfigurable:data.orderFormConfigurable}});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{orderFormConfigurable:data.orderFormConfigurable}});
        return "success";
    } else {
      
        db.clnGlobalSettings.insert({companyId:data.companyId, activeFlag:1, createdDate:Date(), updatedDate:Date(), crmId:data.userLoginId, urmId:data.userLoginId, orderFormConfigurable:data.orderFormConfigurable});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{orderFormConfigurable:data.orderFormConfigurable}});
        return "success";
    }
}
  });