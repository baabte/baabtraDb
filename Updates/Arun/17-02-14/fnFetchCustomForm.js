db.system.js.save({_id: "fnFetchCustomForm",
                  value: function (formFetchData) {
    
var formlist;
var resultmsg;
var mandatoryform;

    if((formFetchData.fkcompanyId=='')&&(formFetchData.formName=='')){
        formlist= db.clnCustomFormsMaster.find({activeFlag:1},{_id:1,formName:1,formDisplayName:1,formSteps:1,formSchema:1}).toArray();
        resultmsg='super admin all form fetch';
   }
  else if((formFetchData.fkcompanyId=='')&&(formFetchData.formName!='')){
       formlist= db.clnCustomFormsMaster.findOne({formName:formFetchData.formName,activeFlag:1},{_id:1,formName:1,formSteps:1,formSchema:1});
     resultmsg='super admin specific form fetch';
    }
else{        
    formFetchData.fkcompanyId=ObjectId(formFetchData.fkcompanyId);
    if(formFetchData.formName  == ''){
     formlist= db.clnUserCustomForms.find({fkcompanyId:formFetchData.fkcompanyId,activeFlag:1},{_id:1,formName:1,formDisplayName:1,roleSchema:1}).toArray();
     resultmsg='company all form fetch';
    }
    else{
     formlist=  db.clnCustomFormsMaster.findOne({formName:formFetchData.formName,activeFlag:1},{_id:1,formName:1,formSteps:1,formSchema:1});
     
          
      }
}
    
   var result={formlist:formlist,result:resultmsg};
    return result;
}

});
