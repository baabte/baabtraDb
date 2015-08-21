/*

  Created by : Akshath

  Modified by : Lijin
  Date : 8-6-2015
  Purpose:Fix in element order generation

*/


db.system.js.save({
    "_id" : "fnAssignCourseMaterials4Batch",
    "value" : function (batchMappingId, dataObj) {
    var batchObj = db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId), activeFlag:1});
    var rmIds = db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId", {_id:ObjectId(batchMappingId), activeFlag:1});
    var elementOrder = {};
    var temp = {};
    for (var element in dataObj) {
        elementOrder[element] = dataObj[element].elementOrder.split(".");
    }
    for (var elem in elementOrder) {
        if (!batchObj.courseTimeline) {
            batchObj.courseTimeline = {};
        }
        var element = batchObj.courseTimeline;
        if (element[elementOrder[elem][0]] == undefined) {
            element[elementOrder[elem][0]] = {};
        }
        element = element[elementOrder[elem][0]];
        if (element[elementOrder[elem][1]] == undefined) {
            element[elementOrder[elem][1]] = [];
        }
        element = element[elementOrder[elem][1]];
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
        var markToAdd = 0;
        var elementTypeArray = ["question-viewer", "question-group-viewer", "assignment-question-viewer", "random-question-exam-viewer"];
        for (var indexKey in elements) {
            if (elementTypeArray.indexOf(elements[indexKey].type) != -1) {
                markToAdd = markToAdd + elements[indexKey].value.mark.totalMark;
            }
        }
        if (markToAdd) {
            if (batchObj.totalMark == undefined) {
                batchObj.totalMark = 0;
            }
            batchObj.totalMark = batchObj.totalMark + markToAdd;
            if (batchObj.courseTimeline[elementOrder[elem][0]].totalMark == undefined) {
                batchObj.courseTimeline[elementOrder[elem][0]].totalMark = 0;
            }
            batchObj.courseTimeline[elementOrder[elem][0]].totalMark = batchObj.courseTimeline[elementOrder[elem][0]].totalMark + markToAdd;
        }
        if (!batchObj.elementOrder) {
            batchObj.elementOrder = {};
        }
        batchObj.elementOrder[dataObj[elem].courseElement.order] = elementOrder[elem][0] + "." + elementOrder[elem][1] + "." + elementOrder[elem][2];
        db.clnCourseBatchMapping.save(batchObj);
    }
    for (var rmId in rmIds) {
        var userCourse = db.clnUserCourseMapping.findOne({fkUserRoleMappingId:rmIds[rmId], fkCourseId:batchObj.fkCourseId, activeFlag:1});
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
            if (userCourse.markSheetElements == undefined) {
                userCourse.markSheetElements = [];
            }
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
                userCourse.courseTimeline[elementOrder[elem][0]].totalMark = batchObj.courseTimeline[elementOrder[elem][0]].totalMark + markToAdd;
            }
            if (!userCourse.elementOrder) {
                userCourse.elementOrder = {};
            }
            userCourse.elementOrder[dataObj[elem].courseElement.order] = elementOrder[elem][0] + "." + elementOrder[elem][1] + "." + elementOrder[elem][2];
            db.clnUserCourseMapping.save(userCourse);
        }
    }
    return "success";
}
});

