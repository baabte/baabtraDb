db.system.js.save({_id: "fnLoadTemplates",
		value: function () 
{
 var result= db.clnEmailSmsTemplateConfig.find().toArray()
   return result; 
}});

