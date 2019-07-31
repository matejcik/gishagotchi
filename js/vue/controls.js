const DONKEY_STATES = [
	"Donkey is hungry",
	"Donkey is happy",
	"Donkey is being an ass",
	"Donkey loves you"
]

Vue.component("m-controls", {
	template: "#t-controls",
	data: () => ({ times: 0 }),
	methods: {
		increment() {
			this.times++
		},

		changeDirection() {
			game.donkey.reverseDirection()
		}
	}
})
