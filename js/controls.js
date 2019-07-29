Vue.component("m-controls", {
    template: "#t-controls",
    data: () => ({ times: 0 }),
    methods: {
        increment() {
            this.times ++
        }
    }
})
