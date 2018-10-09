(function(){
'use strict';

angular.module('common')
.service('SoapService', SoapService);


SoapService.$inject = ['$http', 'CommonService', '$q'];
function SoapService($http, CommonService, $q){
    var service = this;

    service.returnXML = "";

    // This is the callback function that displays the result of the web service call
    service.callComplete = function(result){
        if (result){
            service.returnXML = result.response;
        }
        else
        {
            // alert("Error occurred calling web service.");
        }
    }

    /*  Maken van de json body die wordt meegegeven als een 
        procesinstantie wordt getriggered door het completen van een task
        van de procesinstantie. De json body bevat variabelen die gezet
        worden tijdens het completen van de task. 

        De json body bevat de variabele namen en de waarde die hiervoor is ingevuld
        in het task scherm. Deze staan in de hash 'result'.
        */    
    service.triggerBody = function(result){
        var result_keys = Object.keys(result);
        var tmp = "{\"variables\": {" 

        console.log ("result_keys.length: ", result_keys.length);
        for (var i=0;i<result_keys.length;i++){
            if (i!=0){
                tmp += ",";
            }
            tmp += "\"" + result_keys[i] + "\": {\"value\":" + "\"" + result[result_keys[i]] + "\"" + "}";
        }
                    
        tmp += "}}";

        console.log ("tmp:", tmp);
        return tmp;
    }

    /* Maken van de json body die wordt meegegeven bij het aanmaken van een 
    nieuwe procesinstantie */
    service.createBody = function(){
        var tmp = "{}";

        return tmp;
    }

    service.createCase = function(name){
        var jsonBody = service.createBody();
        var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
        }
        if (name != null) {
            var tmp = "http://localhost:8080/engine-rest/process-definition/key/";
            tmp += name;
            tmp += "/start";
            return $http.post(tmp, jsonBody, config);
        }
        else {
            return -1;
        }
    };

    service.getCase = function(name, instanceid, assignee){
        console.log("service.getCase");
        console.log("assignee: ", assignee);
        var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
        };

        //create get request
        var getrequest = "http://localhost:8080/engine-rest/task?processDefinitionKey=" + name;

        if (assignee!= null || assignee == "") {
            getrequest += "&assignee=" + assignee;
        }

        if (instanceid!= null || instanceid == "") {
            getrequest += "&processInstanceId=" + instanceid;
        }
        
        return $http.get(getrequest, config);
    };

    service.addVariable = function(name, instance, i){
        //console.log("service.getVariable");
        var deferred = $q.defer();

        var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
        };

        //create get request
        var getrequest = "http://localhost:8080/engine-rest/process-instance/" + instance[i].processInstanceId + "/variables/" + name;
        var promise = $http.get(getrequest, config);
        promise.then(function (result){
            instance[i].opgave_id = result.data.value;
        }) 

        deferred.resolve(instance);
        return deferred.promise;
    };

    service.addVariables = function(name, gegevens){
        //console.log("addVariables: gegevens", gegevens);

        var deferred = $q.defer();

        for(var i=0;i<gegevens.length;i++){
            var promise = service.addVariable(name, gegevens, i);

            promise.then( function (result) {
                return result;
            })
        }

        deferred.resolve(gegevens);
        return deferred.promise;
    }

    service.triggerCase = function (processId, taskId, result){
        if (result != null) {

            var jsonBody = service.triggerBody(result);
            var config = {
                    headers : {
                        'Content-Type': 'application/json'
                    }
                }
            return $http.post("http://localhost:8080/engine-rest/task/" + taskId + "/complete", jsonBody, config);
        }
        else {
            return null;
        }
    }

    //not used for camunda
    service.createSoapHeader = function(country){
        // create the Soap request for the web service
        var soap = 
        "<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" " + "xmlns:tem=\"http://tempuri.org/\">" +
           "<soap:Header/>" +
           "<soap:Body>" +
              "<tem:createCases>" +
                 "<tem:casesInfo>" +
                    "<BizAgiWSParam>" +
                        "<domain>domain</domain>" +
                        "<userName>Employee</userName>" +
                        "<Cases>" +
                            "<Case>" +
                            "<Process>VacationLeaveRequest</Process>" +
                            "<Entities>" +
                                "<VacationLeaveRequest>" +
                                    "<Handelsnaam>Pipo</Handelsnaam>" +
                                    "<Businessdaysrequested>33</Businessdaysrequested>" +
                                "</VacationLeaveRequest>" +
                            "</Entities>" +
                            "</Case>" +
                        "</Cases>" +
                    "</BizAgiWSParam>" +
                 "</tem:casesInfo>" +
              "</tem:createCases>" +
           "</soap:Body>" +
        "</soap:Envelope>";      
        return soap;
    }

    //not used for Camunda
    service.getSoapHeader = function(name){
        // create the Soap request for the web service
        var soap = 
        "<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" " + "xmlns:tem=\"http://tempuri.org/\">" +
           "<soap:Header/>" +
           "<soap:Body>" +
              "<tem:getActivities>" +
                 "<tem:activitiesFilters>" +
                    "<BizAgiWSParam>" +
                        "<userName>" + name + "</userName>" +
                    "</BizAgiWSParam>" +
                 "</tem:activitiesFilters>" +
              "</tem:getActivities>" +
           "</soap:Body>" +
        "</soap:Envelope>";      
        return soap;
    }

     //not used for Camunda
    service.triggerSoapHeader = function(processId, taskId, result){
        // create the Soap request for the web service
        var resultXml = service.createResultXml(result);
        console.log("resultXml: ", resultXml);
        var soap = 
        "<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" " + "xmlns:tem=\"http://tempuri.org/\">" +
           "<soap:Header/>" +
           "<soap:Body>" +
              "<tem:performActivity>" +
                 "<tem:activityInfo>" +
                    "<BizAgiWSParam>" +
                        "<domain>domain</domain>" +
                        "<userName>Employee</userName>" +
                        "<ActivityData>" +
                                "<radNumber>" + processId + "</radNumber>" +
                                "<taskId>" + taskId + "</taskId>" + 
                        "</ActivityData>" + resultXml +
                    "</BizAgiWSParam>" +
                 "</tem:activityInfo>" +
              "</tem:performActivity>" +
           "</soap:Body>" +
        "</soap:Envelope>";      
        return soap;
    }

    //not used for Camunda
    service.createResultXml = function (result) {
        var temp = "";
        for (var i in result){
            temp = temp + "<" + i + ">" + result[i] + "</" + i + ">";
        }

        return "<Entities>" + 
                    "<VacationLeaveRequest>" +
                        temp +
                    "</VacationLeaveRequest>" +
                "</Entities>"
    }

    //not used for Camunda
    service.getTagValues = function (inputStr, tagName){
        //Function to go through whole inputStr to find the
        //values of all tags
        console.log("soap.service.js.getTagValues");
        
        var tagArray = [];
        var pos = 0;

        while (pos != -1){
            pos = service.getTagValue(inputStr, tagName, pos, tagArray);         
        }
        return tagArray;
    }

    //not used for Camunda
    service.getTagValue = function(inputStr, tagName, pos, tagArray){
        // Function to search for tagged element in a string,
        // from position pos
        
        // PARAM inputStr - string containing tagged document
        // PARAM tagName - name of element to locate
        // PARAM pos - position to start search
        // RETURNS string data between tagName element or "" if not found
        console.log("soap.service.js.getTagValue");

        var stag = "<" + tagName + ">";
        var etag = "<" + "/" + tagName + ">";

        var startPos = inputStr.indexOf(stag, pos);
        if (startPos >= pos)
        {
            var endPos = inputStr.indexOf(etag, startPos);
            if (endPos > startPos)
            {
                startPos = startPos + stag.length;
                var value = inputStr.substring(startPos, endPos);
                if (value != ""){
                    tagArray.push(value);
                }
                return endPos;
            }
        }

        return -1;
    }      
   
}
})();
