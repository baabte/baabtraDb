db.system.js.save({_id: "fnAddToQuestionBank",
		value:function(questionObj) {
   
  /*
    created by : Anoop
    purpose : add questions to the question bank
    created on : 24th April 2015
  */  
    if(questionObj._id){
        questionObj._id = ObjectId(questionObj._id);
    }
    else{
        questionObj._id = new ObjectId();
    }
    
    db.clnInterviewQuestionBank.save(questionObj);
    
    return  questionObj._id;
    
}});
