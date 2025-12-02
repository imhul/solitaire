import { Scene } from 'phaser'
// config
import {
    cardScale,
    backFrame,
    cardWidth,
    cardHeight,
    drawCardXPos,
    drawCardYPos,
    discardStackXPos,
    discardStackYPos,
} from '../../config'

export class Game extends Scene {
    #drawCardStack: Phaser.GameObjects.Image[]
    #discardStack: Phaser.GameObjects.Image[]

    constructor() {
        super('Game')
    }

    preload() {
        this.load.setPath('assets')

        this.load.spritesheet('cards', 'cards.png', {
            frameWidth: cardWidth,
            frameHeight: cardHeight,
        })
    }

    create(): void {
        this.#createDrawStack()
        this.#createDiscardStack()
    }

    #createDiscardStack(): void {
        this.#drawCardBox(discardStackXPos, discardStackYPos)
        this.#discardStack = []
        const bottomCard = this.#createCard(discardStackXPos, discardStackYPos).setVisible(false)
        const topCard = this.#createCard(discardStackXPos, discardStackYPos).setVisible(false)
        this.#discardStack.push(bottomCard, topCard)
    }

    #createCard(x: number, y: number): Phaser.GameObjects.Image {
        return this.add
            .image(x, y, 'cards', backFrame)
            .setOrigin(0, 0)
            .setScale(cardScale)
    }

    #createDrawStack(): void {
        this.#drawCardBox(drawCardXPos, drawCardYPos)
        this.#drawCardStack = []
        for (let i = 0; i < 3; i++) {
            this.#drawCardStack.push(
                this.#createCard(drawCardXPos + i * 5, drawCardYPos)
            )
        }
    }

    #drawCardBox(x: number, y: number): void {
        this.add
            .rectangle(
                x,
                y,
                cardWidth * cardScale,
                cardHeight * cardScale,
                0xffffff,
                0.2
            )
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff, 0.4)
    }
}
