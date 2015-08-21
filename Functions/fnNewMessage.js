db.system.js.save({
_id:"fnNewMessage",
value:function(data){
data.createdDate = new Date();
data._id = ObjectId();
db.clnCommunications.save(data);
return 'ok';
}
});