const socket = io("https://node-dte.herokuapp.com");
angular.module("userManagementApp", []).controller("dashboardController", [
  "$http",
  function($http) {
    let dte = this;
    dte.showText = "Add";
    function getTimes() {
      $http({
        method: "GET",
        url: "/getTime"
      }).then(
        response => {
          dte.times = response.data.times;
          if(dte.times.length > 0) {
            dte.updateTime(dte.times[dte.times.length - 1]);
          } else {
            dte.addTime();
          }
        },
        err => {
          console.log("err: ", err);
        }
      );
    }
    getTimes();
    function createDateArray(date) {
      let today = new Date();
      let days = ["Sun,","Mon,","Tue,","Wed,","Thu,","Fri,","Sat,"].reverse();
      let times = [];

      for(let i=6;i>=0;i--){
        let clonedDate = new Date(date.getTime());
        let activeDate = new Date(clonedDate.setDate(clonedDate.getDate()-i)).getDate();
        times.push([days[i],activeDate].join(' '));
      }


      return times
    }

    this.addTime = function() {
      var today = new Date();
      var day = today.getDay();
      var date = today.getDate();
      today.setDate(date + 6 - day);
      let weekEnd = today.toDateString();
      dte.timeSlots = createDateArray(weekEnd);
      dte.newTime = {
        week: weekEnd,
        chargeCodes: []
      };
      this.addChargeCode();
    };

    this.updateTime = function(time) {
      var currentDate = new Date(time.week);
      var day = currentDate.getDay();
      var date = currentDate.getDate();
      dte.timeSlots = createDateArray(currentDate);
      dte.newTime = time;
    };

    this.addChargeCode = function() {
      var code = {
        code: "",
        hours: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ]
      };
      dte.newTime.chargeCodes.push(code);
    };
    // this.addTime();
    // this.addChargeCode();

    this.updateTimeSheet = function() {
      $http({
        method: "PATCH",
        url: "/updateTime",
        data: dte.newTime
      }).then(
        response => {
          dte.newTime = response.data;
        },
        err => {
          console.log("err: ", err);
        }
      );
    };

    this.saveTime = function() {
      if (dte.newTime._id) {
        dte.updateTimeSheet();
      } else {
        $http({
          method: "POST",
          url: "/addTime",
          data: dte.newTime
        }).then(
          response => {
            console.log(response);
            dte.newTime = response.data;
          },
          err => {
            console.log("err: ", err);
          }
        );
      }
    };
    /**
     * Fetch every time when db-update event is recieved from server
     */
    socket.on("db-update", getTimes);
  }
]);
