db.system.js.save({
    "_id" : "fngetCollageList",
    "value" : function (companyid) {
 list = db.clnCompany.find({parentCompanyId:ObjectId(companyid), companyType:"CO"}, {Courses:1, companyName:1}).toArray();
    return list;
}});