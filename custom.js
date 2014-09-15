 $(function() 
	{

		

        function crossDomainAjax (url, successCallback) {
	    if (true) {
            // IE8 & 9 only Cross domain JSON GET request
/*            if ('XDomainRequest' in window && window.XDomainRequest !== null) {

            var xdr = new XDomainRequest(); // Use Microsoft XDR

            xdr.open('post', url);
            xdr.onload = function () {

               var dom  = new ActiveXObject('Microsoft.XMLDOM'),
                   JSON = $.parseJSON(xdr.responseText);
                   dom.async = false;

                   if (JSON == null || typeof (JSON) == 'undefined') {
                     JSON = $.parseJSON(data.firstChild.textContent);
                   }
                  successCallback(xdr.responseText); // internal function
               };

               xdr.onerror = function() {
                  _result = false;
               };
               xdr.send();
           }

           // IE7 and lower can't do cross domain
          else if (navigator.userAgent.indexOf('MSIE') != -1 &&
               parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1], 10) < 8)
          {
               return false;
          }

          // Do normal jQuery AJAX for everything else
         else { */
            $.ajax({
                url: url,
                cache: false,
                type: 'GET',
		data: {
			u: "https://docs.google.com/spreadsheet/pub?key=0AgVVZWe9NC8wdE9QY3Q5UEVIUndBNjZPVXQxeEJtbVE&output=csv"
//			u: "https://docs.google.com/spreadsheet/pub?key=0AgVVZWe9NC8wdGxBVWp0M20zTW9WbmJ0a0pyc3RMYlE&output=csv"
		},
//                async: false, // must be set to false
                success: function (data, success) {
                    successCallback(data);
                }
            });
         }
       }

	var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var csv_object;
	crossDomainAjax("../csv-grab.php", 
		function (data)
		{	
			
			var $csv = $.csv.toObjects(data);
			csv_object = $csv;
			csv_temp = {};
			
			var latest_date = 0;
			$($csv).each(function(i, item) {
				
				var id;
				/* Establish IDs */
				for( x in item ) 
				{
					if (x == "id")
					{
						id = item[x];
						csv_temp[id] = {};
						csv_temp[id]["raw"] = item;
					}
					
					break;
				}
				
				for ( y in csv_temp[id]["raw"] )
				{
					if ( y == "id" )
					{
						continue;
					}
					if (y == "type" || y == "title" || y == "labels")
					{
						csv_temp[id][y] = csv_temp[id]["raw"][y];
					}
					else //date
					{
						if (! csv_temp[id]["date"] )
						{
							csv_temp[id]["date"] = {};
						}
						csv_temp[id]["date"][Date.parse(y)] = csv_temp[id]["raw"][y];

						if ( Date.parse(y) > latest_date )
						{
							latest_date = Date.parse(y);
						}
					}
				}
			});
			
			csv_object = csv_temp;

			
			var internally_displaced_data = [];
			for (x in csv_temp['yemen-data-002']['date'])
			{
				if (csv_temp['yemen-data-002']['date'][x])
				{
					internally_displaced_data.push([parseInt(x), parseInt(csv_temp['yemen-data-002']['date'][x])]);
				}
			}

			$("#internally-displaced").OCHAGraphBuilder({
				type: "big", 
				title: "Hello World", 
				subtitle: csv_temp['yemen-data-002']['title'],
				data_main : internally_displaced_data,
				data_main_label: "Funding",
				labels: csv_temp['yemen-data-002']['labels']
			});

			/*
			var idp_numeral = numeral(internally_displaced_data[internally_displaced_data.length - 1][1]).format('0.0a');
			$("#internally-displaced .title-area h1").text(idp_numeral.toUpperCase());
			$("#internally-displaced .title-area h3").html(csv_temp['intern-disp-0']['title'].replace(/\\r\\n/i,"<br />"));
			build_chart('#internally-displaced .highchard-item', internally_displaced_data, "Internally Displaced"); */
			
			/* BUILD  DATA FOR THE PEOPLE REACHED */
			var people_reached_data = [];
			for (x in csv_temp['yemen-data-003']['date'])
			{
				if (csv_temp['yemen-data-003']['date'][x])
				{
					people_reached_data.push([parseInt(x), parseInt(csv_temp['yemen-data-003']['date'][x])]);
				}
			}

/*
			var pr_numeral = numeral(people_reached_data[people_reached_data.length - 1][1]).format('0.0a');
			$("#people-reached .title-area h1").text(pr_numeral.toUpperCase());
			$("#people-reached .title-area h3").html(csv_temp['reached-0']['title'].replace(/\\r\\n/i,"<br />"));

			build_chart('#people-reached .highchard-item', people_reached_data, "Refugees");
*/
			var in_need = [];
			for (x in csv_temp['yemen-data-001']['date'])
			{
				if (csv_temp['yemen-data-001']['date'][x])
				{
					in_need.push([x, csv_temp['yemen-data-001']['date'][x]]);
				}
			}

			$("#people-in-need").OCHAGraphBuilder({
				type: "pie", 
				title: "Funding", 
				subtitle: "Needed funding",
				data_main : in_need,
				data_main_label: "Funding",
				data_secondary: in_need,
				data_secondary_label: "Builder",
				labels: csv_temp['yemen-data-001']['labels']
			});

			var current = new Date(latest_date);
			var mon_str = MONTHS[current.getMonth()] + " " + current.getFullYear();

			$("#latest-month-area").text(mon_str);

		}
	);
	

  });