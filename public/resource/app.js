angular.module('userManagementApp', [])
  .controller('dashboardController', ['$http', function($http) {
    let dte = this;
    dte.isNewTimeSheet = false;
    function getTimes () {
        $http({
            method: 'GET',
            url: '/getTime'
        }).then((response) => {
            dte.times = response.data.times;
        }, (err) => {
            console.log('err: ', err);
        });
    }
    getTimes();
    function createDateArray(day, date) {
        return [
            'Sun, ' + (date + 6 - day),
            'Mon, ' + (date + 6 - day),
            'Tue, ' + (date + 6 - day),
            'Wed, ' + (date + 6 - day),
            'Thu, ' + (date + 6 - day),
            'Fri, ' + (date + 6 - day),
            'Sat, ' + (date + 6 - day)
        ];
    }

    this.addTime = function(){
        dte.isNewTimeSheet = true;
        var today = new Date();
        var day = today.getDay();
        var date = today.getDate();
        dte.timeSlots = createDateArray(day, date);
        today.setDate(date + 6 - day)
        let weekEnd = today.toDateString();
        dte.newTime = {
            week: weekEnd,
            chargeCodes: []
        }
    }

    this.updateTime = function(time) {
        dte.isNewTimeSheet = true;
        var currentDate = new Date(time.week);
        var day = currentDate.getDay();
        var date = currentDate.getDate();
        dte.timeSlots = createDateArray(day, date);
        dte.newTime = time;
    }

    this.addChargeCode = function() {
        var code = {
            code: '',
            hours: [
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0},
                {value: 0}
            ]
        };
        dte.newTime.chargeCodes.push(code);
    }

    this.updateTimeSheet = function() {
        $http({
            method: 'PATCH',
            url: '/updateTime',
            data: dte.newTime
        }).then((response) => {
            dte.newTime = response.data;
            dte.isNewTimeSheet = false;
        }, (err) => {
            console.log('err: ', err);
        });
    }

    this.saveTime = function() {
        if(dte.newTime._id) {
            dte.updateTimeSheet();
        } else {
            $http({
                method: 'POST',
                url: '/addTime',
                data: dte.newTime
            }).then((response) => {
                console.log(response);
                dte.isNewTimeSheet = false;
                dte.newTime = response.data;
            }, (err) => {
                console.log('err: ', err);
            });
        }
    }
  }]);