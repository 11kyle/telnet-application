const Pad = require('./lib/pad');
const cmds = require('./lib/commands');
var connection = null;

var app = new Vue({
	el: '#app',
	data: {
		doors: cmds.doorsCmd(),
		commands: cmds.commandsCmds(),
		currency: cmds.currencyCmds(),
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

			if(connection) {
				connection.sendCommand(command);
			}
			else {
				this.output += 'Not Connected\n';
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
