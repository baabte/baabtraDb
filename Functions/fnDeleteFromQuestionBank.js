db.system.js.save({_id: "fnDeleteFromQuestionBank",
		value:function(questionObjId) {
   
    /*    
    Created by: Anoop
    purpose: to delete an entry from the question bank
    created on: 24th April 2015    
    */
    
    db.clnInterviewQuestionBank.update({_id:ObjectId(questionObjId)},{$set:{aciveFlag:0}});
    
    return {result:"success"};
}});
