db.system.js.save({
    "_id" : "funAssignCourseMaterial",
    "value" : function(courseId,urmId,dataObj){
         var elementOrder = {};
    var temp = {};
    for (var element in dataObj) {
        elementOrder[element] = dataObj[element].elementOrder.split(".");
    }
    var userCourse = db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(urmId), fkCourseId:ObjectId(courseId), activeFlag:1});
        for (var elem in elementOrder) {
            if (!userCourse.courseTimeline) {
                userCourse.courseTimeline = {};
            }
            var element = userCourse.courseTimeline;
            if (element[elementOrder[elem][0]] == undefined) {
                element[elementOrder[elem][0]] = {};
            }
            element = element[elementOrder[elem][0]];
            if (element[elementOrder[elem][1]] == undefined) {
                element[elementOrder[elem][1]] = [];
            }
            element = element[elementOrder[elem][1]];
            if(userCourse.markSheetElements == undefined)
                userCourse.markSheetElements = [];
            userCourse.markSheetElements.push(elementOrder[elem][0] + "." + elementOrder[elem][1] + "." + elementOrder[elem][2]);
            dataObj[elem].courseElement.assignedOn = Date();
            dataObj[elem].courseElement.assignedBy = "";
            for (var arrCount = 0; arrCount <= elementOrder[elem][2]; arrCount++) {
                if (element[arrCount] == undefined) {
                    element[arrCount] = "";
                }
                if (arrCount == elementOrder[elem][2]) {
                    element[arrCount] = dataObj[elem].courseElement;
                }
            }
            var elements = dataObj[elem].courseElement.elements;
            var markToAddTemp = 0;
            var elementTypeArray = ["question-viewer", "question-group-viewer", "assignment-question-viewer", "random-question-exam-viewer"];
            for (var indexKey in elements) {
                if (elementTypeArray.indexOf(elements[indexKey].type) != -1) {
                    markToAddTemp = markToAddTemp + elements[indexKey].value.mark.totalMark;
                }
            }
            if (markToAddTemp) {
                if (userCourse.elementOrder == undefined) {
                    userCourse.totalMark = 0;
                }
                userCourse.totalMark = userCourse.totalMark + markToAddTemp;
                if (userCourse.courseTimeline[elementOrder[elem][0]].totalMark == undefined) {
                    userCourse.courseTimeline[elementOrder[elem][0]].totalMark = 0;
                }
                userCourse.courseTimeline[elementOrder[elem][0]].totalMark = userCourse.courseTimeline[elementOrder[elem][0]].totalMark + markToAddTemp;
            }
            if (!userCourse.elementOrder) {
                userCourse.elementOrder = {};
            }
            userCourse.elementOrder[dataObj[elem].courseElement.order] = elementOrder[elem][0] + "." + elementOrder[elem][1] + "." + elementOrder[elem][2];
    
        }
        db.clnUserCourseMapping.save(userCourse);
        return  "success";
    }
});
