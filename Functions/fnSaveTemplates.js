db.system.js.save({_id: "fnSaveTemplates",
		value: function (template) 
{
   template.createdDate= ISODate();
    template.updatedDate= ISODate();
    db.clnEmailSmsTemplateConfig.insert(template);
    return "success";
}});

