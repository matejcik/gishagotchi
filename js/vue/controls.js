Vue.component("m-controls", {
    template: "#t-controls",
    data: function() { return { times: 0 } },
    methods: {
        increment: function() {
            this.times ++
        }
    }
})
