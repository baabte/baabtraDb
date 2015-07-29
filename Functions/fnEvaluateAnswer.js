//fnSubmitTest
db.system.js.save({
    "_id" : "fnSubmitTest",
    "value" : function (SubmitTestObj) {
          var courseMappingId = ObjectId(SubmitTestObj.courseMappingId);
          var userLoginId = ObjectId(SubmitTestObj.userLoginId);
          var keyName = SubmitTestObj.keyName;
          var tlPointInmins = SubmitTestObj.tlPointInmins;
          var outerIndex = SubmitTestObj.outerIndex;
          var innerIndex = SubmitTestObj.innerIndex;
          var timeObj = SubmitTestObj.timeObj;
          var userAnswers = SubmitTestObj.userAnswers;
          var totalMarkScored = SubmitTestObj.totalMarkScored;
          var uniquekey;
          var resultmsg;
          var targetList = [];
          var temp = {};
          
          var evalStatus='';
          for(var index in userAnswers){
              if(userAnswers[index].evaluated==0){
                  evalStatus='Pending Evaluation';
                  }
          }
          
          if(evalStatus==''){
              evalStatus = 'Evaluated';
              }
          
          var course = db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});  
          uniquekey = course._id.valueOf()+'.'+tlPointInmins+'.'+keyName+'.'+outerIndex;
          
          var element = course.courseTimeline[tlPointInmins][keyName][outerIndex];
          var oldElement = JSON.parse(JSON.stringify(element));
          if(!oldElement.markScored){
              oldElement.markScored = 0;
          }
          element.evalStatus = evalStatus;
          
          course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;
          var markToMinus = 0;
          
          for(var index in userAnswers){
              for(var key in userAnswers[index]){
                  if(key == "markScored"){
                      if(parseFloat(element.elements[innerIndex].value.testModel[index][key]))
                          markToMinus = markToMinus + parseFloat(element.elements[innerIndex].value.testModel[index][key]);
                      }
                      course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.testModel[index][key]=userAnswers[index][key];
                      }
                      }
          //checks if he have already scored marks
          if(!element.markScored){
              element.markScored = 0;
              }
   
    element.markScored = element.markScored + (totalMarkScored - markToMinus);
    //temp = element.markScored + (totalMarkScored - markToMinus);
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins].markScored){
        course.courseTimeline[tlPointInmins].markScored=0;  
    }
   
    course.courseTimeline[tlPointInmins].markScored = course.courseTimeline[tlPointInmins].markScored + (totalMarkScored - markToMinus);
   
    //checks if he have already scored marks
    if(!course.markScored){
    	course.markScored=0;  
    }  
   
    course.markScored = course.markScored + (totalMarkScored - markToMinus);
    
    var syllabusKeyArray = element.syllabus.key.split(".");
                var syllabusObj = course.syllabus;
                for (var key in syllabusKeyArray) {
                    if (syllabusObj[syllabusKeyArray[key]]) {
                        syllabusObj = syllabusObj[syllabusKeyArray[key]];
                    }
                }
                    var markElemCount = 0;
                    var oldSyllabusMark = 0;
                    for (var elem in syllabusObj.element) {
                        if (course.markSheetElements.indexOf(syllabusObj.element[elem]) != -1) {
                            markElemCount++;
                        }
                    }
                    if (element.markScored == oldElement.markScored) {
                        oldElement.markScored = 0;
                    }
                    if (!syllabusObj.mark.markScored) {
                        syllabusObj.mark.markScored = 0;
                    }
                    syllabusObj.mark.markScored = (syllabusObj.mark.markScored - oldSyllabusMark) + (element.markScored - oldElement.markScored) / element.totalMark * syllabusObj.mark.maxMark / (markElemCount ? markElemCount : 1);
                    //temp = oldElement;//(syllabusObj.mark.markScored - oldSyllabusMark) + (element.markScored - oldElement.markScored) / element.totalMark;
db.clnUserCourseMapping.save(course);

return course;
}
});


