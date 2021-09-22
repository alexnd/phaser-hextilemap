// Game rpg-style demo scene using phaser.js with hexagonal tilemap

var app = {
    game: null,
    spawnPoint: [144, 6],
    worldBounds: [5400, 3488],
    G: {
        knight: 14,
    },
    E: {
        knight: null
    },
    config: {
        type: Phaser.AUTO,
        parent: 'gameview',
        width: 640,
        height: 480,
        backgroundColor: '#2d2d2d',
        zoom: 2,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true
            }
        },
        scene: []
    },
    init: function() {
        app.config.scene.push(app.BootScene);
        app.config.scene.push(app.WorldScene);
        app.game = new Phaser.Game(app.config);
    },
    initUI: function() {
        console.log('*game start');
        document.getElementById('preload-indicator').style.display = 'none';
        document.getElementById('credits').style.display = 'block';
    }
};

app.BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene(){
        Phaser.Scene.call(this, { key: 'app.BootScene' });
    },
    preload: function() {
        this.load.image('tileset', 'tileset-hex.png');
        this.load.spritesheet('player', 'player-atlas.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('knight.png', 'knight.png');
        //this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.tilemapTiledJSON('map', 'map-hex.json');
    },
    create: function() {
        this.scene.start('app.WorldScene');
    }
});

app.WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function WorldScene() {
        Phaser.Scene.call(this, { key: 'app.WorldScene' });
    },
    preload: function() {
        
    },
    create: function() {
        app.initUI();
        //var map = this.add.tilemap('map');
        this.map = this.add.tilemap('map');
        this.groundTileset = this.map.addTilesetImage('Tileset', 'tileset');
        this.groundLayer = this.map.createLayer('Ground', this.groundTileset, 0, 0);
        this.obstaclesLayer = this.map.createStaticLayer('Obstacles', this.groundTileset, 0, 0);
        this.obstaclesLayer.setCollisionByExclusion([-1]);
        //this.knightLayer = this.map.createFromObjects('Entities', app.G.knight, '', 0, true, false, app.E.knight);
        var kn = this.map.createFromObjects('Entities', { gid: app.G.knight });
        console.log(kn)
        this.player = this.physics.add.sprite(app.spawnPoint[0], app.spawnPoint[1], 'player', 6);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.obstacles);
        this.cursors = this.input.keyboard.createCursorKeys();
        var controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            acceleration: 0.02,
            drag: 0.0005,
            maxSpeed: 0.7
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        /*this.input.on(Phaser.Input.Events.POINTER_UP, function(pointer) {
           var targetVec = this.map.worldToTileXY(pointer.worldX, pointer.worldY);
           console.log('*event[pointer]', [pointer.worldX, pointer.worldY], targetVec);
        });
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, function() {
           this.input.off(Phaser.Input.Events.POINTER_UP);
        });*/
        //this.cameras.main.setBounds(-30, -20, this.map.widthInPixels + 80, this.map.heightInPixels - 100);
        // this.cameras.main.setZoom(2);
        // this.cameras.main.centerOn(200, 100);
        this.cameras.main.setBounds(0, 0, app.worldBounds[0], app.worldBounds[1]);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
        app.world = this;
    },
    update: function(time, delta) {
        this.player.body.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
            this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
            this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
            this.player.anims.play('down', true);
        } else {
            this.player.anims.stop();
        }
        //console.log(this.player.x, this.player.y)
    }
});

window.onload = function() {
    app.init();
};