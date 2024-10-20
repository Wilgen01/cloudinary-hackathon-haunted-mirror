export const getPositions = (width: number): Record<number, { x: number, y: number }> => {
    width = width/3
    const posiciones: Record<number, { x: number, y: number }> = {
        1: { x: 0 * width, y: 0 * width },
        2: { x: 1 * width, y: 0 * width },
        3: { x: 2 * width, y: 0 * width },
        4: { x: 0 * width, y: 1 * width },
        5: { x: 1 * width, y: 1 * width },
        6: { x: 2 * width, y: 1 * width },
        7: { x: 0 * width, y: 2 * width },
        8: { x: 1 * width, y: 2 * width },
        0: { x: 2 * width, y: 2 * width }
    }

    return posiciones;
}