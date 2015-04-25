db.system.js.save({_id: "fnFetchCandidateReport",
      value:function (data) {
    courseCount = [];
    a=0;
    var courses = fnfetchCourseList(data);
    if(data.type==0)
    {
         courses.forEach(function (course) 
            {
                courseCount.push({candidateCount:db.clnUserCourseMapping.find({fkCourseId:course._id}).count(), courseName:course.Name});
            });
            return courseCount;
        
     }
     else if(data.type=="monthly"){
            courses.forEach(function (course) 
            {
                        counter=0;
                obj=db.clnUserCourseMapping.find({fkCourseId:course._id}).toArray();
                        for(i in obj)
                        {
                            if((obj[i]._id.getTimestamp()).getUTCMonth()==data.monthNumber)
                                {
                                    counter++;
                                }
                        }
                        if(counter>0)
                        {
                                courseCount.push({candidateCount:counter,courseName:course.Name});
                        }
                        
                
            });
            return courseCount;
     }
     else if(data.type=="DateRange")
     {             
            startDate=(new Date(data.DateRange.startDate)).getTime();
            endDate=(new Date(data.DateRange.endDate)).getTime();
            courses.forEach(function (course) 
            {
                        counter=0;
                        obj=db.clnUserCourseMapping.find({fkCourseId:course._id}).toArray();
                        for(i in obj)
                        {
                            if(((obj[i]._id.getTimestamp()).getTime()>startDate)&&((obj[i]._id.getTimestamp()).getTime()<endDate))
                            {
                                counter++;
                            }                            
                        }
                          if(counter>0)
                        {
                                courseCount.push({candidateCount:counter,courseName:course.Name});
                        }
                        
                        
            });
            return courseCount;

    }
 
   
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
                        for(i in candidates)
                        {
                            if(((candidates[i]._id.getTimestamp()).getTime()>startDate)&&((candidates[i]._id.getTimestamp()).getTime()<endDate))
                            {
                                counter++;
                            }                            
                        }
                        if(data.week)
                        {
                                var registered="Registed in Week ".concat(data.week);
                         }
                         else
                         {
                               var registered="Registion between ".concat(dateFromISO(data.DateRange.startDate)+" to "+dateFromISO(data.DateRange.endDate));
                          }
                        menteeList.push({candidateCount:counter,registered:registered});
                       
           
            
            }
    return menteeList;

}
  });



db.system.js.save({_id: "dateFromISO",
      value:function (msSinceEpoch) {
       var d = new Date(msSinceEpoch);
      return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate() ;
  }
  });