db.system.js.save({
_id:"fnLoadMenteesForPayment",
"value":function(companyId,pageNumber, nPerPage,searchKey,orderFormType){
var data = {};

    if(orderFormType==''){
    data.type = "regex";
    data.orderFroms = db.clnTrainingRequest.find({
        $or:[
                {status:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.eMail':{$regex:new RegExp(searchKey, "i")}},
                {customCompanyCode:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.type':{$regex:new RegExp(searchKey, "i")}},
                {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ],
            companyId:ObjectId(companyId),
            //'orderDetails.userInfo.status':{$in:statusType}
            'orderDetails.userInfo.statusHistory.statusChangedTo':{$nin:["paid","Paid"]},
            }).skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();

    }else{
    data.type = "regex";
    data.orderFroms = db.clnTrainingRequest.find({
        $or:[
                {status:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.eMail':{$regex:new RegExp(searchKey, "i")}},
                {customCompanyCode:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.type':{$regex:new RegExp(searchKey, "i")}},
                {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ],
            companyId:ObjectId(companyId),
            'requesteeDetails.type':orderFormType,
            //'orderDetails.userInfo.status':{$in:statusType}
            'orderDetails.userInfo.statusHistory.statusChangedTo':{$nin:["paid","Paid"]},
            }).skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();


    }
    return data;
}});