game.DonkeyTarget = me.Entity.extend({
	init(x, y) {
		this._super(me.Entity, "init", [x, y, { height: 5, width: 5 }])
		this.z = -1
		this.body.collisionType = me.collision.types.ACTION_OBJECT
		//this.renderable = fill(5, 5)
	}
})

game.Donkey = me.Entity.extend({
	init(x, y, settings) {
		this.asscat = me.loader.getImage("asscat")
		this.assbutt = me.loader.getImage("assbutt")
		x = x || me.game.viewport.width / 2
		y = y || 0

		this._super(me.Entity, "init", [
			x,
			y,
			{
				image: this.asscat,
				height: this.asscat.height,
				width: this.asscat.width,
				name: "donkey",
				...settings
			}
		])

		this.body.setMaxVelocity(3, 15)
		this.body.setFriction(0.4, 0)

		this.actions = {
			move: {
				start(d) {
					this.moving = true
					me.game.world.addChild(me.pool.pull("donkeyTarget", this.dest, 360))
					let dir = this.dest - d.centerX
					if (dir > 0) {
						d.body.force.x = d.body.maxVel.x
						d.renderable.flipX(true)
					} else {
						d.body.force.x = -d.body.maxVel.x
						d.renderable.flipX(false)
					}
				},
				update(d, dt) {
					return this.moving
				}
			},

			stand: {
				start(d) {
					d.body.force.x = 0
					d.body.force.y = 0
				},
				update(d, dt) {
					this.ms -= dt
					return this.ms > 0
				}
			},

			die: {
				start(d) {
					d.body.force.x = 0
					d.body.force.y = 0
					d.renderable.flipY(true)
				},
				update(d, dt) { return true }
			}
		}

		this.dead = false

		this.queue = [{ ...this.actions.stand, ms: 1000 }]
		this.action = null
		this.doAction(0)
	},

	die() {
		if (!this.dead) {
			this.action = null
			this.queue.unshift(this.actions.die)
		}
		this.dead = true
	},

	restart() {
		this.dead = false
		this.action = null
		this.queue = []
		this.renderable.flipY(false)
		this.renderable.image = this.asscat
		this.pos.x = 50
		this.pos.y = 100
	},

	flyAway() {
		this.body.force.x = 0
		this.renderable.image = this.assbutt
		this.action = {
			update(d, dt) {
				if (Math.random() < 0.08) {
					d.body.jumping = true
					d.body.force.y = -6
				}
				else d.body.force.y = 0
				return true
			}
		}
	},

	doAction(dt) {
		if (!this.action) {
			if (this.queue.length == 0) this.updateQueue()
			this.action = this.queue.shift()
			this.action.start(this)
		}
		if (!this.action.update(this, dt))  {
			this.action = null
		}
	},

	updateQueue() {
		let nextdest = 0
		do {
			nextdest = game.randint(0, me.game.viewport.width - 1)
		} while (Math.abs(nextdest - this.centerX) < 100)
		this.queue.push({ ...this.actions.move, dest: nextdest })
		this.queue.push({ ...this.actions.stand, ms: game.randint(100, 3000) })
	},

	update(dt) {
		//    if (Math.random() < 0.1) this.move = -this.move;
		this.doAction(dt)

		this.body.update(dt)
		me.collision.check(this)

		return (
			this._super(me.Entity, "update", [dt]) ||
			this.body.vel.x !== 0 ||
			this.body.vel.y !== 0
		)
	},

	onCollision(response, other) {
		if (other instanceof game.DonkeyTarget) {
			me.game.world.removeChild(other)
			if (this.action) this.action.moving = false
			return false
		}
		return true
	}
})
