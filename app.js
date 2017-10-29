const pad = require('./lib/pad');

var app = new Vue({
	el: '#app',
	data: {
		doors: [
			{name: 'All', syntax: 'all', isOpen: true},
			{name: 'Main', syntax: 'm', isOpen: true},
			{name: 'Cage', syntax: 'c', isOpen: true},
			{name: 'Front', syntax: 'f', isOpen: true},
			{name: 'Top', syntax: 't', isOpen: true},
			{name: 'Drop', syntax: 'd', isOpen: true},
			{name: 'Bill', syntax: 'b', isOpen: true},
			{name: 'Processor', syntax: 'x', isOpen: true},
			{name: 'Spare', syntax: 's', isOpen: true}
		],
		commands: [
			{name: 'Spin', syntax: 'spin'},
			{name: 'Repeat Bet', syntax: 'spin'},
			{name: 'Max Bet', syntax: 'max bet'},
			{name: 'Attendant', syntax: 'jkpt res pressed\njkpt res released'},	// beta test this!
			{name: 'W2G', syntax: 'w2g pressed\nw2g released'},	// beta test this!
			{name: 'Cashout', syntax: 'cashout'},
			{name: 'Service', syntax: 'change'},
			{name: 'Toggle RNG', syntax: 'tog rng'}
		],
		currency: [
			{name: '1'},
			{name: '2'},
			{name: '5'},
			{name: '10'},
			{name: '20'},
			{name: '50'},
			{name: '100'}
		],
		input: '',
		output: ''
	},
	methods: {
		sendCommand: function(value) {
			// Handle door buttons
			for (var i = 0; i < this.doors.length; i++) {
				if (value.name.toLowerCase() === this.doors[i].name.toLowerCase()) {	// all | main | cage | etc..

					if (value.isOpen === true) {
						console.log(this.doors[i].syntax + ' cl');
						this.output = this.output + this.doors[i].syntax + ' cl\n';
					} else {
						console.log(this.doors[i].syntax + ' op');
						this.output = this.output + this.doors[i].syntax + ' op\n';
					}
					break;
				}
			}
			// Handle command buttons
			for (var i = 0; i < this.commands.length; i++) {
				if (value.name.toLowerCase() === this.commands[i].name.toLowerCase()) {		// spin | repeat bet | max bet | etc..
					console.log(this.commands[i].syntax);
					this.output = this.output + this.commands[i].syntax + '\n';
					break;
				}
			}
			// Handle currency buttons
			for (var i = 0; i < this.currency.length; i++) {
				if (value.name.toLowerCase() === this.currency[i].name.toLowerCase()) {		// spin | repeat bet | max bet | etc..
					console.log('bill in\n' + this.currency[i].name);
					this.output = this.output + 'bill in\n' + this.currency[i].name + '\n';
					break;
				}
			}

			// Keep textarea scrolled to the bottom
			var otpt = document.getElementById('output');
			otpt.scrollTop = otpt.scrollHeight
		},
		clearOutput: function() {
			// Handle output clear button
			this.output = '';
		},
		clearInput: function() {
			// Handle input clear button
			this.input = '';
		},
		connectTelnet: function() {
			//connect to EGM
			var ip = document.getElementById('ipAddress').value;
			var prt = document.getElementById('port').value;

			//not sure if this is working
			if(pad.connect({host: ip, port: prt})) {
				//set label to connected
				this.output += 'connected';
			}
			else {
				//set label to disconnected
				this.output += 'failed to connect';
			}
		}
	}
})
