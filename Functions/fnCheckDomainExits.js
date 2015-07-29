
db.system.js.save({
    "_id" : "fnCheckDomainExits",
    "value" : function (domainName) {
    var domainNameExits = db.clnCompany.findOne({domainName:domainName});
    if (domainNameExits != null) {
        return {result:"Exits",type:domainNameExits.type, companyName:domainNameExits.companyName, appSettings:domainNameExits.appSettings};
    }
    return {result:"New"};
}
});
