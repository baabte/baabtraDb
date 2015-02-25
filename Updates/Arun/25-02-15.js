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
            
                 
            if (isNaN(customForm.roleSchema.roleId)) {
            customForm.roleSchema.roleId = ObjectId(customForm.roleSchema.roleId);
            } 
       
                db.clnUserCustomForms.update({_id:id},{$pull:{'roleSchema':{roleId:customForm.roleSchema.roleId}}});
               db.clnUserCustomForms.update({_id:id},{$push:{'roleSchema':customForm.roleSchema}});
           
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


db.system.js.save({_id: "fnUserNameValid",
                  value: function (data) {
var  userId = db.clnUserLogin.findOne({userName:data.eMail},{_id:1});
     
    if (userId == null) {
        result = {userCheck:0,result:'no user'};
    }
    else if ((userId != null)&&(data.fetch=='')) {
        result = {userCheck:1,result:'exsisting user profile not fetched'};
    }
    else if ((userId != null)&&(data.fetch=='data')) {
        var UserDetails = db.clnUserDetails.findOne({     fkUserLoginId:userId._id},{_id:1,profile:1});
    if (UserDetails!=null){
        if (UserDetails.profile != undefined) {
        UserDetails.profile.eMail = data.eMail;
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user profile fetched'};
        }
        else if (UserDetails.profile == undefined) {
        UserDetails.profile.eMail = data.eMail;
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user profle not created'};
        }
    }     
    else{
        var userDetailsDataId= new ObjectId();
        var UserDetailsData={_id:userDetailsDataId,fkUserLoginId:userId._id,profile:{},createdDate:Date(),updatedDate:Date()};
        db.clnUserDetails.insert(UserDetailsData);
        var UserDetails={};
        UserDetails._id=userDetailsDataId;
        UserDetails.profile={eMail:data.eMail};
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user userdetails not filled'};
    }  
    }
    
    return result;
}});