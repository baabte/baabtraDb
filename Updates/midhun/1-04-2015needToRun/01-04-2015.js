
//fnchangelanguage funtion to change language of the user
db.system.js.save({_id: "fnchangelanguage",
      value: function (data) { 
		db.clnUserDetails.update({"fkUserLoginId" : ObjectId(data.userloginId)},{$set:{"profile.Preferedlanguage":data.selectedlanguage}});
		db.clnActiveUserData.update({userLoginId:data.userloginId}, {$set:{Preferedlanguage:data.selectedlanguage}});
		return "success";
}}); 



//fnGetCode funtion used for create unigue codes
db.system.js.save({_id: "fnGetCode",
      value:function (data) {
   
    var codeData = {};
    var itemList = db.clnGlobalSettings.findOne({companyId:data.companyId}, {itemCodes:1, _id:0});   
    if (itemList) {
        itemList = itemList.itemCodes;
        for (var i = 0; i < itemList.length; i++) {
            for (j = 0; j < itemList[i].items.length; j++) {
                if (itemList[i].items[j] == data.item) {
                    if (itemList[i].currentRange) {
                        codeData.prefix = itemList[i].prefix;
                        codeData.IncPattern = itemList[i].IncPattern;
                        codeData.range = ++itemList[i].currentRange;
                        db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{itemCodes:itemList}});
                    } else {
                        if (itemList[i].startRange) {
                            codeData.prefix = itemList[i].prefix;
                            codeData.IncPattern = itemList[i].IncPattern;
                            codeData.range = itemList[i].startRange;
                            itemList[i].currentRange = itemList[i].startRange;
                            db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{itemCodes:itemList}});
                        } else {
                            codeData.prefix = itemList[i].prefix;
                            codeData.IncPattern = itemList[i].IncPattern;
                            codeData.range = 1;
                            itemList[i].startRange = 1;
                            itemList[i].currentRange = 1;
                            db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{itemCodes:itemList}});
                        }
                    }
                }
            }
        }
        return codeData.prefix.concat(fngetIncrementalCode(codeData.range, codeData.IncPattern));
    } else {
        return "no Patterns found";
    }
}
		
		
}); 		




db.system.js.save({_id: "fngetIncrementalCode",
      value: function (n, type) { 
		   	if(!n){
				n=1;
			}
		

		if (type=="Number"){
		return n;
		}

				var x = n-1,
		           r26 = x.toString(26),
		           baseCharCode = "A".charCodeAt(0);

		       var arr = r26.split(''),
		           len = arr.length;

		       var newArr =arr.map(function(val,i){
		           val = parseInt(val,26);

		           if( (i === 0) && ( len > 1)){
		               val = val-1;
		           }

		           return String.fromCharCode(baseCharCode + val);
		       });


		      if (type=="Alphabetics(s)"){

					return newArr.join('').toLowerCase();
			  }

		       return newArr.join('');
		
}}); 

