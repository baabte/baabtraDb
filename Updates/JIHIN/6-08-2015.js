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
	    	oldElement.totalMark = oldElement.totalMark + markDifference;
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


db.system.js.save({_id: "fnLoadInterviewQuestionBank",
    value: function(interviewQuestionObj) {
        try{
            var interviewQuestions = db.clnInterviewQuestionBank.find({companyId:interviewQuestionObj.cmp_id},{_id:0}).limit(interviewQuestionObj.noOfQuestions).toArray();
            var projection = {};
            projection[interviewQuestionObj.elementOrder] = 1;
            var userCourseMapping = db.clnUserCourseMapping.findOne({_id:ObjectId(interviewQuestionObj.courseMappingId)});
            var element = userCourseMapping.courseTimeline;
            var elementOrderArray = interviewQuestionObj.elementOrder.split(".");
            for(var elem in elementOrderArray){
                element = element[elementOrderArray[elem]];
            }
            var totalMark = 0;
            for(var question in interviewQuestions){
                totalMark = totalMark + parseFloat(interviewQuestions[question].mark);
            }
            element.totalMark = totalMark;
            var elementNameLevel = userCourseMapping.courseTimeline[elementOrderArray[0]][elementOrderArray[1]];
            if(!elementNameLevel){
                elementNameLevel = 0;
            }
            
            elementNameLevel.totalMark = elementNameLevel.totalMark + totalMark;
            if(!userCourseMapping.totalMark){
                userCourseMapping.totalMark = 0;
            }
            
            userCourseMapping.totalMark = userCourseMapping.totalMark + totalMark;
            
            element.elements[interviewQuestionObj.index].value.questionArray = interviewQuestions;
            element.elements[interviewQuestionObj.index].value.questionSelection.type = "manual"; 
            userCourseMapping.updatedDate = Date();
            db.clnUserCourseMapping.save(userCourseMapping);
            return interviewQuestions;//db.clnInterviewQuestionBank.find().limit(10).toArray();
        }
        catch(err){
            return "Error";
        }
    }
});



db.system.js.save({
    "_id" : "fnAddCourseTimelineElement",
    "value" : function (courseId, courseElement) {
    var keyArray = courseElement.key.split(".");
    var tlPoint = keyArray[0];
    var elemType = keyArray[1];
    var key = "courseTimeline." + courseElement.key;
    var obj = {};
    if(elemType=='Interview'||elemType=='Physical test'){
        courseElement[courseElement.key].evalStatus ='Pending Evaluation';
    }
    
    obj[key] = courseElement[courseElement.key];//Interview
    db.clnCourses.update({_id:courseId}, {$push:obj});
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var elements = courseElement[courseElement.key].elements;
    var innerIndex = course[0].courseTimeline[tlPoint][elemType].length - 1;
    var order = 0;
    var gotOrderFlag = false;
    var lastTraversedOrder = 0;
    if (!course[0].elementOrder) {
        course[0].elementOrder = {};
    } else {
        for (tmpOrder in course[0].elementOrder) {
            var orderKeys = course[0].elementOrder[tmpOrder].split(".");
            orderKeys[0] = parseInt(orderKeys[0]);
            tlPoint = parseInt(tlPoint);
            tmpOrder = parseInt(tmpOrder);
            if (orderKeys[0] == tlPoint) {
                gotOrderFlag = true;
                order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
            }
            if (!gotOrderFlag && orderKeys[0] < tlPoint) {
                order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
            }
        }
    }
    var previousElem = "";
    var traversed = false;
    if (course[0].elementOrder[order]) {
        previousElem = course[0].elementOrder[order];
        for (curOrder in course[0].elementOrder) {
            traversed = true;
            curOrder = parseInt(curOrder);
            if (curOrder >= order) {
                var elemToCopy = previousElem;
                var traversingOrder = parseInt(curOrder + 1);
                previousElem = course[0].elementOrder[traversingOrder];
                if (typeof elemToCopy != "undefined") {
                    var keyArr = elemToCopy.split(".");
                    var tmpTlPoint = keyArr[0];
                    var elementName = keyArr[1];
                    var elemIndex = keyArr[2];
                    course[0].courseTimeline[tmpTlPoint][elementName][elemIndex].order = traversingOrder;
                    course[0].elementOrder[traversingOrder] = elemToCopy;
                }
            }
        }
    }
    var syllabusKeyArray = course[0].courseTimeline[tlPoint][elemType][innerIndex].syllabus.key.split(".");
    var syllabusObj = course[0].syllabus;
    for (var key in syllabusKeyArray) {
        syllabusObj = syllabusObj[syllabusKeyArray[key]];
    }
    if (!syllabusObj.element) {
        syllabusObj.element = [];
    }
    syllabusObj.element.push(tlPoint + "." + elemType + "." + innerIndex);
    course[0].courseTimeline[tlPoint][elemType][innerIndex].order = order;
    course[0].elementOrder[order] = tlPoint + "." + elemType + "." + innerIndex;
    var totalMark = 0;
    var looper = 0;
    var currentMark = 0;
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    if (course[0].totalMark) {
        currentMark = course[0].totalMark;
    }
    for (looper; looper < elements.length; looper++) {
        if (elements[looper] != null) {
            if (elements[looper].type == "question-viewer" ||
                elements[looper].type == "question-group-viewer" ||
                elements[looper].type == "assignment-question-viewer"||
                 elements[looper].type == "random-question-exam-viewer") {
                totalMark = totalMark + elements[looper].value.mark.totalMark;
            }
	   else if(elements[looper].type == "interview-viewer"){
		if(elements[looper].value.questionArray){
			for(var question in elements[looper].value.questionArray){
				totalMark = totalMark + elements[looper].value.questionArray[question].mark;
			}
		}
	   }
        }
    }
    course[0].totalMark = currentMark + totalMark;
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
    if(totalMark>0){
    course[0].courseTimeline[tlPoint][elemType][innerIndex].totalMark = totalMark;    
    }
    
    db.clnCourses.save(course[0]);
    return course[0].elementOrder;
}
});
