db.clnRoleMaster.insert({
    "_id" : 5,
    "urmId" : "",
    "roleDescription" : "Parent accounts will have this role.",
    "crmId" : "",
    "roleName" : "Parent",
    "createdDate" : Date(),
    "updatedDate" : Date(),
    "activeFlag" : 1,
    "companyId" : ""
});


db.clnCustomFormsMaster.insert({
    "formDisplayName" : "Parent Registration",
    "fkcompanyId" : "",
    "formSchema" : {
        "1" : {
            "stepName" : "Step 1",
            "stepFormSchema" : {
                "fields" : [ 
                    {
                        "validation" : {
                            "pattern" : "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$",
                            "required" : true,
                            "messages" : {
                                "pattern" : "Invalid Email"
                            }
                        },
                        "displayName" : "Email",
                        "name" : "eMail",
                        "placeholder" : "Email Address",
                        "tooltip" : "Enter your email address",
                        "customlist" : [ 
                            {
                                "key" : "check-user-existence"
                            }, 
                            {
                                "text" : "data",
                                "key" : "check-mode"
                            }, 
                            {
                                "text" : "form.syncData.FormData",
                                "key" : "out-object"
                            }, 
                            {
                                "text" : "form.syncData.newUser",
                                "key" : "new-user"
                            }
                        ],
                        "type" : "email"
                    }, 
                    {
                        "displayName" : "Phone",
                        "name" : "phone",
                        "placeholder" : "Enter phone number",
                        "tooltip" : "Enter phone number",
                        "validation" : {
                            "minlength" : 5,
                            "required" : true,
                            "messages" : {
                                "minlength" : "Enter a valid phone number"
                            }
                        },
                        "type" : "text"
                    }, 
                    {
                        "displayName" : "First Name",
                        "name" : "firstName",
                        "placeholder" : "First Name",
                        "tooltip" : "Enter First Name",
                        "validation" : {
                            "required" : true,
                            "messages" : {}
                        },
                        "type" : "text"
                    }, 
                    {
                        "displayName" : "Last Name",
                        "name" : "lastName",
                        "placeholder" : "Last Name",
                        "tooltip" : "Enter Last Name",
                        "validation" : {
                            "messages" : {}
                        },
                        "type" : "text"
                    }, 
                    {
                        "validation" : {
                            "minlength" : 5,
                            "required" : true,
                            "messages" : {
                                "minlength" : "Password doesn't have enough strength (minimum 5 characters)"
                            }
                        },
                        "displayName" : "Password (Minimum 5 characters)",
                        "name" : "password",
                        "placeholder" : "Password (Minimum 5 characters)",
                        "tooltip" : "Enter Your Password (Minimum 5 characters)",
                        "customlist" : [ 
                            {
                                "text" : "form.syncData.newUser",
                                "key" : "ng-show"
                            }
                        ],
                        "type" : "password"
                    }
                ]
            }
        }
    },
    "formSteps" : 1,
    "fkuserId" : ObjectId("54cdd3d476be6cefb1167a53"),
    "formName" : "parentRegistration",
    "crmId" : ObjectId("54cdd3d476be6cefb1167a54"),
    "urmId" : ObjectId("54cdd3d476be6cefb1167a54"),
    "createdDate" : Date(),
    "updatedDate" : Date(),
    "activeFlag" : 1
});



db.system.js.save({_id:'fnLoadParents',
'value':function (data) {
    var loginIds =  db.clnUserRoleMapping.distinct('fkUserLoginId',{fkRoleId:5,"profile.fkCompanyId":ObjectId(data.companyId)});
    var datas = db.clnUserDetails.find({fkUserLoginId:{$in:loginIds},$or:[{"profile.firstName":{$regex:new RegExp(data.searchKey,'i')}},{"profile.lastName":{$regex:new RegExp(data.searchKey,'i')}},{"userName":{$regex:new RegExp(data.searchKey,'i')}}]}).toArray();
    return datas;
}});


db.system.js.save({
_id:'fnLoadMappedCandidatesForParent',
value:function(data){
    var candidateIds = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(data.fkLoginId)},{_id:0,candidates:1});
    for(var key in candidateIds.candidates){
     candidateIds.candidates[key]=ObjectId(candidateIds.candidates[key]);
    }
    var candidates = [];
    if(candidateIds.candidates){
       candidates = db.clnUserDetails.find({"fkUserLoginId":{$in:candidateIds.candidates}}).toArray();    
    }
    return candidates;
}});


db.system.js.save({
_id:'fnSaveCandidateMapping',
value:function(data){
db.clnUserDetails.update({fkUserLoginId:ObjectId(data.fkLoginId)},{$set:{candidates:data.candidateArray}});
return 'ok';
}    
});