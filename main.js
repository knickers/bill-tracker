jQuery(function($) {
	var DB = new IndexedDB('bill-tracker', 'transactions');
	var TRANS = $('#transactions .transaction.hide');
	var MONTHS = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var initialize = function() {
		var date = new Date();
		$('thead .month').text(MONTHS[date.getMonth()]);
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
			updateTransactionRow(T, transactions[i]);
			$('#transactions').append(T);
		}
		recalculate();
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
		DB.insert(trans, function(item) {
			console.log('got back:', item);
			if (isNew) {
				var t = TRANS.clone(true, true).removeClass('hide');
				updateTransactionRow(t, trans);
				$('#transactions tbody').append(t);
			} else {
				updateTransactionRow($('#transaction-' + trans.id), trans);
			}
			recalculate();
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
				DB.delete(id, function(e) { console.log(e); });
				$('#transaction-' + id).remove();
				clearModalData();
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
