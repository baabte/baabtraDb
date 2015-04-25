
db.system.js.save({_id: "getDatesBetween",
      value:function (d1, d2) {
      var oneDay = 24*3600*1000;
	  for (var d=[],ms=d1*1,last=d2*1;ms<=last;ms+=oneDay){
	    d.push( new Date(ms) );
	  }
	  return d;
  }
  });





db.system.js.save({_id: "fnFetchCandidateRegistrationReport",
      value:function (data) {
    menteeList = [];
    a=0;
    if (data.type == 0) {
        var months = [{name:"January", value:0}, {name:"February", value:1}, {name:"March", value:2}, {name:"April", value:3}, {name:"May", value:4}, {name:"June", value:5}, {name:"July", value:6}, {name:"August", value:7}, {name:"September", value:8}, {name:"October", value:9}, {name:"November", value:10}, {name:"December", value:11}];
        candidates=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(data.companyId),activeFlag:1},{}).toArray();
        for (month in months) {
             		counter=0;
         		candidates.forEach(function (candidate) 
	         	{
	                      	
                            if((candidate._id.getTimestamp()).getUTCMonth()==months[month].value)
                                {
                                    counter++;
                                    a++;
                                }       	
                        
	         	});
	         	menteeList.push({candidateCount:counter,registered:months[month].name});	
    	

              
        }
    }
    else if(data.type=="DateRange")
        {
             
                        startDate=(new Date(data.DateRange.startDate)).getTime();
                        endDate=(new Date(data.DateRange.endDate)).getTime();
                        counter=0;
                        candidates=db.clnUserRoleMapping.find({fkRoleId:3,"profile.fkCompanyId":ObjectId(data.companyId),activeFlag:1},{}).toArray();
                      
                        datesArray=getDatesBetween(startDate+86400000,endDate+86400000);
                      
                        for(i in datesArray){
                            counter=0;
                            for(j in candidates)
                            {
                                
                               if(dateFromISO((candidates[j]._id.getTimestamp()))==dateFromISO(datesArray[i]))
                                {
                                    counter++;
                                
                                }                            
                            }
                            menteeList.push({candidateCount:counter,registered:dateFromISO(datesArray[i])});
                        }      
            
            }
    return menteeList;

}
  });
