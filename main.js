jQuery(function($) {
	var DB = new IndexedDB('bill-tracker', 'transactions');
	var TRANS = $('#transactions .transaction.hide');
	var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var ordinal = function(num) {
		var n = String(num).substr(-1);
		if (n === '1') return 'st';
		if (n === '2') return 'nd';
		if (n === '3') return 'rd';
		return 'th';
	};
	
	var initialize = function() {
		var date = new Date();
		$('.head .month').text(months[date.getMonth()]);
		DB.open(2, function() {
			DB.getAll(rebuild);
		});
	};
	
	var rebuild = function(transactions) {
		var exploded = [];
		for (var i=0; i<transactions.length; i++) {
			var T = transactions[i];
			/*for (var j=0; j<T.occurences.length; j++) {
				var t = T.occurences[j];
				exploded.push({
					id: T.id,
					date: t.date,
					name: T.name,
					amount: T.amount,
					complete: t.complete
				});
			}*/
		}
		for (var i=0; i<transactions.length; i++) {
			var T = TRANS.clone(true, true).removeClass('hide');
			var t = transactions[i];
			var d = new Date(t.date).getDate();
			var a = t.amount || 0;
			T.data('trans', t);
			T.find('.date').text(d);
			T.find('.ordinal').text(ordinal(d));
			T.find('.name .link').text(t.name).attr('href', t.link);
			T.find('.amount .dollar').text(Number(a).toFixed(2));
			T.find('.month input').prop('checked', !!t.paid);
			$('#transactions').append(T);
		}
		recalculate();
	};
	
	var recalculate = function() {
		var total = 0;
		$('.transaction:not(.hide)').each(function() {
			var self = $(this);
			var dollar = self.find('.amount .dollar');
			var amount = parseFloat(dollar.text());
			if (amount < 0) {
				dollar.addClass('red');
			} else {
				dollar.removeClass('red');
			}
			
			total += amount;
			
			self.find('.total .dollar').text(total.toFixed(2));
		});
	};
	
	/* Open the Editor Modal when a row is clicked */
	$('tr.transaction td').on('click', function() {
		var data = $(this).parents('tr.transaction').data('trans');
		$('#transaction-id').val(data.id);
		$('#transaction-name').val(data.name);
		$('#transaction-link').val(data.link);
		$('#transaction-date').val(data.date);
		$('#transaction-skip').val(data.skip);
		$('#transaction-period').val(data.period);
		$('#transaction-amount').val(data.amount);
		$('#transaction-modal-toggle').trigger('click');
	});
	
	/* Save the current transaction */
	$('#transaction-save').on('click', function(e) {
		var $id = $('#transaction-id');
		var $name = $('#transaction-name');
		var $link = $('#transaction-link');
		var $date = $('#transaction-date');
		var $skip = $('#transaction-skip');
		var $period = $('#transaction-period');
		var $amount = $('#transaction-amount');
		var trans = {
			name: $name.val(),
			link: $link.val(),
			date: $date.val(),
			skip: $skip.val(),
			period: $period.val(),
			amount: $amount.val()
		};
		if ($id.val() !== '') {
			trans.id = Number($id.val());
		}
		DB.insert(trans, function(item) {
			console.log('got back:', item);
			$name.val('');
			$link.val('');
			$date.val('');
			$skip.val('');
			$period.val('');
			$amount.val('');
		});
	});
	
	/* Delete the current transaction */
	$('#transaction-delete').on('click', function(e) {
		if(confirm('Are you sure you want to delete this transaction?\nAll events in this series will be deleted.')) {
			var id = Number($('#transaction-id').val());
			if (id) {
				DB.delete(id, function(e) { console.log(e); });
			}
		}
	});
	
	/* Prevent the link from opening the editor modal */
	$('.name a').on('click', function(e) { e.stopPropagation(); });
	
	/* Update the paid status when a checkbox is changed */
	$('.month input').on('change', function(e) {
		e.stopPropagation();
	});
	
	initialize();
});
