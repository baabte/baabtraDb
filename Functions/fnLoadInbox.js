db.system.js.save({
_id:"fnLoadInbox",
value:function(data){
if(data.lastId){
    data.filter._id = {$gt:ObjectId(data.lastId)}
}
return db.clnCommunications.find(data.filter).sort({_id:-1}).limit(10).toArray();
}
});