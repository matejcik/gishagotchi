
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },

    // Run on page load.
    onload() {
        // Initialize the video.
        if (!me.video.init(640, 640, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        // me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    loaded() {
        //me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        //me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("donkey", game.Donkey)
        me.pool.register("donkeyTarget", game.DonkeyTarget)
        me.pool.register("wall", game.Wall),
        me.pool.register("floor", game.Floor),

        // Start the game.
        me.state.change(me.state.PLAY);
    },

    randint: (min, max) => Math.floor(Math.random() * (max - min) + min),

};
