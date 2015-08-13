db.system.js.save({
    "_id" : "fnEditCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, elemObjToSave, rmId) {
	try{
		//finding the editing course
		var course = db.clnCourses.findOne({_id:courseId});
                
                var elementOrder = tlPoint+"."+courseElemName+"."+elemObjToSave.index;
		//selecting the element to edit
		var oldElement = course.courseTimeline[tlPoint][courseElemName][elemObjToSave.index];
		//selecting old course element elements
		var oldElements = oldElement.elements;
		//taking old element total mark
		var oldElementTotalMark = oldElement.totalMark?oldElement.totalMark:0;
            
		var temp = {};

		var newElement = elemObjToSave.element;
		var newElements = newElement.elements;
		var newElementTotalMark = 0;
		for (var looper in newElements) {
			
	        if (newElements[looper] != null) {
	            if (newElements[looper].type == "question-viewer" ||
	                newElements[looper].type == "question-group-viewer" ||
	                newElements[looper].type == "assignment-question-viewer"||
	                newElements[looper].type == "random-question-exam-viewer") {
	            	
	                newElementTotalMark = newElementTotalMark + newElements[looper].value.mark.totalMark;
	            }
			    else if(newElements[looper].type == "interview-viewer"){

			    	if(newElements[looper].value.questionArray){
			    		for(var question in newElements[looper].value.questionArray){
			    			
			    			newElementTotalMark = newElementTotalMark + newElements[looper].value.questionArray[question].mark;
			    		}
			    		
					}
			   }
	        }
	    }

	    var markDifference = newElementTotalMark - oldElementTotalMark;
	    elemObjToSave.element.totalMark = newElementTotalMark;
	    if(markDifference){
	    	oldElement.totalMark = (oldElement.totalMark?oldElement.totalMark:0) + markDifference;
	    	course.courseTimeline[tlPoint].totalMark = course.courseTimeline[tlPoint].totalMark + markDifference;
	    	course.totalMark = course.totalMark + markDifference;
	    }

	    if(oldElement.syllabus.key != elemObjToSave.element.syllabus.key){
                
	    	var oldSyllabusKey = oldElement.syllabus.key;
            var oldSyllabusKeyArray = oldSyllabusKey.split(".");
            var syllabus = course.syllabus;
            for(var sybsKey in oldSyllabusKeyArray){
            	syllabus = syllabus[oldSyllabusKeyArray[sybsKey]];
            }
            if(syllabus.element){
                var elementIndex = syllabus.element.indexOf(elementOrder);
                if(elementIndex != -1){
                    syllabus.element.splice(elementIndex, 1);
                }
            }

            var newSyllabusKeyArray = elemObjToSave.element.syllabus.key.split(".");

            var syllabus = course.syllabus;
            for(var sybsKey in newSyllabusKeyArray){
            	syllabus = syllabus[newSyllabusKeyArray[sybsKey]];
            }

            if(!syllabus.element){
            	syllabus.element = [];
            }
            syllabus.element.push(elementOrder);
            oldElement.syllabus = elemObjToSave.element.syllabus;
	    }

	    oldElement.elements = newElements;
	    db.clnCourses.save(course);
	    return course;
	}
	catch(err){
		return "Error";
	}
}});

