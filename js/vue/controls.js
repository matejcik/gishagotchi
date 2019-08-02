const DONKEY_HUNGER = {
	15: {level: 100, msg: "dying of hunger"},
	40: {level: 50, msg: "very hungry"},
	65: {level: 20, msg: "hungry"},
	80: {level: 0, msg: "a bit peckish"},
	101: {level: 1, msg: "well fed"},
	110: {level: 26, msg: "overfed"},
	120: {level: 50, msg: "about to burst"},
	200: {level: 1000, msg: "dead :("}
}

const DONKEY_MOOD = {
	15: {level: 100, msg: "livid"},
	40: {level: 50, msg: "rather cross with you"},
	65: {level: 20, msg: "craving attention"},
	80: {level: 0, msg: "neutral"},
	101: {level: 1, msg: "happy"},
	115: {level: 25, msg: "excited"},
	200: {level: 45, msg: "HYPER!!!1!!!"},
}

function donkeyStatusText(donkey) {
	let states = []

	function from(property, options) {
		for (let value in options) {
			if (property < value) {
				states.push({property, ...options[value]})
				break
			}
		}
	}

	from(donkey.food, DONKEY_HUNGER)
	from(donkey.mood, DONKEY_MOOD)
	states.sort((a, b) => (b.level - a.level) || (b.property - a.property))
	return states[0].msg
}

function between(value, min, max) {
	return value >= min && value <= max
}

const FOOD_MAX = 110

Vue.component("m-controls", {
	template: "#t-controls",
	data: () => ({
		times: 0,
		donkeyMood: "No mood",
		donkey: {
			food: 100,
			mood: 100,
			cocoon: 0,
			action: null,
		}
	}),
	computed: {
		donkeyStatus() {
			return donkeyStatusText(this.donkey)
		},
	},
	methods: {
		increment() {
			this.times++
		},

		changeDirection() {
			game.donkey.reverseDirection()
		},

		update() {
			this.donkey.food--
			this.donkey.mood--

			if (between(this.donkey.food, 80, 100) && between(this.donkey.mood, 80, 115))
				this.donkey.cocoon++

			let a = this.donkey.action
			if (a) {
				a.count--
				if (a.count < 0) this.donkey.action = null
				else a.update()
			}
		},

		feed() {
			if (this.donkey.action) return
			this.donkey.action = {
				name: "eating",
				update: () => this.donkey.food += 5,
				count: 5,
			}
		},

		pet() {
			if (this.donkey.action) return
			this.donkey.action = {
				name: "enjoying your caresses",
				update: () => this.donkey.mood += 3,
				count: 10,
			}
		},
	},

	created() {
		this.$options.updater = setInterval(() => this.update(), 1000)
	},
	beforeDestroy() {
		clearInterval(this.$options.updater)
	}
})

Vue.component("m-status", {
	template: "#t-status",
	props: ["label", "value"],
	computed: {
		style() {
			let s = "font-weight: bold; "
			if (this.value < 50) return s + "color: red"
			if (this.value < 70) return s + "color: orange"
			if (this.value <= 100) return s + "color: green"
			return s + "color: red"
		}
	}
})
