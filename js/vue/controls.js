const DONKEY_STATES = [
	"Donkey is hungry",
	"Donkey is happy",
	"Donkey is being an ass",
	"Donkey loves you"
]

Vue.component("m-controls", {
	template: "#t-controls",
	data: () => ({
		times: 0,
		donkeyMood: "No mood"
	}),
	methods: {
		increment() {
			this.times++
		},

		changeDirection() {
			game.donkey.reverseDirection()
		},

		update() {
			let i = game.randint(0, DONKEY_STATES.length)
			this.donkeyMood = DONKEY_STATES[i]
		}
	},

	created() {
		this.$options.updater = setInterval(() => this.update(), 1000);
	},
	beforeDestroy() {
		clearInterval(this.$options.updater)
	},
})
