/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For remove course element from course timeline

Modified by:Lijin
Date:20-2-2015
purpose: Added feature for re-calculating total mark of the course

Modified By: Lijin
Date: 05-03-2015
purpose: For retaining order of element on updation

Modified By: Arun
Date: 04-05-2015
purpose: for returning the element order back to front end 

Modified By: Lijin
Date: 13-05-2015
purpose: added assignment-question-viewer

Modified By: Jihin
Date: 13-05-2015
purpose:  Added syllabus in element level

Modified By: Arun
Date: 14-05-2015
purpose:  total mark calculation in element delete

*/

db.system.js.save({
    "_id" : "fnRemoveCourseElement",
    "value" : function (courseId, courseElemName, tlPoint, index, rmId) {
    try {
        var obj = {};
        var temp = {};
        var objProjection = {};
        var oldCourse = db.clnCourses.findOne({_id:courseId});
        var elementNameLevel = oldCourse.courseTimeline[tlPoint][courseElemName];
        var element = elementNameLevel[index];
        var elemenOrderCopy = JSON.parse(JSON.stringify(oldCourse.elementOrder));
        var elementOrderLength = Object.keySet(elemenOrderCopy).length;
        for (var order in oldCourse.elementOrder) {
            if (order > element.order) {
                var elementOrderArray = JSON.parse(JSON.stringify(oldCourse.elementOrder[order].split(".")));
                var elementToBeEdit = oldCourse.courseTimeline[elementOrderArray[0]][elementOrderArray[1]][elementOrderArray[2]];
                if (elementOrderArray[0] == tlPoint &&
                    elementOrderArray[1] == courseElemName &&
                    parseInt(elementOrderArray[2]) > parseInt(index)) {
                    oldCourse.elementOrder[order] = elementOrderArray[0] + "." + elementOrderArray[1] + "." + (parseInt(elementOrderArray[2]) - 1);
                    elementToBeEdit.index = parseInt(elementOrderArray[2]) - 1;
                    var syllabusArray = elementToBeEdit.syllabus.key.split(".");
                    var syllabus = oldCourse.syllabus;
                    for (var syllabusArrayNode in syllabusArray) {
                        syllabus = syllabus[syllabusArray[syllabusArrayNode]];
                    }
                    if (syllabus != null) {
            var indexOfSyllabusElement = -1;
            if(syllabus.element){
                            indexOfSyllabusElement = syllabus.element.indexOf(elementOrderArray[0] + "." + elementOrderArray[1] + "." + elementOrderArray[2]);
}
                        if (indexOfSyllabusElement != -1) {
                            syllabus.element[indexOfSyllabusElement] = oldCourse.elementOrder[order];
                        }
                        if (oldCourse.markSheetElements) {
            var indexOfmarkSheetElement = -1;
            if(oldCourse.markSheetElements){
                            var indexOfmarkSheetElement = oldCourse.markSheetElements.indexOf(elementOrderArray[0] + "." + elementOrderArray[1] + "." + elementOrderArray[2]);
}
                            if (indexOfmarkSheetElement != -1) {
                                oldCourse.markSheetElements[indexOfmarkSheetElement] = oldCourse.elementOrder[order];
                            }
                        }
                    }
                }
                elemenOrderCopy[order - 1] = oldCourse.elementOrder[order];
                elementToBeEdit.order = order - 1;
            }
        }
       var syllabusArray = element.syllabus.key.split(".");
        var syllabus = oldCourse.syllabus;
        for (var syllabusArrayNode in syllabusArray) {
            syllabus = syllabus[syllabusArray[syllabusArrayNode]];
        }
         if (syllabus != null) {
        var indexOfSyllabusElement = -1;
        if(syllabus.element){
            indexOfSyllabusElement = syllabus.element.indexOf(tlPoint + "." + courseElemName + "." + index);
}
            if (indexOfSyllabusElement != -1) {
                syllabus.element.splice(indexOfSyllabusElement, 1);
            }
            if (oldCourse.markSheetElements) {
                var indexOfmarkSheetElement = -1;
        if(oldCourse.markSheetElements){
            indexOfmarkSheetElement = oldCourse.markSheetElements.indexOf(tlPoint + "." + courseElemName + "." + index);
}
                if (indexOfmarkSheetElement != -1) {
                    oldCourse.markSheetElements.splice(indexOfmarkSheetElement, 1);
                }
            }
        }
        if (element.totalMark) {
            oldCourse.courseTimeline[tlPoint].totalMark = oldCourse.courseTimeline[tlPoint].totalMark - element.totalMark;
            oldCourse.totalMark = oldCourse.totalMark - element.totalMark;
        }
        elementNameLevel.splice(index, 1);

        if(!oldCourse.courseTimeline[tlPoint][courseElemName].length){
            delete oldCourse.courseTimeline[tlPoint][courseElemName];
            if(Object.keySet(oldCourse.courseTimeline[tlPoint]).length ==1){
                if(oldCourse.courseTimeline[tlPoint].totalMark != undefined){
                    delete oldCourse.courseTimeline[tlPoint];
                }
            }
        }
                
        delete elemenOrderCopy[elementOrderLength - 1];
        oldCourse.elementOrder = elemenOrderCopy;
        oldCourse.updatedDate = Date();
        db.clnCourses.save(oldCourse);
        return oldCourse.elementOrder;
    } catch (err) {
      return "Error";
    }
}});
