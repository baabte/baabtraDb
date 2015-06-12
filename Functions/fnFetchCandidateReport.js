db.system.js.save({
    "_id" : "fnFetchCandidateReport",
    "value" : function (data) {
    courseCount = [];
    a=0;
    var courses = fnfetchCourseList(data);
    if(data.type==0)
    {
         courses.forEach(function (course) 
            {
                courseCount.push({candidateCount:db.clnUserCourseMapping.find({fkCourseId:course._id,activeFlag:1}).count(), courseName:course.Name});
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