const config = require("../../../config");
module.exports = {
    GetById: function(id){
        if(config.hosts.filter(x => x.id == id).length == 0) return null;
        return config.hosts.find(x => x.id == id);
    },
    GetDataCenterById: function(id){
        if(config.DataCenter.filter(x => x.id == id).length == 0) return 'Not Found';
        return config.DataCenter.find(x => x.id == id).name;
    },
    GetFullDataCenterById: function(id){
        if(config.DataCenter.filter(x => x.id == id).length == 0) return null;
        return config.DataCenter.find(x => x.id == id);
    }
}