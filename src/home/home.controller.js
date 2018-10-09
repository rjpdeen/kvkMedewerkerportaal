(function () {
"use strict";

angular.module('medewerkerportaal')
.controller('HomeController', HomeController);

HomeController.$inject = ['CommonService'];
function HomeController(CommonService) {
	var $ctrl = this;

	$ctrl.login = null;
	$ctrl.processId = null;

	$ctrl.saveAll = function(){
		CommonService.saveLogin($ctrl.login);
		CommonService.saveProcessId($ctrl.processId);
	}

	$ctrl.saveLogin = function (){
		CommonService.saveLogin($ctrl.login);
	}

	$ctrl.saveProcessId = function (){
		CommonService.saveProcessId($ctrl.processId);
	}
}


}) ();