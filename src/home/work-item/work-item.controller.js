(function () {
"use strict";

angular.module('medewerkerportaal')
.controller('WorkItemController', WorkItemController);

WorkItemController.$inject = ['taskName', 'processInstanceId', 'taskId', 'SoapService','CommonService'];
function WorkItemController(taskName, processInstanceId, taskId, SoapService, CommonService) {
	var $ctrl = this;

	$ctrl.taskName = taskName;
	$ctrl.processInstanceId = processInstanceId;
	$ctrl.taskId = taskId;
	$ctrl.result = {};
	$ctrl.gegevens = {};

	$ctrl.submit = function(){
		$ctrl.promise = SoapService.triggerCase($ctrl.processInstanceId, $ctrl.taskId, $ctrl.result).then( function success (result) {
			$ctrl.result_text = "Ok";
		})
		.catch (function (error){
			$ctrl.result_text = "Opslaan mislukt: " + error;
			console.log ($ctrl.result_text);
		});
	}	
	
	$ctrl.nexttask = function(){
		$ctrl.promise = SoapService.getCase(CommonService.getProcessId(), $ctrl.processInstanceId, null).then( function success (result2) {
			if (result2.data.length != 0){
				$ctrl.gegevens = result2.data;
				$ctrl.taskName_next = $ctrl.gegevens[0].name;
				$ctrl.processInstanceId_next = $ctrl.gegevens[0].processInstanceId;
				$ctrl.taskId_next = $ctrl.gegevens[0].id;
				$ctrl.taskDefKey_next = $ctrl.gegevens[0].taskDefinitionKey;
				$ctrl.nexttask_text = $ctrl.gegevens[0].name;
			}
			else {
				$ctrl.result_text = "Geen volgende taak gevonden.";	
			}
		})
		.catch (function (error){
			$ctrl.result_text = "Opzoeken next task mislukt: " + error;
			console.log ($ctrl.result_text);
		});
	}
}


}) ();