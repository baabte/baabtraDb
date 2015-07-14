//fnGetCourseSyllabus4CandidateView

db.system.js.save({"_id" : "fnGetCourseSyllabus4CandidateView",
value:function (userLoginId, courseMappingId) {
     var course = db.clnUserCourseMapping.findOne({_id:ObjectId(courseMappingId), fkUserLoginId:ObjectId(userLoginId), activeFlag:1},{courseTimeline:1,syllabus:1,_id:0});
	

     var changeSyllabus = function(syllabus,courseTimeline){   



	if(syllabus.element!=undefined){

		 for(var index in syllabus.element){
		 		var splitArray=syllabus.element[index].split('.');
		 		var tlpoint=splitArray[0];
		 		var materialType=splitArray[1];
		 		var outerIndex=splitArray[2];
		 		var Name="";
				var	Order="";
				var status="";
		 		
		 		if(courseTimeline[tlpoint]){
		 			if(courseTimeline[tlpoint][materialType]){

		 				if(courseTimeline[tlpoint][materialType][outerIndex]){

					 		 Name=courseTimeline[tlpoint][materialType][outerIndex].elements[0].value
					 		 Order=courseTimeline[tlpoint][materialType][outerIndex].order
					 		 if(courseTimeline[tlpoint][materialType][outerIndex].evalStatus){
					 		 	status=courseTimeline[tlpoint][materialType][outerIndex].evalStatus;
					 		 }else{
					 		 	status='Pending Submission'
					 		 }

		 				}
		 			}
		 		}

					if(Name!=""){
		                    var childObj={ 
                            "name" : Name,                        
                            "nodeId" : syllabus.nodeId,                        
                            "activeFlag" : 1,
                            "ElementOrder":syllabus.element[index],
                            "children":[],
                            "order":Order,
                            "status":status
                            }
                    syllabus.children.push(childObj)
                }

                syllabus.collapsed=true;
          }
	}
	
	if((syllabus.children)&&(syllabus.children.length)&&(syllabus.children.length>0)){


        for(var index in syllabus.children){
            tmpElements=changeSyllabus(syllabus.children[index],courseTimeline);
        }
    }
              
        
    return syllabus
            
    };

    changeSyllabus(course.syllabus[0],course.courseTimeline)


    return {syllabus:course.syllabus};

}});
