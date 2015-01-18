jQuery(function($) {
	var DB = new IndexedDB('bill-tracker', 'transactions');
	var DATE = new Date();
	var TRANS = $('#transactions .transaction.hide');
	var MONTHS = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var initialize = function() {
		console.log('initializing');
		$('thead .paid').text(MONTHS[DATE.getMonth()]);
		$('#loading').removeClass('hide');
		DB.open(2, function() {
			console.log('opened database');
			DB.getAll(rebuild);
		});
	};
	
	var rebuild = function(transactions) {
		//console.log('rebuilding', DATE.getMonth()+1, DATE.getFullYear());
		$('.transaction:not(.hide)').remove();
		var occurrences = [];
		for (var i=0; i<transactions.length; i++) {
			var T = transactions[i];
			//console.log('transaction', T);
			var d = new Date(DATE);
			if (T.day != '') {
				var count = Number(T.date) || 1;
				for (var j=1; j<32; j++) {
					d.setDate(j);
					if (d.getDay() == T.day && !--count) {
						break;
					}
				}
			} else {
				d.setDate(T.date);
			}
			
			for (var j=0; j<32; j++) {
				//console.log('  occurence', d);
				occurrences.push($.extend(clone(T), {
					due: d.getTime(),
					date: d.getDate()
				}));
				
				// Go to the next occurence
				if (T.period === 'day') {
					d.setDate(d.getDate() + T.skip);
				} else if (T.period === 'week') {
					d.setDate(d.getDate() + T.skip*7);
				} else if (T.period === 'month') {
					d.setMonth(d.getMonth() + T.skip);
				} else if (T.period === 'year') {
					d.setFullYear(d.getFullYear() + T.skip);
				}
				
				if (d.getMonth() > DATE.getMonth()) {
					break;
				}
			}
		}
		occurrences.sort(function(a, b) {
			return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0);
		});
		for (var i=0; i<occurrences.length; i++) {
			var T = TRANS.clone(true, true).removeClass('hide');
			updateTransactionRow(T, occurrences[i]);
			$('#transactions').append(T);
		}
		recalculate();
		$('#loading').addClass('hide');
	};
	
	/* Open the Editor Modal when a row is clicked */
	$('tr.transaction td').on('click', function() {
		setModalData($(this).parents('tr.transaction').data('trans'));
		$('#transaction-modal-toggle').trigger('click');
	});
	
	/* Save the current transaction */
	$('#transaction-save').on('click', function(e) {
		var trans = getModalData();
		var isNew = trans.id === '';
		trans.id = isNew ? undefined : Number(trans.id);
		$('#loading').removeClass('hide');
		DB.insert(trans, function(item) {
			//console.log('got back:', item);
			DB.getAll(rebuild);
			clearModalData();
		});
	});
	
	/* Cancel the current editing */
	$('#transaction-cancel').on('click', function(e) {
		clearModalData();
	});
	
	/* Delete the current transaction */
	$('#transaction-delete').on('click', function(e) {
		if(confirm('Are you sure you want to delete this transaction?\nAll events in this series will be deleted.')) {
			var id = Number($('#transaction-id').val());
			if (id) {
				$('#loading').removeClass('hide');
				DB.delete(id, function(e) {
					//console.log('deleted ', e);
					DB.getAll(rebuild);
					clearModalData();
				});
			}
		}
	});
	
	/* Prevent the link from opening the editor modal */
	$('.name a').on('click', function(e) { e.stopPropagation(); });
	
	/* Update the paid status when a checkbox is changed */
	$('.paid input').on('change', function(e) {
		e.stopPropagation();
	});
	
	initialize();
});
