document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');

        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: [ 'interaction', 'dayGrid' ],
          defaultDate: '2023-02-12',
          editable: true,
          eventLimit: true, // allow "more" link when too many events
          // events: [
          //   {
          //     title: '',
          //     start: '2023-02-01'
          //   },
          //   {
          //     title: '',
          //     start: '2023-02-07',
          //     //end: '2023-02-10'
          //   },
          //   {
          //     groupId: 999,
          //     title: '',
          //     start: '2023-02-09T16:00:00'
          //   },
          //   {
          //     groupId: 999,
          //     title: '',
          //     start: '2023-02-16T16:00:00'
          //   },
          //   {
          //     title: '',
          //     start: '2023-02-11',
          //     //end: '2023-02-13'
          //   },
          //   {
          //     title: 'Meeting',
          //     start: '2023-02-12T10:30:00',
          //     end: '2023-02-12T12:30:00'
          //   },
          //   {
          //     title: 'Lunch',
          //     start: '2023-02-12T12:00:00'
          //   },
          //   {
          //     title: 'Meeting',
          //     start: '2023-02-12T14:30:00'
          //   },
          //   {
          //     title: 'Happy Hour',
          //     start: '2023-02-12T17:30:00'
          //   },
          //   {
          //     //title: 'Dinner',
          //     start: '2023-02-12T20:00:00'
          //   },
          //   {
          //     //title: 'Birthday Party',
          //     start: '2023-02-13T07:00:00'
          //   },
          //   {
          //     //title: 'Click for Google',
          //     url: 'http://google.com/',
          //     start: '2023-02-28'
          //   }
          // ]
        });

        calendar.render();
});
	  


	if ('WebSocket' in window) {
		(function () {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function (msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}
