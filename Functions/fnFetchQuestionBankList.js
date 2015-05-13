//fnFetchQuestionBankList

db.system.js.save({_id: "fnFetchQuestionBankList",
      value: function (questionBankFetchData) {
    var companyId=ObjectId(questionBankFetchData.fkcompanyId);


    var questionBanklist = db.clnQuestionBank.find({companyId:companyId,activeFlag:1},{_id:1, Name:1,noOfQuestions:1}).toArray();

    for(var index in questionBanklist){
    	questionBanklist[index]._id=questionBanklist[index]._id.valueOf();
    }
    return questionBanklist;
}});