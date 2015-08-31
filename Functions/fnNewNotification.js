db.system.js.save({
_id:'fnNewNotification',
value:function(data){
    
    var fkLoginIds = data.fkLoginIds;
    delete data.fkLoginIds;
    var ids = [];
    data.crmId = ObjectId(data.crmId);
    data.createdDate = new Date();
    data.read = 0;
    
    for(key in fkLoginIds){
    	data._id = new ObjectId();
    	ids.push(data._id.valueOf());
    	data.fkLoginId = fkLoginIds[key];
    	db.clnNotification.save(data);	
    }
    return ids;
}
});