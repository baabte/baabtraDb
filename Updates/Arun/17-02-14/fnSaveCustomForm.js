db.system.js.save({_id: "fnSaveCustomForm",
                  value: function (customForm) {
    var resultmsg;
    customForm.fkuserId = ObjectId(customForm.fkuserId);
    if(customForm.fkcompanyId!=''){
    customForm.fkcompanyId = ObjectId(customForm.fkcompanyId);
    }
    var loggedusercrmid = ObjectId(customForm.loggedusercrmid);
    delete customForm.loggedusercrmid;
    if (customForm._id == undefined) {
        customForm.crmId = loggedusercrmid;
        customForm.urmId = loggedusercrmid;
        customForm.createdDate = Date();
        customForm.updatedDate = Date();
        customForm.activeFlag=1
        if(customForm.fkcompanyId!=''){
        db.clnUserCustomForms.insert(customForm);
            resultmsg='company created form';
        }
        else if(customForm.fkcompanyId==''){
        db.clnCustomFormsMaster.insert(customForm);
            resultmsg='super admin created form';
            }
    }
    else if (customForm._id != undefined) {
        var id = ObjectId(customForm._id);
        delete customForm._id;
       
     
        if(customForm.fkcompanyId!=''){
            
            for (var index in customForm.roleSchema) {        
            if (isNaN(customForm.roleSchema[index].roleId)) {
            customForm.roleSchema[index].roleId = ObjectId(customForm.roleSchema[index].roleId);
            } 
         }
            
            for(var i in customForm.roleSchema){
                db.clnUserCustomForms.update({_id:id},{$pull:{'roleSchema':{roleId:customForm.roleSchema[i].roleId}}});
               db.clnUserCustomForms.update({_id:id},{$push:{'roleSchema':customForm.roleSchema[i]}});
               }
     db.clnUserCustomForms.update({'_id':id},{'$set':{urmId:loggedusercrmid,updatedDate:Date()}});
      resultmsg='company updated form';
        }
       
        else if(customForm.fkcompanyId==''){
            customForm.urmId=loggedusercrmid;
            customForm.updatedDate=Date();
     db.clnCustomFormsMaster.update({'_id':id},{'$set':customForm});
     resultmsg='super admin updated form';
            }
        
    }
    var result={result:resultmsg,customForm:customForm}
    return result;
}

});