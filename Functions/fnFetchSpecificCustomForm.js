//fnFetchSpecificCustomForm
//function to fetch secific form to a form used in user specific 
db.system.js.save({_id: "fnFetchSpecificCustomForm",
      value: function (FetchSpecificFormObj){
        var resultmsg;
      	
      var roleSchema=db.clnUserCustomForms.findOne({fkcompanyId:ObjectId(FetchSpecificFormObj.companyId),formName:FetchSpecificFormObj.fetchFormName},{_id:0,roleSchema:1});
  resultmsg='specific form fetch company for rolebased forms';
var result={'result':resultmsg,roleSchema:roleSchema}
    return result;
}
}); 