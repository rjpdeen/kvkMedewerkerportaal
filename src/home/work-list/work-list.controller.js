(function () {
"use strict";

angular.module('medewerkerportaal')
.controller('WorkListController', WorkListController);

WorkListController.$inject = ['SoapService','CommonService', '$q'];
function WorkListController(SoapService, CommonService, $q) {
	var $ctrl = this;

	//console.log("work-list.controller.js");

	$ctrl.displayCases = function (gegevens){
		console.log("START displayCases");
		if (gegevens.length != 0) {
			//console.log("Cases gevonden:", gegevens.length);
			//console.log("id: ", gegevens[0].id);
			$ctrl.result_text = gegevens.length.toString() + " taken gevonden.";

			//create range for ng-repeat list
			var range = [];
			for(var i=0;i<gegevens.length;i++) {
			  range.push(i);
			}
			$ctrl.range = range;
		}
		else {
			$ctrl.result_text = "Geen taken gevonden.";
		}
	}

	$ctrl.getCases = function(){
		console.log("START getCases");
		var promise = SoapService.getCase(CommonService.getProcessId(), null, CommonService.getLogin());

		promise
		.then( function (response) {
			return SoapService.addVariables("opgave_id", response.data);
		})
		.then( function (result) {
				$ctrl.gegevens = result;
				$ctrl.displayCases(result);
		})
		.catch (function (error){
			$ctrl.result = "Taken ophalen mislukt: " + error;
		});
	}

	/* cases opvragen */
	$ctrl.getCases();

}


}) ();