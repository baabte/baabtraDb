
//fnCheckRegDomainExits


db.system.js.save({
    "_id" : "fnCheckRegDomainExits",
    "value" : function (domainName) {
    var domainNameExits = db.clnCompany.findOne({domainName:domainName});
    if (domainNameExits != null) {
        return {result:"Exits", companyType:domainNameExits.companyType, companyName:domainNameExits.companyName, appSettings:domainNameExits.appSettings};
    }
    return {result:"New"};
}
});
