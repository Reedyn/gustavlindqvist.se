module.exports = {
	minutesToHoursAndMinutes: function (minutes) {
		let hours = Math.floor(minutes / 60);
		let remainingMinutes = minutes % 60;

		let hoursString = "";
		let minutesString = "";
		let separator = "";

		if (remainingMinutes >= 45) {
			remainingMinutes = 0;
			hours += 1;
		}

		if (hours !== 0) {
			if (hours > 1) {
				hoursString = hours + " timmar ";
			} else {
				hoursString = hours + " timme ";
			}
		}

		if (hours !== 0 && remainingMinutes > 15) {
			separator = " ";
		}

		if (remainingMinutes > 15 || hours === 0) {
			minutesString = remainingMinutes + " minuter";
		}

		return hoursString + separator + minutesString;
	},
};
