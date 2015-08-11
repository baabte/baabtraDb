db.system.js.save({
_id:'fnNewNotification',
value:function(data){
    data._id = new ObjectId();
    data.crmId = ObjectId(data.crmId);
    data.createdDate = new Date();
    data.read = 0;
    
    db.clnNotification.save(data);
    return data;
}
});