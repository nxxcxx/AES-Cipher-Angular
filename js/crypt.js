'use strict';

angular
	.module('CRYPTO-APP', [])
	.controller('mainCtrl', ['$scope', 'cryptoService', function ($scope, cryptoService) {

		var cs = $scope.cs = cryptoService;
		$scope.input = {};
		$scope.input.data = '';
		$scope.message = {};
		$scope.message.status = '';

		$scope.clearInput = function () {
			$scope.input.decryptKey = '';
			$scope.input.encryptKey = '';
			$scope.input.encryptKeyRepeat = '';
		};

		$scope.$on('clearInput', function () {
			$scope.clearInput();
		});

		$scope.decrypt = function () {
			if ($scope.input.data && $scope.input.decryptKey) {
				var decrypted = cs.decrypt($scope.input.data, $scope.input.decryptKey);
				if (decrypted) {
					$scope.input.data = decrypted;
					$scope.message.status = '';
				} else {
					$scope.message.status = 'Invalid key.';
				}
			}
		};

	}])
	.factory('cryptoService', [function () {
		return {
			encrypt: function (data, key) {
				return CryptoJS.AES.encrypt(data, key).toString();
			},
			decrypt: function (data, key) {
				try {
					return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
				} catch(e) {
					return 0;
				}
			}
		};

	}])
	.directive('openFile', [function () {

		function link(scope, element, attrs) {
			element.on('click', function () {
				var uploadBtn = document.getElementById("uploadBtn");
				var e = document.createEvent("MouseEvents");
				e.initMouseEvent('click', !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
				uploadBtn.dispatchEvent(e);
			});
		}

		return {
			restrict: 'A',
			scope: {},
			link: link
		};
		
	}])
	.directive('fileread', [function () {

		function link(scope, element, attrs) {
			element.bind('change', function (changeEvent) {
				document.getElementById("fileLabel").value = this.value.replace("C:\\fakepath\\", "");
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.$emit('clearInput');
						scope.fileread = loadEvent.target.result;
					});
				};
				reader.readAsText(changeEvent.target.files[0]);
			});
		}

		return {
			restrict: 'A',
			scope: {fileread: "="},
			link: link
		};
		
	}])
	.directive('encryptBtn', ['cryptoService', function (cs) {

		function link(scope, element, attrs) {
			scope.encrypt = function () {
				if (scope.input.data && scope.input.encryptKey && scope.input.encryptKeyRepeat) {
					if (scope.input.encryptKey !== scope.input.encryptKeyRepeat) {
						scope.message.status = 'Key is not the same!';
						element.attr('href', '');
					} else {

						var encrypted = cs.encrypt(scope.input.data, scope.input.encryptKey);
						var blob = new Blob([encrypted], {type: "text/plain"});
						var url = URL.createObjectURL(blob);

						element.attr('download', 'encrypted.txt');
						element.attr('href', url);

						// var a = document.createElement('a');
						// var e = document.createEvent("MouseEvents");
						// e.initMouseEvent('click', !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
						// a.setAttribute('href', url);
						// a.setAttribute('download', 'encrypted.txt');
						// a.dispatchEvent(e);

					}
				}
			};
		}

		return {
			restrict: 'E',
			replace: true,
			scope: true,
			link: link,
			template: '<a class="btn btn-danger btn-sm" ng-click="encrypt()" download><span class="icon-lock"><!--lock icon--></span></a>'
		};

	}]);