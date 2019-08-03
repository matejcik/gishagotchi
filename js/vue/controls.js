const DONKEY_HUNGER = {
	0: { level: 1000, msg: "DEAD" },
	15: { level: 100, msg: "dying of hunger" },
	40: { level: 50, msg: "very hungry" },
	65: { level: 20, msg: "hungry" },
	80: { level: 0, msg: "a bit peckish" },
	101: { level: 1, msg: "well fed" },
	110: { level: 26, msg: "overfed" },
	120: { level: 50, msg: "about to burst" },
	200: { level: 1000, msg: "sick :(" }
}

const DONKEY_MOOD = {
	0: { level: 1000, msg: "DEAD" },
	15: { level: 100, msg: "livid" },
	40: { level: 50, msg: "rather cross with you" },
	65: { level: 20, msg: "craving attention" },
	80: { level: 0, msg: "neutral" },
	101: { level: 1, msg: "happy" },
	115: { level: 25, msg: "excited" },
	200: { level: 45, msg: "HYPER!!!1!!!" }
}

function donkeyStatusText(donkey) {
	let states = []

	function from(property, options) {
		for (let value in options) {
			if (property < value) {
				states.push({ property, ...options[value] })
				break
			}
		}
	}

	from(donkey.food, DONKEY_HUNGER)
	from(donkey.mood, DONKEY_MOOD)
	states.sort((a, b) => b.level - a.level || b.property - a.property)
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
			dead: false
		},
		win: false
	}),
	computed: {
		donkeyStatus() {
			return donkeyStatusText(this.donkey)
		}
	},
	methods: {
		increment() {
			this.times++
		},

		changeDirection() {
			game.donkey.reverseDirection()
		},

		update() {
			if (this.win || this.donkey.dead) return

			this.donkey.food--
			this.donkey.mood--

			if (
				between(this.donkey.food, 80, 100) &&
				between(this.donkey.mood, 80, 115)
			)
				this.donkey.cocoon += 4

			let a = this.donkey.action
			if (a) {
				a.count--
				if (a.count < 0) this.donkey.action = null
				else a.update()
			}

			if (this.donkey.food < 0 || this.donkey.mood < 0) {
				game.donkey.die()
				this.donkey.dead = true
			} else if (this.donkey.cocoon >= 100) {
				this.win = true
				game.donkey.flyAway()
			}
		},

		restart() {
			this.win = false
			this.donkey.food = game.randint(40, 110)
			this.donkey.mood = game.randint(40, 110)
			this.donkey.cocoon = 0
			this.donkey.action = null
			this.donkey.dead = false
			game.donkey.restart()
		},

		feed() {
			if (this.donkey.action) return
			this.donkey.action = {
				name: "eating",
				update: () => (this.donkey.food += 7),
				count: 4
			}
		},

		pet() {
			if (this.donkey.action) return
			this.donkey.action = {
				name: "enjoying your caresses",
				update: () => (this.donkey.mood += 4),
				count: 7
			}
		}
	},

	created() {
		this.$options.updater = setInterval(() => this.update(), 1000)
		this.restart()
	},
	beforeDestroy() {
		clearInterval(this.$options.updater)
	}
})

Vue.component("m-status", {
	template: "#t-status",
	props: {
		label: String,
		value: Number,
		max: {
			type: Number,
			default: 100,
		}
	},
	computed: {
		style() {
			let s = "font-weight: bold; "
			if (this.value < 50) return s + "color: red"
			if (this.value < 80) return s + "color: orange"
			if (this.value <= 100) return s + "color: green"
			return s + "color: red"
		}
	}
})
