(function(){
'use strict';

angular.module('common')
.service('CommonService', CommonService);

function CommonService(){
    var service = this;

    service.login = null;
    service.processId = null;

    service.saveLogin = function(login){
        if (login != null){
            service.login = login;
            console.log("saveLogin: ", service.login);
        }
        else {
            service.login = null;
        }
    }   

    service.getLogin = function(){
        return service.login;
    }

    service.saveProcessId = function(id){
        if (id != null){
            service.processId = id;
            console.log("saveProcessId: ", service.processId);
        }
        else {
            service.processId = "";
        }
    }   

    service.getProcessId = function(){
        return service.processId;
    }
}
})();