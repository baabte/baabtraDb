//fncourseElementsByAttendence 
db.system.js.save({_id: "fncourseElementsByAttendence",
      value: function (data) {
      	var userCourseMappingId=ObjectId(data.userCourseMappingId);
      	var userCourseTimelineData=db.clnUserCourseMapping.findOne({_id:userCourseMappingId},{courseTimeline:1,_id:0});
      	var userCourseElementlist=[];
      	for(var tlpoint in userCourseTimelineData.courseTimeline){
      		for(var userCourseElementType in userCourseTimelineData.courseTimeline[tlpoint]){
      			if(typeof userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType]=='object'){
      				for(var innerIndex in userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType]){
      					if(userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType][innerIndex].attendenceTrack==true){

      		    		userCourseElementlist.push({tlpoint:tlpoint,userCourseElementType:userCourseElementType,innerIndex:innerIndex,courseElement:userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType][innerIndex]});
      		    		}
      				}
      			}
      		}
      	}
        
      	return userCourseElementlist;
}});


//fnMarkAttendence
db.system.js.save({_id: "fnMarkAttendence",
      value: function (data) {
            var course=db.clnUserCourseMapping.findOne({_id:ObjectId(data.userCourseMappingId)});
            course.courseTimeline[data.tlpoint][data.userCourseElementType][data.innerIndex].attendence=data.attendence;
            db.clnUserCourseMapping.save(course);
            return 'attendence marked'; 
      }});



db.system.js.save({_id: "fnEvaluationFetch",
      value: function (data) {
            var userCourseMappingId=ObjectId(data.userCourseMappingId);
            var tlPoint=data.tlPoint;
            var elementType=data.elementType;
            var outerIndex=data.outerIndex;


            var course=db.clnUserCourseMapping.findOne({_id:userCourseMappingId},{courseTimeline:1});

            return course.courseTimeline[tlPoint][elementType][outerIndex];
      
    }});

//fnSubmitTest
db.system.js.save({_id: "fnSubmitTest",
                  value: function (SubmitTestObj) {
          var courseMappingId=ObjectId(SubmitTestObj.courseMappingId);
          var userLoginId=ObjectId(SubmitTestObj.userLoginId);
          var keyName=SubmitTestObj.keyName;
          var tlPointInmins=SubmitTestObj.tlPointInmins;
          var outerIndex=SubmitTestObj.outerIndex;
          var innerIndex=SubmitTestObj.innerIndex;
          var timeObj=SubmitTestObj.timeObj;
          var userAnswers=SubmitTestObj.userAnswers;
          var totalMarkScored=SubmitTestObj.totalMarkScored;
          var uniquekey;
          var resultmsg;
          var targetList=[];

var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});  
uniquekey=course._id.valueOf()+'.'+tlPointInmins+'.'+keyName+'.'+outerIndex;
//checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=0;  
    }
   
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored+totalMarkScored;
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins].markScored){
    course.courseTimeline[tlPointInmins].markScored=0;  
    }
   
    course.courseTimeline[tlPointInmins].markScored=course.courseTimeline[tlPointInmins].markScored+totalMarkScored;
   
    //checks if he have already scored marks
    if(!course.markScored){
    course.markScored=0;  
    }  
   
    course.markScored=course.markScored+totalMarkScored;
    
     course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;  
   

    for(var index in userAnswers){
      for(var key in userAnswers[index]){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.testModel[index][key]=userAnswers[index][key];
        }
    }

db.clnUserCourseMapping.save(course);

return course;
}});



//fnEvaluationFetch
db.system.js.save({_id: "fnEvaluationFetch",
      value: function (data) {
            var userCourseMappingId=ObjectId(data.userCourseMappingId);
            var tlPoint=data.tlPoint;
            var elementType=data.elementType;
            var outerIndex=data.outerIndex;


            var course=db.clnUserCourseMapping.findOne({_id:userCourseMappingId},{courseTimeline:1});

            return course.courseTimeline[tlPoint][elementType][outerIndex];
      
    }});

//fnEvaluateAnswer
db.system.js.save({_id: "fnEvaluateAnswer",
      value: function (data) {
            var userCourseMappingId=ObjectId(data.userCourseMappingId);
            var tlPoint=data.tlPoint;
            var elementType=data.elementType;
            var outerIndex=data.outerIndex;
            var evaluationobj=data.evaluationobj;
            var oldCourseMark=0;//to keep old course mark;
            var oldtlpointMark=0;// keep old course mark;
            var oldelementMark=0;//to keep old element mark;
            var newtlpointMark=0; //to keep new tlpint mark;
            var newelementMark=evaluationobj.markScored; //new course element mark;

            evaluationobj.evaluatedBy=ObjectId(evaluationobj.evaluatedBy);

            for(var index in evaluationobj.evaluator){
                        evaluationobj.evaluator[index].roleMappingId=ObjectId(evaluationobj.evaluator[index].roleMappingId)
                  }

            var course=db.clnUserCourseMapping.findOne({_id:userCourseMappingId});//taking that course element back to update
            oldCourseMark=course.markScored; //keeping prevoius score @ course level
            oldtlpointMark=course.courseTimeline[tlPoint].markScored; //keeping prevoius score @ time-line  level
            oldelementMark=course.courseTimeline[tlPoint][elementType][outerIndex].markScored; //keeping prevoius score @ element level

            //updating 
            course.courseTimeline[tlPoint].markScored-=oldelementMark;
            course.courseTimeline[tlPoint].markScored+=newelementMark;
            newtlpointMark=course.courseTimeline[tlPoint].markScored;
            course.markScored-=oldtlpointMark;
            course.markScored+=newtlpointMark;

            course.courseTimeline[tlPoint][elementType][outerIndex]=evaluationobj;

            db.clnUserCourseMapping.save(course);
            return 'evaluated sucessfully';
      }});