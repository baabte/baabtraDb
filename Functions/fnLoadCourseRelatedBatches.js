db.system.js.save({_id: "fnLoadCourseRelatedBatches",
		value: function (cmpId,courseId,joining_date,Type) 
{
  var results=[];
    
     joining_date=ISODate(joining_date)     
    
    //joining_date=ISODate(joining_date)
    //var selectedDuration=db.clnCourses.find("_id":ObjectId(courseId))
    db.clnBatches.find({companyId:ObjectId(cmpId),
                    course:{$elemMatch:{_id:courseId}},
                            activeFlag:1,
                            courseType:Type,
                    endDate:{$gt:joining_date}
                }).forEach( function(batch) { 
                    var lowerBound=new Date();
                    var upperBound= new Date(); 
                    var start=new Date();
                    var end=new Date(); 
                    if(batch.batchMode=="onetime"){ //checking the batchMode
                       batch.enrollmentBefore =new Date();
                       batch.enrollmentAfter =new Date(); 
                       lowerBound=new Date(batch.startDate.getTime()- batch.Admission.beforeDaysCount*24*60*60*1000);
                       upperBound=new Date(batch.startDate.getTime()+ batch.Admission.afterDaysCount*24*60*60*1000);
                        var timediff_onetime=Math.abs(batch.endDate.getTime()-batch.startDate.getTime());
                        var diffDays_onetime = Math.ceil(timediff_onetime / (1000 * 3600 * 24)); //calculating the date difference in 
                       if(joining_date >=lowerBound && joining_date<=upperBound){
                           batch.duration=diffDays_onetime;
                           batch.enrollmentBefore=lowerBound;
                           batch.enrollmentAfter=upperBound;
                           batch.end=batch.endDate; 
                           batch.start=batch.startDate;
                           var lower =new Date();
                           var upper =new Date();
                            upper=new Date(batch.enrollmentAfter.getTime()-1*24*60*60*1000);
                            lower=new Date(batch.enrollmentBefore.getTime()+1*24*60*60*1000);
                          var Batch = db.clnCourseBatchMapping.findOne({"batchId":batch._id,fkCourseId:ObjectId(courseId),"enrollmentAfter":{$lt:lower},"enrollmentBefore":{$gt:upper}},{users:1}) 
                         if(Batch!=null){ 
                          if(Batch.users.length!=0){
                                  batch.seat= batch.seats-Batch.users.length;
                            }else{
                                batch.seat=batch.seats;
                            }
                        }else{
                             batch.seat=batch.seats;
                             }  
                          if(batch.seat!=0){ 
                           results.push(batch);
                          }    
                       }
                    }else{
                        var timeDiff = Math.abs(batch.startDate.getTime()-joining_date.getTime());//claculating the time difference between batch start date and joining date
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); //calculating the date difference in days                         
                        lowerBound=batch.Admission.beforeDaysCount; //days before taken admission
                        upperBound=batch.Admission.afterDaysCount;  //days after taken admission
                        var diff =diffDays%batch.repeats.repeatsAfter;//calculating the modulo divison of difference in days with batch repeating days
                        var currentBatchStartDate=new Date();
                        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];                     
                        var dayname="";
                        
                        if(diffDays<=lowerBound){
                            
                             currentBatchStartDate=batch.startDate;//new Date(joining_date.getTime() - diff*24*60*60*1000)
                             dayname= days[currentBatchStartDate.getDay()];//to get day name                       
                            if (typeof batch.repeats.excludedDaysRepeat != "undefined") {//checking whether the object is exist or not   
                            if(batch.repeats.excludedDaysRepeat.indexOf(dayname)!=-1){
                                 batch.start=new Date(currentBatchStartDate.getTime()+1*24*60*60*1000);                            
                             }
                           }  
                            //batch.end =new Date();
                            batch.enrollmentBefore =new Date();
                            batch.enrollmentAfter =new Date();
                            batch.start = currentBatchStartDate;//to get the batch start date
                            batch.end= new Date(batch.start.getTime() + batch.repeats.repeatsAfter*24*60*60*1000);//to get the batch end date
                            batch.enrollmentBefore=new Date(batch.start.getTime() - batch.Admission.beforeDaysCount*24*60*60*1000);//to get the enrollment before date
                            batch.enrollmentAfter=new Date(batch.start.getTime() + batch.Admission.afterDaysCount*24*60*60*1000);//to get the enrollment after days   
                             var lower =new Date();
                             var upper =new Date();
                            upper =new Date(batch.enrollmentAfter.getTime()-1*24*60*60*1000);
                            lower =new Date(batch.enrollmentBefore.getTime()+1*24*60*60*1000);
                            var Batch = db.clnCourseBatchMapping.findOne({"batchId":batch._id,fkCourseId:ObjectId(courseId),"enrollmentAfter":{$lt: lower},enrollmentBefore:{$gt:upper}},{users:1}) 
                          if(Batch!=null){ 
                            if(Batch.users.length!=0){
                                  batch.seat=batch.seats- Batch.users.length;
                            }else{
                               batch.seat=batch.seats
                                }
                          }else{
                             batch.seat=batch.seats;
                             }  
                            if(batch.seat!=0){ 
                              results.push(batch);
                            }              
                        }else{
                           
                         //var repeats_diff= batch.repeats.repeatsAfter-diffDays;
                           // currentBatchStartDate=new Date(joining_date.getTime() + repeats_diff*24*60*60*1000);  
                             currentBatchStartDate=new Date(joining_date.getTime() - diff*24*60*60*1000);  
                              batch.start=currentBatchStartDate;
                            dayname=days[currentBatchStartDate.getDay()];     
                            if(Math.abs(diff)<=upperBound){
                              if (typeof batch.repeats.excludedDaysRepeat != "undefined") {//checking whether the object is exist or not   
                                if(batch.repeats.excludedDaysRepeat.indexOf(dayname)!=-1){
                                 batch.start=new Date(batch.start.getTime()+1*24*60*60*1000);                            
                              }  
                           }  
                             
                             // batch.end =new Date();
                              batch.enrollmentBefore =new Date();
                              batch.enrollmentAfter =new Date();
                            //batch.endDate.setDate(batch.startDate.getDate() + batch.repeats.repeatsAfter);//to get the batch end date
                           batch.end=new Date(batch.start.getTime()+batch.repeats.repeatsAfter*24*60*60*1000) 
                           //print(batch.endDate)                            
                           //batch.enrollmentBefore.setDate(batch.startDate.getDate() - batch.Admission.beforeDaysCount);//to get the enrollment before date
                            batch.enrollmentBefore=new Date(batch.start.getTime()-batch.Admission.beforeDaysCount*24*60*60*1000)
                           //batch.enrollmentAfter.setDate(batch.startDate.getDate() + batch.Admission.afterDaysCount);//to get the enrollment after days
                            batch.enrollmentAfter=new Date(batch.start.getTime() + batch.Admission.afterDaysCount*24*60*60*1000);//to get the enrollment after days  
                           var lower =new Date();
                             var upper =new Date();
                            upper = new Date(batch.enrollmentAfter.getTime()-1*24*60*60*1000);
                            lower = new Date(batch.enrollmentBefore.getTime()+1*24*60*60*1000);
                             var Batch = db.clnCourseBatchMapping.findOne({"batchId":batch._id,fkCourseId:ObjectId(courseId),"enrollmentAfter":{$lt:lower},"enrollmentBefore":{$gt:upper}},{users:1}) 
                          if(Batch!=null){ 
                             if(Batch.users.length!=0){
                                  batch.seat=batch.seats- Batch.users.length;
                            }else{
                                batch.seat=batch.seats;
                                }
                         }else{
                             batch.seat=batch.seats;
                             } 
                          if(batch.seat!=0){ 
                           results.push(batch);
                          }   
                              
                          }  
                        }                 
                       
                    } 
                    
                 }) 
      //print(results)
        return results        
}});

