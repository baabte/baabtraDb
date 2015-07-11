/*
Created By Lijin
Creted On: 4-7-2015
Purpose : For mapping candidates to parent
*/

db.system.js.save({
_id:'fnSaveCandidateMapping',
value:function(data){
db.clnUserDetails.update({fkUserLoginId:ObjectId(data.fkLoginId)},{$set:{candidates:data.candidateArray}});
return 'ok';
}    
});