(function () {
"use strict";

angular.module('medewerkerportaal')
.controller('WorkCreateController', WorkCreateController);

WorkCreateController.$inject = ['SoapService', 'CommonService'];
function WorkCreateController(SoapService, CommonService) {
	var $ctrl = this;

	//console.log("work-create.controller.js");
	$ctrl.promise = SoapService.createCase(CommonService.getProcessId()).then( function success (result) {
			$ctrl.gegevens = result.data
			console.log("created case: ", $ctrl.gegevens);
	})
	.catch (function (error){
		$ctrl.result = "Case aanmaken mislukt: " + error;
	});
}


}) ();