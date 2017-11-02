const Pad = require('./lib/pad');
const cmds = require('./lib/commands');
var connection = null;

var app = new Vue({
	el: '#app',
	data: {
		commands: cmds.commands(),
		isConnected: 'Disconnected',
		input: '',
		output: ''
	},
	methods: {
		sendCommand: function(value) {

			var command = '';

			for (var i = 0; i < this.commands.length; i++) {
				if (value.name.toLowerCase() === this.commands[i].name.toLowerCase()) {
					switch (value.type) {
						// Handle doors
						case 'door':
								if (value.isOpen === true) {
									command = this.commands[i].syntax + ' cl';
								} else {
									command = this.commands[i].syntax + ' op';
								}
								break;
							break;
						// Handle commands
						case 'command':
								command = this.commands[i].syntax;
								break;
							break;
						// Handle currency
						case 'currency':
								command = 'bill in\n' + this.commands[i].syntax;
								break;
							break;
						// Default
						default:
							console.log('Do nothing');
							break;
					}
					console.log(command);
					this.output = this.output + command + '\n';
				}
			}

			if(connection) {
				console.log(command);
				connection.sendCommand(command);
			}
			else {
				this.output += 'Disconnected\n';
			}

			if(connection) {
				connection.sendCommand(command);
			}
			else {
				this.output += 'Not Connected\n';
			}

			// Keep textarea scrolled to the bottom
			var otpt = document.getElementById('output');
			otpt.scrollTop = otpt.scrollHeight;
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
				//modify label to be connected
				self.isConnected = 'Connected';
				self.output += 'Connected\n';
			});

			connection.on('close', function() {
				self.output += 'Connection closed\n';
				//modify label to be disconnected
				self.isConnected = 'Connected';
			});

			connection.on('error', function() {
				self.output += 'Error occurred\n';
			});

			connection.on('data', function(data) {
				self.output += data.toString('utf-8') + '\n';

				// Keep textarea scrolled to the bottom
				var otpt = document.getElementById('output');
				otpt.scrollTop = otpt.scrollHeight;
			});

			connection.connect({ip, port});
		}
	}
})
