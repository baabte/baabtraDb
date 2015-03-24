
/*
Created by : Jihin
Created On : 23/03/2015
Purpose    : Load Order Form by Form Id
*/

db.system.js.save({_id: "fnLoadOrderFormById",
      value:function(orderFormId) {
    return db.clnTrainingRequest.findOne({orderFormId:orderFormId});
}});
