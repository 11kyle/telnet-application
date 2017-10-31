const Pad = require('./lib/pad');
var connection = null;

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
			{name: 'Attendant', syntax: 'jkpt res pressed\njkpt res released'},
			{name: 'W2G', syntax: 'w2g pressed\nw2g released'},
			{name: 'Cashout', syntax: 'cashout'},
			{name: 'Service', syntax: 'change'},
			{name: 'Toggle RNG', syntax: 'tog rng'}
		],
		currency: [
			{name: '1', syntax: '100'},
			{name: '2', syntax: '200'},
			{name: '5', syntax: '500'},
			{name: '10', syntax: '1000'},
			{name: '20', syntax: '2000'},
			{name: '50', syntax: '5000'},
			{name: '100', syntax: '10000'}
		],
		input: '',
		output: ''
	},
	methods: {
		sendCommand: function(value) {
			// Handle door buttons
			var command = '';

			for (var i = 0; i < this.doors.length; i++) {
				if (value.name.toLowerCase() === this.doors[i].name.toLowerCase()) {	// all | main | cage | etc..

					if (value.isOpen === true) {
						console.log(this.doors[i].syntax + ' cl');
						this.output = this.output + this.doors[i].syntax + ' cl\n';
						command = this.doors[i].syntax + ' cl';
					} else {
						console.log(this.doors[i].syntax + ' op');
						this.output = this.output + this.doors[i].syntax + ' op\n';
						command = this.doors[i].syntax + ' op';
					}
					break;
				}
			}
			// Handle command buttons
			for (var i = 0; i < this.commands.length; i++) {
				if (value.name.toLowerCase() === this.commands[i].name.toLowerCase()) {		// spin | repeat bet | max bet | etc..
					console.log(this.commands[i].syntax);
					this.output = this.output + this.commands[i].syntax + '\n';
					command = this.commands[i].syntax;
					break;
				}
			}
			// Handle currency buttons
			for (var i = 0; i < this.currency.length; i++) {
				if (value.name.toLowerCase() === this.currency[i].name.toLowerCase()) {		// spin | repeat bet | max bet | etc..
					console.log('bill in\n' + this.currency[i].syntax);
					this.output = this.output + 'bill in\n' + this.currency[i].syntax + '\n';
					command = 'bill in\n' + this.currency[i].syntax;
					break;
				}
			}

			connection.sendCommand(command);

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
			var port = document.getElementById('port').value;

			connection = new Pad();
			var self = this;

			connection.on('connect', function() {
				self.output += 'Connected\n';
				//modify label to be connected
			});

			connection.on('close', function() {
				self.output += 'Connection closed\n';
				//modify label to be disconnected
			});

			connection.on('error', function() {
				self.output += 'Error occurred\n';
			});

			connection.on('data', function(data) {
				self.output += data.toString('utf-8') + '\n';

				// Keep textarea scrolled to the bottom
				var otpt = document.getElementById('output');
				otpt.scrollTop = otpt.scrollHeight
			});

			connection.connect({ip, port});
		}
	}
})
