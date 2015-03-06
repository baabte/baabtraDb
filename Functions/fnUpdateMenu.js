db.system.js.save({_id: "fnUpdateMenu",
                  value:function(menu) {
    db.clnMenuMaster.save(menu);
    return db.clnMenuMaster.find({activeFlag:1}).toArray();
}});

