class World {
    constructor(generated) {
        this.matrix = generated.matrix;
        this.can = generated.can;

        CYCLABLES.splice(0, CYCLABLES.length);
        SPRITES.splice(0, SPRITES.length);
        ITEMS.splice(0, ITEMS.length);
        ENEMIES.splice(0, ENEMIES.length);
        MINIMAP_ELEMENTS.splice(0, MINIMAP_ELEMENTS.length);
        DAMAGE_ANGLES.splice(0, DAMAGE_ANGLES.length);
    }

    cycle(e) {
        P.cycle(e);

        CYCLABLES.forEach(b => b.cycle(e));
    }

    emitBloodParticles(x, y, z, particleCount, color) {
        if (distP(x, y, P.x, P.y) > DRAW_DISTANCE) {
            return;
        }

        for (let i = 0 ; i < particleCount ; i++) {
            const duration = max(0.2, (0.5 + z / BLOCK_SIZE) / rnd(0.4, 0.7));

            const size = BLOCK_SIZE * rnd(0.01, 0.05);

            const maxMovement = (z + BLOCK_SIZE / 2) / BLOCK_SIZE * 50;

            const particle = {
                'alpha': 1,
                'worldWidth': size,
                'worldHeight': size,
                'color': color()
            };
            SPRITES.push(particle);
            interp(particle, 'x', x, x + rnd(-1, 1) * maxMovement, duration);
            interp(particle, 'y', y, y + rnd(-1, 1) * maxMovement, duration);
            interp(particle, 'z', z, -BLOCK_SIZE / 2, duration, 0, easeOutBounce);
            interp(particle, 'f', 0, 0, duration + 0.5, 0, null, () => remove(SPRITES, particle));
        }
    }
}
