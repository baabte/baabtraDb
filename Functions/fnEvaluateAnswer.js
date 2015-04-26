db.system.js.save({_id: "fnEvaluateAnswer",
    value: function (userCourseMappingId, element, elementOrder) {
        var course = db.clnUserCourseMapping.findOne({_id:ObjectId(userCourseMappingId)});
        var keyArray = elementOrder.split('.');
        var oldElement = course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]];
        var result = "Added";
        if(oldElement.markScored){
            if(oldElement.markScored > 0){
                course.markScored = course.markScored - oldElement.markScored;
                result = "Updated"
            }
        }
        
        course.markScored = course.markScored + element.markScored;
        
        course.courseTimeline[keyArray[0]][keyArray[1]][keyArray[2]] = element;
        
        db.clnUserCourseMapping.save(course);
        
        return {result:result};
        
      }});
