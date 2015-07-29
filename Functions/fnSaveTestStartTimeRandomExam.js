//fnSaveTestStartTimeRandomExam
db.system.js.save({_id: "fnSaveTestStartTimeRandomExam",
                  value: function (StartTimeObj) {
    var courseMappingId = ObjectId(StartTimeObj.courseMappingId);
    var userLoginId = ObjectId(StartTimeObj.userLoginId);
    var keyName = StartTimeObj.keyName;
    var tlPointInmins = StartTimeObj.tlPointInmins;
    var outerIndex = StartTimeObj.outerIndex;
    var innerIndex = StartTimeObj.innerIndex;
    var timeObj = StartTimeObj.timeObj;
    var questionBankId = ObjectId(StartTimeObj.questionBankId);
    var noOfQuestion = StartTimeObj.noOfQuestion;
    var resultmsg;
    var course = db.clnUserCourseMapping.findOne({_id:courseMappingId, activeFlag:1});
    if (!course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]) {
        var date = new Date;
        var currentTime = date.getTime();
        course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key] = currentTime;
        var tempArray = db.clnQuestionBank.findOne({_id:questionBankId}, {questions:1, _id:0});
        var questionsArray = tempArray.questions;
        if (questionsArray.length < noOfQuestion) {
            noOfQuestion = questionsArray.length;
        }
        var testModel = [];
        while (noOfQuestion > 0) {
            var index = Math.floor(Math.random() * questionsArray.length);
            testModel.push(questionsArray[index]);
            questionsArray.splice(index, 1);
            noOfQuestion--;
        }
        course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.testModel = testModel;
        db.clnUserCourseMapping.save(course);
        resultmsg = "test Started";
    } else {
        resultmsg = "test already started or finished";
    }
    return {result:resultmsg, testModel:testModel};
}});
