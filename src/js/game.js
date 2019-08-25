class Game {

    constructor() {
        G = this;
        G.clock = 0;

        G.messages = [];

        G.setupNewGame();
    }

    cycle(e) {
        e *= !onMenu;
        G.clock += e;

        W.cycle(e);

        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        wrap(() => {
            if (G.clock - P.lastDamage < 0.2) {
                translate(rnd(-20, 20), rnd(-20, 20));
            }

            G.renderWorld = measure(() => wrap(renderWorld));

            if (P.health && !onMenu) {
                G.renderHud = measure(() => wrap(renderHud));
                G.renderMinimap = measure(() => wrap(renderMinimap));

                wrap(() => {
                    translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                    rotate(PI / 4);

                    R.globalAlpha = 1 - min(1, (G.clock - P.lastHit - 0.1) / 0.15);

                    R.fs('#f00');
                    for (let i = 0 ; i < 4 ; i++) {
                        rotate(PI / 2);
                        fr(5, -1, 6, 2);
                    }
                });

                // Crosshair
                R.fs('#fff');
                fr(CANVAS_WIDTH / 2 - 5, CANVAS_HEIGHT / 2 - 1, 10, 2);
                fr(CANVAS_WIDTH / 2 - 1, CANVAS_HEIGHT / 2 - 5, 2, 10);

                const weaponOffsetX = sin(P.movingClock * PI * 2) * 10;
                const weaponOffsetY = cos(P.movingClock * PI * 4) * 10 +
                    max(0, 1 - (G.clock - P.weapon.lastShot) / 0.15) * 50 +
                    30 +
                    P.landingProgress() * 20 +
                    max(0, 1 - (G.clock - P.weapon.created) / 0.5) * P.weapon.sprite.height;

                // Muzzleflash
                if (G.clock - P.weapon.lastShot < 0.1) {
                    wrap(() => {
                        translate(weaponOffsetX + CANVAS_WIDTH / 2, weaponOffsetY + CANVAS_HEIGHT - P.weapon.sprite.height);
                        rotate(PI * P.weapon.lastShot * 99);
                        drawImage(MUZZLEFLASH, -MUZZLEFLASH.width / 2, -MUZZLEFLASH.height / 2);
                    });
                }

                // Weapon
                wrap(() => {
                    translate(weaponOffsetX, weaponOffsetY);
                    drawImage(P.weapon.sprite, (CANVAS_WIDTH - P.weapon.sprite.width) / 2, CANVAS_HEIGHT - P.weapon.sprite.height);
                });
            }

            if (G.clock - max(P.lastDamage, P.lastPickup) < 0.35 || !P.health) {
                wrap(() => {
                    R.globalAlpha = 0.2;
                    fs(P.lastDamage > P.lastPickup ? '#f00' : '#fff');
                    fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                });
            }
        });

        if (onMenu) {
            wrap(renderMenu);
        } else {
            R.font = '12pt Courier';
            R.textAlign = 'center';
            G.messages.forEach((m, i) => wrap(() => {
                R.globalAlpha = 1 - abs(m.offset);
                translate(m.offset * 100, CANVAS_HEIGHT / 2 + 30 + i * 25);

                R.textAlign = 'right';
                fs('#fff');
                fillText(m.primary, CANVAS_WIDTH / 2 - 10, 0);

                R.textAlign = 'left';
                fs('#ff0');
                fillText(m.secondary, CANVAS_WIDTH / 2 + 10, 0);
            }));
        }

        if (DEBUG) {
            wrap(() => {
                R.font = '7pt ' + monoFont;
                R.textAlign = 'left';
                fs('#fff');

                const fpsGauge = [];
                for (let i = 0 ; i < (G.fps / 60) * 20 ; i++) {
                    fpsGauge.push('-');
                }

                const info = [
                    'fps: ' + G.fps,
                    fpsGauge.join(''),
                    '',
                    '--------------------',
                    'sprites: ' + SPRITES.length,
                    'enemies: ' + ITEMS.length,
                    'cyclables: ' + CYCLABLES.length,
                    'enemies: ' + ENEMIES.length,
                    '--------------------',
                    'renderWorld: ' + G.renderWorld,
                    'castTime: ' + G.castTime,
                    'casts: ' + G.casts,
                    'interpolations: ' + G.interpolations,
                    'cast+interp: ' + (G.casts + G.interpolations),
                    'castIterations: ' + G.castIterations,
                    '--------------------',
                    'renderWalls: ' + G.renderWalls,
                    'renderFloor: ' + G.renderFloor,
                    'floorTiles: ' + G.floorTiles,
                    '--------------------',
                    'topSprites: ' + G.topSprites,
                    'bottomSprites: ' + G.bottomSprites,
                    'decorationParticles: ' + G.decorationParticles,
                    'sortIterations: ' + G.sortIterations,
                    'sortTime: ' + G.sortTime,
                    '--------------------',
                    'renderHud: ' + G.renderHud,
                    'renderMinimap: ' + G.renderMinimap,
                ];
                let y = 20;
                info.forEach(info => {
                    fillText(info, CANVAS_WIDTH - 200, y);
                    y += 10;
                });
            });
        }
    }

    setupNewGame() {
        P = new Player();
        P.setWeapon(new Pistol(P));

        W = new World();

        G.showMessage('AIM/SHOOT', 'MOUSE', 5);
        G.showMessage('MOVE', 'WASD/ARROW KEYS', 5);
    }

    showMessage(primary, secondary, duration = 1) {
        const messageObject = {
            'primary': primary,
            'secondary': secondary
        };
        G.messages.unshift(messageObject);

        interp(messageObject, 'offset', -1, 0, 0.3, 0, null, () => {
            setTimeout(() => {
                interp(messageObject, 'offset', 0, duration, 0.3, 0, null, () => remove(G.messages, messageObject));
            }, 2000);
        });
    }

}
