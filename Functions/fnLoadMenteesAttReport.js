db.system.js.save({
    "_id" : "fnLoadMenteesAttReport",
    "value" : function(courseId,urmId) {
    
  currentCourseTimeLine = db.clnUserCourseMapping.findOne({_id:ObjectId(courseId),fkUserRoleMappingId:ObjectId(urmId),activeFlag:1},{courseImg:0});
        data=[
		[ 
                    "Attendance", 
                    "User Track"
                ]
            ];
  
          var present=0,absent=0;
  
        for(var order in currentCourseTimeLine.elementOrder){
            tempArr=currentCourseTimeLine.elementOrder[order].split('.');
            
            var tlpoint=tempArr[0];
            var type=tempArr[1];
            var innerIndex=tempArr[2];
            var courseElm=currentCourseTimeLine.courseTimeline[tlpoint][type][innerIndex];
         
            if(courseElm!=undefined){
            if(courseElm.attendenceTrack!=undefined ){
                if(courseElm.attendenceTrack==true){
                      if(courseElm.attendence==true){
                            present++;
                      }
                    else{
                        absent++;
                     }  
               }
            
            }
           }
            
        }
        data.push(["Present",present]);
        data.push(["Absent",absent]);
  return {data:data};

   
}
});
