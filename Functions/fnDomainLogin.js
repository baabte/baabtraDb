db.system.js.save({
    "_id" : "fnDomainLogin",
    "value" : function (data) {
    ReturnData = {};
    if (data.from_where == "direct") {
        var company = db.clnCompany.findOne({domainName:data.domainName, activeFlag:1});
        if(company != null){
            data.loginCredential.companyId = company._id;
            user_valid_or_not = db.clnUserLogin.find(data.loginCredential).limit(1).count();
            if (user_valid_or_not == 0) {
                ReturnData.result = "false";
                return ReturnData;
            } else {
                return GetAuthUserData(data.loginCredential, data.ip, data.from_where);
            }
        }
        else{
            ReturnData.result = "false";
        }
    }
}});
