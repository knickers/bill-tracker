jQuery(function($) {
	console.log('Loaded');
	
	var months = [
		'Jan',
		'Feb',
		'March',
		'April',
		'May',
		'June',
		'July',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	
	var initialize = function() {
		var date = new Date();
		$('.head .month').text(months[date.getMonth()]);
	}
	
	var recalculate = function() {
		var total = 0;
		$('.transaction').each(function() {
			var self = $(this);
			var dollar = self.find('.amount .dollar');
			var amount = parseInt(dollar.text(), 10);
			if (amount < 0) {
				dollar.addClass('red');
			} else {
				dollar.removeClass('red');
			}
			
			amount += total;
			total = amount;
			
			self.find('.total .dollar').text(amount.toFixed(2));
		});
	};
	
	$('.month input').on('change', function() {
		var args = {
			'submit': true,
			'month': 0
		};
		/*
		$.post('/update.php', args, function(data) {
			
		});
		*/
	});
	
	initialize();
	recalculate();
});
