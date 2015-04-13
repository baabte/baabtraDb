//fnInsertMenu
db.system.js.save({_id: "fnInsertMenu",
                  value: function(menu) {
    db.clnMenuMaster.insert(menu);

}});