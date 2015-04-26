
db.system.js.save({_id: "fnLoadInterviewQuestionBank",
    value: function(companyId, noQuestion) {
    	return db.clnInterviewQuestionBank.find().limit(10).toArray();
	}
});
