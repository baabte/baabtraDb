db.system.js.save({
"_id":"fnLoadParent",
value:function(data){
    return db.clnUserDetails.find({candidates:data.candidateId}).toArray();
}
});