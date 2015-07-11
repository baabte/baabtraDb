/*
Created By Lijin
Creted On: 4-7-2015
Purpose : For loading mapped candidates for parent
*/
db.system.js.save({
_id:'fnLoadMappedCandidatesForParent',
value:function(data){
    var candidateIds = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(data.fkLoginId)},{_id:0,candidates:1});
    for(var key in candidateIds.candidates){
     candidateIds.candidates[key]=ObjectId(candidateIds.candidates[key]);
    }
    var candidates = [];
    if(candidateIds.candidates){
       candidates = db.clnUserDetails.find({"fkUserLoginId":{$in:candidateIds.candidates}}).toArray();    
    }
    return candidates;
}});